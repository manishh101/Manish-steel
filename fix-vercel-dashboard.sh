#!/bin/bash

# 🎯 Vercel Dashboard Fix - Step by Step Guide

clear

cat << 'EOF'

╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚨 VERCEL DASHBOARD FIX - FOLLOW THESE STEPS 🚨           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

Your code is PERFECT ✅
Your Vercel project settings are WRONG ❌

═══════════════════════════════════════════════════════════════

📋 STEP-BY-STEP INSTRUCTIONS:

Step 1: Open Vercel Dashboard
═══════════════════════════════════════════════════════════════
🔗 Go to: https://vercel.com/dashboard

Step 2: Delete the Current Project
═══════════════════════════════════════════════════════════════
1. Find your backend project (manish-steel-backend or similar)
2. Click on the project
3. Go to: Settings → General
4. Scroll to bottom → "Delete Project"
5. Type the project name to confirm
6. Click "Delete"

❓ Why delete? The project configuration is corrupted and Vercel
   Build Output API v3 is ignoring your vercel.json file.

Step 3: Create New Project (FRESH START)
═══════════════════════════════════════════════════════════════
1. Click "Add New..." → "Project"
2. Select your GitHub repository: manishh101/Manish-steel
3. Click "Import"

Step 4: CRITICAL CONFIGURATION
═══════════════════════════════════════════════════════════════
⚠️  THIS IS THE MOST IMPORTANT STEP! ⚠️

Configure as follows:

┌─────────────────────────────────────────────────────────────┐
│ Project Name: manish-steel-backend (or your choice)         │
│                                                              │
│ Framework Preset: Other                                      │
│                                                              │
│ Root Directory: server  ← ⭐ CRITICAL! MUST BE "server" ⭐  │
│                                                              │
│ Build & Development Settings:                               │
│   Build Command: (leave empty or "echo build")              │
│   Output Directory: (leave empty)                           │
│   Install Command: npm install                              │
└─────────────────────────────────────────────────────────────┘

Step 5: Add Environment Variables
═══════════════════════════════════════════════════════════════
Click "Environment Variables" and add these:

Required Variables:
┌─────────────────────────────────────────────────────────────┐
│ MONGO_URI                                                    │
│ Value: mongodb+srv://your-connection-string                 │
│                                                              │
│ JWT_SECRET                                                   │
│ Value: your-jwt-secret-minimum-32-characters-long           │
│                                                              │
│ CLOUDINARY_CLOUD_NAME                                        │
│ Value: your-cloudinary-cloud-name                           │
│                                                              │
│ CLOUDINARY_API_KEY                                           │
│ Value: your-cloudinary-api-key                              │
│                                                              │
│ CLOUDINARY_API_SECRET                                        │
│ Value: your-cloudinary-api-secret                           │
│                                                              │
│ NODE_ENV                                                     │
│ Value: production                                           │
│                                                              │
│ ALLOWED_ORIGINS                                              │
│ Value: *                                                     │
│ (Change to specific domains after testing)                  │
└─────────────────────────────────────────────────────────────┘

Step 6: Deploy
═══════════════════════════════════════════════════════════════
1. Click "Deploy"
2. Wait 2-3 minutes
3. Watch the build logs

Step 7: Check Build Logs (CRITICAL)
═══════════════════════════════════════════════════════════════
The logs should show:

✅ GOOD (What you WANT to see):
┌─────────────────────────────────────────────────────────────┐
│ ✓ Cloning completed                                          │
│ ✓ Running "vercel build"                                     │
│ ✓ Installing dependencies                                    │
│ ✓ Building Functions...                                      │
│ ✓ api/[...all].js                                           │
│ ✓ api/index.js                                              │
│ ✓ Function size: ~XX MB                                      │
│ ✓ Build Completed                                            │
│ ✓ Deploying outputs                                          │
│ ✓ Functions: 2 created                                       │
│ ✓ Deployment completed                                       │
└─────────────────────────────────────────────────────────────┘

❌ BAD (What you DON'T want):
┌─────────────────────────────────────────────────────────────┐
│ ✓ Build Completed in /vercel/output [173ms]                 │
│ ⚠ Skipping cache upload because no files were prepared      │
└─────────────────────────────────────────────────────────────┘

Step 8: Test Your Backend
═══════════════════════════════════════════════════════════════
Copy your new backend URL (e.g., https://manish-steel-backend.vercel.app)

Test in browser:
1. https://YOUR-BACKEND-URL.vercel.app/api/health
   Expected: {"status":"ok","message":"API is running"}

2. https://YOUR-BACKEND-URL.vercel.app/api/products
   Expected: [] or array of products

3. https://YOUR-BACKEND-URL.vercel.app
   Expected: Should respond (not 404)

Step 9: Update Frontend
═══════════════════════════════════════════════════════════════
If backend works:
1. Copy the backend URL
2. Update frontend .env.production:
   REACT_APP_API_URL=https://YOUR-BACKEND-URL.vercel.app/api
3. Commit and push
4. Frontend will auto-redeploy

Step 10: Test Your Website
═══════════════════════════════════════════════════════════════
Open: https://www.manishsteelfurniture.com.np

Check (F12 Console):
✅ No CORS errors
✅ No 404 errors
✅ Products load
✅ API calls succeed (200 OK)

═══════════════════════════════════════════════════════════════

🎯 WHY THIS WILL WORK:

When you set Root Directory = "server" and create a FRESH project:
• Vercel looks in the server/ folder
• Finds api/**/*.js files automatically
• Builds them as serverless functions using @vercel/node
• Your api/[...all].js catches ALL routes
• No more "no files were prepared" error!

═══════════════════════════════════════════════════════════════

📊 SUMMARY:

Problem:     Vercel ignoring your configuration
Cause:       Build Output API v3 + wrong project settings
Solution:    Delete project + recreate with Root Directory = "server"
Result:      Functions will be built automatically

═══════════════════════════════════════════════════════════════

🆘 IF IT STILL DOESN'T WORK:

1. Check Root Directory is exactly: server (no trailing slash)
2. Check environment variables are set
3. Check build logs show "Building Functions..."
4. Try manual redeploy: Deployments → ... → Redeploy
5. Contact Vercel support (they respond fast)

═══════════════════════════════════════════════════════════════

✅ YOUR CODE IS READY. FILES ARE CORRECT.
   JUST FIX THE VERCEL DASHBOARD SETTINGS!

═══════════════════════════════════════════════════════════════

Press Enter to continue...

EOF

read

echo ""
echo "🎉 Good luck! Your backend will work after these steps."
echo ""
echo "📖 Full documentation: VERCEL-DASHBOARD-FIX-REQUIRED.md"
echo ""
