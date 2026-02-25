const { Router } = require('express');
const { getDB } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = Router();

// GET /api/users/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/users/me
router.put('/me', requireAuth, (req, res) => {
  const { name, units, shift_types } = req.body;
  const db = getDB();

  db.prepare(`
    UPDATE users SET name = ?, units = ?, shift_types = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(
    name || null,
    JSON.stringify(units || []),
    JSON.stringify(shift_types || []),
    req.user.id
  );

  const user = db.prepare('SELECT id, name, email, units, shift_types FROM users WHERE id = ?').get(req.user.id);
  res.json({
    user: { ...user, units: JSON.parse(user.units || '[]'), shift_types: JSON.parse(user.shift_types || '[]') },
  });
});

module.exports = router;
