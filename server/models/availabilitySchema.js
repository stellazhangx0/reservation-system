const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true
  },
  slots: [String]  // array of available time slots, e.g., ["13:00-14:00", "14:00-15:00"]
});

module.exports = mongoose.model('Availability', availabilitySchema);