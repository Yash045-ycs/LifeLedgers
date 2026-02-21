const express = require('express');
const db = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/documents
router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM documents WHERE user_id = ? ORDER BY days_left ASC').all(req.userId));
});

// POST /api/documents
router.post('/', (req, res) => {
  const { name, expiry_date } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  // Calculate days left
  const daysLeft = expiry_date
    ? Math.max(0, Math.ceil((new Date(expiry_date) - new Date()) / 86400000))
    : 0;

  const result = db.prepare(
    'INSERT INTO documents (user_id, name, expiry_date, days_left) VALUES (?, ?, ?, ?)'
  ).run(req.userId, name, expiry_date || null, daysLeft);

  res.status(201).json(db.prepare('SELECT * FROM documents WHERE id = ?').get(result.lastInsertRowid));
});

// PUT /api/documents/:id
router.put('/:id', (req, res) => {
  const doc = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  const { name, expiry_date } = req.body;
  const daysLeft = expiry_date
    ? Math.max(0, Math.ceil((new Date(expiry_date) - new Date()) / 86400000))
    : doc.days_left;

  db.prepare('UPDATE documents SET name=?, expiry_date=?, days_left=? WHERE id=? AND user_id=?')
    .run(name ?? doc.name, expiry_date ?? doc.expiry_date, daysLeft, req.params.id, req.userId);

  res.json(db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id));
});

// DELETE /api/documents/:id
router.delete('/:id', (req, res) => {
  const doc = db.prepare('SELECT id FROM documents WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  db.prepare('DELETE FROM documents WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;