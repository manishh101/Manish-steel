require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const runSeeders = require('./seeders');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

// Import Cloudinary configuration
const { cloudinary, testConnection } = require('./utils/cloudinarySetup');

// Import cache middleware
const { cacheMiddleware, clearCache, getCacheStats } = require('./middleware/cacheMiddleware');

// Create Express app
const app = express();

// Verify Cloudinary configuration during startup
testConnection()
  .then(isValid => {
    if (isValid) {
      console.log('Cloudinary image storage is properly configured');
    } else {
      console.warn('WARNING: Cloudinary configuration issues detected');
    }
  })
  .catch(err => {
    console.error('Error verifying Cloudinary configuration:', err.message);
  });

// Optimized logging for serverless (reduced verbosity)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('combined'));
} else {
  // Minimal logging in production for better performance
  app.use(morgan('tiny'));
}

// Middleware
// Add compression for all responses
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6 // Compression level (0-9, where 9 is maximum)
}));

// Configure CORS to allow requests from frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 
     'https://manishsteelfurniture.com.np',
     'https://www.manishsteelfurniture.com.np',
     'https://manish-steel-furniture.vercel.app', 
     'https://manish-steel-furniture-m9ayaff4c-manishh101s-projects.vercel.app',
     'https://manish-steel-furniture-git-main-manishh101s-projects.vercel.app'];

// Log the allowed origins for debugging
console.log(`CORS configured with allowed origins: ${JSON.stringify(allowedOrigins)}`);

// Setup CORS with more permissive settings during development
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests or postman)
    if(!origin) {
      console.log(`CORS allowing request with no origin`);
      return callback(null, true);
    }
    
    if(allowedOrigins.indexOf(origin) === -1) {
      console.log(`CORS blocked for origin: ${origin}`);
      // During development, you might want to still allow the request
      // return callback(new Error(`Origin ${origin} not allowed by CORS`), false);
      return callback(null, true); // More permissive - allow all origins temporarily
    }
    console.log(`CORS allowing origin: ${origin}`);
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));
app.use(express.json({ limit: '50mb' })); // Increase JSON payload limit

// Simplified rate limiting for serverless (less effective but faster cold starts)
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Reasonable limit per window
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks and OPTIONS requests
    return req.method === 'OPTIONS' || req.path.includes('/health');
  }
});

// Apply lighter rate limiting to sensitive endpoints only
app.use('/api/auth', apiLimiter);

// Serve static files from uploads directory for legacy image support
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Test route to verify server is running
app.get('/', (req, res) => {
  res.json({ 
    message: 'Manish Steel API is running!',
    status: 'success'
  });
});

// Port discovery endpoint
app.get('/port', (req, res) => {
  const port = process.env.PORT || 5000;
  res.json({ 
    port: port,
    baseUrl: `http://localhost:${port}/api`
  });
});

// API root route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Manish Steel API is running!',
    status: 'success'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000
  });
});

// Alternative health check endpoint without /api prefix
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000
  });
});

// Cache management endpoints
app.get('/api/cache/stats', getCacheStats);
app.post('/api/cache/clear', clearCache, (req, res) => {
  res.json({ success: true, message: 'Cache cleared successfully' });
});

// Apply caching to GET requests for public API routes
// Cache products for 5 minutes
app.use('/api/products', cacheMiddleware(300000));
app.use('/api/categories', cacheMiddleware(300000));
app.use('/api/about', cacheMiddleware(600000)); // 10 minutes for about page
app.use('/api/gallery', cacheMiddleware(300000));

// Define Routes - Use secure authentication system
app.use('/api/auth', require('./routes/auth-secure-simple'));
app.use('/api/users', require('./routes/users'));

// Use the consolidated product routes
app.use('/api/products', require('./routes/products-consolidated'));

// Other routes
app.use('/api/categories', require('./routes/categories'));
app.use('/api/subcategories', require('./routes/subcategories'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/custom-orders', require('./routes/customOrders'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/about', require('./routes/aboutRoutes'));
app.use('/api/gallery', require('./routes/gallery'));

// Setup MongoDB connection
const connectDB = async () => {
  try {
    console.log('Starting database connection...');
    let mongoUri;

    if (process.env.MONGO_URI) {
      mongoUri = process.env.MONGO_URI;
      console.log('Using MongoDB URI from environment variable.');
    } else {
      console.error('MONGO_URI environment variable is not set.');
      return false;
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected successfully');

    // Check if database needs seeding (only run seeders if no products exist or if explicitly requested)
    const Product = require('./models/Product');
    const existingProducts = await Product.find();
    const hasCloudinaryProducts = existingProducts.some(product => 
      product.image && product.image.includes('cloudinary.com')
    );
    
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
      console.log('💡 To force reseeding, set FORCE_RESEED=true in .env file');
    } else {
      console.log('⚠️ Warning: Products found but they don\'t use Cloudinary images. Run migration scripts manually if needed.');
    }

    return true;
  } catch (error) {
    console.error('Database Connection Error:', error.message);
    console.error('Full error:', error);
    return false;
  }
};

// Enhanced error handling middleware (must be at the end)
app.use((err, req, res, next) => {
  console.error('⚠️ Server Error:', err);
  console.error('Stack trace:', err.stack);
  
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Export the Express app for serverless deployment
// Database connection is handled in the root index.js
module.exports = app;
