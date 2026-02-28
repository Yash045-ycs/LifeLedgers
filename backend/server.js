const express = require('express');
const cors = require('cors');
const { seed } = require('./db/seed');

const app = express();
const PORT = process.env.PORT || 5000;

/* ─────────────────────────────────────────────
   CORS CONFIGURATION
───────────────────────────────────────────── */

const allowedOrigins = [
  "http://localhost:3000",
  "https://lifeledgers-1.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

/* ─────────────────────────────────────────────
   MIDDLEWARE
───────────────────────────────────────────── */

app.use(express.json());

/* ─────────────────────────────────────────────
   ROUTES
───────────────────────────────────────────── */

app.use('/api/auth', require('./routes/auth'));
app.use('/api/obligations', require('./routes/obligations'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/settings', require('./routes/settings'));

// Health Check
app.get('/api/health', (_, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

/* ─────────────────────────────────────────────
   START SERVER
───────────────────────────────────────────── */

app.listen(PORT, () => {
  seed(); // Seed demo data on first start
  console.log(`\n🚀 LifeLedger API running on port ${PORT}`);
  console.log(`📊 Database: SQLite (lifeledger.db)`);
  console.log(`\n🔑 Demo credentials:`);
  console.log(`   Email:    demo@lifeledger.com`);
  console.log(`   Password: demo1234\n`);
});