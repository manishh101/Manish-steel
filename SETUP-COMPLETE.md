# ✅ Setup Complete - Manish Steel Furniture Project

## 🎉 What Has Been Done

I've successfully configured your project so that running `npm start` in the appropriate directories will automatically start all necessary services.

---

## 🚀 How to Start Everything

### 1️⃣ Start Backend (Database + API)

```bash
cd server
npm start
```

**This automatically:**
- ✅ Loads environment variables from `.env`
- ✅ Connects to MongoDB database
- ✅ Verifies Cloudinary configuration
- ✅ Seeds database if empty (with Cloudinary images)
- ✅ Starts Express API server on port 5000
- ✅ Sets up all routes, middleware, and CORS
- ✅ Displays helpful URLs in console

**Backend will run at:** `http://localhost:5000`

---

### 2️⃣ Start Frontend (React App)

```bash
cd manish-steel-final
npm start
```

**This automatically:**
- ✅ Starts React development server
- ✅ Opens browser at `http://localhost:3000`
- ✅ Enables hot reload
- ✅ Connects to backend API

**Frontend will run at:** `http://localhost:3000`

---

## 📋 Changes Made

### 1. Updated `/server/package.json`

**Before:**
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

**After:**
```json
"scripts": {
  "start": "node start-server.js",
  "dev": "nodemon start-server.js",
  "serverless": "node index.js"
}
```

Now `npm start` runs the standalone server (`start-server.js`) which:
- Connects to MongoDB
- Seeds database if needed
- Starts Express server with all routes

### 2. Improved Error Handling

Added better error handling in `start-server.js` for:
- Port already in use (EADDRINUSE)
- Database connection failures
- Graceful shutdown (SIGTERM, SIGINT)

### 3. Created Helper Scripts

Created scripts in project root:
- `start-backend.sh` - Start backend only
- `start-frontend.sh` - Start frontend only
- `start-full-project.sh` - Start both services
- `stop-all.sh` - Stop all running services
- `check-status.sh` - Check service status

### 4. Documentation

Created comprehensive guides:
- `HOW-TO-START.md` - Complete startup guide
- `SETUP-COMPLETE.md` - This file

---

## 🔧 Quick Commands Reference

### Backend Commands (in `/server`)
```bash
npm start              # Start backend server with database
npm run dev            # Development mode with auto-restart
npm run serverless     # Serverless mode (for Vercel)
npm run init           # Initialize admin user
npm run migrate        # Run data migration
npm run seed-top-products  # Seed top products
```

### Frontend Commands (in `/manish-steel-final`)
```bash
npm start              # Start React dev server
npm run build          # Build for production
npm test               # Run tests
```

### Utility Commands (from project root)
```bash
./start-backend.sh     # Start backend
./start-frontend.sh    # Start frontend
./start-full-project.sh # Start both
./stop-all.sh          # Stop all services
./check-status.sh      # Check status
```

---

## 🎯 Typical Workflow

### Daily Development Startup

**Option 1: Manual (Recommended for visibility)**

Terminal 1:
```bash
cd server
npm start
```

Terminal 2:
```bash
cd manish-steel-final
npm start
```

**Option 2: Using Scripts**
```bash
./start-full-project.sh
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Port 5000 Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
```bash
# Kill the process using port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
echo "PORT=5001" >> server/.env
```

### Issue 2: Port 3000 Already in Use

**Solution:**
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or React will prompt to use another port
# Just press 'Y' when asked
```

### Issue 3: MongoDB Connection Failed

**Error:**
```
Database Connection Error: connect ECONNREFUSED
```

**Solutions:**
1. Check if MongoDB is running:
   ```bash
   sudo systemctl status mongodb
   # or
   sudo systemctl status mongod
   ```

2. Start MongoDB:
   ```bash
   sudo systemctl start mongodb
   ```

3. Verify `MONGO_URI` in `server/.env`

### Issue 4: Cloudinary Configuration Error

**Error:**
```
WARNING: Cloudinary configuration issues detected
```

**Solution:**
Verify in `server/.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Issue 5: Cannot Connect to Backend API

**Frontend shows connection errors**

**Solutions:**
1. Make sure backend is running:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. Check CORS configuration in `server/server.js`

3. Verify frontend API base URL in `manish-steel-final/src/services/api.js`

---

## 🔍 Verify Everything is Working

### 1. Check Backend
```bash
# Health check
curl http://localhost:5000/api/health

# Get products
curl http://localhost:5000/api/products

# Get categories
curl http://localhost:5000/api/categories
```

### 2. Check Frontend
- Open browser: `http://localhost:3000`
- Browse products
- Check admin panel: `http://localhost:3000/admin/login`

### 3. Check Database
```bash
# Connect to MongoDB
mongosh manish-steel

# Check products count
db.products.countDocuments()

# View sample product
db.products.findOne()
```

