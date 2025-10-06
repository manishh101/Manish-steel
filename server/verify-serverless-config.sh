#!/bin/bash

# Comprehensive Vercel Serverless Deployment Verification Script
# This script checks all critical configurations for Vercel deployment

echo "=========================================="
echo "VERCEL SERVERLESS DEPLOYMENT CHECK"
echo "=========================================="
echo ""

PASS=0
FAIL=0
WARN=0

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print results
print_pass() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    ((PASS++))
}

print_fail() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    ((FAIL++))
}

print_warn() {
    echo -e "${YELLOW}⚠ WARN${NC}: $1"
    ((WARN++))
}

echo "1. CRITICAL FILES CHECK"
echo "----------------------------------------"

# Check index.js
if [ -f "index.js" ]; then
    if grep -q "module.exports = require('./server')" index.js; then
        print_pass "index.js exists and exports server.js"
    else
        print_fail "index.js doesn't properly export server.js"
    fi
else
    print_fail "index.js not found"
fi

# Check server.js
if [ -f "server.js" ]; then
    if grep -q "module.exports = app" server.js; then
        print_pass "server.js exports app for serverless"
    else
        print_fail "server.js doesn't export app"
    fi
else
    print_fail "server.js not found"
fi

# Check vercel.json
if [ -f "vercel.json" ]; then
    if grep -q '"index.js"' vercel.json && grep -q '@vercel/node' vercel.json; then
        print_pass "vercel.json configured correctly"
    else
        print_fail "vercel.json has incorrect configuration"
    fi
else
    print_fail "vercel.json not found"
fi

# Check package.json
if [ -f "package.json" ]; then
    if grep -q '"main": "index.js"' package.json; then
        print_pass "package.json main entry point is index.js"
    else
        print_fail "package.json main entry should be index.js"
    fi
else
    print_fail "package.json not found"
fi

echo ""
echo "2. SERVERLESS OPTIMIZATIONS CHECK"
echo "----------------------------------------"

# Check database connection caching
if grep -q "cachedConnection" config/db.js 2>/dev/null; then
    print_pass "Database connection caching implemented"
else
    print_warn "Database connection caching not found"
fi

# Check compression middleware
if grep -q "compression" server.js; then
    print_pass "Compression middleware enabled"
else
    print_warn "Compression middleware not found"
fi

# Check cache middleware
if [ -f "middleware/cacheMiddleware.js" ]; then
    print_pass "Response caching middleware exists"
else
    print_warn "Response caching middleware not found"
fi

# Check if connectDB is called before export
if grep -q "connectDB()" server.js && grep -q "module.exports = app" server.js; then
    print_pass "Database initialized before app export"
else
    print_warn "Database initialization order may be incorrect"
fi

echo ""
echo "3. DEPENDENCIES CHECK"
echo "----------------------------------------"

# Check critical dependencies
REQUIRED_DEPS=("express" "mongoose" "cors" "dotenv" "compression")
for dep in "${REQUIRED_DEPS[@]}"; do
    if grep -q "\"$dep\"" package.json; then
        print_pass "Dependency '$dep' found"
    else
        print_fail "Missing dependency: $dep"
    fi
done

echo ""
echo "4. ENVIRONMENT VARIABLES CHECK"
echo "----------------------------------------"

# Check if .env.example exists as reference
if [ -f ".env.example" ]; then
    print_pass ".env.example exists as reference"
    
    # List required environment variables
    REQUIRED_VARS=("MONGO_URI" "JWT_SECRET" "CLOUDINARY_CLOUD_NAME" "CLOUDINARY_API_KEY" "CLOUDINARY_API_SECRET" "NODE_ENV" "ALLOWED_ORIGINS")
    
    echo ""
    echo "Required Environment Variables in Vercel:"
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "$var" .env.example 2>/dev/null || grep -q "$var" server.js; then
            echo "  • $var"
        fi
    done
else
    print_warn ".env.example not found"
fi

echo ""
echo "5. FILE STRUCTURE CHECK"
echo "----------------------------------------"

# Check important directories
REQUIRED_DIRS=("routes" "models" "controllers" "middleware" "config")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        print_pass "Directory '$dir' exists"
    else
        print_warn "Directory '$dir' not found"
    fi
done

echo ""
echo "6. VERCEL-SPECIFIC CHECKS"
echo "----------------------------------------"

# Check .vercelignore
if [ -f ".vercelignore" ]; then
    print_pass ".vercelignore exists"
else
    print_warn ".vercelignore not found (optional but recommended)"
fi

# Check for serverless-incompatible code
if grep -q "process.exit" server.js; then
    print_warn "process.exit() found - may cause issues in serverless"
fi

if grep -q "setInterval" server.js; then
    print_warn "setInterval() found - not recommended for serverless"
fi

# Check mongoose connection options
if grep -q "maxPoolSize" config/db.js 2>/dev/null || grep -q "maxPoolSize" server.js; then
    print_pass "Mongoose connection pooling configured"
else
    print_warn "Mongoose connection pooling not configured"
fi

echo ""
echo "7. ROUTE CONFIGURATION CHECK"
echo "----------------------------------------"

# Check if routes are properly registered
COMMON_ROUTES=("/api/products" "/api/categories" "/api/auth" "/api/health")
for route in "${COMMON_ROUTES[@]}"; do
    if grep -q "$route" server.js; then
        print_pass "Route '$route' registered"
    else
        print_warn "Route '$route' not found in server.js"
    fi
done

echo ""
echo "8. CORS CONFIGURATION CHECK"
echo "----------------------------------------"

if grep -q "cors" server.js; then
    print_pass "CORS middleware configured"
    
    if grep -q "ALLOWED_ORIGINS" server.js; then
        print_pass "ALLOWED_ORIGINS environment variable used"
    else
        print_warn "Consider using ALLOWED_ORIGINS env variable"
    fi
else
    print_fail "CORS not configured"
fi

echo ""
echo "=========================================="
echo "SUMMARY"
echo "=========================================="
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${YELLOW}Warnings: $WARN${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
    echo "Your backend is ready for Vercel serverless deployment."
    echo ""
    echo "Next steps:"
    echo "1. Push to GitHub: git add -A && git commit -m 'Ready for deployment' && git push"
    echo "2. Vercel will auto-deploy (if connected)"
    echo "3. Set environment variables in Vercel dashboard"
    echo "4. Test endpoints after deployment"
    exit 0
else
    echo -e "${RED}✗ Some critical checks failed!${NC}"
    echo "Please fix the issues above before deploying."
    exit 1
fi
