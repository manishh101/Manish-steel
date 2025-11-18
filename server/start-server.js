/**
 * Standalone server startup script
 */
require('dotenv').config();
const app = require('./server');
const mongoose = require('mongoose');
const runSeeders = require('./seeders');

// Set PORT
const PORT = process.env.PORT || 5000;

// Setup MongoDB connection
const connectDB = async () => {
  try {
    console.log('Starting database connection...');
    let mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('MONGO_URI environment variable is not set.');
      return false;
    }
    
    console.log('Using MongoDB URI from environment variable.');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected successfully');

    // Check if database needs seeding
    const Product = require('./models/Product');
    const existingProducts = await Product.find();
    const hasCloudinaryProducts = existingProducts.some(product => 
      product.image && product.image.includes('cloudinary.com')
    );
    
    console.log(`Found ${existingProducts.length} products in database`);
    
    const forceReseed = process.env.FORCE_RESEED === 'true';
    
    if (forceReseed) {
      console.log('🔄 FORCE_RESEED is enabled - running seeders...');
      await runSeeders();
      console.log('Forced database seeding completed');
    } else if (existingProducts.length === 0) {
      console.log('No products found in database - running initial seeding...');
      await runSeeders();
      console.log('Initial database seeding completed');
    } else if (hasCloudinaryProducts) {
      console.log(`✅ Database already has ${existingProducts.length} products with Cloudinary images - skipping seeding`);
    } else {
      console.log('⚠️ Warning: Products found but they don\'t use Cloudinary images.');
    }
    
    return true;
  } catch (error) {
    console.error('Database Connection Error:', error.message);
    console.error('Full error:', error);
    return false;
  }
};

// Start server
const startServer = async () => {
  try {
    const dbConnected = await connectDB();
    if (dbConnected) {
      const server = app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
        console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
        console.log(`🔍 Products API: http://localhost:${PORT}/api/products`);
        console.log(`⭐ Top Products: http://localhost:${PORT}/api/products/top`);
        console.log(`🔥 Most Selling: http://localhost:${PORT}/api/products/most-selling`);
      });

      // Handle port already in use error
      server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          console.error(`❌ Error: Port ${PORT} is already in use!`);
          console.error(`💡 Solutions:`);
          console.error(`   1. Kill the process: lsof -ti:${PORT} | xargs kill -9`);
          console.error(`   2. Change PORT in .env file`);
          console.error(`   3. Wait a few seconds and try again`);
          process.exit(1);
        } else {
          console.error('Server error:', error);
          process.exit(1);
        }
      });
    } else {
      console.error('Failed to connect to database. Server not started.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});

startServer();
