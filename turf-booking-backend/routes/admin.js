// routes/admin.js
const express = require('express');
const router = express.Router();
const Turf = require('../models/Turf');
const Booking = require('../models/Booking');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key';

// Middleware to verify token and admin role
const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.json({ status: 'error', error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.json({ status: 'error', error: 'Failed to authenticate token' });

    const user = await User.findById(decoded.id);
    if (user.role !== 'admin') return res.json({ status: 'error', error: 'Unauthorized' });

    req.userId = decoded.id;
    next();
  });
};

// Turf Management Routes

// Add a Turf
router.post('/turfs', verifyAdmin, async (req, res) => {
  const { name, type, location, pricePerHour, availableTimeSlots } = req.body;

  const turf = new Turf({
    name,
    type,
    location,
    pricePerHour,
    availableTimeSlots,
  });

  await turf.save();
  res.json({ status: 'ok', turf });
});

// Get All Turfs
router.get('/turfs', verifyAdmin, async (req, res) => {
  const turfs = await Turf.find();
  res.json({ status: 'ok', turfs });
});

// Update a Turf
router.put('/turfs/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, type, location, pricePerHour, availableTimeSlots } = req.body;

  await Turf.findByIdAndUpdate(id, {
    name,
    type,
    location,
    pricePerHour,
    availableTimeSlots,
  });
  res.json({ status: 'ok' });
});

// Delete a Turf
router.delete('/turfs/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;

  await Turf.findByIdAndDelete(id);
  res.json({ status: 'ok' });
});

// Booking Management Routes

// Get All Bookings
router.get('/bookings', verifyAdmin, async (req, res) => {
  const bookings = await Booking.find().populate('userId', 'username').populate('turfId', 'name');
  res.json({ status: 'ok', bookings });
});

// User Management Routes

// Get All Users
router.get('/users', verifyAdmin, async (req, res) => {
  const users = await User.find();
  res.json({ status: 'ok', users });
});

// Update User Role
router.put('/users/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body; // role can be 'user' or 'admin'

  await User.findByIdAndUpdate(id, { role });
  res.json({ status: 'ok' });
});

module.exports = router;
