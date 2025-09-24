#!/bin/bash

# Domain Testing Script for manishsteelfurniture.com.np

echo "🧪 Testing Custom Domain Setup..."
echo "=================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

test_dns() {
    local domain=$1
    local description=$2
    
    echo -e "\n${BLUE}Testing: $description${NC}"
    
    if nslookup $domain > /dev/null 2>&1; then
        echo -e "${GREEN}✅ DNS resolved: $domain${NC}"
        
        # Get IP address
        ip=$(nslookup $domain | grep 'Address:' | tail -1 | awk '{print $2}')
        echo -e "${BLUE}   IP: $ip${NC}"
        
        # Test HTTP response
        if curl -s -I --connect-timeout 10 https://$domain > /dev/null 2>&1; then
            echo -e "${GREEN}✅ HTTPS working: https://$domain${NC}"
            
            # Get response time
            response_time=$(curl -s -w "%{time_total}" -o /dev/null https://$domain)
            echo -e "${BLUE}   Response Time: ${response_time}s${NC}"
        else
            echo -e "${YELLOW}⚠️  HTTPS not ready yet: https://$domain${NC}"
        fi
    else
        echo -e "${RED}❌ DNS not resolved: $domain${NC}"
        echo -e "${YELLOW}   This is normal if nameservers were just changed${NC}"
    fi
}

test_api() {
    local domain=$1
    
    echo -e "\n${BLUE}Testing: API Endpoint${NC}"
    
    if curl -s --connect-timeout 10 https://$domain/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ API responding: https://$domain${NC}"
    elif curl -s --connect-timeout 10 https://$domain > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Domain accessible but API not ready: https://$domain${NC}"
    else
        echo -e "${RED}❌ API not accessible: https://$domain${NC}"
    fi
}

# Test all domains
test_dns "manishsteelfurniture.com.np" "Main Domain"
test_dns "www.manishsteelfurniture.com.np" "WWW Domain" 
test_api "api.manishsteelfurniture.com.np"

echo -e "\n${BLUE}Cloudflare Status Check:${NC}"
if curl -s -I https://manishsteelfurniture.com.np | grep -i "cf-ray" > /dev/null; then
    echo -e "${GREEN}✅ Cloudflare CDN active${NC}"
else
    echo -e "${YELLOW}⚠️  Cloudflare CDN not detected (may take time to propagate)${NC}"
fi

echo -e "\n${BLUE}SSL Certificate Check:${NC}"
ssl_info=$(echo | openssl s_client -servername manishsteelfurniture.com.np -connect manishsteelfurniture.com.np:443 2>/dev/null | openssl x509 -noout -issuer 2>/dev/null)
if echo "$ssl_info" | grep -i "cloudflare" > /dev/null; then
    echo -e "${GREEN}✅ Cloudflare SSL certificate active${NC}"
elif echo "$ssl_info" | grep -i "let's encrypt" > /dev/null; then
    echo -e "${GREEN}✅ Let's Encrypt SSL certificate active${NC}"
else
    echo -e "${YELLOW}⚠️  SSL certificate not detected or still propagating${NC}"
fi

echo -e "\n${BLUE}Performance Test:${NC}"
if command -v curl > /dev/null; then
    load_time=$(curl -s -w "Connect: %{time_connect}s | First Byte: %{time_starttransfer}s | Total: %{time_total}s\n" -o /dev/null https://manishsteelfurniture.com.np 2>/dev/null)
    echo -e "${GREEN}Load Times: $load_time${NC}"
fi

echo -e "\n${BLUE}Next Steps if Tests Fail:${NC}"
echo "1. Wait 24-48 hours for DNS propagation"
echo "2. Check nameservers are updated at domain registrar"
echo "3. Verify Cloudflare DNS records are correct"
echo "4. Ensure Vercel and Render deployments are successful"

echo -e "\n${GREEN}🎉 Testing Complete!${NC}"
echo "Run this script periodically to monitor setup progress."
