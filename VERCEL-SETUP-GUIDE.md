🔧 VERCEL DASHBOARD SETUP - STEP BY STEP GUIDE
===================================================

## STEP 1: SET ENVIRONMENT VARIABLES

1. **Go to Vercel Dashboard**
   → https://vercel.com/dashboard

2. **Find Your Backend Project**
   → Look for "manish-steel-backend" or similar name
   → Click on the project

3. **Go to Settings**
   → Click "Settings" tab at the top
   → Click "Environment Variables" on the left sidebar

4. **Add These 7 Environment Variables:**

   **Variable 1: MONGO_URI**
   - Name: MONGO_URI
   - Value: [Your MongoDB Atlas connection string]
   - Environment: Production ✓

   **Variable 2: JWT_SECRET**
   - Name: JWT_SECRET
   - Value: [Your JWT secret key]
   - Environment: Production ✓

   **Variable 3: CLOUDINARY_CLOUD_NAME**
   - Name: CLOUDINARY_CLOUD_NAME
   - Value: [Your Cloudinary cloud name]
   - Environment: Production ✓

   **Variable 4: CLOUDINARY_API_KEY**
   - Name: CLOUDINARY_API_KEY
   - Value: [Your Cloudinary API key]
   - Environment: Production ✓

   **Variable 5: CLOUDINARY_API_SECRET**
   - Name: CLOUDINARY_API_SECRET
   - Value: [Your Cloudinary API secret]
   - Environment: Production ✓

   **Variable 6: NODE_ENV**
   - Name: NODE_ENV
   - Value: production
   - Environment: Production ✓

   **Variable 7: ALLOWED_ORIGINS**
   - Name: ALLOWED_ORIGINS
   - Value: https://manishsteelfurniture.com.np,https://www.manishsteelfurniture.com.np,https://manish-steel-furniture.vercel.app
   - Environment: Production ✓

## STEP 2: REDEPLOY AFTER ADDING ENVIRONMENT VARIABLES

1. **Go to Deployments Tab**
   → Click "Deployments" tab

2. **Find Latest Deployment**
   → Look for the most recent deployment

3. **Redeploy**
   → Click "..." (three dots) next to latest deployment
   → Click "Redeploy"
   → Check "Use existing Build Cache" 
   → Click "Redeploy" button

## STEP 3: WAIT FOR DEPLOYMENT (2-3 minutes)

Watch the deployment progress. When it shows "Ready", your backend will be fully functional.

## STEP 4: TEST BACKEND

After redeployment, test:
→ https://manish-steel-backend.vercel.app/api/health
→ https://manish-steel-backend.vercel.app/api/products

Both should return data (not errors).

═══════════════════════════════════════════════════════════════════

NEXT: After backend is working, update frontend API URL
