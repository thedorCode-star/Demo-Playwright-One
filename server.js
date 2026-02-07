const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Demo credentials (for testing only - never use in production!)
const VALID_USER = { username: 'testuser', password: 'Test123!' };
const LOCKED_USER = { username: 'locked', password: 'Locked123!' };

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

  if (username === LOCKED_USER.username) {
    return res.status(423).json({
      success: false,
      message: 'Account is locked. Please contact support.'
    });
  }

  if (username === VALID_USER.username && password === VALID_USER.password) {
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
