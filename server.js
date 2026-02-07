const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Demo credentials and in-memory users (for testing only - never use in production!)
const VALID_USER = { username: 'testuser', password: 'Test123!' };
const LOCKED_USER = { username: 'locked', password: 'Locked123!' };

const users = new Map([
  [VALID_USER.username, { ...VALID_USER, email: 'test@example.com' }],
  [LOCKED_USER.username, { ...LOCKED_USER, email: 'locked@example.com' }],
]);

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }

  if (username.trim() === LOCKED_USER.username) {
    return res.status(423).json({
      success: false,
      message: 'Account is locked. Please contact support.'
    });
  }

  const user = users.get(username.trim());
  if (user && user.password === password) {
    return res.json({
      success: true,
      message: 'Login successful',
      redirectUrl: '/dashboard'
    });
  }

  res.status(401).json({
    success: false,
    message: 'Invalid username or password'
  });
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username, email and password are required'
    });
  }

  if (username.trim().length === 0 || email.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Username and email cannot be empty'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  if (users.has(username.trim())) {
    return res.status(409).json({
      success: false,
      message: 'Username already exists'
    });
  }

  users.set(username.trim(), { username: username.trim(), email: email.trim(), password });
  return res.status(201).json({
    success: true,
    message: 'Registration successful. You can now sign in.',
    redirectUrl: '/login'
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
