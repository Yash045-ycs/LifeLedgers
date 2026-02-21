const express = require('express');
const db = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/obligations
router.get('/', (req, res) => {
  const { status, category } = req.query;
  let sql = 'SELECT * FROM obligations WHERE user_id = ?';
  const params = [req.userId];
  if (status   && status   !== 'All') { sql += ' AND status = ?';   params.push(status); }
  if (category && category !== 'All') { sql += ' AND category = ?'; params.push(category); }
  sql += ' ORDER BY due_date ASC';
  res.json(db.prepare(sql).all(...params));
});

// POST /api/obligations
router.post('/', (req, res) => {
  const { title, category, amount, due_date, recurrence, priority, reminder, notes } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const result = db.prepare(`
    INSERT INTO obligations (user_id, title, category, amount, due_date, recurrence, priority, status, reminder, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Upcoming', ?, ?)
  `).run(req.userId, title, category || 'Other', amount || 0, due_date || null, recurrence || 'One-time', priority || 'Medium', reminder || '1 week before', notes || '');

  const created = db.prepare('SELECT * FROM obligations WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/obligations/:id
router.put('/:id', (req, res) => {
  const obl = db.prepare('SELECT * FROM obligations WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!obl) return res.status(404).json({ error: 'Not found' });

  const { title, category, amount, due_date, recurrence, priority, status, reminder, notes } = req.body;
  db.prepare(`
    UPDATE obligations
    SET title=?, category=?, amount=?, due_date=?, recurrence=?, priority=?, status=?, reminder=?, notes=?, updated_at=datetime('now')
    WHERE id = ? AND user_id = ?
  `).run(
    title ?? obl.title, category ?? obl.category, amount ?? obl.amount,
    due_date ?? obl.due_date, recurrence ?? obl.recurrence, priority ?? obl.priority,
    status ?? obl.status, reminder ?? obl.reminder, notes ?? obl.notes,
    req.params.id, req.userId
  );

  res.json(db.prepare('SELECT * FROM obligations WHERE id = ?').get(req.params.id));
});

// PATCH /api/obligations/:id/status  — quick status update
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const obl = db.prepare('SELECT id FROM obligations WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!obl) return res.status(404).json({ error: 'Not found' });
  db.prepare("UPDATE obligations SET status=?, updated_at=datetime('now') WHERE id=?").run(status, req.params.id);
  res.json({ success: true, id: parseInt(req.params.id), status });
});

// DELETE /api/obligations/:id
router.delete('/:id', (req, res) => {
  const obl = db.prepare('SELECT id FROM obligations WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!obl) return res.status(404).json({ error: 'Not found' });
  db.prepare('DELETE FROM obligations WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// GET /api/obligations/analytics
router.get('/analytics/summary', (req, res) => {
  const userId = req.userId;
  const total      = db.prepare('SELECT COUNT(*) as c FROM obligations WHERE user_id=?').get(userId).c;
  const completed  = db.prepare("SELECT COUNT(*) as c FROM obligations WHERE user_id=? AND status='Completed'").get(userId).c;
  const overdue    = db.prepare("SELECT COUNT(*) as c FROM obligations WHERE user_id=? AND status='Overdue'").get(userId).c;
  const totalSpend = db.prepare('SELECT COALESCE(SUM(amount),0) as s FROM obligations WHERE user_id=?').get(userId).s;

  const byCategory = db.prepare(`
    SELECT category, COUNT(*) as count FROM obligations WHERE user_id=? GROUP BY category
  `).all(userId);

  res.json({ total, completed, overdue, totalSpend, byCategory });
});

module.exports = router;