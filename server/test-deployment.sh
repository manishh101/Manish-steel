#!/bin/bash

# Test Deployed Vercel Backend Script
# Tests all endpoints to verify deployment

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║           🧪 TESTING VERCEL BACKEND DEPLOYMENT                     ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Backend URL
BACKEND_URL="https://manish-steel-backend.vercel.app"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

echo -e "${BLUE}Backend URL:${NC} $BACKEND_URL"
echo ""
echo "Testing endpoints..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local expected_status=$2
    local description=$3
    
    echo -e "${BLUE}Testing:${NC} $endpoint"
    
    # Make request and capture status code and response
    response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL$endpoint" --max-time 30)
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    # Check status code
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ Status: $status_code${NC}"
        
        # Show response preview (first 200 chars)
        if [ ${#body} -gt 200 ]; then
            echo -e "${GREEN}Response:${NC} ${body:0:200}..."
        else
            echo -e "${GREEN}Response:${NC} $body"
        fi
        
        ((PASS++))
    else
        echo -e "${RED}✗ Status: $status_code (Expected: $expected_status)${NC}"
        echo -e "${RED}Response:${NC} $body"
        ((FAIL++))
    fi
    
    echo ""
}

# Test 1: Root endpoint
test_endpoint "/" "200" "Root endpoint"

# Test 2: Health check
test_endpoint "/api/health" "200" "Health check endpoint"

# Test 3: Products endpoint
test_endpoint "/api/products" "200" "Products listing"

# Test 4: Categories endpoint
test_endpoint "/api/categories" "200" "Categories listing"

# Test 5: About endpoint
test_endpoint "/api/about" "200" "About page data"

# Test 6: Gallery endpoint
test_endpoint "/api/gallery" "200" "Gallery images"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                          TEST SUMMARY                              ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✓ Passed: $PASS${NC}"
echo -e "${RED}✗ Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                                    ║${NC}"
    echo -e "${GREEN}║              ✅ ALL TESTS PASSED! DEPLOYMENT SUCCESSFUL             ║${NC}"
    echo -e "${GREEN}║                                                                    ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "🎉 Your backend is live and working perfectly!"
    echo ""
    echo "Next steps:"
    echo "1. Update frontend .env.production with:"
    echo "   REACT_APP_API_URL=$BACKEND_URL/api"
    echo ""
    echo "2. Push frontend changes to trigger redeploy"
    echo ""
    echo "3. Test your website: https://manishsteelfurniture.com.np"
    echo ""
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                                                                    ║${NC}"
    echo -e "${RED}║              ⚠️  SOME TESTS FAILED - NEEDS ATTENTION               ║${NC}"
    echo -e "${RED}║                                                                    ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Possible issues:"
    echo "1. Environment variables not set in Vercel"
    echo "2. MongoDB connection issue (check Network Access)"
    echo "3. Deployment still in progress (wait 1-2 minutes)"
    echo ""
    echo "To fix:"
    echo "1. Go to Vercel Dashboard → Settings → Environment Variables"
    echo "2. Ensure all 7 variables are set"
    echo "3. Click 'Redeploy' if needed"
    echo "4. Run this script again after 2 minutes"
    echo ""
    exit 1
fi
