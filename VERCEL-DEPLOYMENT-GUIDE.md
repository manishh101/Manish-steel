# 🚀 Vercel Deployment Guide

Complete guide to deploy both Frontend and Backend to Vercel.

---

## 📋 Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **Vercel CLI** (Optional): Install globally
   ```bash
   npm install -g vercel
   ```
3. **GitHub Account**: For automatic deployments
4. **MongoDB Atlas**: Database (already configured)
5. **Cloudinary Account**: Image storage (already configured)

---

## 🎯 Deployment Strategy

We'll deploy **TWO separate projects** on Vercel:

1. **Backend API** (`/server`) → `manish-steel-api.vercel.app`
2. **Frontend App** (`/manish-steel-final`) → `manish-steel.vercel.app`

---

## 📦 Part 1: Deploy Backend API

### Step 1: Prepare Backend

The backend is already configured! Verify these files exist:
- ✅ `server/index.js` - Entry point
- ✅ `server/vercel.json` - Vercel configuration
- ✅ `server/package.json` - Dependencies
- ✅ `server/.env.example` - Environment template

### Step 2: Deploy Backend to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Import your GitHub repository
4. **Configure Project:**
   - **Framework Preset:** Other
   - **Root Directory:** `server`
   - **Build Command:** Leave empty or `npm install`
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

5. **Add Environment Variables** (CRITICAL):
   Click "Environment Variables" and add:

   ```bash
   MONGO_URI=mongodb+srv://your-username:password@cluster.mongodb.net/manish-steel
   JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://manishsteelfurniture.com.np
   ```

6. Click **"Deploy"**
7. Wait for deployment to complete
8. **Copy your backend URL**: `https://your-backend.vercel.app`

#### Option B: Via Vercel CLI

```bash
cd server
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set up and deploy

# Add environment variables
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
vercel env add NODE_ENV
vercel env add ALLOWED_ORIGINS

# Deploy to production
vercel --prod
```

### Step 3: Test Backend API

```bash
# Test health endpoint
curl https://your-backend.vercel.app/api/health

# Should return: {"status":"OK","message":"Server is running"}

# Test products endpoint
curl https://your-backend.vercel.app/api/products

# Should return product data
```

---

## 🎨 Part 2: Deploy Frontend

### Step 1: Update Frontend Environment Variables

Update `manish-steel-final/.env.production`:

```bash
# IMPORTANT: Replace with your actual backend URL
REACT_APP_API_URL=https://your-backend.vercel.app/api

# App Configuration
REACT_APP_NAME=Manish Steel Furniture
REACT_APP_VERSION=1.0.0
GENERATE_SOURCEMAP=false
```

### Step 2: Deploy Frontend to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Import your GitHub repository (or create a new one)
4. **Configure Project:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `manish-steel-final`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

5. **Add Environment Variables:**
   ```bash
   REACT_APP_API_URL=https://your-backend.vercel.app/api
   REACT_APP_NAME=Manish Steel Furniture
   REACT_APP_VERSION=1.0.0
   GENERATE_SOURCEMAP=false
   ```

6. Click **"Deploy"**
7. Wait for deployment to complete
8. **Your site is live!** `https://your-frontend.vercel.app`

#### Option B: Via Vercel CLI

```bash
cd manish-steel-final
vercel

# Follow prompts
# Add environment variables
vercel env add REACT_APP_API_URL
vercel env add REACT_APP_NAME
vercel env add REACT_APP_VERSION
vercel env add GENERATE_SOURCEMAP

# Deploy to production
vercel --prod
```

---

## 🔄 Part 3: Update CORS Settings

After deploying frontend, update backend CORS settings:

1. Go to your backend Vercel project
2. Navigate to **Settings → Environment Variables**
3. Update `ALLOWED_ORIGINS`:
   ```
   https://your-frontend.vercel.app,https://www.your-frontend.vercel.app,http://localhost:3000
   ```
4. Redeploy backend (Vercel will auto-deploy on env change)

