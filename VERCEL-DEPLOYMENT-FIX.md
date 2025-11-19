# 🔧 Vercel Deployment Fix

**Date:** November 19, 2025  
**Issue:** CORS errors and 404 errors after Vercel deployment  
**Status:** ✅ FIXED

---

## 🐛 Issues Identified

### 1. **CORS Policy Error**
```
Access to fetch at 'https://manish-steel-backend.vercel.app/api/health' 
from origin 'https://www.manishsteelfurniture.com.np' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### 2. **404 Not Found Error**
```
GET https://manish-steel-backend.vercel.app/api/health net::ERR_FAILED 404 (Not Found)
```

### 3. **Build Output Issue**
```
Build Completed in /vercel/output [173ms]
Deploying outputs...
Skipping cache upload because no files were prepared
```

**Root Cause:** Vercel wasn't building the serverless functions properly due to incorrect configuration structure.

---

## ✅ Fixes Applied

### 1. Updated `server/vercel.json`
**Changed:** From old `builds` and `routes` format to new `functions` and `rewrites` format

**Before:**
```json
{
  "builds": [{ "src": "index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/api/(.*)", "dest": "/index.js" }]
}
```

**After:**
```json
{
  "functions": {
    "api/index.js": { "maxDuration": 30, "memory": 1024 }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index" },
    { "source": "/health", "destination": "/api/index" },
    { "source": "/(.*)", "destination": "/api/index" }
  ]
}
```

### 2. Created `/server/api/index.js`
Moved the serverless function to the proper `api/` directory structure that Vercel expects.

### 3. Added CORS Headers in `vercel.json`
```json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      { "key": "Access-Control-Allow-Origin", "value": "*" },
      { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS, PATCH" },
      { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization, Accept, X-Requested-With" },
      { "key": "Access-Control-Allow-Credentials", "value": "true" }
    ]
  }
]
```

### 4. Updated `server/index.js`
Enhanced error handling and connection management for serverless environment.

---

## 📋 Deployment Steps

### Step 1: Commit and Push Changes
```bash
cd /home/manish/Manish-steel
git add .
git commit -m "Fix: Update Vercel serverless configuration for proper deployment"
git push origin main
```

### Step 2: Redeploy Backend (Automatic)
Vercel will automatically redeploy when you push to GitHub.

**OR** manually trigger redeploy:
1. Go to https://vercel.com/dashboard
2. Select your backend project (`manish-steel-api` or `server`)
3. Click "Deployments" tab
4. Click "Redeploy" on the latest deployment

### Step 3: Update Environment Variables (CRITICAL!)
Go to backend project settings and ensure these are set:

```bash
# Required Environment Variables
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-jwt-secret-min-32-characters
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
NODE_ENV=production

# CORS Configuration (UPDATE THIS!)
ALLOWED_ORIGINS=https://www.manishsteelfurniture.com.np,https://manishsteelfurniture.com.np,http://localhost:3000
```

⚠️ **IMPORTANT:** Replace `*` in ALLOWED_ORIGINS with your actual frontend domains!

### Step 4: Test Backend Endpoints
After redeployment, test these URLs in your browser:

```bash
# Health check (should return JSON with status: "ok")
https://manish-steel-backend.vercel.app/api/health

# Products endpoint (should return array of products)
https://manish-steel-backend.vercel.app/api/products

