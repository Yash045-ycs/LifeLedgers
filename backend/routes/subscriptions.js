const express = require('express');
const db = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/subscriptions
router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC').all(req.userId));
});

// POST /api/subscriptions
router.post('/', (req, res) => {
  const { name, cost, renewal, status, icon } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const result = db.prepare(
    'INSERT INTO subscriptions (user_id, name, cost, renewal, status, icon) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(req.userId, name, cost || 0, renewal || '', status || 'Active', icon || '↻');

  res.status(201).json(db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(result.lastInsertRowid));
});

// PUT /api/subscriptions/:id
router.put('/:id', (req, res) => {
  const sub = db.prepare('SELECT * FROM subscriptions WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!sub) return res.status(404).json({ error: 'Not found' });

  const { name, cost, renewal, status, icon } = req.body;
  db.prepare('UPDATE subscriptions SET name=?, cost=?, renewal=?, status=?, icon=? WHERE id=? AND user_id=?')
    .run(name ?? sub.name, cost ?? sub.cost, renewal ?? sub.renewal, status ?? sub.status, icon ?? sub.icon, req.params.id, req.userId);

  res.json(db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(req.params.id));
});

// PATCH /api/subscriptions/:id/cancel
router.patch('/:id/cancel', (req, res) => {
  const sub = db.prepare('SELECT id FROM subscriptions WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!sub) return res.status(404).json({ error: 'Not found' });
  db.prepare("UPDATE subscriptions SET status='Cancelled' WHERE id=?").run(req.params.id);
  res.json({ success: true });
});

// DELETE /api/subscriptions/:id
router.delete('/:id', (req, res) => {
  const sub = db.prepare('SELECT id FROM subscriptions WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!sub) return res.status(404).json({ error: 'Not found' });
  db.prepare('DELETE FROM subscriptions WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;