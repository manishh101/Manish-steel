#!/bin/bash

# Quick test script for backend API
# Usage: ./test-backend.sh <backend-url>

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get backend URL from argument or use default
BACKEND_URL="${1:-https://manish-steel-backend.vercel.app}"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       🧪 Testing Backend API Endpoints        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Backend URL: ${GREEN}$BACKEND_URL${NC}"
echo ""

# Test 1: Root endpoint
echo -e "${BLUE}Test 1: Root Endpoint (/)${NC}"
if curl -s -f "$BACKEND_URL/" > /dev/null; then
    echo -e "   ${GREEN}✓ PASS${NC} - Root endpoint responding"
else
    echo -e "   ${RED}✗ FAIL${NC} - Root endpoint not responding"
fi
echo ""

# Test 2: Health check with /api prefix
echo -e "${BLUE}Test 2: Health Check (/api/health)${NC}"
HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/api/health")
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    echo -e "   ${GREEN}✓ PASS${NC} - Health check endpoint working"
    echo -e "   Response: $HEALTH_RESPONSE"
else
    echo -e "   ${RED}✗ FAIL${NC} - Health check endpoint failed"
    echo -e "   Response: $HEALTH_RESPONSE"
fi
echo ""

# Test 3: Health check without /api prefix
echo -e "${BLUE}Test 3: Alternative Health Check (/health)${NC}"
if curl -s -f "$BACKEND_URL/health" > /dev/null; then
    echo -e "   ${GREEN}✓ PASS${NC} - Alternative health endpoint working"
else
    echo -e "   ${RED}✗ FAIL${NC} - Alternative health endpoint failed"
fi
echo ""

# Test 4: Products endpoint
echo -e "${BLUE}Test 4: Products API (/api/products)${NC}"
PRODUCTS_RESPONSE=$(curl -s "$BACKEND_URL/api/products")
if echo "$PRODUCTS_RESPONSE" | grep -q "products"; then
    PRODUCT_COUNT=$(echo "$PRODUCTS_RESPONSE" | grep -o '"_id"' | wc -l)
    echo -e "   ${GREEN}✓ PASS${NC} - Products endpoint working"
    echo -e "   Found: $PRODUCT_COUNT products"
else
    echo -e "   ${RED}✗ FAIL${NC} - Products endpoint failed"
    echo -e "   Response: $(echo "$PRODUCTS_RESPONSE" | head -c 200)..."
fi
echo ""

# Test 5: Categories endpoint
echo -e "${BLUE}Test 5: Categories API (/api/categories)${NC}"
if curl -s -f "$BACKEND_URL/api/categories" > /dev/null; then
    echo -e "   ${GREEN}✓ PASS${NC} - Categories endpoint working"
else
    echo -e "   ${RED}✗ FAIL${NC} - Categories endpoint failed"
fi
echo ""

# Test 6: CORS Headers
echo -e "${BLUE}Test 6: CORS Headers${NC}"
CORS_HEADERS=$(curl -s -I -X OPTIONS "$BACKEND_URL/api/health")
if echo "$CORS_HEADERS" | grep -qi "access-control-allow-origin"; then
    echo -e "   ${GREEN}✓ PASS${NC} - CORS headers present"
    echo "$CORS_HEADERS" | grep -i "access-control" | sed 's/^/   /'
else
    echo -e "   ${RED}✗ FAIL${NC} - CORS headers missing"
fi
echo ""

# Summary
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}Testing Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}💡 Next: Test from frontend browser console:${NC}"
echo -e "   ${GREEN}fetch('$BACKEND_URL/api/health')${NC}"
echo -e "   ${GREEN}  .then(r => r.json())${NC}"
echo -e "   ${GREEN}  .then(d => console.log(d))${NC}"
