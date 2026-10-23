require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Define Routes
app.get('/api', (req, res) => res.json({ status: 'ok', message: 'API is running' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/analysisRoutes'));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;

