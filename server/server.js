require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const runSeeders = require('./seeders');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Run the script to ensure uploads directory has valid images for backward compatibility
require('./scripts/ensureUploads');

// Import Cloudinary configuration
const { cloudinary, testConnection } = require('./utils/cloudinarySetup');

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

// Use Morgan for request logging
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));

// Add detailed request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Body:', req.body);
  }
  
  // Capture and log the response
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`[${new Date().toISOString()}] Response for ${req.method} ${req.originalUrl}:`, 
      typeof body === 'string' ? body.substring(0, 200) + '...' : '[Object]');
    return originalSend.call(this, body);
  };
  
  next();
});

// Middleware
// Configure CORS to allow requests from frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 
     'https://manish-steel-furniture.vercel.app', 
     'https://manish-steel-furniture-m9ayaff4c-manishh101s-projects.vercel.app',
     'https://manish-steel-furniture-git-main-manishh101s-projects.vercel.app',
     'https://manish-steel-furniture.onrender.com'];

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

// Enhanced global rate limiting - more lenient for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Very generous limit for general API usage
  message: {
    error: 'Too many requests, please try again later',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks, static files, and OPTIONS requests
    return req.method === 'OPTIONS' || 
           req.path.includes('/health') || 
           req.path.includes('/uploads') || 
           req.path.includes('/public') ||
           req.path === '/' ||
           req.path === '/api';
  },
  onLimitReached: (req, res, options) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
  }
});

// Apply rate limiting to API routes only
app.use('/api', apiLimiter);

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
  res.json({ 
    port: PORT,
    baseUrl: `http://localhost:${PORT}/api`
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
    port: PORT
  });
});

// Alternative health check endpoint without /api prefix
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

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

// Define PORT - use 5000 to match frontend proxy
const PORT = process.env.PORT || 5000;

// Start server first, then connect to database
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
  
  // Connect to database after server starts
  connectDB()
    .then(async (dbConnected) => {
      if (dbConnected) {
        console.log('API running with database connection');
        
        // Print sample product to verify data
        const Product = require('./models/Product');
        const sampleProducts = await Product.find().limit(1);
        if (sampleProducts.length > 0) {
          console.log('Sample product:', sampleProducts[0].name);
        } else {
          console.log('No products found in database');
        }
      } else {
        console.log('API running without database connection');
      }
    })
    .catch(error => {
      console.error('Database connection failed:', error);
      console.log('API running without database connection');
    });
});

// Configure server timeouts to handle slow requests better
server.timeout = 60000; // 60 seconds
server.keepAliveTimeout = 65000; // 65 seconds (should be > timeout)
server.headersTimeout = 66000; // 66 seconds (should be > keepAliveTimeout)

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('⚠️ Server Error:', err);
  console.error('Stack trace:', err.stack);
  
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Handle server shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server gracefully...');
  
  server.close(async () => {
    console.log('HTTP server closed');
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
    
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.log('Forcing server shutdown...');
    process.exit(1);
  }, 10000);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  
  server.close(async () => {
    console.log('HTTP server closed');
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
    
    process.exit(0);
  });
});
