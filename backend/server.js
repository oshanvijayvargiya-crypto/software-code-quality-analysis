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

// Reconnect to DB on request if disconnected
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 0) {
    connectDB().catch(() => {});
  }
  next();
});

// Health checks
const mongoose = require('mongoose');
const healthHandler = (req, res) => res.json({
  status: 'ok',
  message: 'Backend is running',
  mongo: mongoose.connection.readyState === 1 ? 'connected' : `status_${mongoose.connection.readyState}`,
  hasMongoUri: !!process.env.MONGO_URI
});
app.get('/', healthHandler);
app.get('/api', healthHandler);
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

const dbTestHandler = async (req, res) => {
  let uri = (process.env.MONGO_URI || '').trim();
  if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    uri = uri.slice(1, -1).trim();
  }
  const maskedUri = uri ? uri.replace(/:([^@]+)@/, ':****@') : 'NONE';
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000 });
    res.json({ success: true, mongo: 'connected', host: conn.connection.host, uri: maskedUri });
  } catch (err) {
    res.status(500).json({ success: false, mongo: 'failed', error: err.message, uri: maskedUri, code: err.code });
  }
};
app.get('/db-test', dbTestHandler);
app.get('/api/db-test', dbTestHandler);

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
