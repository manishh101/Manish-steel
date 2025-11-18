#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Starting Manish Steel Backend Server${NC}"
echo -e "${GREEN}========================================${NC}"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVER_DIR="$SCRIPT_DIR/server"

# Navigate to server directory
cd "$SERVER_DIR" || {
    echo -e "${RED}Error: Server directory not found at $SERVER_DIR${NC}"
    exit 1
}

echo -e "${BLUE}Current directory: $(pwd)${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    npm install
    echo ""
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo -e "${RED}⚠️  Warning: .env file not found!${NC}"
    echo -e "${YELLOW}Please create .env file with required configurations:${NC}"
    echo -e "  - DATABASE_URL"
    echo -e "  - CLOUDINARY_CLOUD_NAME"
    echo -e "  - CLOUDINARY_API_KEY"
    echo -e "  - CLOUDINARY_API_SECRET"
    echo -e "  - JWT_SECRET"
    echo ""
fi

# Kill any existing process on port 5000
echo -e "${YELLOW}🔍 Checking for existing processes on port 5000...${NC}"
EXISTING_PID=$(lsof -ti:5000 || true)
if [ ! -z "$EXISTING_PID" ]; then
    echo -e "${YELLOW}⚠️  Killing existing process on port 5000 (PID: $EXISTING_PID)${NC}"
    kill -9 $EXISTING_PID 2>/dev/null || true
    sleep 2
fi

# Start the backend server
echo -e "${GREEN}🚀 Starting backend server on port 5000...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

npm start
