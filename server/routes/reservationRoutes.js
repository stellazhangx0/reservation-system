const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservationSchema');  
const Availability = require('../models/availabilitySchema');  

router.post('/', async (req, res) => {
  const { typeOfPhotoshoot, visaPhoto, makeup, date, time, name, contact, notes } = req.body;

  let availability;

  try {
    if (!req.headers['x-admin-secret']) {
      availability = await Availability.findOne({ date: date });
      if (!availability || !availability.slots.includes(time)) {
        return res.status(400).json({ message: 'The selected time slot is not available.' });
      }
    }

    const newReservation = new Reservation({
      typeOfPhotoshoot,
      visaPhoto,
      makeup,
      date,
      time,
      name,
      contact,
      notes
    });

    await newReservation.save();

    if (availability) {
      const updatedSlots = availability.slots.filter(slot => slot !== time);
      availability.slots = updatedSlots;
      await availability.save();
    }

    return res.status(200).json({ success: true, message: 'Reservation successfully created.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: ' Internal Server Errorrrrrrrs' });
  }
});



// Get all reservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Could not retrieve reservations", error });
  }
});


// Get a reservation by ID
router.get('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (reservation) {
      res.status(200).json(reservation);
    } else {
      res.status(404).json({ message: 'Reservation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not retrieve reservation", error });
  }
});

// Update a reservation by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedReservation) {
      res.status(200).json(updatedReservation);
    } else {
      res.status(404).json({ message: 'Reservation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not update reservation", error });
  }
});


// Delete a reservation
router.delete('/:id', async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
    if (deletedReservation) {
      res.status(200).json({ message: 'Reservation deleted' });
    } else {
      res.status(404).json({ message: 'Reservation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not delete reservation", error });
  }
});

module.exports = router;
