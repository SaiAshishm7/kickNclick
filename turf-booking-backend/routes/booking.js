const express = require('express');
const router = express.Router();
const multer = require('multer');
const Booking = require('../models/Booking');
const Turf = require('../models/Turf');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'saiashishm1508@gmail.com',
    pass: 'xqxt docg gmxc icms'
  }
});

// Send Email Function
const sendBookingEmail = (email, bookingDetails) => {
  const mailOptions = {
    from: 'saiashishm1508@gmail.com',
    to: email,
    subject: 'Turf Booking Confirmation',
    text: `Your booking is confirmed for ${bookingDetails.turfName} on ${bookingDetails.date} at ${bookingDetails.timeSlot}.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Test Email Sending Route
router.post('/test-email', async (req, res) => {
  const { email } = req.body;
  const bookingDetails = {
    turfName: "Test Turf",
    date: "2025-01-01",
    timeSlot: "10:00 AM - 11:00 AM"
  };

  sendBookingEmail(email, bookingDetails);
  res.json({ status: 'ok' });
});

// Get All Turfs
router.get('/turfs', async (req, res) => {
  const turfs = await Turf.find();
  res.json({ status: 'ok', turfs });
});

// Add Turf (without verifyToken)
router.post('/turfs', upload.single('image'), async (req, res) => {
  const { name, type, timeSlots } = req.body;
  const imageUrl = req.file ? req.file.path : null;
  const parsedTimeSlots = timeSlots ? timeSlots.split(',').map(slot => slot.trim()) : [];

  const turf = new Turf({
    name,
    type,
    imageUrl,
    timeSlots: parsedTimeSlots,
  });

  try {
    await turf.save();
    res.json({ status: 'ok', turf });
  } catch (error) {
    console.error('Error adding turf:', error);
    res.status(500).json({ status: 'error', error: 'Failed to add turf' });
  }
});

// Get Available Slots
router.get('/slots', async (req, res) => {
  const { turfId, date } = req.query;

  const turf = await Turf.findById(turfId);
  if (!turf) return res.json({ status: 'error', error: 'Turf not found' });

  const timeSlots = turf.timeSlots || [];

  const bookings = await Booking.find({ turfId, date });
  const bookedTimeSlots = bookings.map((booking) => booking.timeSlot);

  const availableSlots = timeSlots.filter(
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

  // Fetch user email
  const user = await User.findById(req.userId);
  const bookingDetails = {
    turfName: turf.name,
    date,
    timeSlot,
  };

  // Send booking confirmation email
  sendBookingEmail(user.email, bookingDetails);

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

// Delete Turf
router.delete('/turfs/:id', async (req, res) => {
  const { id } = req.params;

  const turf = await Turf.findByIdAndDelete(id);
  if (!turf) return res.json({ status: 'error', error: 'Turf not found' });

  res.json({ status: 'ok', message: 'Turf deleted successfully' });
});

module.exports = router
