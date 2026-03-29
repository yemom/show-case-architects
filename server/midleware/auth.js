import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export default function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Please sign in to continue.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'super')) {
      return res.status(401).json({ success: false, message: 'Your account does not have access to this action.' });
    }

    req.admin = decoded; // attach admin info
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ success: false, message: 'Your session has expired. Please sign in again.' });
  }
}
