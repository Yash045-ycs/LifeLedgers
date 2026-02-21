const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'lifeledger.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    password    TEXT    NOT NULL,
    timezone    TEXT    DEFAULT 'UTC',
    created_at  TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS obligations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    title       TEXT    NOT NULL,
    category    TEXT    NOT NULL DEFAULT 'Other',
    amount      REAL    DEFAULT 0,
    due_date    TEXT,
    recurrence  TEXT    DEFAULT 'One-time',
    priority    TEXT    DEFAULT 'Medium',
    status      TEXT    DEFAULT 'Upcoming',
    reminder    TEXT    DEFAULT '1 week before',
    notes       TEXT    DEFAULT '',
    created_at  TEXT    DEFAULT (datetime('now')),
    updated_at  TEXT    DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS documents (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    name        TEXT    NOT NULL,
    expiry_date TEXT,
    days_left   INTEGER DEFAULT 0,
    file_name   TEXT    DEFAULT '',
    created_at  TEXT    DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    name        TEXT    NOT NULL,
    cost        REAL    DEFAULT 0,
    renewal     TEXT,
    status      TEXT    DEFAULT 'Active',
    icon        TEXT    DEFAULT '↻',
    created_at  TEXT    DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS notification_settings (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL UNIQUE,
    email_reminders     INTEGER DEFAULT 1,
    push_notifications  INTEGER DEFAULT 1,
    weekly_digest       INTEGER DEFAULT 1,
    overdue_alerts      INTEGER DEFAULT 1,
    doc_expiry_alerts   INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

module.exports = db;