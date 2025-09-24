#!/bin/bash

# Vercel Deployment Status Checker
# Run this to monitor your redeploy progress

echo "🚀 Checking Vercel Deployment Status..."
echo "======================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Expected Vercel URL (update this after you get the real one)
VERCEL_URL="https://manish-steel-furniture.vercel.app"

echo -e "${BLUE}1. Checking if deployment is accessible...${NC}"

if curl -s --connect-timeout 10 "$VERCEL_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Deployment is live and accessible!${NC}"
    
    # Check response time
    response_time=$(curl -s -w "%{time_total}" -o /dev/null "$VERCEL_URL")
    echo -e "${BLUE}   Response Time: ${response_time}s${NC}"
    
    # Check if it's a React app
    if curl -s "$VERCEL_URL" | grep -q "react" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ React app detected${NC}"
    fi
    
else
    echo -e "${YELLOW}⚠️  Deployment not accessible yet${NC}"
    echo -e "${BLUE}   This is normal if redeploy is still in progress${NC}"
fi

echo -e "\n${BLUE}2. Last Git Commit:${NC}"
git log --oneline -1

echo -e "\n${BLUE}3. GitHub Status:${NC}"
if git status | grep -q "nothing to commit" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ All changes pushed to GitHub${NC}"
else
    echo -e "${YELLOW}⚠️  Unpushed changes detected${NC}"
    git status --porcelain
fi

echo -e "\n${BLUE}4. Project Configuration Status:${NC}"

# Check if vercel.json exists (should NOT exist)
if [ -f "manish-steel-final/vercel.json" ]; then
    echo -e "${RED}❌ vercel.json found - should be removed${NC}"
else
    echo -e "${GREEN}✅ No vercel.json (correct for auto-detection)${NC}"
fi

# Check package.json
if [ -f "manish-steel-final/package.json" ]; then
    if grep -q '"homepage"' "manish-steel-final/package.json" > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Homepage field found in package.json${NC}"
    else
        echo -e "${GREEN}✅ Package.json clean (no homepage field)${NC}"
    fi
fi

echo -e "\n${BLUE}5. Next Steps:${NC}"
echo "• Monitor at: https://vercel.com/dashboard"
echo "• Expected completion: 2-3 minutes from push"
echo "• After success: Add custom domain manishsteelfurniture.com.np"
echo "• Then: Get real DNS records from Vercel"

echo -e "\n${BLUE}6. Quick Links:${NC}"
echo "• Vercel Dashboard: https://vercel.com/dashboard"
echo "• GitHub Repo: https://github.com/manishh101/Manish-steel"
echo "• Expected URL: $VERCEL_URL"

echo -e "\n${GREEN}🎉 Redeployment Status Check Complete!${NC}"
echo -e "${BLUE}Run this script again in 2-3 minutes to check progress.${NC}"
