const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'stfrancis-technical-secret-key-2026';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.student = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const generateToken = (student) => {
  return jwt.sign(
    { id: student._id, admissionNumber: student.admissionNumber },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = { authMiddleware, generateToken, JWT_SECRET };
