// models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  turfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf' },
  date: String,
  timeSlot: String,
  penalty: { type: Boolean, default: false },
});

module.exports = mongoose.model('Booking', BookingSchema);
