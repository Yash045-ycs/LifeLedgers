const express = require('express');
const db = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/settings/notifications
router.get('/notifications', (req, res) => {
  let settings = db.prepare('SELECT * FROM notification_settings WHERE user_id = ?').get(req.userId);
  if (!settings) {
    db.prepare('INSERT INTO notification_settings (user_id) VALUES (?)').run(req.userId);
    settings = db.prepare('SELECT * FROM notification_settings WHERE user_id = ?').get(req.userId);
  }
  res.json(settings);
});

// PUT /api/settings/notifications
router.put('/notifications', (req, res) => {
  const { email_reminders, push_notifications, weekly_digest, overdue_alerts, doc_expiry_alerts } = req.body;
  db.prepare(`
    INSERT INTO notification_settings (user_id, email_reminders, push_notifications, weekly_digest, overdue_alerts, doc_expiry_alerts)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      email_reminders=excluded.email_reminders,
      push_notifications=excluded.push_notifications,
      weekly_digest=excluded.weekly_digest,
      overdue_alerts=excluded.overdue_alerts,
      doc_expiry_alerts=excluded.doc_expiry_alerts
  `).run(req.userId, email_reminders?1:0, push_notifications?1:0, weekly_digest?1:0, overdue_alerts?1:0, doc_expiry_alerts?1:0);
  res.json({ success: true });
});

module.exports = router;