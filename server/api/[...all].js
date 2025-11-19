/**
 * Catch-all serverless function for all routes
 * This is placed at the root to catch all requests
 */

const app = require('../server');
const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not set');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ DB error:', error.message);
    throw error;
  }
};

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
