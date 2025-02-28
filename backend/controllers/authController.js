
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { calculateDistance } = require('../utils/authUtils');

// Register a new user
exports.register = async (req, res, next) => {
  const { username, email, clickPoints } = req.body;

  if (!username || !email || !clickPoints || clickPoints.length === 0) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Start a transaction
    await db.query('BEGIN');

    // Insert the user
    const userResult = await db.query(
      'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id',
      [username, email]
    );
    const userId = userResult.rows[0].id;

    // Insert the graphical password points
    for (let i = 0; i < clickPoints.length; i++) {
      const { imageId, x, y } = clickPoints[i];
      await db.query(
        'INSERT INTO graphical_passwords (user_id, image_id, x_coordinate, y_coordinate, sequence_number) VALUES ($1, $2, $3, $4, $5)',
        [userId, imageId, x, y, i]
      );
    }

    // Commit the transaction
    await db.query('COMMIT');

    // Create and send the JWT token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Set the JWT as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return the user data
    res.status(201).json({
      id: userId,
      username,
      email,
    });
  } catch (error) {
    await db.query('ROLLBACK');
    next(error);
  }
};

// Login a user
exports.login = async (req, res, next) => {
  const { email, clickPoints } = req.body;

  if (!email || !clickPoints || clickPoints.length === 0) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Find the user by email
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Get the stored graphical password points
    const passwordResult = await db.query(
      'SELECT * FROM graphical_passwords WHERE user_id = $1 ORDER BY sequence_number',
      [user.id]
    );

    if (passwordResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const storedPoints = passwordResult.rows;

    // Validate the click points
    if (storedPoints.length !== clickPoints.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check each point with a tolerance
    const TOLERANCE = 30; // 30 pixels tolerance
    const isValid = clickPoints.every((point, index) => {
      const storedPoint = storedPoints[index];
      
      if (point.imageId !== storedPoint.image_id) {
        return false;
      }
      
      const distance = calculateDistance(
        { x: point.x, y: point.y },
        { x: storedPoint.x_coordinate, y: storedPoint.y_coordinate }
      );
      
      return distance <= TOLERANCE;
    });

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create and send the JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Set the JWT as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return the user data
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

// Logout a user
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
};

// Get the current authenticated user
exports.getCurrentUser = async (req, res, next) => {
  try {
    const userResult = await db.query('SELECT id, username, email FROM users WHERE id = $1', [
      req.userId,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(userResult.rows[0]);
  } catch (error) {
    next(error);
  }
};
