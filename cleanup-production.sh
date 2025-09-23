#!/bin/bash

echo "🧹 Starting Production Cleanup for Manish Steel Project"
echo "====================================================="

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
    else
        echo -e "${BLUE}ℹ Already clean:${NC} $1"
    fi
}

# Function to create .gitignore entries
create_gitignore_entry() {
    local gitignore_file="$1"
    local entry="$2"
    
    if [ ! -f "$gitignore_file" ]; then
        touch "$gitignore_file"
    fi
    
    if ! grep -q "^$entry$" "$gitignore_file"; then
        echo "$entry" >> "$gitignore_file"
        echo -e "${GREEN}Added to .gitignore:${NC} $entry"
    fi
}

echo -e "\n${BLUE}1. Removing development and debugging files...${NC}"

# Remove markdown documentation files (keep main README.md)
safe_remove "ADMIN_ABOUT_FIX_SUMMARY.md"
safe_remove "ADMIN_PANEL_FIX_SUMMARY.md"
safe_remove "ADMIN_PRODUCT_ENHANCEMENT_SUMMARY.md"
safe_remove "CACHE_TROUBLESHOOTING_GUIDE.md"
safe_remove "CATEGORY_FILTERING_DEBUG_GUIDE.md"
safe_remove "CATEGORY_SUBCATEGORY_INTEGRATION_SUMMARY.md"
safe_remove "CORS-FIX-GUIDE.md"
safe_remove "HOMEPAGE_INTEGRATION_FIX.md"
safe_remove "MANUAL-DEPLOYMENT-GUIDE.md"
safe_remove "PRODUCTION_ANALYSIS.md"
safe_remove "PRODUCT_DISPLAY_FIX_SUMMARY.md"
safe_remove "PROFESSIONAL_STANDARDS_REPORT.md"
safe_remove "VERCEL-COMPLETE-DEPLOYMENT-GUIDE.md"
safe_remove "VERCEL-STEP-BY-STEP-GUIDE.md"

# Remove debug and test scripts
safe_remove "debug-auth.js"
safe_remove "professional-category-analysis.js"
safe_remove "test-api-connection.sh"
safe_remove "test-api-fixes.js"
safe_remove "test-api-url-formats.sh"
safe_remove "test-api.sh"
safe_remove "test-category-filtering.js"
safe_remove "test-cors.sh"
safe_remove "test-existing-products.js"
safe_remove "test-objectid-filtering.js"
safe_remove "test-preview-cors.sh"
safe_remove "test-product-data.sh"

# Remove deployment scripts (keep main deploy.sh)
safe_remove "deploy-cors-fix-vercel.sh"
safe_remove "deploy-cors-fix.sh"
safe_remove "deploy-render-cors-fix.sh"
safe_remove "deploy-timeout-fixes.sh"
safe_remove "update-frontend-env.sh"
safe_remove "update-mobile-fixes.sh"
safe_remove "update-render-cors.sh"

# Remove temp backup directory
safe_remove "temp_backup"

# Remove documentation source directory
safe_remove "src"

# Remove package.json and package-lock.json from root (they're duplicated)
safe_remove "package.json"
safe_remove "package-lock.json"

echo -e "\n${BLUE}2. Cleaning server directory...${NC}"

# Server test files
safe_remove "server/quick-test.js"
safe_remove "server/test-about-model.js"
safe_remove "server/test-api-fixes.js"
safe_remove "server/test-category-filter.js"
safe_remove "server/verify-about-fixes.js"

# Remove server uploads directory if empty or contains only test files
if [ -d "server/uploads" ]; then
    if [ -z "$(ls -A server/uploads)" ]; then
        safe_remove "server/uploads"
        echo -e "${GREEN}✓ Removed empty uploads directory${NC}"
    else
        echo -e "${YELLOW}ℹ Keeping uploads directory (contains files)${NC}"
    fi
fi

echo -e "\n${BLUE}3. Cleaning frontend directory...${NC}"

# Remove development environment files (keep .env.example)
safe_remove "manish-steel-final/.env.development"
safe_remove "manish-steel-final/.env.local"

# Remove npm cache and build artifacts
safe_remove "manish-steel-final/.npmrc"
safe_remove "manish-steel-final/.nowignore"

# Remove cache debug file from public
safe_remove "manish-steel-final/public/cache-debug-utils.js"

echo -e "\n${BLUE}4. Updating .gitignore files...${NC}"

