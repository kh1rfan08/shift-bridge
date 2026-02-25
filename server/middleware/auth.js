const { verifyToken } = require('../services/token');
const { getDB } = require('../db');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = verifyToken(header.slice(7));
    const user = getDB().prepare('SELECT id, name, email, units, shift_types FROM users WHERE id = ?').get(decoded.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = { ...user, units: JSON.parse(user.units || '[]'), shift_types: JSON.parse(user.shift_types || '[]') };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { requireAuth };
