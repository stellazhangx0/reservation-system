const express = require('express');
const router = express.Router();
const Availability = require('../models/availabilitySchema');

// Create availability for a new date
router.post('/', async (req, res) => {
  try {
    // Check if this date already exists
    const existingAvailability = await Availability.findOne({ date: req.body.date });
    if (existingAvailability) {
      return res.status(400).json({ message: "Date already exists" });
    }
    // Save the new date
    const newAvailability = new Availability(req.body);
    const savedAvailability = await newAvailability.save();
    return res.status(200).json({ 
        success: true, 
        message: 'Availability successfully created.',
        data: savedAvailability
      });
  } catch (error) {
    res.status(500).json({ message: "Could not save availability", error });
  }
});


// Get availability
router.get('/', async (req, res) => {
    try {
      const { month, year } = req.query;
  
      let filter = {};
  
      if (month && year) {
        // Construct the filter dates in the format "YYYY-MM-DD"
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
  
        filter.date = {
          $gte: startDate,
          $lte: endDate
        };
      }
  
      const availability = await Availability.find(filter);
      res.json(availability);
  
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve availability", error });
    }
});

// Update an availability by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedAvailability = await Availability.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedAvailability);
  } catch (error) {
    res.status(500).json({ message: "Could not update availability", error });
  }
});
  
// Delete an availability
router.delete('/:id', async (req, res) => {
  try {
    await Availability.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Availability deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete availability", error });
  }
});

module.exports = router;
