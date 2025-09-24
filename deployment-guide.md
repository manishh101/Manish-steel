# Manish Steel Furniture - Domain Hosting Guide

## Phase 1: Quick Domain Setup with Vercel + Render

### Step 1: Vercel Frontend Configuration

1. **Login to Vercel Dashboard**
   - Go to your project: manish-steel-final
   - Navigate to Settings → Domains

2. **Add Custom Domains**
   ```
   Primary: manishsteelfurniture.com.np
   WWW: www.manishsteelfurniture.com.np
   ```

3. **DNS Records to Add**
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   TTL: 3600

   Type: CNAME  
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

### Step 2: Render Backend Configuration

1. **Add Custom Domain in Render**
   ```
   Domain: api.manishsteelfurniture.com.np
   Service: Your backend service
   ```

2. **Additional DNS Record**
   ```
   Type: CNAME
   Name: api
   Value: your-backend-name.onrender.com
   TTL: 3600
   ```

### Step 3: Update Application Configuration

1. **Frontend Environment Variables**
   ```bash
   # Update in Vercel dashboard
   REACT_APP_API_URL=https://api.manishsteelfurniture.com.np
   REACT_APP_SITE_URL=https://manishsteelfurniture.com.np
   ```

2. **Backend CORS Configuration**
   ```javascript
   // Update in server.js
   const corsOptions = {
     origin: [
       'https://manishsteelfurniture.com.np',
       'https://www.manishsteelfurniture.com.np',
       'http://localhost:3000' // for development
     ],
     credentials: true
   };
   ```

## Phase 2: VPS Setup (Optional - Better Performance)

### Recommended VPS Specs
```
CPU: 2 vCPUs
RAM: 2GB
Storage: 50GB SSD
Bandwidth: 1TB
Location: Singapore/Mumbai (closest to Nepal)
Cost: $5-10/month
```

### Server Setup Commands
```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PM2 for process management
sudo npm install -g pm2

# 4. Install Nginx
sudo apt install nginx

# 5. Install SSL certificate tool
sudo apt install certbot python3-certbot-nginx

# 6. Setup firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/manishsteelfurniture.com.np
server {
    listen 80;
    server_name manishsteelfurniture.com.np www.manishsteelfurniture.com.np;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# API subdomain
server {
    listen 80;
    server_name api.manishsteelfurniture.com.np;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Phase 3: Cloudflare Setup (Performance Optimization)

1. **Add Domain to Cloudflare**
   - Sign up at cloudflare.com
   - Add manishsteelfurniture.com.np
   - Change nameservers at domain registrar

2. **Cloudflare Settings**
   ```
   SSL/TLS: Full (Strict)
   Caching: Standard
   Minification: CSS, JS, HTML enabled
   Brotli Compression: Enabled
   Auto Minify: Enabled
   ```

3. **Performance Rules**
   ```
   Cache Everything for static assets
   Browser Cache TTL: 4 hours
   Edge Cache TTL: 7 days
   ```

## Cost Breakdown

### Option 1: Vercel + Render + Cloudflare
```
Vercel Pro (if needed): $20/month
Render (free tier): $0/month
Cloudflare: $0/month
Domain: ~$15/year
Total: $20/month + $15/year
```

### Option 2: VPS + Cloudflare
```
VPS (DigitalOcean): $6/month
Cloudflare: $0/month
Domain: ~$15/year
Total: $6/month + $15/year
```

### Option 3: Nepal VPS + Cloudflare
```
Nepal VPS: $10-15/month
Cloudflare: $0/month  
Domain: ~$15/year
Total: $10-15/month + $15/year
```

## Recommended Timeline

### Week 1: Domain Setup
- Day 1-2: Configure DNS and Vercel domain
- Day 3-4: Test and verify SSL certificates
- Day 5-7: Monitor and optimize

### Week 2: Performance Optimization  
- Day 1-3: Setup Cloudflare
- Day 4-5: Optimize caching rules
- Day 6-7: Performance testing

### Week 3: Optional VPS Migration
- Day 1-3: Setup VPS server
- Day 4-5: Deploy and test applications
- Day 6-7: Switch DNS and monitor

## SEO Considerations

1. **301 Redirects**: Setup redirects from old domains
2. **Search Console**: Update Google Search Console
3. **Sitemap**: Update sitemap.xml with new domain
4. **Social Links**: Update all social media profiles
5. **Business Listings**: Update Google My Business

## Backup Strategy

1. **Database Backups**: Daily MongoDB backups
2. **Code Backups**: Git repository (already done)
3. **Asset Backups**: Regular backup of uploads/images
4. **Configuration Backups**: Save all server configs

## Monitoring Setup

1. **Uptime Monitoring**: Use UptimeRobot (free)
2. **Performance Monitoring**: Google Analytics 4
3. **Error Tracking**: Sentry.io integration
4. **Server Monitoring**: New Relic or DataDog (if VPS)
