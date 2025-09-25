#!/bin/bash

# External Keep-Alive Script for Render Backend
# Run this on a separate server or your local machine

API_URL="https://api.manishsteelfurniture.com.np/health"
PING_INTERVAL=840 # 14 minutes (840 seconds)

echo "🚀 Starting keep-alive service for Manish Steel API"
echo "📍 Target URL: $API_URL"
echo "⏰ Ping interval: $PING_INTERVAL seconds (14 minutes)"
echo "🔄 Starting monitoring loop..."

while true; do
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Ping the API
    response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$API_URL")
    
    if [ "$response_code" = "200" ]; then
        echo "[$timestamp] ✅ API is alive (HTTP $response_code)"
    elif [ "$response_code" = "000" ]; then
        echo "[$timestamp] ⚠️  API timeout or connection failed"
    else
        echo "[$timestamp] ❌ API returned HTTP $response_code"
    fi
    
    # Wait for the next ping
    sleep $PING_INTERVAL
done
