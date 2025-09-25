#!/bin/bash

# PRODUCTION DEPLOYMENT FIXES
# This script addresses all the critical issues found in production

echo "🚨 FIXING PRODUCTION DEPLOYMENT ISSUES"
echo "======================================"

echo ""
echo "📋 ISSUES IDENTIFIED:"
echo "1. ❌ Wrong API URL in Vercel (https://api.manishsteelfurniture.com.np - doesn't exist)"
echo "2. ❌ Missing domain in CORS origins (manishsteelfurniture.com.np variants)"
echo "3. ❌ Manifest.json CORS issue (www vs non-www)"
echo "4. ❌ API timeouts due to Render cold starts"
echo ""

echo "🔧 FIXES APPLIED:"

echo "✅ 1. Updated .env.production with correct API URL"
echo "   - OLD: https://api.manishsteelfurniture.com.np"
echo "   - NEW: https://manish-steel-api.onrender.com/api"
echo ""

echo "✅ 2. Fixed CORS origins in server.js"
echo "   - Added: https://manishsteelfurniture.com.np"
echo "   - Added: https://www.manishsteelfurniture.com.np"
echo ""

echo "✅ 3. Updated manifest.json for proper PWA behavior"
echo "   - Fixed start_url and added scope"
echo ""

echo "📋 CRITICAL NEXT STEPS:"
echo "========================"

echo ""
echo "🔴 IMMEDIATE ACTIONS REQUIRED:"
echo ""

echo "1️⃣  UPDATE VERCEL ENVIRONMENT VARIABLES:"
echo "   Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables"
echo "   🔧 SET EXACTLY:"
echo "   REACT_APP_API_URL = https://manish-steel-api.onrender.com/api"
echo "   REACT_APP_SITE_URL = https://www.manishsteelfurniture.com.np"
echo "   PUBLIC_URL = https://www.manishsteelfurniture.com.np"
echo ""

echo "2️⃣  UPDATE RENDER ENVIRONMENT VARIABLES:"
echo "   Go to: https://render.com/dashboard → Your Service → Environment"
echo "   🔧 ADD/UPDATE:"
echo "   ALLOWED_ORIGINS = http://localhost:3000,https://manishsteelfurniture.com.np,https://www.manishsteelfurniture.com.np,https://manish-steel-furniture.vercel.app"
echo ""

echo "3️⃣  REDEPLOY BOTH SERVICES:"
echo "   ✅ Push server changes to trigger Render deployment"
echo "   ✅ Push frontend changes to trigger Vercel deployment"
echo ""

echo "4️⃣  TEST DEPLOYMENT:"
echo "   🧪 Test: curl https://manish-steel-api.onrender.com/api/health"
echo "   🧪 Check: https://www.manishsteelfurniture.com.np"
echo "   🧪 Verify: Browser console has no CORS or API URL errors"
echo ""

echo "🎯 ROOT CAUSE ANALYSIS:"
echo "======================"
echo "❌ The malformed URL 'https://https/.manishsteelfurniture.com.np/api/health'"
echo "   was caused by wrong REACT_APP_API_URL in Vercel environment variables"
echo ""
echo "❌ CORS errors were caused by missing domain origins in server CORS config"
echo ""
echo "❌ The api.manishsteelfurniture.com.np subdomain doesn't exist in your DNS"
echo "   Your backend is actually hosted on Render: manish-steel-api.onrender.com"
echo ""

echo "✅ FIXES SUMMARY:"
echo "================"
echo "📁 Updated files:"
echo "   - manish-steel-final/.env.production (correct API URL)"
echo "   - server/server.js (added CORS origins)"
echo "   - manish-steel-final/public/manifest.json (fixed PWA)"
echo ""
echo "⚙️  Environment variables to update:"
echo "   - Vercel: REACT_APP_API_URL, REACT_APP_SITE_URL, PUBLIC_URL"
echo "   - Render: ALLOWED_ORIGINS"
echo ""

echo "🚀 After applying these fixes, your production deployment should work perfectly!"
echo "📞 The malformed API URLs and CORS errors will be resolved."
echo ""
echo "⏰ Remember: Render free tier has cold starts - first API call may take 30+ seconds."
echo "💡 Consider implementing the keep-alive script for production."
