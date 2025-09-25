#!/bin/bash

# Keep-alive script to prevent Render from sleeping
# This will ping the API every 14 minutes to keep it awake

echo "🏃‍♂️ Starting keep-alive service for Render backend"

while true; do
    echo "$(date): Pinging API to keep it awake..."
    
    # Ping the health endpoint
    response=$(curl -s -o /dev/null -w "%{http_code}" https://api.manishsteelfurniture.com.np/health)
    
    if [ "$response" = "200" ]; then
        echo "✅ API is awake (HTTP $response)"
    else
        echo "⚠️ API responded with HTTP $response"
    fi
    
    # Wait 14 minutes (840 seconds) - slightly less than Render's 15-minute timeout
    echo "😴 Sleeping for 14 minutes..."
    sleep 840
done
