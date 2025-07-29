const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit'); // For rate limiting
const authRoutes = require('./routes/authRoutes'); // We'll create this file
const noteRoutes = require('./routes/noteRoutes'); // We'll create this file

const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(helmet()); // Set security headers

// Rate limiting to prevent brute-force attacks
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', apiLimiter); // Apply to all /api/ routes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Note-App Backend API is running!');
});

// Error handling middleware (optional, for more robust error handling)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;