const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
  turfId: { type: Schema.Types.ObjectId, ref: 'Turf', required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  penalty: { type: Boolean, default: false },
});

module.exports = mongoose.model('Booking', bookingSchema);
