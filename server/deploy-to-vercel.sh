#!/bin/bash

# Manish Steel Backend - Vercel Deployment Script
# This script deploys the backend API to Vercel

set -e  # Exit on error

echo "🚀 Manish Steel Backend Deployment Script"
echo "=========================================="
echo ""

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the server directory."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed"
echo ""

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "⚠️  Not logged in to Vercel. Please log in:"
    vercel login
fi

echo ""
echo "✅ Authenticated with Vercel"
echo ""

# Ask user which deployment type
echo "Select deployment type:"
echo "1) Preview deployment (test)"
echo "2) Production deployment"
echo ""
read -p "Enter choice (1 or 2): " choice

echo ""

if [ "$choice" = "1" ]; then
    echo "🚀 Deploying to preview environment..."
    vercel
elif [ "$choice" = "2" ]; then
    echo "🚀 Deploying to production..."
    vercel --prod
else
    echo "❌ Invalid choice. Exiting."
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Set environment variables in Vercel Dashboard:"
echo "      - MONGO_URI"
echo "      - JWT_SECRET"
echo "      - CLOUDINARY_CLOUD_NAME"
echo "      - CLOUDINARY_API_KEY"
echo "      - CLOUDINARY_API_SECRET"
echo ""
echo "   2. Test your API endpoints"
echo "   3. Update frontend API URL"
echo ""
echo "   View deployment: vercel ls"
echo "   View logs: vercel logs"
echo ""
