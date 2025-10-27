const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const db = new Database(':memory:');
console.log('Connected to SQLite database');

// Initialize database tables
db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  fullName TEXT,
  bio TEXT,
  avatar TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);
console.log('Users table ready');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(username, email);

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const insert = db.prepare('INSERT INTO users (username, email, password, fullName) VALUES (?, ?, ?, ?)');
    const info = insert.run(username, email, hashedPassword, fullName || '');

    const token = jwt.sign({ id: info.lastInsertRowid, username }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: info.lastInsertRowid, username, email, fullName: fullName || '' }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, username, email, fullName, bio, avatar, createdAt FROM users WHERE id = ?').get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const { fullName, bio, avatar } = req.body;

    const update = db.prepare('UPDATE users SET fullName = ?, bio = ?, avatar = ? WHERE id = ?');
    update.run(fullName || '', bio || '', avatar || '', req.user.id);

    const user = db.prepare('SELECT id, username, email, fullName, bio, avatar, createdAt FROM users WHERE id = ?').get(req.user.id);

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  try {
    const stats = db.prepare('SELECT COUNT(*) as totalUsers FROM users').get();

    res.json({
      totalUsers: stats.totalUsers,
      currentUser: req.user.username,
      loginTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Serve static files from React build
const buildPath = path.join(process.cwd(), 'frontend/build');
app.use(express.static(buildPath, { fallthrough: true }));

// Serve React app for all other routes (SPA fallback)
app.use((req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