---

## 🌐 Part 4: Custom Domain (Optional)

### Add Custom Domain to Frontend

1. Go to your frontend Vercel project
2. Navigate to **Settings → Domains**
3. Add your domain: `manishsteelfurniture.com.np`
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

### Add Custom Domain to Backend

1. Go to your backend Vercel project
2. Navigate to **Settings → Domains**
3. Add subdomain: `api.manishsteelfurniture.com.np`
4. Update DNS records
5. Update frontend `REACT_APP_API_URL` to use new domain

---

## ✅ Verification Checklist

After deployment, verify:

### Backend Checklist
- [ ] API health endpoint works: `/api/health`
- [ ] Products endpoint works: `/api/products`
- [ ] Categories endpoint works: `/api/categories`
- [ ] Admin login works: `/api/auth/login`
- [ ] Images load from Cloudinary
- [ ] CORS allows frontend domain
- [ ] Environment variables are set
- [ ] No build errors in Vercel logs

### Frontend Checklist
- [ ] Homepage loads correctly
- [ ] Products page displays items
- [ ] Images load properly
- [ ] Category navigation works
- [ ] Contact form submits
- [ ] Admin panel accessible
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Custom domain works (if configured)

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: 500 Internal Server Error**
```bash
# Check Vercel logs
vercel logs your-backend-url

# Common fixes:
# 1. Verify MONGO_URI is correct
# 2. Check Cloudinary credentials
# 3. Ensure JWT_SECRET is set
# 4. Check ALLOWED_ORIGINS includes frontend URL
```

**Problem: CORS Errors**
```bash
# Update ALLOWED_ORIGINS in backend
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://www.your-frontend.vercel.app
```

**Problem: Database Connection Fails**
```bash
# Verify MongoDB Atlas:
# 1. IP whitelist includes 0.0.0.0/0 (all IPs)
# 2. Database user has correct permissions
# 3. Connection string is correct
```

### Frontend Issues

**Problem: API Requests Fail**
```bash
# Check .env.production
REACT_APP_API_URL=https://your-backend.vercel.app/api

# Rebuild and redeploy
vercel --prod
```

**Problem: Images Don't Load**
```bash
# Verify Cloudinary images are public
# Check browser console for errors
# Ensure backend is returning correct image URLs
```

**Problem: Blank Page After Deploy**
```bash
# Check browser console
# Verify build completed successfully
# Check Vercel build logs
# Ensure all dependencies are in package.json
```

---

## 🔧 Advanced Configuration

### Enable Automatic Deployments

1. Connect your GitHub repository to Vercel
2. Every push to `main` branch will auto-deploy
3. Pull requests create preview deployments

### Set Up Environment for Multiple Environments

```bash
# Production
vercel env add VARIABLE_NAME production

# Preview (staging)
vercel env add VARIABLE_NAME preview

# Development
vercel env add VARIABLE_NAME development
```

### Monitor Performance

1. Go to Vercel project → Analytics
2. Monitor:
   - Response times
   - Error rates
   - Bandwidth usage
   - Visitor statistics

---

## 📊 Deployment Summary

| Component | URL Pattern | Directory |
|-----------|-------------|-----------|
| Backend API | `your-backend.vercel.app` | `/server` |
| Frontend | `your-frontend.vercel.app` | `/manish-steel-final` |
| Custom Domain (Frontend) | `manishsteelfurniture.com.np` | - |
| Custom Domain (Backend) | `api.manishsteelfurniture.com.np` | - |

---

## 🎉 Success Indicators

Your deployment is successful when:

✅ Backend API responds at `/api/health`  
✅ Frontend loads without errors  
✅ Products display correctly  
✅ Images load from Cloudinary  
✅ Admin panel works  
✅ Form submissions succeed  
✅ No CORS errors in console  
✅ Mobile version works perfectly  

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Community**: https://github.com/vercel/vercel/discussions

---

**Last Updated:** November 19, 2025  
**Status:** Ready for Deployment ✅