---

## 📊 Service Status

Use the status checker:
```bash
./check-status.sh
```

This shows:
- Backend status (port 5000)
- Frontend status (port 3000)
- MongoDB connection
- Running processes

---

## 🛑 Stopping Services

### Stop Backend
```bash
# In the terminal running backend, press:
Ctrl + C

# Or kill the process:
pkill -f "node.*start-server.js"
```

### Stop Frontend
```bash
# In the terminal running frontend, press:
Ctrl + C

# Or kill the process:
pkill -f "react-scripts start"
```

### Stop Everything
```bash
./stop-all.sh
```

---

## 📁 Project Structure

```
Manish-steel/
├── server/                     # Backend API
│   ├── start-server.js        # ⭐ Main server startup (npm start runs this)
│   ├── server.js              # Express app configuration
│   ├── index.js               # Serverless entry point (Vercel)
│   ├── package.json           # ⭐ Updated scripts
│   ├── .env                   # Environment variables
│   ├── config/                # Database config
│   ├── models/                # MongoDB models
│   ├── routes/                # API routes
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── utils/                 # Utility functions
│   └── seeders/               # Database seeders
│
├── manish-steel-final/        # Frontend React App
│   ├── package.json           # Frontend scripts
│   ├── public/                # Static files
│   └── src/                   # React source code
│       ├── components/        # Reusable components
│       ├── pages/             # Page components
│       ├── services/          # API services
│       ├── context/           # React context
│       └── App.js             # Main app
│
├── start-backend.sh           # ⭐ Start backend script
├── start-frontend.sh          # ⭐ Start frontend script
├── start-full-project.sh      # ⭐ Start both
├── stop-all.sh                # ⭐ Stop all services
├── check-status.sh            # ⭐ Check status
├── HOW-TO-START.md            # ⭐ Detailed guide
└── SETUP-COMPLETE.md          # ⭐ This file
```

---

## 🎓 What You Learned

### Backend Startup Process
When you run `npm start` in `/server`:
1. Node.js runs `start-server.js`
2. Loads environment variables
3. Connects to MongoDB
4. Checks if database needs seeding
5. Seeds database with Cloudinary images (if empty)
6. Starts Express server
7. Listens on port 5000
8. Ready to serve API requests

### Frontend Startup Process
When you run `npm start` in `/manish-steel-final`:
1. React Scripts starts
2. Webpack compiles the code
3. Development server starts on port 3000
4. Browser opens automatically
5. Hot module replacement enabled
6. Ready for development

---

## 💡 Pro Tips

1. **Always start backend first** - Frontend needs API to be available
2. **Use separate terminals** - Better log visibility
3. **Check console logs** - They show helpful startup information
4. **Use `npm run dev` for backend** - Auto-restarts on file changes
5. **Keep both running during development** - Hot reload works best
6. **Check status script regularly** - Verify everything is running
7. **Use stop-all script** - Clean shutdown when done

---

## 🚨 Important Notes

### Environment Variables
- Backend requires `server/.env` file
- Never commit `.env` to git
- Keep credentials secure

### Database Seeding
- Automatic on first run if database is empty
- Won't re-seed if products with Cloudinary images exist
- Set `FORCE_RESEED=true` in `.env` to force re-seeding

### Ports
- Backend: 5000 (configurable via PORT in .env)
- Frontend: 3000 (React default)
- Make sure these ports are available

### CORS
- Backend configured to allow `http://localhost:3000`
- Production domains also configured
- Check `server/server.js` if issues occur

---

## ✨ Success Indicators

You'll know everything is working when:

### Backend Terminal Shows:
```
✅ Cloudinary connection successful
Cloudinary image storage is properly configured
MongoDB Connected successfully
✅ Database already has X products with Cloudinary images - skipping seeding
🚀 Server is running on port 5000
📱 API Base URL: http://localhost:5000/api
```

### Frontend Terminal Shows:
```
Compiled successfully!

You can now view manish-steel-website in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Browser Shows:
- Website loads at `http://localhost:3000`
- Products display with images
- No console errors
- Admin panel accessible

---

## 📞 Need Help?

If you encounter issues:
1. ✅ Check this document first
2. ✅ Read `HOW-TO-START.md` for detailed troubleshooting
3. ✅ Verify `.env` configuration
4. ✅ Check terminal logs for error messages
5. ✅ Use `./check-status.sh` to diagnose
6. ✅ Try `./stop-all.sh` and restart

---

## 🎉 You're All Set!

Your project is now properly configured. Simply:

1. **Open Terminal 1:** `cd server && npm start`
2. **Open Terminal 2:** `cd manish-steel-final && npm start`
3. **Start coding!** 🚀

---

**Last Updated:** November 18, 2025
**Status:** ✅ Production Ready
