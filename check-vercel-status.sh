#!/bin/bash

echo "🔧 VERCEL BACKEND STATUS CHECK"
echo "================================"
echo ""

BACKEND_URL="https://manish-steel-backend.vercel.app"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Testing Backend URL:${NC} $BACKEND_URL"
echo ""

# Test 1: Health Check
echo "1. Testing Health Endpoint..."
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" "$BACKEND_URL/api/health")
HTTP_CODE="${HEALTH_RESPONSE: -3}"
RESPONSE_BODY="${HEALTH_RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Health Check: SUCCESS${NC}"
    echo "Response: $RESPONSE_BODY"
else
    echo -e "${RED}❌ Health Check: FAILED (Status: $HTTP_CODE)${NC}"
    echo "Response: $RESPONSE_BODY"
fi
echo ""

# Test 2: Products Endpoint  
echo "2. Testing Products Endpoint..."
PRODUCTS_RESPONSE=$(curl -s -w "%{http_code}" "$BACKEND_URL/api/products?limit=1")
HTTP_CODE="${PRODUCTS_RESPONSE: -3}"
RESPONSE_BODY="${PRODUCTS_RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ] && [[ "$RESPONSE_BODY" == *"totalProducts"* ]]; then
    echo -e "${GREEN}✅ Products Endpoint: SUCCESS${NC}"
    echo "Products found in response"
else
    echo -e "${RED}❌ Products Endpoint: FAILED${NC}"
    if [ "$HTTP_CODE" = "500" ]; then
        echo -e "${YELLOW}⚠️  This usually means environment variables are missing${NC}"
        echo ""
        echo "REQUIRED ACTIONS:"
        echo "1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables"
        echo "2. Add all 7 required environment variables:"
        echo "   - MONGO_URI"
        echo "   - JWT_SECRET"
        echo "   - CLOUDINARY_CLOUD_NAME" 
        echo "   - CLOUDINARY_API_KEY"
        echo "   - CLOUDINARY_API_SECRET"
        echo "   - NODE_ENV=production"
        echo "   - ALLOWED_ORIGINS"
        echo "3. Redeploy the project"
        echo ""
    fi
    echo "Status: $HTTP_CODE"
    echo "Response: ${RESPONSE_BODY:0:200}..."
fi
echo ""

# Test 3: Frontend API URL Status
echo "3. Checking Frontend Configuration..."
FRONTEND_API=$(grep "REACT_APP_API_URL" manish-steel-final/.env.production 2>/dev/null | cut -d'=' -f2)

if [[ "$FRONTEND_API" == *"vercel.app"* ]]; then
    echo -e "${GREEN}✅ Frontend API URL: Updated to Vercel${NC}"
    echo "Current: $FRONTEND_API"
else
    echo -e "${YELLOW}⚠️  Frontend API URL: Still pointing to old backend${NC}"
    echo "Current: $FRONTEND_API"
    echo "Should be: https://manish-steel-backend.vercel.app/api"
fi
echo ""

# Summary
echo "=================================="
echo "📊 SUMMARY & NEXT STEPS"
echo "=================================="

if [ "$HTTP_CODE" = "200" ] && [[ "$PRODUCTS_RESPONSE" == *"totalProducts"* ]]; then
    echo -e "${GREEN}🎉 BACKEND IS WORKING PERFECTLY!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. ✅ Backend is working"
    echo "2. ✅ Frontend API URL updated" 
    echo "3. 🔄 Push frontend changes to trigger redeploy:"
    echo "   cd manish-steel-final"
    echo "   git add .env.production"
    echo "   git commit -m 'Update API URL to Vercel backend'"
    echo "   git push"
    echo ""
    echo "4. 🧪 Test your website: https://manishsteelfurniture.com.np"
    echo ""
else
    echo -e "${RED}❌ BACKEND NEEDS ENVIRONMENT VARIABLES${NC}"
    echo ""
    echo "Required actions:"
    echo "1. 🔧 Set environment variables in Vercel Dashboard"
    echo "2. 🔄 Redeploy backend"
    echo "3. ✅ Run this script again to verify"
    echo "4. 🚀 Then push frontend changes"
    echo ""
fi

echo "Vercel Dashboard: https://vercel.com/dashboard"
echo "Backend URL: $BACKEND_URL"
