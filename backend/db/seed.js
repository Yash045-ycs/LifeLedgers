const db = require('./database');
const bcrypt = require('bcryptjs');

function seed() {
  // Check if demo user already exists
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@lifeledger.com');
  if (exists) {
    console.log('✓ Demo data already seeded');
    return;
  }

  // Create demo user
  const hash = bcrypt.hashSync('demo1234', 10);
  const userId = db.prepare(
    'INSERT INTO users (name, email, password, timezone) VALUES (?, ?, ?, ?)'
  ).run('Jane Smith', 'demo@lifeledger.com', hash, 'UTC+5:30').lastInsertRowid;

  // Seed obligations
  const insertObl = db.prepare(`
    INSERT INTO obligations (user_id, title, category, amount, due_date, recurrence, priority, status, reminder, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const obligations = [
    [userId, 'Electricity Bill',      'Utility',      142,   '2025-02-18', 'Monthly',   'High',     'Overdue',   '3 days before', ''],
    [userId, 'Car Insurance Renewal', 'Insurance',    890,   '2025-02-21', 'Annual',    'High',     'Due Today', '1 week before', 'Renews with PolicyBazaar'],
    [userId, 'Netflix Subscription',  'Subscription', 15.99, '2025-02-28', 'Monthly',   'Low',      'Upcoming',  '1 day before',  ''],
    [userId, 'Rent Payment',          'Housing',      1800,  '2025-03-01', 'Monthly',   'Critical', 'Upcoming',  '3 days before', 'Bank transfer to landlord'],
    [userId, 'Gym Membership',        'Health',       49,    '2025-03-05', 'Monthly',   'Medium',   'Upcoming',  '1 day before',  ''],
    [userId, 'Water Bill',            'Utility',      68,    '2025-02-10', 'Monthly',   'Medium',   'Completed', '3 days before', ''],
    [userId, 'Internet Plan',         'Utility',      79.99, '2025-03-10', 'Monthly',   'High',     'Upcoming',  '3 days before', ''],
    [userId, 'Health Insurance',      'Insurance',    320,   '2025-02-15', 'Monthly',   'Critical', 'Overdue',   '1 week before', ''],
    [userId, 'Property Tax',          'Housing',      1200,  '2025-03-31', 'Quarterly', 'High',     'Upcoming',  '2 weeks before',''],
    [userId, 'Dentist Appointment',   'Health',       120,   '2025-03-08', 'One-time',  'Medium',   'Upcoming',  '1 day before',  'Annual check-up at Apollo'],
  ];
  obligations.forEach(o => insertObl.run(...o));

  // Seed documents
  const insertDoc = db.prepare(`
    INSERT INTO documents (user_id, name, expiry_date, days_left, file_name)
    VALUES (?, ?, ?, ?, ?)
  `);
  [
    [userId, 'Passport',              '2025-08-14', 174, ''],
    [userId, "Driver's License",      '2025-03-30', 37,  ''],
    [userId, 'Vehicle Registration',  '2025-02-28', 7,   ''],
    [userId, 'Home Insurance Policy', '2026-01-01', 314, ''],
    [userId, 'Work Visa',             '2025-04-15', 53,  ''],
  ].forEach(d => insertDoc.run(...d));

  // Seed subscriptions
  const insertSub = db.prepare(`
    INSERT INTO subscriptions (user_id, name, cost, renewal, status, icon)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  [
    [userId, 'Netflix',              15.99, 'Feb 28, 2025', 'Active',    '▶'],
    [userId, 'Spotify',              9.99,  'Mar 3, 2025',  'Active',    '♪'],
    [userId, 'Adobe Creative Cloud', 54.99, 'Mar 15, 2025', 'Active',    '✦'],
    [userId, 'GitHub Pro',           4.00,  'Mar 20, 2025', 'Active',    '◈'],
    [userId, 'Notion',               8.00,  'Apr 1, 2025',  'Cancelled', '◻'],
    [userId, '1Password',            2.99,  'Apr 5, 2025',  'Active',    '⬡'],
  ].forEach(s => insertSub.run(...s));

  // Seed notification settings
  db.prepare(`
    INSERT INTO notification_settings (user_id) VALUES (?)
  `).run(userId);

  console.log('✓ Demo data seeded successfully');
  console.log('  Email: demo@lifeledger.com');
  console.log('  Password: demo1234');
}

module.exports = { seed };