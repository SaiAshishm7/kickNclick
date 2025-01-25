// models/Turf.js
const mongoose = require('mongoose');

const TurfSchema = new mongoose.Schema({
  name: String,
  type: String, // e.g., Soccer, Tennis, Cricket
  location: String,
  pricePerHour: Number,
  availableTimeSlots: [String], // e.g., ['08:00', '09:00']
});

module.exports = mongoose.model('Turf', TurfSchema);
