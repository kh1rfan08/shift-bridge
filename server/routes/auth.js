const { Router } = require('express');
const { getDB } = require('../db');
const { signToken, generateMagicToken, generateCode } = require('../services/token');
const { sendMagicLink } = require('../services/email');
const { requireAuth } = require('../middleware/auth');

const router = Router();

// POST /api/auth/login — send magic link
router.post('/login', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const db = getDB();
  const token = generateMagicToken();
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  db.prepare('INSERT INTO magic_links (email, token, code, expires_at) VALUES (?, ?, ?, ?)').run(email.toLowerCase(), token, code, expiresAt);

  try {
    await sendMagicLink(email.toLowerCase(), token, code);
    res.json({ ok: true });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// GET /api/auth/verify?token=xxx — verify magic link
router.get('/verify', (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token required' });

  const db = getDB();
  const link = db.prepare('SELECT * FROM magic_links WHERE token = ? AND used = 0').get(token);

  if (!link) return res.status(400).json({ error: 'Invalid or expired link' });
  if (new Date(link.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Link expired' });
  }

  // Mark as used
  db.prepare('UPDATE magic_links SET used = 1 WHERE id = ?').run(link.id);

  // Find or create user
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(link.email);
  const isNew = !user;

  if (!user) {
    const result = db.prepare('INSERT INTO users (email) VALUES (?)').run(link.email);
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  }

  const jwt = signToken(user.id);
  res.json({
    token: jwt,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      units: JSON.parse(user.units || '[]'),
      shift_types: JSON.parse(user.shift_types || '[]'),
    },
    isNew,
  });
});

// POST /api/auth/verify-code — verify 6-digit code (for PWA)
router.post('/verify-code', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and code required' });

  const db = getDB();
  const link = db.prepare(
    'SELECT * FROM magic_links WHERE email = ? AND code = ? AND used = 0 ORDER BY created_at DESC LIMIT 1'
  ).get(email.toLowerCase(), code);

  if (!link) return res.status(400).json({ error: 'Invalid code' });
  if (new Date(link.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Code expired' });
  }

  db.prepare('UPDATE magic_links SET used = 1 WHERE id = ?').run(link.id);

  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(link.email);
  const isNew = !user;

  if (!user) {
    const result = db.prepare('INSERT INTO users (email) VALUES (?)').run(link.email);
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  }

  const jwt = signToken(user.id);
  res.json({
    token: jwt,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      units: JSON.parse(user.units || '[]'),
      shift_types: JSON.parse(user.shift_types || '[]'),
    },
    isNew,
  });
});

// GET /api/auth/me — current user
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
