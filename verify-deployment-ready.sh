#!/bin/bash

echo "🔍 Pre-Deployment Verification Script"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
    else
        echo -e "${RED}✗${NC} $1 missing"
        ((ERRORS++))
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
    else
        echo -e "${RED}✗${NC} $1 missing"
        ((ERRORS++))
    fi
}

# Function to check env variable in file
check_env_var() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $2 configured in $1"
    else
        echo -e "${YELLOW}⚠${NC} $2 not found in $1"
        ((WARNINGS++))
    fi
}

echo "📦 Checking Backend Files..."
echo "----------------------------"
check_file "server/index.js"
check_file "server/server.js"
check_file "server/package.json"
check_file "server/vercel.json"
check_file "server/.env.example"
check_file "server/.gitignore"
check_dir "server/config"
check_dir "server/controllers"
check_dir "server/models"
check_dir "server/routes"
echo ""

echo "🎨 Checking Frontend Files..."
echo "----------------------------"
check_file "manish-steel-final/package.json"
check_file "manish-steel-final/vercel.json"
check_file "manish-steel-final/.env.example"
check_file "manish-steel-final/.env.production"
check_file "manish-steel-final/.gitignore"
check_dir "manish-steel-final/src"
check_dir "manish-steel-final/public"
echo ""

echo "🔐 Checking Environment Templates..."
echo "-----------------------------------"
check_env_var "server/.env.example" "MONGO_URI"
check_env_var "server/.env.example" "JWT_SECRET"
check_env_var "server/.env.example" "CLOUDINARY_CLOUD_NAME"
check_env_var "manish-steel-final/.env.example" "REACT_APP_API_URL"
echo ""

echo "📝 Checking Package Dependencies..."
echo "---------------------------------"
if [ -f "server/package.json" ]; then
    if grep -q "express" server/package.json; then
        echo -e "${GREEN}✓${NC} Express installed"
    fi
    if grep -q "mongoose" server/package.json; then
        echo -e "${GREEN}✓${NC} Mongoose installed"
    fi
    if grep -q "cors" server/package.json; then
        echo -e "${GREEN}✓${NC} CORS installed"
    fi
fi

if [ -f "manish-steel-final/package.json" ]; then
    if grep -q "react" manish-steel-final/package.json; then
        echo -e "${GREEN}✓${NC} React installed"
    fi
    if grep -q "axios" manish-steel-final/package.json; then
        echo -e "${GREEN}✓${NC} Axios installed"
    fi
fi
echo ""

echo "🔍 Checking Git Configuration..."
echo "------------------------------"
if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Git repository initialized"
    
    # Check if .env files are gitignored
    if grep -q ".env" .gitignore 2>/dev/null; then
        echo -e "${GREEN}✓${NC} .env files are in .gitignore"
    else
        echo -e "${RED}✗${NC} .env files not in .gitignore (SECURITY RISK!)"
        ((ERRORS++))
    fi
    
    if grep -q "node_modules" .gitignore 2>/dev/null; then
        echo -e "${GREEN}✓${NC} node_modules in .gitignore"
    else
        echo -e "${YELLOW}⚠${NC} node_modules not in .gitignore"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠${NC} Git not initialized"
    ((WARNINGS++))
fi
echo ""

echo "📊 Verification Summary"
echo "======================="
echo -e "Errors:   ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All critical checks passed!${NC}"
    echo ""
    echo "🚀 Ready for Vercel Deployment!"
    echo ""
    echo "Next Steps:"
    echo "1. Read VERCEL-DEPLOYMENT-GUIDE.md"
    echo "2. Set up environment variables in Vercel"
    echo "3. Deploy backend first, then frontend"
    echo "4. Update frontend REACT_APP_API_URL with backend URL"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Please fix errors before deploying${NC}"
    echo ""
    exit 1
fi
