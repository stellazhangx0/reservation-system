require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const cron = require('node-cron');
const Reservation = require('./models/reservationSchema');
const Availability = require('./models/availabilitySchema');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGODB_URI_FALLBACK;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// API Routes
const reservationRoutes = require('./routes/reservationRoutes');
app.use('/api/reservations', reservationRoutes);

const availabilityRoutes = require('./routes/AvailabilityRoutes');
app.use('/api/availability', availabilityRoutes);

app.get('/', (req, res) => {
  res.send('Hello, this is the root URL');
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Middleware to check admin secret
app.use('/admin', (req, res, next) => {
    const adminSecret = req.headers['x-admin-secret']; // get the secret from the request header
    if (adminSecret && adminSecret === process.env.ADMIN_SECRET) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
});

// Handle /admin route after checking the secret.
app.get('/admin', (req, res) => {
    res.setHeader('Content-Type', 'application/json'); // Set the Content-Type to application/json
    res.status(200).json({ message: 'This is the admin page.' }); // Return JSON data
});
  

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

