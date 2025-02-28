
const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  // Get token from cookie
  const token = req.cookies.token;

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user ID to request
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
