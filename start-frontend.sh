#!/bin/bash

#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Starting Manish Steel Frontend App${NC}"
echo -e "${GREEN}========================================${NC}"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FRONTEND_DIR="$SCRIPT_DIR/manish-steel-final"

# Navigate to frontend directory
cd "$FRONTEND_DIR" || {
    echo -e "${RED}Error: Frontend directory not found at $FRONTEND_DIR${NC}"
    exit 1
}

echo -e "${BLUE}Current directory: $(pwd)${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
    echo ""
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Note: .env file not found (optional)${NC}"
    echo -e "${BLUE}Create .env file if you need custom configuration:${NC}"
    echo -e "  - REACT_APP_API_URL (default: http://localhost:5000/api)"
    echo ""
fi

# Kill any existing process on port 3000
echo -e "${YELLOW}🔍 Checking for existing processes on port 3000...${NC}"
EXISTING_PID=$(lsof -ti:3000 || true)
if [ ! -z "$EXISTING_PID" ]; then
    echo -e "${YELLOW}⚠️  Killing existing process on port 3000 (PID: $EXISTING_PID)${NC}"
    kill -9 $EXISTING_PID 2>/dev/null || true
    sleep 2
fi

# Start the frontend server
echo -e "${GREEN}� Starting frontend development server on port 3000...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Frontend will open automatically in your browser${NC}"
echo -e "${BLUE}  URL: http://localhost:3000${NC}"
echo ""

npm start
