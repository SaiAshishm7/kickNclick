const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key';

// Sign Up
router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;

  // Check if username or email already exists
  const userExist = await User.findOne({ username });
  const emailExist = await User.findOne({ email });
  if (userExist || emailExist) return res.json({ status: 'error', error: 'User or Email already exists' });

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = new User({
    username,
    password: hashedPassword,
    email,
  });

  try {
    await user.save();
    res.json({ status: 'ok', userId: user._id }); // Return the user ID
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ status: 'error', error: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.json({ status: 'error', error: 'Invalid credentials' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.json({ status: 'error', error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({ status: 'ok', token, userId: user._id, email: user.email, role: user.role }); // Return the user ID and email
});

module.exports = router;


