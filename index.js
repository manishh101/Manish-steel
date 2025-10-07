/**
 * Vercel Serverless Entry Point
 * Optimized for serverless deployment on Vercel platform
 */

require('dotenv').config();

// Import database connection
const connectDB = require('./server/config/db');

// Import the Express application
const app = require('./server/server');

// Initialize database connection immediately for serverless
// This ensures connection is established during cold start
connectDB()
  .then(() => {
    console.log('✅ Database connection initialized for serverless');
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
  });

// Export the Express app for Vercel to handle
module.exports = app;
