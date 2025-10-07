#!/bin/bash

echo "🧪 Testing Vercel Backend After Environment Variable Setup"
echo "========================================================"
echo ""

# Test health endpoint
echo "1. Testing Health Endpoint..."
curl -s "https://manish-steel-backend.vercel.app/api/health" | jq .

echo ""
echo "2. Testing Products Endpoint..."
curl -s "https://manish-steel-backend.vercel.app/api/products?limit=1" | jq '.totalProducts'

echo ""
echo "3. Testing Categories Endpoint..."
curl -s "https://manish-steel-backend.vercel.app/api/categories" | jq 'length'

echo ""
if curl -s "https://manish-steel-backend.vercel.app/api/products?limit=1" | grep -q "totalProducts"; then
    echo "✅ SUCCESS: Backend is working with database!"
    echo "🎉 Ready to update frontend and test website!"
else
    echo "❌ ISSUE: Backend still having database connection issues"
    echo "💡 Check if all environment variables are set correctly"
fi
