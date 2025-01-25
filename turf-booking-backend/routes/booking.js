const express = require('express');
const router = express.Router();
const multer = require('multer');
const Booking = require('../models/Booking');
const Turf = require('../models/Turf');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.json({ status: 'error', error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.json({ status: 'error', error: 'Failed to authenticate token' });

    req.userId = decoded.id;
    next();
  });
};

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Get All Turfs
router.get('/turfs', async (req, res) => {
  const turfs = await Turf.find();
  res.json({ status: 'ok', turfs });
});

// Add Turf
router.post('/turfs', verifyToken, upload.single('image'), async (req, res) => {
  const { name, type, timeSlots } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  const turf = new Turf({ name, type, imageUrl, timeSlots });
  await turf.save();
  res.json({ status: 'ok', turf });
});

// Get Available Slots
router.get('/slots', async (req, res) => {
  const { turfId, date } = req.query;

  const turf = await Turf.findById(turfId);
  if (!turf) return res.json({ status: 'error', error: 'Turf not found' });

  const bookings = await Booking.find({ turfId, date });
  const bookedTimeSlots = bookings.map((booking) => booking.timeSlot);

  const availableSlots = turf.timeSlots.filter(
    (slot) => !bookedTimeSlots.includes(slot)
  );

  res.json({ status: 'ok', slots: availableSlots });
});

// Book a Slot
router.post('/book', verifyToken, async (req, res) => {
  const { turfId, date, timeSlot } = req.body;

  const turf = await Turf.findById(turfId);
  if (!turf) return res.json({ status: 'error', error: 'Turf not found' });

  const existingBooking = await Booking.findOne({ turfId, date, timeSlot });
  if (existingBooking) return res.json({ status: 'error', error: 'Time slot already booked' });

  const booking = new Booking({
    userId: req.userId,
    turfId,
    date,
    timeSlot,
  });

  await booking.save();
  res.json({ status: 'ok', booking });
});

// Modify Booking
router.put('/modify/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { date, timeSlot } = req.body;

  const booking = await Booking.findById(id);
  if (!booking) return res.json({ status: 'error', error: 'Booking not found' });

  const existingBooking = await Booking.findOne({
    turfId: booking.turfId,
    date,
    timeSlot,
  });
  if (existingBooking) return res.json({ status: 'error', error: 'Time slot already booked' });

  booking.date = date;
  booking.timeSlot = timeSlot;
  await booking.save();

  res.json({ status: 'ok', booking });
});

// Cancel Booking
router.delete('/cancel/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) return res.json({ status: 'error', error: 'Booking not found' });

  booking.penalty = true;
  await booking.save();

  res.json({ status: 'ok' });
});

module.exports = router;
