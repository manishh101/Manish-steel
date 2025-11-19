# 📋 Files Kept - Reference Guide

This document explains why certain files are kept in the project.

## 🎯 Root Directory Files

### Documentation (4 files)
- **README.md** - Main project overview, setup instructions
- **HOW-TO-START.md** - Detailed startup guide for developers
- **QUICK-START.md** - Quick reference for common commands
- **SETUP-COMPLETE.md** - Complete setup documentation
- **CLEANUP-SUMMARY.md** - Record of cleanup activities

### Startup Scripts (4 files)
- **start-frontend.sh** - Launch React frontend (port 3000)
- **start-backend.sh** - Launch Express backend (port 5000)
- **start-full-project.sh** - Launch both services at once
- **stop-all.sh** - Stop all running processes

### Configuration (1 file)
- **.env.example** - Template for environment variables (if exists)

---

## 📦 Server Directory

### Core Files
- **index.js** - Vercel serverless entry point
- **server.js** - Express app configuration and export
- **start-server.js** - Local development server launcher
- **package.json** - Backend dependencies
- **vercel.json** - Vercel deployment configuration

### Configuration
- **.env** - Environment variables (keep secret!)
- **.env.example** - Template for new developers
- **.gitignore** - Files to exclude from Git
- **jsconfig.json** - JavaScript configuration

### Directories
- **config/** - Database and app configuration
- **controllers/** - Route controllers/logic
- **middleware/** - Express middleware (auth, validation)
- **models/** - MongoDB/Mongoose models
- **routes/** - API route definitions
- **scripts/** - Utility scripts (init, migrate, seed)
- **seeders/** - Database seed data
- **uploads/** - File upload storage (needed!)
- **utils/** - Helper functions
- **public/images/** - Static image assets

---

## 🎨 Frontend Directory

### Core Files
- **package.json** - Frontend dependencies
- **vercel.json** - Vercel deployment configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **postcss.config.js** - PostCSS configuration
- **jsconfig.json** - JavaScript configuration

### Configuration
- **.env** - Current environment variables
- **.env.development** - Development settings
- **.env.production** - Production settings
- **.env.local** - Local overrides
- **.env.example** - Template for new developers
- **.eslintrc.js** - ESLint code quality rules
- **.gitignore** - Files to exclude from Git
- **.vercelignore** - Files to exclude from Vercel

### Directories
- **src/** - React source code
  - **components/** - React components
  - **pages/** - Page components
  - **hooks/** - Custom React hooks
  - **services/** - API services
  - **utils/** - Helper functions
  - **assets/** - Images, fonts, etc.
  - **data/** - Static data files
- **public/** - Static assets served directly
  - **index.html** - Main HTML template
  - **favicon.ico** - Site icon
  - **robots.txt** - SEO crawler rules
  - **manifest.json** - PWA manifest
  - Images and logos

---

## ⚠️ IMPORTANT - DO NOT DELETE

### Environment Files (.env*)
These contain sensitive configuration and API keys:
- Database URLs
- API endpoints
- Authentication secrets
- Cloud service credentials

**Always ensure these are in .gitignore!**

### Configuration Files
- **vercel.json** - Required for deployment
- **package.json** - Required for dependencies
- **tailwind.config.js** - Required for styling
- **.gitignore** - Required for security

### Upload Directories
- **server/uploads/** - User uploaded files
- **server/public/images/** - Dynamic images

---

## 🗑️ Safe to Delete (if they reappear)

- **server.log** - Regenerated automatically
- **node_modules/** - Reinstalled with `npm install`
- **.DS_Store** - macOS system files
- **Thumbs.db** - Windows system files
- Any **.zip** or **.tar.gz** backup files
- Test files: **test-*.js**, **test-*.html**
- Old documentation with dates or "OLD" in name

---

## 📝 Notes

1. **Multiple .env files** are normal and needed for different environments
2. **Multiple vercel.json files** (one per directory) are correct
3. **node_modules/** folders are large but necessary (excluded from Git)
4. **.git/** folder contains version history (keep it!)
5. **uploads/** folder may be empty initially but will fill with user content

---

## 🔍 Quick Check

To verify your project is clean:

```bash
# Check root directory
ls -la

# Should see:
# - 2 directories (manish-steel-final, server)
# - 4-5 documentation files
# - 4 startup scripts
# - Hidden files (.git, .gitignore, .env.example)

# Check for unnecessary files
find . -name "*.log" -o -name "*.zip" -o -name "test-*.js" 2>/dev/null

# Should return minimal or no results
```

---

**Last Updated:** November 19, 2025  
**Status:** Clean & Optimized ✅
