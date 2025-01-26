const mongoose = require('mongoose');

const TurfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  timeSlots: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('Turf', TurfSchema);
