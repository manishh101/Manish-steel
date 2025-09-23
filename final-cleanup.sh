#!/bin/bash

echo "🧹 Final Project Cleanup - Removing Unnecessary Files"
echo "===================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to safely remove files/directories
safe_remove() {
    if [ -e "$1" ]; then
        echo -e "${YELLOW}Removing:${NC} $1"
        rm -rf "$1"
        echo -e "${GREEN}✓ Removed${NC}"
        return 0
    else
        echo -e "${BLUE}ℹ Not found:${NC} $1"
        return 1
    fi
}

# Function to check if file is safe to remove
is_safe_to_remove() {
    local file="$1"
    
    # Don't remove if it's a core dependency
    case "$file" in
        */node_modules/* | */build/* | */.git/* | */src/* | */public/index.html | */package.json | */package-lock.json)
            return 1 ;;
        *.bak | *~ | *.tmp | *.temp | *.log | .DS_Store)
            return 0 ;;
        *)
            return 0 ;;
    esac
}

echo -e "\n${BLUE}1. Removing backup and temporary files...${NC}"

# Remove backup files
safe_remove "manish-steel-final/package.json.bak"
safe_remove "server/package.json.bak"

# Remove any temporary files
find . -name "*.bak" -type f -delete 2>/dev/null || true
find . -name "*.tmp" -type f -delete 2>/dev/null || true
find . -name "*.temp" -type f -delete 2>/dev/null || true
find . -name "*~" -type f -delete 2>/dev/null || true
find . -name ".DS_Store" -type f -delete 2>/dev/null || true

echo -e "\n${BLUE}2. Cleaning up documentation files...${NC}"

# Keep only essential documentation
# Remove duplicate README files (keep main README.md)
safe_remove "manish-steel-final/README.md"
safe_remove "server/README.md"

# Remove cleanup summary files (they've served their purpose)
safe_remove "CLEANUP_SUMMARY.md"

echo -e "\n${BLUE}3. Optimizing script files...${NC}"

# Remove the cleanup script itself after this run
echo -e "${YELLOW}Note: cleanup-production.sh will be removed after this execution${NC}"

# Remove setup script (no longer needed after initial setup)
safe_remove "setup-production-env.sh"

echo -e "\n${BLUE}4. Checking for unused image files...${NC}"

# Check for duplicate logos (keep the main one)
if [ -f "manish-steel-final/public/company-logo.png" ] && [ -f "manish-steel-final/public/manish-steel-logo.png" ]; then
    # Check if they're the same file
    if cmp -s "manish-steel-final/public/company-logo.png" "manish-steel-final/public/manish-steel-logo.png"; then
        safe_remove "manish-steel-final/public/company-logo.png"
        echo -e "${GREEN}✓ Removed duplicate logo${NC}"
    else
        echo -e "${BLUE}ℹ Keeping both logos (they're different)${NC}"
    fi
fi

echo -e "\n${BLUE}5. Cleaning up empty directories...${NC}"

# Remove empty uploads directory if it only contains .gitkeep
if [ -d "server/uploads" ] && [ "$(ls -A server/uploads 2>/dev/null | wc -l)" -eq 1 ] && [ -f "server/uploads/.gitkeep" ]; then
    echo -e "${BLUE}ℹ Uploads directory only contains .gitkeep - keeping for git${NC}"
fi

echo -e "\n${BLUE}6. Optimizing build artifacts...${NC}"

# Remove build directory if it exists (will be rebuilt for production)
if [ -d "manish-steel-final/build" ]; then
    echo -e "${YELLOW}Build directory found${NC}"
    echo -e "${BLUE}ℹ Keeping build directory (may be needed for production)${NC}"
    # Only remove if it's a development build
    if [ -f "manish-steel-final/build/static/js/*.map" ]; then
        echo -e "${YELLOW}Removing source maps from build...${NC}"
        find "manish-steel-final/build" -name "*.map" -type f -delete 2>/dev/null || true
    fi
fi

echo -e "\n${BLUE}7. Final validation...${NC}"

# Check that essential files still exist
essential_files=(
    "manish-steel-final/package.json"
    "manish-steel-final/src/App.js"
    "manish-steel-final/public/index.html"
    "server/package.json"
    "server/server.js"
    "server/models"
    "server/routes"
)

missing_files=0
for file in "${essential_files[@]}"; do
    if [ ! -e "$file" ]; then
        echo -e "${RED}❌ Essential file missing: $file${NC}"
        missing_files=$((missing_files + 1))
    fi
done

if [ $missing_files -eq 0 ]; then
    echo -e "${GREEN}✅ All essential files are present${NC}"
else
    echo -e "${RED}⚠️ Warning: $missing_files essential files are missing${NC}"
fi

echo -e "\n${BLUE}8. Creating final project summary...${NC}"

# Create a clean project summary
cat > "PROJECT_FINAL.md" << 'EOF'
# Manish Steel Furniture - Production Ready

## 📁 Final Project Structure

```
manish-steel-main/
├── manish-steel-final/          # Frontend React Application
│   ├── public/                  # Static assets
│   ├── src/                     # React source code
│   ├── .env.production         # Production environment
│   ├── package.json            # Dependencies
│   └── vercel.json             # Deployment config
├── server/                      # Backend Node.js API  
│   ├── controllers/            # API controllers
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── middleware/             # Express middleware
│   ├── .env.example           # Environment template
│   ├── package.json           # Dependencies
│   └── server.js              # Main server file
├── README.md                   # Complete documentation
├── PRODUCTION_CHECKLIST.md    # Deployment guide
├── deploy.sh                   # Deployment script
└── start.sh                    # Development script
```

## 🚀 Quick Start

1. **Frontend**: `cd manish-steel-final && npm install && npm start`
2. **Backend**: `cd server && npm install && npm start`  
3. **Deploy**: `./deploy.sh`

## 📊 Project Status

- ✅ Production Ready
- ✅ Cleaned & Optimized
- ✅ Documentation Complete
- ✅ Deployment Configured

## 🎯 Next Steps

1. Deploy backend to Render
2. Deploy frontend to Vercel
3. Configure environment variables
4. Test production deployment

---
**Project cleaned and optimized for production deployment**
EOF

echo -e "${GREEN}✓ Created PROJECT_FINAL.md${NC}"

echo -e "\n${GREEN}✅ Final cleanup completed!${NC}"
echo -e "\n${YELLOW}📊 Summary:${NC}"
echo "- Removed backup and temporary files"
echo "- Optimized documentation structure"
echo "- Cleaned up duplicate files"
echo "- Validated essential files"
echo "- Created final project summary"

echo -e "\n${BLUE}📁 Final project structure is clean and production-ready!${NC}"

# Self-remove this script
rm -f "$0"
echo -e "${GREEN}✓ Cleanup script removed${NC}"
