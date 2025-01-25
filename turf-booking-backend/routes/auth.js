const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key';

// Sign Up
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const userExist = await User.findOne({ username });
  if (userExist) return res.json({ status: 'error', error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, role: 'user' });

  await user.save();
  res.json({ status: 'ok' });
});

// Temporary route for admin creation
router.post('/signup-admin', async (req, res) => {
  const { username, password } = req.body;

  const userExist = await User.findOne({ username });
  if (userExist) return res.json({ status: 'error', error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, role: 'admin' });

  await user.save();
  res.json({ status: 'ok' });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.json({ status: 'error', error: 'Invalid credentials' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.json({ status: 'error', error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({ status: 'ok', token, role: user.role });
});

module.exports = router;
