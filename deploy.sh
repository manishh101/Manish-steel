#!/bin/bash

echo "🚀 Deploying Manish Steel to Production"
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -d "manish-steel-final" ] || [ ! -d "server" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Pre-deployment checks...${NC}"

# Check if environment files exist
if [ ! -f "server/.env" ]; then
    echo -e "${RED}❌ Missing server/.env file${NC}"
    echo "Please copy server/.env.example to server/.env and configure it"
    exit 1
fi

if [ ! -f "manish-steel-final/.env.production" ]; then
    echo -e "${RED}❌ Missing frontend production environment${NC}"
    echo "Please ensure manish-steel-final/.env.production exists"
    exit 1
fi

echo -e "${GREEN}✅ Environment files found${NC}"

# Test backend dependencies
echo -e "${YELLOW}🔧 Checking backend dependencies...${NC}"
cd server
if ! npm install --only=production --silent; then
    echo -e "${RED}❌ Backend dependency installation failed${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}✅ Backend dependencies OK${NC}"

# Test frontend dependencies
echo -e "${YELLOW}🔧 Checking frontend dependencies...${NC}"
cd manish-steel-final
if ! npm install --silent; then
    echo -e "${RED}❌ Frontend dependency installation failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend dependencies OK${NC}"

# Test production build
echo -e "${YELLOW}🏗️ Testing production build...${NC}"
if ! npm run build; then
    echo -e "${RED}❌ Production build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Production build successful${NC}"

cd ..

echo -e "\n${GREEN}🎉 Pre-deployment checks passed!${NC}"
echo -e "\n${YELLOW}📚 Next steps:${NC}"
echo "1. Deploy backend to Render:"
echo "   - Connect GitHub repo"
echo "   - Set build: 'cd server && npm install'"
echo "   - Set start: 'cd server && npm start'"
echo "   - Add environment variables from server/.env"
echo ""
echo "2. Deploy frontend to Vercel:"
echo "   - Connect GitHub repo"
echo "   - Set root directory: 'manish-steel-final'"
echo "   - Add environment variables from .env.production"
echo ""
echo "3. Update CORS origins with production URLs"
echo ""
echo "4. Test production deployment thoroughly"
echo ""
echo -e "${GREEN}📖 See PRODUCTION_CHECKLIST.md for detailed steps${NC}"
