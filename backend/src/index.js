require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors({ origin: ['http://localhost:5200', 'http://localhost:5173', 'http://localhost:5201', process.env.FRONTEND_URL].filter(Boolean) }));
app.use(express.json());

// ── Public routes (no auth required) ─────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.get('/api/health', (req, res) => res.json({ status:'ok', version:'1.0.0', name:'RealCRM API', timestamp:new Date() }));

// ── Protected routes ──────────────────────────────────────────────────────────
const auth = require('./middleware/auth');
app.use('/api/leads',        auth, require('./routes/leads'));
app.use('/api/agents',       auth, require('./routes/agents'));
app.use('/api/pipeline',     auth, require('./routes/pipeline'));
app.use('/api/activities',   auth, require('./routes/activities'));
app.use('/api/tasks',        auth, require('./routes/tasks'));
app.use('/api/dashboard',    auth, require('./routes/dashboard'));
app.use('/api/integrations', auth, require('./routes/integrations'));

// ── Serve built frontend in production ────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../frontend/dist/index.html')));
}

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`🏠 RealCRM API running on http://localhost:${PORT}`));
