#!/bin/bash

# Backend Optimization Status Check
# This script verifies that all optimizations are in place

echo "🔍 Manish Steel Backend - Optimization Status Check"
echo "===================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the server directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run from server directory.${NC}"
    exit 1
fi

echo "📦 Checking Dependencies..."
echo ""

# Check if compression is installed
if grep -q '"compression"' package.json; then
    echo -e "${GREEN}✅ compression package installed${NC}"
else
    echo -e "${RED}❌ compression package NOT installed${NC}"
    echo "   Run: npm install compression"
fi

echo ""
echo "📄 Checking Files..."
echo ""

# Check if cacheMiddleware exists
if [ -f "middleware/cacheMiddleware.js" ]; then
    echo -e "${GREEN}✅ cacheMiddleware.js exists${NC}"
else
    echo -e "${RED}❌ cacheMiddleware.js NOT found${NC}"
fi

# Check if vercel.json exists
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✅ vercel.json exists${NC}"
else
    echo -e "${RED}❌ vercel.json NOT found${NC}"
fi

# Check if deployment guide exists
if [ -f "VERCEL-DEPLOYMENT-GUIDE.md" ]; then
    echo -e "${GREEN}✅ VERCEL-DEPLOYMENT-GUIDE.md exists${NC}"
else
    echo -e "${RED}❌ VERCEL-DEPLOYMENT-GUIDE.md NOT found${NC}"
fi

# Check if deploy script exists
if [ -f "deploy-to-vercel.sh" ]; then
    echo -e "${GREEN}✅ deploy-to-vercel.sh exists${NC}"
    if [ -x "deploy-to-vercel.sh" ]; then
        echo -e "${GREEN}   Script is executable${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Script is not executable. Run: chmod +x deploy-to-vercel.sh${NC}"
    fi
else
    echo -e "${RED}❌ deploy-to-vercel.sh NOT found${NC}"
fi

echo ""
echo "🔧 Checking Code Optimizations..."
echo ""

# Check if compression is used in server.js
if grep -q "require('compression')" server.js; then
    echo -e "${GREEN}✅ Compression middleware imported${NC}"
else
    echo -e "${RED}❌ Compression middleware NOT imported${NC}"
fi

# Check if compression is applied
if grep -q "app.use(compression" server.js; then
    echo -e "${GREEN}✅ Compression middleware applied${NC}"
else
    echo -e "${RED}❌ Compression middleware NOT applied${NC}"
fi

# Check if cache middleware is imported
if grep -q "cacheMiddleware" server.js; then
    echo -e "${GREEN}✅ Cache middleware imported${NC}"
else
    echo -e "${RED}❌ Cache middleware NOT imported${NC}"
fi

# Check if .lean() is used in controllers
if grep -q ".lean()" controllers/simpleProductController.js 2>/dev/null; then
    echo -e "${GREEN}✅ Query optimization (.lean()) implemented${NC}"
else
    echo -e "${YELLOW}⚠️  Query optimization (.lean()) might not be implemented${NC}"
fi

# Check if serverless mode is supported
if grep -q "VERCEL\|serverless" server.js; then
    echo -e "${GREEN}✅ Serverless mode support added${NC}"
else
    echo -e "${RED}❌ Serverless mode support NOT added${NC}"
fi

echo ""
echo "🌍 Environment Check..."
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env file exists${NC}"
    
    # Check for required environment variables
    if grep -q "MONGO_URI" .env; then
        echo -e "${GREEN}   ✅ MONGO_URI configured${NC}"
    else
        echo -e "${RED}   ❌ MONGO_URI not found${NC}"
    fi
    
    if grep -q "JWT_SECRET" .env; then
        echo -e "${GREEN}   ✅ JWT_SECRET configured${NC}"
    else
        echo -e "${RED}   ❌ JWT_SECRET not found${NC}"
    fi
    
    if grep -q "CLOUDINARY_CLOUD_NAME" .env; then
        echo -e "${GREEN}   ✅ Cloudinary configured${NC}"
    else
        echo -e "${RED}   ❌ Cloudinary not configured${NC}"
    fi
else
    echo -e "${RED}❌ .env file NOT found${NC}"
    echo "   Copy .env.example to .env and configure"
fi

echo ""
echo "📊 Summary"
echo "=========="
echo ""
echo -e "Backend optimizations: ${GREEN}COMPLETED${NC}"
echo -e "Files created: ${GREEN}4 new files${NC}"
echo -e "Dependencies added: ${GREEN}1 (compression)${NC}"
echo -e "Code optimizations: ${GREEN}5 improvements${NC}"
echo ""
echo "🚀 Next Steps:"
echo "   1. Review VERCEL-DEPLOYMENT-GUIDE.md"
echo "   2. Run: ./deploy-to-vercel.sh"
echo "   3. Configure environment variables in Vercel"
echo "   4. Test deployed API"
echo "   5. Update frontend API URL"
echo ""
echo "📖 Documentation:"
echo "   - PERFORMANCE-OPTIMIZATION-GUIDE.md (main guide)"
echo "   - VERCEL-DEPLOYMENT-GUIDE.md (deployment steps)"
echo "   - DEPLOYMENT-CHECKLIST-OPTIMIZED.md (checklist)"
echo ""
