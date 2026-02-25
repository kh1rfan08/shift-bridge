const { Router } = require('express');
const { getDB } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = Router();

// GET /api/shifts
router.get('/', requireAuth, (req, res) => {
  const { status, limit = 50 } = req.query;
  const db = getDB();

  let where = 'WHERE 1=1';
  const params = [];
  if (status) {
    where += ' AND s.status = ?';
    params.push(status);
  }

  const shifts = db.prepare(`
    SELECT s.*,
      u.name AS poster_name, u.email AS poster_email,
      c.name AS claimer_name,
      (SELECT COUNT(*) FROM comments WHERE shift_id = s.id) AS comment_count
    FROM shifts s
    JOIN users u ON s.posted_by = u.id
    LEFT JOIN users c ON s.claimed_by = c.id
    ${where}
    ORDER BY s.date ASC, s.start_time ASC
    LIMIT ?
  `).all(...params, Number(limit));

  // Get reactions for each shift
  const reactionStmt = db.prepare(`
    SELECT type, COUNT(*) as count,
      MAX(CASE WHEN user_id = ? THEN 1 ELSE 0 END) AS mine
    FROM reactions WHERE shift_id = ? GROUP BY type
  `);

  const result = shifts.map(s => {
    const reactions = reactionStmt.all(req.user.id, s.id);
    return { ...s, reactions };
  });

  res.json({ shifts: result });
});

// GET /api/shifts/:id
router.get('/:id', requireAuth, (req, res) => {
  const db = getDB();
  const shift = db.prepare(`
    SELECT s.*,
      u.name AS poster_name, u.email AS poster_email,
      c.name AS claimer_name
    FROM shifts s
    JOIN users u ON s.posted_by = u.id
    LEFT JOIN users c ON s.claimed_by = c.id
    WHERE s.id = ?
  `).get(req.params.id);

  if (!shift) return res.status(404).json({ error: 'Shift not found' });

  const reactions = db.prepare(`
    SELECT type, COUNT(*) as count,
      MAX(CASE WHEN user_id = ? THEN 1 ELSE 0 END) AS mine
    FROM reactions WHERE shift_id = ? GROUP BY type
  `).all(req.user.id, shift.id);

  const comments = db.prepare(`
    SELECT c.*, u.name AS user_name, u.email AS user_email
    FROM comments c JOIN users u ON c.user_id = u.id
    WHERE c.shift_id = ? ORDER BY c.created_at ASC
  `).all(shift.id);

  res.json({ shift: { ...shift, reactions, comments } });
});

// POST /api/shifts
router.post('/', requireAuth, (req, res) => {
  const { date, start_time, end_time, unit, note } = req.body;
  if (!date || !start_time || !end_time || !unit) {
    return res.status(400).json({ error: 'date, start_time, end_time, unit are required' });
  }

  const db = getDB();
  const result = db.prepare(
    'INSERT INTO shifts (posted_by, date, start_time, end_time, unit, note) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(req.user.id, date, start_time, end_time, unit, note || null);

  const shift = db.prepare('SELECT * FROM shifts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ shift });
});

// POST /api/shifts/:id/claim
router.post('/:id/claim', requireAuth, (req, res) => {
  const db = getDB();
  const shift = db.prepare('SELECT * FROM shifts WHERE id = ?').get(req.params.id);
  if (!shift) return res.status(404).json({ error: 'Shift not found' });
  if (shift.status !== 'open') return res.status(400).json({ error: 'Shift not open' });
  if (shift.posted_by === req.user.id) return res.status(400).json({ error: "Can't claim your own shift" });

  db.prepare("UPDATE shifts SET status = 'claimed', claimed_by = ?, claimed_at = datetime('now') WHERE id = ?")
    .run(req.user.id, shift.id);

  res.json({ ok: true });
});

// DELETE /api/shifts/:id/claim
router.delete('/:id/claim', requireAuth, (req, res) => {
  const db = getDB();
  const shift = db.prepare('SELECT * FROM shifts WHERE id = ?').get(req.params.id);
  if (!shift) return res.status(404).json({ error: 'Shift not found' });
  if (shift.claimed_by !== req.user.id) return res.status(403).json({ error: 'Not your claim' });

  db.prepare("UPDATE shifts SET status = 'open', claimed_by = NULL, claimed_at = NULL WHERE id = ?")
    .run(shift.id);

  res.json({ ok: true });
});

// DELETE /api/shifts/:id
router.delete('/:id', requireAuth, (req, res) => {
  const db = getDB();
  const shift = db.prepare('SELECT * FROM shifts WHERE id = ?').get(req.params.id);
  if (!shift) return res.status(404).json({ error: 'Shift not found' });
  if (shift.posted_by !== req.user.id) return res.status(403).json({ error: 'Not your shift' });
  if (shift.status === 'claimed') return res.status(400).json({ error: "Can't delete claimed shift" });

  db.prepare('DELETE FROM shifts WHERE id = ?').run(shift.id);
  res.status(204).end();
});

// POST /api/shifts/:id/reactions
router.post('/:id/reactions', requireAuth, (req, res) => {
  const { type } = req.body;
  if (!type) return res.status(400).json({ error: 'type required' });

  const db = getDB();
  const existing = db.prepare(
    'SELECT id FROM reactions WHERE shift_id = ? AND user_id = ? AND type = ?'
  ).get(req.params.id, req.user.id, type);

  if (existing) {
    db.prepare('DELETE FROM reactions WHERE id = ?').run(existing.id);
    return res.json({ toggled: 'off' });
  }

  db.prepare('INSERT INTO reactions (shift_id, user_id, type) VALUES (?, ?, ?)')
    .run(req.params.id, req.user.id, type);
  res.json({ toggled: 'on' });
});

// GET /api/shifts/:id/comments
router.get('/:id/comments', requireAuth, (req, res) => {
  const db = getDB();
  const comments = db.prepare(`
    SELECT c.*, u.name AS user_name, u.email AS user_email
    FROM comments c JOIN users u ON c.user_id = u.id
    WHERE c.shift_id = ? ORDER BY c.created_at ASC
  `).all(req.params.id);

  res.json({ comments });
});

// POST /api/shifts/:id/comments
router.post('/:id/comments', requireAuth, (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'text required' });

  const db = getDB();
  const result = db.prepare('INSERT INTO comments (shift_id, user_id, text) VALUES (?, ?, ?)')
    .run(req.params.id, req.user.id, text.trim());

  const comment = db.prepare(`
    SELECT c.*, u.name AS user_name, u.email AS user_email
    FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json({ comment });
});

module.exports = router;
