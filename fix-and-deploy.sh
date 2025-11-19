#!/bin/bash

# Fix CORS and 404 errors, then deploy to Vercel
# Usage: ./fix-and-deploy.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🔧 Fix CORS & 404 - Deploy to Vercel        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "server/index.js" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root${NC}"
    echo -e "${YELLOW}   Current directory: $(pwd)${NC}"
    exit 1
fi

# Step 1: Show what was fixed
echo -e "${GREEN}✅ Files Fixed:${NC}"
echo -e "   📄 server/index.js (Serverless handler)"
echo -e "   📄 server/vercel.json (Routing config)"
echo ""

# Step 2: Check git status
echo -e "${BLUE}📊 Checking git status...${NC}"
git status --short
echo ""

# Step 3: Stage the fixed files
echo -e "${YELLOW}📦 Staging fixed files...${NC}"
git add server/index.js server/vercel.json CORS-FIX-GUIDE.md
echo -e "${GREEN}   ✓ Files staged${NC}"
echo ""

# Step 4: Commit changes
echo -e "${YELLOW}💾 Committing changes...${NC}"
git commit -m "Fix: Resolve CORS and 404 errors in Vercel serverless deployment

- Update server/index.js with proper serverless function handler
- Add database connection pooling and reuse
- Fix vercel.json routes to properly forward all requests
- Add global CORS headers at Vercel level
- Add comprehensive CORS-FIX-GUIDE.md documentation

Fixes:
- CORS policy errors from frontend
- 404 errors on /api/health and other endpoints
- Database connection issues in serverless environment"

echo -e "${GREEN}   ✓ Changes committed${NC}"
echo ""

# Step 5: Push to GitHub
echo -e "${YELLOW}🚀 Pushing to GitHub...${NC}"
if git push origin main; then
    echo -e "${GREEN}   ✓ Pushed to GitHub successfully${NC}"
else
    echo -e "${RED}   ✗ Failed to push to GitHub${NC}"
    echo -e "${YELLOW}   Please check your internet connection and GitHub credentials${NC}"
    exit 1
fi
echo ""

# Step 6: Wait for Vercel deployment
echo -e "${BLUE}⏳ Waiting for Vercel auto-deployment...${NC}"
echo -e "${YELLOW}   This may take 30-60 seconds${NC}"
echo ""
sleep 10

# Step 7: Show next steps
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           ✅ Deployment Initiated             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo ""
echo -e "${YELLOW}1. Check Vercel Deployment:${NC}"
echo -e "   Visit: https://vercel.com/dashboard"
echo -e "   → Your backend project → Deployments tab"
echo -e "   → Wait for deployment to complete (shows ✓)"
echo ""
echo -e "${YELLOW}2. Verify Environment Variables:${NC}"
echo -e "   Go to: Settings → Environment Variables"
echo -e "   Ensure these exist:"
echo -e "   ${GREEN}✓${NC} MONGO_URI"
echo -e "   ${GREEN}✓${NC} JWT_SECRET"
echo -e "   ${GREEN}✓${NC} CLOUDINARY_CLOUD_NAME"
echo -e "   ${GREEN}✓${NC} CLOUDINARY_API_KEY"
echo -e "   ${GREEN}✓${NC} CLOUDINARY_API_SECRET"
echo -e "   ${GREEN}✓${NC} NODE_ENV=production"
echo -e "   ${GREEN}✓${NC} ALLOWED_ORIGINS (must include your frontend URL)"
echo ""
echo -e "${YELLOW}3. Test Backend Endpoints:${NC}"
echo -e "   ${GREEN}curl https://manish-steel-backend.vercel.app/api/health${NC}"
echo -e "   ${GREEN}curl https://manish-steel-backend.vercel.app/api/products${NC}"
echo ""
echo -e "${YELLOW}4. Test from Frontend:${NC}"
echo -e "   Open: https://www.manishsteelfurniture.com.np"
echo -e "   Open Browser Console (F12)"
echo -e "   Check for errors (should be none)"
echo ""
echo -e "${YELLOW}5. If Issues Persist:${NC}"
echo -e "   Read: ${BLUE}CORS-FIX-GUIDE.md${NC}"
echo -e "   Check: Vercel deployment logs"
echo -e "   Check: Vercel function logs"
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Done! Your backend should be fixed now!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
