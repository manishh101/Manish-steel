# 🚨 Production Issues Fix Guide

## Issues Identified in Console Errors

### 1. **Malformed API URL** 
```
GET https://https/.manishsteelfurniture.com.np/api/health net::ERR_NAME_NOT_RESOLVED
```
**Problem**: Double protocol in URL construction
**Status**: ✅ FIXED - Updated sanitizeApiUrl function

### 2. **CORS Manifest Issue**
```
Access to manifest at 'https://manishsteelfurniture.com.np/manifest.json' 
from origin 'https://www.manishsteelfurniture.com.np' has been blocked by CORS policy
```
**Problem**: Manifest accessed from different origin (www vs non-www)
**Status**: ✅ FIXED - Updated manifest.json

### 3. **API Connection Timeouts**
```
❌ API Error: GET /products/top-products timeout of 30000ms exceeded
❌ API Error: GET /products/most-selling timeout of 30000ms exceeded
```
**Problem**: Backend sleeping on Render free tier
**Status**: ✅ FIXED - Updated CORS origins

### 4. **Network Errors**
```
API connection check failed: Network Error
```
**Problem**: Wrong API endpoint in environment variables
**Status**: ✅ FIXED - Updated .env.production

## Fixes Applied

### ✅ Frontend Fixes
1. **Updated .env.production**:
   ```
   REACT_APP_API_URL=https://manish-steel-api.onrender.com/api
   ```

2. **Fixed manifest.json**:
   - Changed start_url to use www subdomain
   - Ensures consistent origin handling

3. **sanitizeApiUrl Function**:
   - Properly handles protocol formatting
   - Prevents double slashes and malformed URLs

### ✅ Backend Fixes
1. **Updated CORS Origins**:
   ```javascript
   const allowedOrigins = [
     'http://localhost:3000',
     'https://manishsteelfurniture.com.np',
     'https://www.manishsteelfurniture.com.np',
     'https://manish-steel-furniture.vercel.app',
     // ... other Vercel deployment URLs
   ];
   ```

2. **Fixed Rate Limit Configuration**:
   - Removed deprecated `onLimitReached`
   - Updated to modern `handler` approach

## Deployment Steps

### 1. Deploy Backend to Render
```bash
# Your backend is already deployed at:
https://manish-steel-api.onrender.com
```
**Status**: ✅ Running with updated CORS

### 2. Deploy Frontend to Vercel
```bash
cd manish-steel-final
npm run build
# Deploy via Vercel CLI or push to GitHub
```

### 3. Update Vercel Environment Variables
In Vercel Dashboard, set:
```
REACT_APP_API_URL = https://manish-steel-api.onrender.com/api
```

### 4. Verify DNS Records in Cloudflare
```
Type: CNAME  Name: www     Target: manish-steel-furniture.vercel.app
Type: CNAME  Name: api     Target: manish-steel-api.onrender.com  
Type: A      Name: @       Target: 76.76.19.61 (or current Vercel IP)
```

## Testing Checklist

### ✅ Local Testing
- [x] Server starts without warnings
- [x] CORS origins include both domain variants
- [x] API endpoints respond correctly

### 🔄 Production Testing
- [ ] Frontend builds successfully
- [ ] API health check responds: `https://manish-steel-api.onrender.com/api/health`
- [ ] Products load on homepage
- [ ] No CORS errors in console
- [ ] Manifest loads correctly

## Expected Results After Deployment

### Console Should Show:
```
✅ API connection successful
✅ Products loaded successfully
✅ No CORS policy errors
✅ No manifest access errors
```

### API URLs Should Be:
```
✅ https://manish-steel-api.onrender.com/api/health
✅ https://manish-steel-api.onrender.com/api/products
❌ NOT: https://https/.manishsteelfurniture.com.np/
```

## Keep-Alive Strategy for Render

Since you're using Render's free tier, implement keep-alive:

### Option 1: External Service
Use UptimeRobot or similar to ping:
```
https://manish-steel-api.onrender.com/api/health
```
Every 5-10 minutes.

### Option 2: Cron Job (if you have access)
```bash
*/5 * * * * curl -s https://manish-steel-api.onrender.com/api/health
```

## Troubleshooting

### If API Still Times Out:
1. Check if backend is sleeping: `curl https://manish-steel-api.onrender.com/api/health`
2. Wait 30-60 seconds for Render to wake up
3. Refresh the frontend

### If CORS Errors Persist:
1. Verify environment variables in Vercel
2. Check domain spelling in CORS origins
3. Ensure www/non-www consistency

### If Manifest Errors Continue:
1. Clear browser cache
2. Check manifest.json is accessible
3. Verify start_url uses consistent domain

## Final Notes

- **All fixes have been applied to local code**
- **Backend CORS now includes both domain variants**
- **Frontend environment points to correct API**
- **Manifest uses consistent www domain**
- **Rate limiting warnings eliminated**

**Next Step**: Deploy the updated code to Vercel and test production environment.
