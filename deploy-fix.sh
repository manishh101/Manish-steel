#!/bin/bash

# 🚀 Deploy Fixed Backend to Vercel

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 PUSHING VERCEL FIX TO GITHUB"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd /home/manish/Manish-steel

echo "📋 Files changed:"
echo "  ✓ server/vercel.json - Updated serverless config"
echo "  ✓ server/api/index.js - New serverless function"
echo "  ✓ VERCEL-DEPLOYMENT-FIX.md - Fix documentation"
echo ""

git add server/vercel.json server/api/index.js VERCEL-DEPLOYMENT-FIX.md
git commit -m "Fix: Vercel serverless configuration for CORS and 404 errors"
git push origin main

echo ""
echo "✅ DONE! Vercel will auto-deploy in 2-3 minutes"
echo ""
echo "🧪 Test after deployment:"
echo "   https://manish-steel-backend.vercel.app/api/health"
echo ""
