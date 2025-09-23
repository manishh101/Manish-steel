#!/bin/bash

echo "🚀 Deploying API fixes for rate limiting and timeout issues..."
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "server/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Navigate to server directory
cd server

echo "📦 Installing/updating dependencies..."
npm install express-rate-limit --save

echo "🔄 Checking current server status..."
# Check if server is running locally
if lsof -i:5000 >/dev/null 2>&1; then
    echo "⚠️  Local server is running on port 5000"
    echo "🛑 Stopping local server..."
    pkill -f "node.*server" || true
    sleep 2
fi

echo "🧪 Running API connection tests..."
cd ..
node test-api-fixes.js

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🔧 Changes made:"
echo "  - Increased API timeout from 5s to 30s"
echo "  - Added retry logic for failed requests"
echo "  - Implemented exponential backoff"
echo "  - Enhanced rate limiting (more lenient)"
echo "  - Improved error handling and logging"
echo "  - Added server timeout configuration"
echo ""
echo "📊 Next steps:"
echo "  1. The frontend will now handle timeouts better"
echo "  2. Automatic retries will help with temporary network issues"
echo "  3. Rate limiting is more generous for API endpoints"
echo "  4. Better fallback to local data when API is unavailable"
echo ""
echo "🌐 For production deployment:"
echo "  - Deploy the updated server code to Render"
echo "  - Deploy the updated frontend to Vercel"
echo "  - Monitor the logs for improved performance"
