/**
 * Server entry point for Vercel Serverless
 */

const app = require('../server');
const mongoose = require('mongoose');

// Database connection flag
let isConnected = false;

// Connect to MongoDB with connection pooling
const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    console.log('Establishing new database connection...');
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;
    console.log('✅ MongoDB connected successfully');

    // Check and run seeders if needed (only on first connection)
    const Product = require('../models/Product');
    const existingProducts = await Product.find().limit(1);
    
    if (existingProducts.length === 0 && process.env.RUN_SEEDERS !== 'false') {
      console.log('Running initial database seeding...');
      const runSeeders = require('../seeders');
      await runSeeders();
      console.log('Database seeding completed');
    } else {
      console.log(`Database has ${existingProducts.length > 0 ? 'existing' : 'no'} products`);
    }

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    throw error;
  }
};

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    // Ensure database is connected before handling requests
    await connectDB();

    // Handle the request with Express app
    return app(req, res);
  } catch (error) {
    console.error('Error in serverless function:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Also export the app for local development
module.exports.app = app;
