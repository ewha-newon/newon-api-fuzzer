const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Simple login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (email === 'test@example.com' && password === 'password123') {
    return res.status(200).json({ message: 'Login successful', token: 'valid-token' });
  }

  return res.status(401).json({ error: 'Invalid email or password' });
});

// Endpoint to fetch user profile
app.get('/profile', (req, res) => {
  const authToken = req.headers.authtoken;

  if (authToken === 'valid-token') {
    return res.status(200).json({
      name: 'John Doe',
      email: 'test@example.com',
      age: 30
    });
  }

  return res.status(403).json({ error: 'Unauthorized access' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});