// MongoDB connection utility with serverless optimization

const mongoose = require('mongoose');

// Cache the database connection across serverless function invocations
let cachedConnection = null;

const connectDB = async () => {
  // If we already have a cached connection and it's connected, reuse it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached database connection');
    return true;
  }

  try {
    // Use MONGO_URI from environment if available (for Atlas)
    let mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI environment variable is not set.');
      return false;
    }

    console.log('Creating new database connection...');
    const conn = await mongoose.connect(mongoUri, {
      // Serverless-optimized settings
      maxPoolSize: 10, // Maximum number of connections in pool
      minPoolSize: 1, // Lower minimum for serverless
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      serverSelectionTimeoutMS: 10000, // Increased timeout for serverless cold starts
      heartbeatFrequencyMS: 10000, // Heartbeat frequency 10 seconds
      // Prevent deprecation warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    cachedConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    cachedConnection = null;
    return false;
  }
};

module.exports = connectDB;
