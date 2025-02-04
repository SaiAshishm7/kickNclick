const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  turfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  penalty: { type: Boolean, default: false },
});

module.exports = mongoose.model('Booking', BookingSchema);