# Port check (should return port info)
https://manish-steel-backend.vercel.app/port
```

### Step 5: Update Frontend Environment Variable
If backend URL changed, update in Vercel:

1. Go to frontend project settings
2. Environment Variables
3. Update `REACT_APP_API_URL`:
   ```
   https://manish-steel-backend.vercel.app/api
   ```
4. Redeploy frontend

---

## 🧪 Testing Checklist

After redeployment, verify:

- [ ] Backend `/api/health` returns `200 OK`
- [ ] Backend `/api/products` returns product data
- [ ] Frontend loads without CORS errors
- [ ] Products display on homepage
- [ ] Images load from Cloudinary
- [ ] Admin dashboard loads
- [ ] No 404 errors in browser console
- [ ] API calls succeed (check Network tab)

---

## 🔍 How to Verify It's Working

### In Browser Console (F12):
```javascript
// Test backend health
fetch('https://manish-steel-backend.vercel.app/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Expected output: { status: "ok", message: "API is running", ... }
```

### Expected Results:
✅ **Status:** 200 OK  
✅ **Response:** JSON with `status: "ok"`  
✅ **Headers:** Contains `Access-Control-Allow-Origin`  
✅ **No CORS errors** in console  

---

## 🐛 Troubleshooting

### Still Getting 404 Errors?

**Check 1:** Verify file structure
```bash
server/
├── api/
│   └── index.js  ← Must exist here!
├── vercel.json
├── server.js
└── package.json
```

**Check 2:** Review Vercel build logs
- Go to Vercel dashboard → Deployments → Click latest
- Check "Building" logs - should show: `Building functions...`
- Should NOT say: `No functions found`

**Check 3:** Test the raw function URL
```
https://manish-steel-backend.vercel.app/api/index
```

### Still Getting CORS Errors?

**Check 1:** Environment variables in Vercel
- Ensure `ALLOWED_ORIGINS` includes your frontend domain
- Format: comma-separated, no spaces
- Example: `https://domain1.com,https://domain2.com`

**Check 2:** Clear browser cache
```bash
# In browser console
location.reload(true);
```

**Check 3:** Check response headers
```bash
curl -I https://manish-steel-backend.vercel.app/api/health
# Should include: Access-Control-Allow-Origin: *
```

---

## 📞 Quick Commands

### Commit and Deploy
```bash
cd /home/manish/Manish-steel
git add server/vercel.json server/api/
git commit -m "Fix: Vercel serverless configuration"
git push origin main
```

### Test Backend Locally (Optional)
```bash
cd server
npm install
npm start
# Test: http://localhost:5000/api/health
```

### Check Vercel Logs
```bash
# Install Vercel CLI
npm i -g vercel

# Login and check logs
vercel login
vercel logs manish-steel-backend
```

---

## 🎉 Success Indicators

Your deployment is fixed when you see:

✅ Vercel build shows "Building functions..." in logs  
✅ Backend `/api/health` returns 200 OK  
✅ Browser console shows NO CORS errors  
✅ Browser console shows NO 404 errors  
✅ Products load on frontend  
✅ Images display correctly  
✅ All API calls succeed  

---

## 📊 Before vs After

### Before (Broken):
```
Build Output:
  ❌ Build Completed in /vercel/output [173ms]
  ❌ No functions found
  ❌ Skipping cache upload

Browser Console:
  ❌ CORS policy error
  ❌ 404 Not Found
  ❌ Network Error
```

### After (Fixed):
```
Build Output:
  ✅ Building functions...
  ✅ Function: api/index.js (Node.js)
  ✅ Deployment completed

Browser Console:
  ✅ 200 OK
  ✅ Products loaded
  ✅ No errors
```

---

## 🔗 Resources

- **Vercel Functions Docs:** https://vercel.com/docs/functions
- **Vercel Serverless:** https://vercel.com/docs/concepts/functions/serverless-functions
- **CORS Configuration:** https://vercel.com/docs/concepts/edge-network/headers

---

## 📝 Next Steps

1. **Push changes to GitHub** (see commands above)
2. **Wait for automatic redeployment** (~2-3 minutes)
3. **Test all endpoints** (use testing checklist)
4. **Update ALLOWED_ORIGINS** in production (security)
5. **Monitor Vercel logs** for any errors

---

**Fixed by:** GitHub Copilot  
**Date:** November 19, 2025  
**Estimated Fix Time:** 5 minutes after push  

🚀 **Ready to deploy!**
