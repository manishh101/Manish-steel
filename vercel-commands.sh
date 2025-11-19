#!/bin/bash

# Quick Deployment Commands for Vercel
# Use this as a reference for CLI deployment

echo "🚀 Vercel Deployment Commands"
echo "=============================="
echo ""
echo "Prerequisites: npm install -g vercel"
echo ""

cat << 'EOF'

## 📦 DEPLOY BACKEND (Do This First!)

cd server

# Login to Vercel (first time only)
vercel login

# Deploy to production
vercel --prod

# Or for preview deployment
vercel

# Add environment variables (do this once)
vercel env add MONGO_URI production
vercel env add JWT_SECRET production
vercel env add CLOUDINARY_CLOUD_NAME production
vercel env add CLOUDINARY_API_KEY production
vercel env add CLOUDINARY_API_SECRET production
vercel env add NODE_ENV production
vercel env add ALLOWED_ORIGINS production

# Pull environment variables (to test locally)
vercel env pull

# View logs
vercel logs

# Get deployment URL
vercel ls

---

## 🎨 DEPLOY FRONTEND (Do This Second!)

cd manish-steel-final

# IMPORTANT: First update .env.production with backend URL!
# Edit: REACT_APP_API_URL=https://your-backend-url.vercel.app/api

# Deploy to production
vercel --prod

# Or for preview deployment
vercel

# Add environment variables (do this once)
vercel env add REACT_APP_API_URL production
vercel env add REACT_APP_NAME production
vercel env add GENERATE_SOURCEMAP production

# Pull environment variables
vercel env pull

# View logs
vercel logs

# Get deployment URL
vercel ls

---

## 🔄 REDEPLOY / UPDATE

# Backend
cd server
vercel --prod

# Frontend
cd manish-steel-final
vercel --prod

---

## 🌐 CUSTOM DOMAIN

# Add domain to project
vercel domains add yourdomain.com

# List domains
vercel domains ls

# Remove domain
vercel domains rm yourdomain.com

---

## 📊 MONITORING

# View project info
vercel inspect

# View logs (real-time)
vercel logs --follow

# List all deployments
vercel ls

# Remove old deployment
vercel rm deployment-url

---

## 🐛 TROUBLESHOOTING

# View environment variables
vercel env ls

# Pull latest environment variables
vercel env pull

# View build logs
vercel logs [deployment-url]

# Rollback to previous deployment
vercel rollback [deployment-url]

---

## 💡 USEFUL COMMANDS

# Check Vercel CLI version
vercel --version

# Get help
vercel --help

# Link existing project
vercel link

# Unlink project
vercel unlink

# Switch teams/accounts
vercel switch

---

## 📝 NOTES

1. Always deploy BACKEND first, then FRONTEND
2. Copy backend URL and update frontend .env.production
3. Update ALLOWED_ORIGINS in backend after frontend deployment
4. Use --prod flag for production deployments
5. Preview deployments are created automatically for PRs

---

EOF

echo ""
echo "For step-by-step guide, see: VERCEL-DEPLOYMENT-GUIDE.md"
echo "For checklist, see: DEPLOYMENT-CHECKLIST.md"
echo ""
