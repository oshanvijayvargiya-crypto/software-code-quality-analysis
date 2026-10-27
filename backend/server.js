require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// CORS configuration - allow all origins & methods
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));

// Health checks
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Backend is running' }));
app.get('/api', (req, res) => res.json({ status: 'ok', message: 'API is running' }));

// Define Routes - Support both /api prefix and root level
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/analysisRoutes'));
app.use('/', require('./routes/analysisRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
