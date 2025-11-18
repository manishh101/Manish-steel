# How to Start Manish Steel Furniture Project

## 🚀 Quick Start Guide

This guide explains how to start the backend and frontend of the Manish Steel Furniture project.

---

## 📋 Prerequisites

Before starting, make sure you have:
- Node.js (v14 or higher)
- MongoDB running (local or cloud)
- `.env` file configured in `/server` directory

---

## 🔧 Backend Setup & Start

### Start Backend Server

The backend includes:
- Express API server
- MongoDB database connection
- Automatic data seeding (if database is empty)
- Cloudinary image storage

**To start the backend:**

```bash
# Navigate to server directory
cd server

# Install dependencies (first time only)
npm install

# Start the backend server
npm start
```

**What happens when you run `npm start` in `/server`:**
1. ✅ Loads environment variables from `.env`
2. ✅ Connects to MongoDB database
3. ✅ Verifies Cloudinary configuration
4. ✅ Seeds database with initial data (if empty)
5. ✅ Starts Express server on port 5000 (or PORT from .env)
6. ✅ Sets up all API routes and middleware

**Backend will be available at:** `http://localhost:5000`

### Alternative Backend Commands

```bash
# Development mode with auto-restart
npm run dev

# Run only for serverless (Vercel)
npm run serverless

# Initialize admin user
npm run init

# Run data migration
npm run migrate

# Seed top products
npm run seed-top-products
```

### Verify Backend is Running

```bash
# Test API health
curl http://localhost:5000/api/health

# Test products endpoint
curl http://localhost:5000/api/products
```

---

## 🎨 Frontend Setup & Start

### Start Frontend Application

**To start the frontend:**

```bash
# Navigate to frontend directory
cd manish-steel-final

# Install dependencies (first time only)
npm install

# Start the React development server
npm start
```

**What happens when you run `npm start` in `/manish-steel-final`:**
1. ✅ Starts React development server
2. ✅ Opens browser automatically
3. ✅ Enables hot reload for development
4. ✅ Connects to backend API at `http://localhost:5000`

**Frontend will be available at:** `http://localhost:3000`

The browser will open automatically at `http://localhost:3000`

### Alternative Frontend Commands

```bash
# Build for production
npm run build

# Run tests
npm run test
```

---

## 🔄 Complete Project Start (Both Services)

### Option 1: Using Separate Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd manish-steel-final
npm start
```

### Option 2: Using the Start Scripts

**Start Backend:**
```bash
# From project root
./start-backend.sh
```

**Start Frontend:**
```bash
# From project root
./start-frontend.sh
```

**Start Both:**
```bash
# From project root
./start-full-project.sh
```

---

## 🛑 Stopping Services

### Stop Backend
- Press `Ctrl + C` in the terminal running backend
- Or kill the process:
```bash
pkill -f "node.*start-server.js"
```

### Stop Frontend
- Press `Ctrl + C` in the terminal running frontend
- Or kill the process:
```bash
pkill -f "react-scripts start"
```

### Stop All Services
```bash
./stop-all.sh
```

---

## 🔍 Check Service Status

```bash
./check-status.sh
```

This will show:
- ✅ Backend server status (port 5000)
- ✅ Frontend server status (port 3000)
- ✅ MongoDB connection
- ✅ Running Node processes

---

## 📝 Environment Variables

### Backend (.env in /server)

Required variables:
```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/manish-steel
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/manish-steel

# JWT
JWT_SECRET=your-secret-key-here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=5000
NODE_ENV=development

# Optional
FORCE_RESEED=false
ALLOWED_ORIGINS=http://localhost:3000
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: "MONGO_URI environment variable is not set"**
```bash
# Solution: Create .env file in /server directory
cd server
cp .env.example .env
# Edit .env with your MongoDB connection string
```

**Problem: "Port 5000 already in use"**
```bash
# Solution 1: Kill the process using port 5000
lsof -ti:5000 | xargs kill -9

# Solution 2: Change PORT in .env file
PORT=5001
```

**Problem: "Cloudinary connection failed"**
```bash
# Solution: Verify Cloudinary credentials in .env
# Make sure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are correct
```

### Frontend Issues

**Problem: "Port 3000 already in use"**
```bash
# Solution 1: Kill the process
lsof -ti:3000 | xargs kill -9

# Solution 2: React will offer to run on different port
# Just press 'Y' when prompted
```

**Problem: "Cannot connect to backend API"**
```bash
# Solution: Make sure backend is running on port 5000
curl http://localhost:5000/api/health

# If backend is not running, start it:
cd server && npm start
```

**Problem: "Module not found"**
```bash
# Solution: Reinstall dependencies
cd manish-steel-final
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Additional Information

### Project Structure
```
Manish-steel/
├── server/                  # Backend API
│   ├── config/             # Database config
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── seeders/            # Database seeders
│   ├── start-server.js     # Standalone server startup
│   ├── server.js           # Express app configuration
│   ├── index.js            # Serverless entry point
│   └── package.json        # Backend dependencies
│
├── manish-steel-final/     # Frontend React App
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   └── App.js          # Main app component
│   └── package.json        # Frontend dependencies
│
├── start-backend.sh        # Backend startup script
├── start-frontend.sh       # Frontend startup script
├── start-full-project.sh   # Start both services
├── stop-all.sh            # Stop all services
├── check-status.sh        # Check service status
└── HOW-TO-START.md        # This file
```

### API Endpoints

Once backend is running, available endpoints:

- `GET /api/health` - Health check
- `GET /api/products` - Get all products
- `GET /api/categories` - Get all categories
- `GET /api/subcategories` - Get all subcategories
- `POST /api/auth/login` - Admin login
- And many more...

### Admin Access

Default admin credentials (if database is seeded):
- Email: `admin@manishsteel.com`
- Password: `admin123`

Change these after first login!

---

## 💡 Tips

1. **Always start backend before frontend** to ensure API is available
2. **Check console logs** for any errors during startup
3. **Use separate terminals** for better visibility of logs
4. **Keep both services running** during development
5. **Use `npm run dev`** in backend for auto-restart on file changes

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the logs in the terminal
2. Verify `.env` file configuration
3. Ensure MongoDB is running
4. Check if ports 3000 and 5000 are available
5. Try restarting both services

---

**Last Updated:** November 18, 2025