# Update root .gitignore
create_gitignore_entry ".gitignore" "node_modules/"
create_gitignore_entry ".gitignore" ".env"
create_gitignore_entry ".gitignore" ".env.local"
create_gitignore_entry ".gitignore" ".env.development"
create_gitignore_entry ".gitignore" "dist/"
create_gitignore_entry ".gitignore" "build/"
create_gitignore_entry ".gitignore" "uploads/"
create_gitignore_entry ".gitignore" "temp_backup/"
create_gitignore_entry ".gitignore" "*.log"
create_gitignore_entry ".gitignore" ".venv/"
create_gitignore_entry ".gitignore" "__pycache__/"

# Update frontend .gitignore
create_gitignore_entry "manish-steel-final/.gitignore" "node_modules/"
create_gitignore_entry "manish-steel-final/.gitignore" ".env"
create_gitignore_entry "manish-steel-final/.gitignore" ".env.local"
create_gitignore_entry "manish-steel-final/.gitignore" ".env.development"
create_gitignore_entry "manish-steel-final/.gitignore" "build/"
create_gitignore_entry "manish-steel-final/.gitignore" "dist/"
create_gitignore_entry "manish-steel-final/.gitignore" "*.log"

# Update server .gitignore
create_gitignore_entry "server/.gitignore" "node_modules/"
create_gitignore_entry "server/.gitignore" ".env"
create_gitignore_entry "server/.gitignore" "uploads/"
create_gitignore_entry "server/.gitignore" "*.log"

echo -e "\n${BLUE}5. Organizing project structure...${NC}"

# Create a clean project structure documentation
cat > "PROJECT_STRUCTURE.md" << 'EOF'
# Manish Steel - Project Structure

## Production Structure

```
manish-steel-main/
├── manish-steel-final/          # Frontend React Application
│   ├── public/                  # Static assets
│   ├── src/                     # React source code
│   ├── package.json            # Frontend dependencies
│   └── vercel.json             # Vercel deployment config
├── server/                      # Backend Node.js API
│   ├── controllers/            # API controllers
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── middleware/             # Express middleware
│   ├── utils/                  # Utility functions
│   ├── config/                 # Configuration files
│   ├── seeders/                # Database seeders
│   ├── package.json           # Backend dependencies
│   └── vercel.json            # Vercel deployment config
├── README.md                   # Main project documentation
├── deploy.sh                   # Production deployment script
└── start.sh                    # Local development script
```

## Key Production Files

### Frontend (manish-steel-final/)
- **package.json**: Dependencies and build scripts
- **vercel.json**: Vercel deployment configuration
- **src/**: React application source code
- **public/**: Static assets and HTML template

### Backend (server/)
- **package.json**: Node.js dependencies
- **server.js**: Main server entry point
- **vercel.json**: Serverless deployment config
- **models/**: MongoDB schemas
- **routes/**: API endpoint definitions
- **controllers/**: Business logic

### Environment Variables
- **server/.env.example**: Backend environment template
- **manish-steel-final/.env.example**: Frontend environment template

## Deployment

1. **Frontend**: Deploy to Vercel from `manish-steel-final/` directory
2. **Backend**: Deploy to Render or Vercel from `server/` directory
3. **Database**: MongoDB Atlas (cloud database)

## Development

1. Install dependencies: `npm install` in both directories
2. Start backend: `cd server && npm start`
3. Start frontend: `cd manish-steel-final && npm start`
EOF

echo -e "${GREEN}✓ Created PROJECT_STRUCTURE.md${NC}"

echo -e "\n${BLUE}6. Final cleanup...${NC}"

# Remove Python virtual environment if it exists
safe_remove ".venv"

# Remove any remaining log files
find . -name "*.log" -type f -delete 2>/dev/null || true

# Remove any remaining node_modules in root
safe_remove "node_modules"

# Remove any remaining .DS_Store files (macOS)
find . -name ".DS_Store" -type f -delete 2>/dev/null || true

echo -e "\n${GREEN}✅ Production cleanup completed!${NC}"
echo -e "\n${BLUE}Project Summary:${NC}"
echo "- Removed debug and test files"
echo "- Cleaned development artifacts"
echo "- Updated .gitignore files"
echo "- Organized project structure"
echo "- Created production documentation"

echo -e "\n${YELLOW}Next Steps:${NC}"
echo "1. Review the cleaned project structure"
echo "2. Test both frontend and backend locally"
echo "3. Update environment variables for production"
echo "4. Deploy to production servers"
echo "5. Update README.md with current project information"

echo -e "\n${GREEN}🎉 Your project is now production-ready!${NC}"
