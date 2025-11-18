#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${RED}========================================${NC}"
echo -e "${RED}  Stopping All Manish Steel Processes${NC}"
echo -e "${RED}========================================${NC}"
echo ""

# Function to kill process on a port
kill_port() {
    local port=$1
    local name=$2
    
    EXISTING_PID=$(lsof -ti:$port 2>/dev/null || true)
    if [ ! -z "$EXISTING_PID" ]; then
        echo -e "${YELLOW}⚠️  Killing $name process on port $port (PID: $EXISTING_PID)${NC}"
        kill -9 $EXISTING_PID 2>/dev/null || true
        sleep 1
        echo -e "${GREEN}✓ $name process stopped${NC}"
    else
        echo -e "${BLUE}ℹ  No $name process found on port $port${NC}"
    fi
}

# Kill backend on port 5000
kill_port 5000 "Backend"

# Kill frontend on port 3000
kill_port 3000 "Frontend"

# Kill any remaining npm/node processes related to the project
echo ""
echo -e "${YELLOW}🔍 Checking for other npm/node processes...${NC}"

# Kill npm start processes
pkill -9 -f "npm start" 2>/dev/null && echo -e "${GREEN}✓ Killed npm start processes${NC}" || echo -e "${BLUE}ℹ  No npm start processes found${NC}"

# Kill react-scripts processes
pkill -9 -f "react-scripts start" 2>/dev/null && echo -e "${GREEN}✓ Killed react-scripts processes${NC}" || echo -e "${BLUE}ℹ  No react-scripts processes found${NC}"

# Kill node server processes
pkill -9 -f "node.*index.js" 2>/dev/null && echo -e "${GREEN}✓ Killed node server processes${NC}" || echo -e "${BLUE}ℹ  No node server processes found${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  All processes stopped successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
