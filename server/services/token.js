const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function generateMagicToken() {
  return crypto.randomBytes(32).toString('hex');
}

function generateCode() {
  return crypto.randomInt(100000, 999999).toString();
}

module.exports = { signToken, verifyToken, generateMagicToken, generateCode };
