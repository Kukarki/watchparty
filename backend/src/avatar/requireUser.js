// Verifies the WatchParty JWT from `Authorization: Bearer <token>`
// and puts { id, userId, ...payload } on req.user.
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_in_prod';

function requireUser(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'missing bearer token' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // payload.userId is the app's user id; expose it as .id for route compatibility
    req.user = { ...payload, id: payload.userId };
    return next();
  } catch {
    return res.status(401).json({ error: 'invalid or expired token' });
  }
}

module.exports = { requireUser };
