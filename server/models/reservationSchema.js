const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    typeOfPhotoshoot: {
        type: String,
        enum: ['Yearbook', 'Portrait', 'LinkedIn Photo', 'Visa Photo'],
        required: true
    },
    visaPhoto: {
        type: Boolean,
        default: false
    },
    makeup: {
        type: Boolean,
        required: true
    },
    date: {
        type: String, // strings like "2023-08-14"
        required: true
    },
    time: {
        type: String,  // strings like "09:00-10:00"
        required: true
    },
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    notes: {
        type: String
    }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
