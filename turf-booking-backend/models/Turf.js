const mongoose = require('mongoose');
const { Schema } = mongoose;

const turfSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  imageUrl: { type: String },
  timeSlots: { type: [String], required: true },
});

module.exports = mongoose.model('Turf', turfSchema);
