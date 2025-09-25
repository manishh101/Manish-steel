#!/bin/bash

echo "🧪 Testing Production Deployment"
echo "================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test main website
echo -e "${YELLOW}Testing main website...${NC}"
if curl -I -s https://manishsteelfurniture.com.np | grep -q "200 OK"; then
    echo -e "${GREEN}✅ Main website is accessible${NC}"
else
    echo -e "${RED}❌ Main website is not accessible${NC}"
fi

# Test www redirect
echo -e "${YELLOW}Testing www redirect...${NC}"
if curl -I -s https://www.manishsteelfurniture.com.np | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ WWW subdomain is accessible${NC}"
else
    echo -e "${RED}❌ WWW subdomain is not accessible${NC}"
fi

# Test API health
echo -e "${YELLOW}Testing API health...${NC}"
if curl -s https://api.manishsteelfurniture.com.np/api/health | grep -q "healthy"; then
    echo -e "${GREEN}✅ API health check passed${NC}"
else
    echo -e "${RED}❌ API health check failed${NC}"
fi

# Test products API
echo -e "${YELLOW}Testing products API...${NC}"
if curl -s https://api.manishsteelfurniture.com.np/api/products | grep -q "products\|_id\|name"; then
    echo -e "${GREEN}✅ Products API is working${NC}"
else
    echo -e "${RED}❌ Products API is not working${NC}"
fi

# Test CORS
echo -e "${YELLOW}Testing CORS...${NC}"
if curl -H "Origin: https://manishsteelfurniture.com.np" -I -s https://api.manishsteelfurniture.com.np/api/health | grep -q "Access-Control-Allow-Origin"; then
    echo -e "${GREEN}✅ CORS is configured correctly${NC}"
else
    echo -e "${RED}❌ CORS configuration issue${NC}"
fi

# SSL Certificate Test
echo -e "${YELLOW}Testing SSL certificates...${NC}"
if curl -I -s https://manishsteelfurniture.com.np | grep -q "HTTP/2 200\|HTTP/1.1 200"; then
    echo -e "${GREEN}✅ SSL certificate is valid${NC}"
else
    echo -e "${RED}❌ SSL certificate issue${NC}"
fi

echo -e "\n${YELLOW}📊 Performance Tests${NC}"
echo "====================" 

# Test page load time
echo -e "${YELLOW}Testing page load time...${NC}"
LOAD_TIME=$(curl -o /dev/null -s -w "%{time_total}" https://manishsteelfurniture.com.np)
echo "Main page load time: ${LOAD_TIME} seconds"

if (( $(echo "$LOAD_TIME < 3.0" | bc -l) )); then
    echo -e "${GREEN}✅ Page load time is acceptable (<3s)${NC}"
else
    echo -e "${RED}❌ Page load time is slow (>3s)${NC}"
fi

echo -e "\n${YELLOW}🔧 Manual Tests Needed:${NC}"
echo "========================"
echo "1. Visit https://manishsteelfurniture.com.np in browser"
echo "2. Test contact form submission"
echo "3. Test admin login functionality"
echo "4. Verify image loading and gallery"
echo "5. Check mobile responsiveness"
echo "6. Test product search and filtering"

echo -e "\n${YELLOW}📈 Monitoring Setup:${NC}"
echo "====================="
echo "1. Setup Google Analytics"
echo "2. Configure UptimeRobot monitoring"
echo "3. Add Google Search Console"
echo "4. Setup error tracking (Sentry)"

echo -e "\n${GREEN}🎉 Deployment test completed!${NC}"
