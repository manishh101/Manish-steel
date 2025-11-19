# 🔧 CORS and 404 Error Fix Guide

## 🚨 Problems Identified

From your console errors:
1. **CORS Error**: `No 'Access-Control-Allow-Origin' header is present`
2. **404 Error**: `GET https://manish-steel-backend.vercel.app/api/health net::ERR_FAILED 404`

---

## ✅ What We Fixed

### 1. Backend Serverless Handler (`server/index.js`)
- **Problem**: Simple export doesn't work properly with Vercel serverless
- **Fix**: Created proper serverless function handler with:
  - Database connection pooling
  - Connection reuse across invocations
  - Proper error handling
  - Request routing through Express app

### 2. Vercel Configuration (`server/vercel.json`)
- **Problem**: Routes not properly configured for serverless
- **Fix**: Updated routes to properly forward ALL requests to `index.js`:
  - All `/api/*` routes
  - `/health` endpoint
  - Root `/` endpoint
  - Static file routes
- **Fix**: Added global CORS headers at Vercel level

---

## 🚀 Deployment Steps

### Step 1: Commit and Push Changes

```bash
cd /home/manish/Manish-steel

# Stage the fixed files
git add server/index.js server/vercel.json

# Commit with descriptive message
git commit -m "Fix: Resolve CORS and 404 errors in Vercel serverless deployment"

# Push to GitHub
git push origin main
```

### Step 2: Verify Backend Environment Variables

Go to your Vercel backend project dashboard:

1. **Navigate**: `vercel.com` → Your backend project → `Settings` → `Environment Variables`

2. **Verify these variables exist**:
   ```
   MONGO_URI=mongodb+srv://your-connection-string
   JWT_SECRET=your-32-character-secret
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   NODE_ENV=production
   ALLOWED_ORIGINS=https://www.manishsteelfurniture.com.np,https://manishsteelfurniture.com.np
   ```

3. **IMPORTANT**: Update `ALLOWED_ORIGINS` to include your frontend domain:
   ```
   ALLOWED_ORIGINS=https://www.manishsteelfurniture.com.np,https://manishsteelfurniture.com.np,http://localhost:3000
   ```

### Step 3: Redeploy Backend

After pushing the changes, Vercel will automatically redeploy. Or manually:

```bash
# If you have Vercel CLI installed
cd /home/manish/Manish-steel/server
vercel --prod
```

**OR** in Vercel Dashboard:
- Go to your backend project
- Click `Deployments` tab
- Click `...` on latest deployment → `Redeploy`

### Step 4: Test Backend

Once deployed, test these endpoints:

```bash
# Test 1: Root endpoint
curl https://manish-steel-backend.vercel.app/

# Test 2: Health check with /api prefix
curl https://manish-steel-backend.vercel.app/api/health

# Test 3: Health check without prefix
curl https://manish-steel-backend.vercel.app/health

# Test 4: Products endpoint
curl https://manish-steel-backend.vercel.app/api/products
```

**All should return JSON responses, NOT 404**

### Step 5: Test CORS from Frontend

Open your browser console on `https://www.manishsteelfurniture.com.np`:

```javascript
// Run this in browser console
fetch('https://manish-steel-backend.vercel.app/api/health')
  .then(res => res.json())
  .then(data => console.log('✅ Success:', data))
  .catch(err => console.error('❌ Error:', err));
```

Should see: `✅ Success: { status: 'healthy', ... }`

---

## 🔍 Troubleshooting

### If 404 Still Occurs

**Check 1: Verify Vercel Root Directory**
- Go to Vercel project → Settings → General
- Confirm "Root Directory" is set to `server`
- If not, change it and redeploy

**Check 2: Verify Build Configuration**
- Framework Preset: `Other` (not Next.js, not Nuxt.js)
- Build Command: (leave empty)
- Output Directory: (leave empty)
- Install Command: `npm install`

**Check 3: Check Vercel Build Logs**
- Go to Deployments tab
- Click on latest deployment
- Check "Building" section for errors
- Look for `index.js` in the build output

### If CORS Still Fails

**Check 1: Environment Variables**
```bash
# In Vercel dashboard, verify ALLOWED_ORIGINS includes:
https://www.manishsteelfurniture.com.np
https://manishsteelfurniture.com.np
```

**Check 2: Browser Cache**
```bash
# Clear browser cache or try in Incognito mode
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

**Check 3: Check Actual CORS Headers**
```bash
# In browser console:
fetch('https://manish-steel-backend.vercel.app/api/health', {
  method: 'OPTIONS'
}).then(res => {
  console.log('CORS Headers:', res.headers);
});
```

### If Database Connection Fails

**Check Vercel Function Logs**:
- Go to your backend project
- Click `Logs` tab
- Look for MongoDB connection errors
- Common issues:
  - Wrong MONGO_URI format
  - IP whitelist in MongoDB Atlas (add `0.0.0.0/0` to allow all)
  - Network timeout

---

## 📊 Expected Results After Fix

### ✅ Frontend Console (No Errors)
```
✅ API connection successful
✅ Products loaded: 12 items
✅ Categories loaded: 5 items
✅ Images loading from Cloudinary
```

### ✅ Backend Health Check
```json
{
  "status": "healthy",
  "timestamp": "2025-11-19T10:30:00.000Z",
  "port": 5000
}
```

### ✅ Products API
```json
{
  "products": [...],
  "total": 12,
  "page": 1
}
```

---

## 🆘 Quick Commands Reference

```bash
# 1. Commit fixes
git add server/index.js server/vercel.json
git commit -m "Fix: CORS and 404 errors"
git push origin main

# 2. Test backend (after deployment)
curl https://manish-steel-backend.vercel.app/api/health

# 3. Watch Vercel logs (if CLI installed)
vercel logs --follow

# 4. Force redeploy
vercel --prod --force
```

---

## 📞 If Issues Persist

1. **Share Vercel Deployment Logs**:
   - Go to Vercel → Your backend project → Deployments
   - Click latest deployment → "Building" section
   - Copy and share the build logs

2. **Share Runtime Logs**:
   - Click "Functions" tab in deployment details
   - Click on `index.js` function
   - Copy runtime logs

3. **Check Network Tab**:
   - Open browser DevTools → Network tab
   - Try loading the site
   - Click on failed request → Headers tab
   - Share Request URL, Status Code, and Response Headers

---

**Last Updated**: November 19, 2025
**Status**: Ready for deployment
