const mongoose = require('mongoose');

let isConnecting = false;

const connectDB = async () => {
  let mongoUri = (process.env.MONGO_URI || 'mongodb://localhost:27017/codeinsight').trim();
  if ((mongoUri.startsWith('"') && mongoUri.endsWith('"')) || (mongoUri.startsWith("'") && mongoUri.endsWith("'"))) {
    mongoUri = mongoUri.slice(1, -1).trim();
  }

  if (mongoose.connection.readyState === 1 || isConnecting) {
    return;
  }

  isConnecting = true;
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 6000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnecting = false;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}. Retrying in 5s...`);
    isConnecting = false;
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
