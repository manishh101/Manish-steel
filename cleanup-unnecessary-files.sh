#!/bin/bash

# Cleanup script for Manish Steel project
# This script removes unnecessary files that don't affect the working of the project

echo "🧹 Starting cleanup of unnecessary files..."

# Remove backup files
echo "📁 Removing backup files..."
rm -f "manish-steel-final/public/index.html.backup"
rm -f "manish-steel-final/build/index.html.backup"
echo "  ✅ Backup files removed"

# Remove test and development files (keeping essential ones)
echo "📁 Removing test and development files..."
rm -f "test-api-fixes.js"
rm -f "server/test-about-model.js" 
rm -f "server/quick-test.js"
rm -f "server/verify-about-fixes.js"
echo "  ✅ Test files removed"

# Remove redundant setup scripts (keeping essential ones)
echo "📁 Removing redundant setup scripts..."
rm -f "setup-production-env.sh"
rm -f "cleanup-production.sh"
rm -f "final-cleanup.sh"
rm -f "vps-setup.sh"
echo "  ✅ Redundant setup scripts removed"

# Remove unnecessary documentation files (keeping main ones)
echo "📁 Removing redundant documentation..."
rm -f "ADMIN_ABOUT_FIX_SUMMARY.md"
rm -f "CLEANUP_SUMMARY.md"
rm -f "FINAL_CLEANUP_REPORT.md"
rm -f "PROJECT_FINAL.md"
rm -f "VERCEL-TROUBLESHOOTING.md"
echo "  ✅ Redundant documentation removed"

# Remove deployment check scripts (keeping main ones)
echo "📁 Removing deployment check scripts..."
rm -f "check-vercel-status.sh"
rm -f "deploy-timeout-fixes.sh"
rm -f "test-domain-setup.sh"
echo "  ✅ Deployment check scripts removed"

# Clean up node_modules cache if present
echo "📁 Cleaning node_modules cache..."
rm -rf "manish-steel-final/node_modules/.cache/default-development/index.pack.old"
echo "  ✅ Node modules cache cleaned"

# Remove uploads folder if empty or contains test files
echo "📁 Checking server uploads folder..."
if [ -d "server/uploads" ]; then
    # Remove test images if any
    find "server/uploads" -name "test*" -delete 2>/dev/null || true
    # Check if uploads folder is empty
    if [ -z "$(ls -A server/uploads 2>/dev/null)" ]; then
        rm -rf "server/uploads"
        echo "  ✅ Empty uploads folder removed"
    else
        echo "  ℹ️  Uploads folder contains files, keeping it"
    fi
fi

# Remove any log files
echo "📁 Removing log files..."
find . -name "*.log" -type f -delete 2>/dev/null || true
echo "  ✅ Log files removed"

# Remove temporary files
echo "📁 Removing temporary files..."
find . -name "*.tmp" -type f -delete 2>/dev/null || true
find . -name "*.temp" -type f -delete 2>/dev/null || true
echo "  ✅ Temporary files removed"

echo ""
echo "🎉 Cleanup completed successfully!"
echo ""
echo "📊 Summary of files that were removed:"
echo "   • Backup HTML files (index.html.backup)"
echo "   • Test and debug JavaScript files"
echo "   • Redundant setup and deployment scripts"
echo "   • Excess documentation files"
echo "   • Node modules cache files"
echo "   • Log and temporary files"
echo ""
echo "✅ The project structure is now clean and optimized for production deployment."
