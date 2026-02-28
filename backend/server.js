const express = require('express');
const cors    = require('cors');
const { seed } = require('./db/seed');

const app  = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/obligations',   require('./routes/obligations'));
app.use('/api/documents',     require('./routes/documents'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/settings',      require('./routes/settings'));

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  seed(); // Seed demo data on first start
  console.log(`\n🚀 LifeLedger API running on http://localhost:${PORT}`);
  console.log(`📊 Database: SQLite (lifeledger.db)`);
  console.log(`\n🔑 Demo credentials:`);
  console.log(`   Email:    demo@lifeledger.com`);
  console.log(`   Password: demo1234\n`);
});