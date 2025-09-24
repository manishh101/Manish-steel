# FREE Custom Domain Hosting with Cloudflare
# manishsteelfurniture.com.np - Zero Cost Solution

## 🎯 **Complete FREE Setup Strategy**

### **Architecture Overview**
```
manishsteelfurniture.com.np (FREE)
├── Frontend: Vercel (FREE) + Cloudflare (FREE)
├── Backend: Render (FREE) + Cloudflare (FREE)
├── Database: MongoDB Atlas (FREE 512MB)
├── CDN: Cloudflare (FREE)
├── SSL: Cloudflare (FREE)
├── Analytics: Google Analytics (FREE)
└── Monitoring: UptimeRobot (FREE)
```

## 📋 **Step-by-Step FREE Setup**

### **Phase 1: Cloudflare Setup (5 minutes)**

1. **Create Cloudflare Account**
   - Go to https://cloudflare.com
   - Sign up for FREE account
   - Add domain: `manishsteelfurniture.com.np`

2. **Change Nameservers at Domain Registrar**
   ```
   Cloudflare will provide 2 nameservers like:
   - ada.ns.cloudflare.com
   - jude.ns.cloudflare.com
   
   Update these at your .np domain registrar
   ```

3. **Wait for DNS Propagation** (2-24 hours)

### **Phase 2: Vercel Frontend Setup (FREE)**

1. **Connect GitHub to Vercel**
   - Login to vercel.com with GitHub
   - Import your `manish-steel-final` project
   - Auto-deploy from main branch

2. **Add Custom Domain in Vercel**
   ```
   Project Settings → Domains → Add Domain
   - manishsteelfurniture.com.np
   - www.manishsteelfurniture.com.np
   ```

3. **Vercel will provide DNS records:**
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### **Phase 3: Render Backend Setup (FREE)**

1. **Deploy to Render**
   - Connect GitHub repository
   - Deploy `server` folder as Web Service
   - Use FREE tier (sleeps after 15 min inactivity)

2. **Get Render URL**
   ```
   Example: your-app-name.onrender.com
   ```

### **Phase 4: DNS Configuration in Cloudflare**

```bash
# Add these DNS records in Cloudflare dashboard:

# Main domain (Frontend - Vercel)
Type: A
Name: @
Value: 76.76.19.61
Proxy: ✅ Proxied (Orange Cloud)

# WWW subdomain (Frontend - Vercel)  
Type: CNAME
Name: www
Value: cname.vercel-dns.com
Proxy: ✅ Proxied (Orange Cloud)

# API subdomain (Backend - Render)
Type: CNAME
Name: api
Value: your-app-name.onrender.com
Proxy: ✅ Proxied (Orange Cloud)
```

### **Phase 5: Cloudflare Optimization (FREE Features)**

1. **SSL/TLS Settings**
   ```
   SSL/TLS → Overview → Encryption Mode: Full (Strict)
   SSL/TLS → Edge Certificates → Always Use HTTPS: ON
   ```

2. **Performance Settings**
   ```
   Speed → Optimization
   ✅ Auto Minify: CSS, JavaScript, HTML
   ✅ Brotli Compression
   ✅ Early Hints
   
   Caching → Configuration
   ✅ Browser Cache TTL: 4 hours
   ```

3. **Security Settings**
   ```
   Security → Settings
   ✅ Security Level: Medium
   ✅ Bot Fight Mode: ON
   ✅ Challenge Passage: 30 minutes
   ```

## 🔧 **Configuration Updates**

### **Frontend Environment Variables (Vercel)**
```bash
# Add in Vercel Dashboard → Project → Settings → Environment Variables

REACT_APP_API_URL=https://api.manishsteelfurniture.com.np
REACT_APP_SITE_URL=https://manishsteelfurniture.com.np
GENERATE_SOURCEMAP=false
```

### **Backend Environment Variables (Render)**
```bash
# Add in Render Dashboard → Service → Environment

NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/manishsteel
JWT_SECRET=your-jwt-secret-key
FRONTEND_URL=https://manishsteelfurniture.com.np
```

### **Update CORS in Backend**
```javascript
// server/index.js or server.js
const corsOptions = {
  origin: [
    'https://manishsteelfurniture.com.np',
    'https://www.manishsteelfurniture.com.np',
    'http://localhost:3000' // for development
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

## 📊 **FREE Monitoring & Analytics**

### **1. UptimeRobot (FREE Monitoring)**
```
Website: https://uptimerobot.com
- Monitor: https://manishsteelfurniture.com.np
- Monitor: https://api.manishsteelfurniture.com.np
- Alert: Email notifications
- Interval: 5 minutes
```

### **2. Google Analytics 4 (FREE)**
```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### **3. Google Search Console (FREE SEO)**
```
1. Add property: manishsteelfurniture.com.np
2. Verify ownership via DNS TXT record
3. Submit sitemap: https://manishsteelfurniture.com.np/sitemap.xml
```

## 🚀 **Deployment Commands**

### **Frontend Deployment (Vercel Auto-deploys)**
```bash
# Just push to GitHub main branch
git add .
git commit -m "Deploy to production"
git push origin main
```

### **Backend Deployment (Render Auto-deploys)**
```bash
# Render auto-deploys from GitHub
# No manual commands needed
```

## 💡 **FREE Performance Optimizations**

### **1. Cloudflare Page Rules (3 FREE rules)**
```
Rule 1: manishsteelfurniture.com.np/api/*
- Cache Level: Bypass

Rule 2: manishsteelfurniture.com.np/static/*
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month

Rule 3: *.manishsteelfurniture.com.np/*
- Always Use HTTPS: ON
```

### **2. Image Optimization**
```bash
# Use Cloudflare's FREE image optimization
# Automatically resizes and compresses images
# Serves WebP format to supported browsers
```

### **3. Minification & Compression**
```bash
# Cloudflare automatically:
# - Minifies CSS, JS, HTML
# - Applies Brotli/Gzip compression
# - Removes unnecessary characters
```

## 🔐 **Security Features (FREE)**

### **1. DDoS Protection**
```
Cloudflare provides FREE:
- Unlimited DDoS protection
- Rate limiting (basic)
- Bot protection
```

### **2. SSL Certificate**
```
Cloudflare provides FREE:
- Universal SSL certificate
- Automatic renewal
- TLS 1.3 support
```

### **3. Firewall Rules**
```bash
# 5 FREE firewall rules available
# Example rules:
1. Block traffic from specific countries (if needed)
2. Rate limit login attempts
3. Block malicious bots
```

## 📈 **SEO Optimization (FREE)**

### **1. Sitemap Generation**
```javascript
// Add to your React app
npm install react-router-sitemap

// Generate sitemap automatically
// Upload to /public/sitemap.xml
```

### **2. Meta Tags Optimization**
```javascript
// Update public/index.html
<meta name="description" content="Premium steel furniture in Nepal. Quality office and household furniture at affordable prices in Biratnagar, Dharan, Itahari.">
<meta name="keywords" content="steel furniture nepal, furniture biratnagar, office furniture nepal">
<meta property="og:title" content="Manish Steel Furniture - Quality Furniture Nepal">
<meta property="og:url" content="https://manishsteelfurniture.com.np">
```

### **3. Structured Data**
```json
{
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "name": "Shree Manish Steel Furniture",
  "url": "https://manishsteelfurniture.com.np",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Dharan Rd",
    "addressLocality": "Biratnagar",
    "postalCode": "56613",
    "addressCountry": "NP"
  }
}
```

## 🎯 **Cost Breakdown**

```
Frontend Hosting (Vercel): $0/month
Backend Hosting (Render): $0/month  
Database (MongoDB Atlas): $0/month (512MB free)
CDN (Cloudflare): $0/month
SSL Certificate: $0/month
Domain: ~$15/year (already owned)
Monitoring: $0/month
Analytics: $0/month

TOTAL MONTHLY COST: $0
TOTAL YEARLY COST: $15 (domain only)
```

## ⚡ **Performance Expectations**

### **With FREE Tier Limitations:**
```
✅ 99.9% uptime (Cloudflare + Vercel)
✅ Global CDN (200+ locations)
✅ Fast loading (< 2 seconds)
⚠️  Backend may sleep (Render free tier)
⚠️  15-30 second cold start after sleep
✅ Automatic scaling
✅ SSL/HTTPS everywhere
```

## 🔄 **Backup Strategy (FREE)**

### **1. Code Backup**
```bash
# GitHub (FREE private repos)
- Automatic commits
- Version history
- Branch protection
```

### **2. Database Backup**
```bash
# MongoDB Atlas (FREE)
- Automatic daily backups
- Point-in-time recovery (7 days)
```

### **3. Content Backup**
```bash
# Google Drive API (FREE 15GB)
- Weekly exports
- Automated backups
```

## 🚨 **Important Notes**

### **Render FREE Tier Limitations:**
```
- Sleeps after 15 minutes of inactivity
- 750 hours/month usage limit
- Cold start takes 15-30 seconds
- 512MB RAM limit
```

### **Solutions for Limitations:**
```bash
# 1. Keep backend awake with cron job
# Create a FREE cron job at cron-job.org
# Ping your API every 14 minutes

# 2. Show loading message for cold starts
"Please wait, waking up server..." (15-30 seconds)

# 3. Consider Vercel Functions for critical APIs
# Vercel Functions are instant (no cold start)
```

## 📱 **Mobile Optimization (FREE)**

### **Progressive Web App**
```javascript
// Add service worker for offline functionality
// Enable install prompt
// Cache critical resources
```

### **Performance Testing**
```bash
# Use FREE tools:
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse (built into Chrome)
```

## 🎉 **Final Checklist**

- [ ] Cloudflare account created
- [ ] Domain nameservers updated
- [ ] Vercel project deployed
- [ ] Render service deployed  
- [ ] DNS records configured
- [ ] SSL enabled
- [ ] CORS updated
- [ ] Environment variables set
- [ ] Monitoring setup
- [ ] Analytics installed
- [ ] SEO optimized
- [ ] Backup configured

## 🔧 **Troubleshooting**

### **Common Issues:**
```bash
1. "Domain not working" 
   → Check nameserver propagation (24-48 hours)

2. "API not accessible"
   → Verify CORS settings and DNS records

3. "SSL errors"
   → Set Cloudflare to "Full (Strict)" mode

4. "Slow backend response"
   → Render free tier is sleeping, implementing wake-up ping
```

This setup gives you a **completely FREE professional website** with:
- Custom domain
- Global CDN
- SSL certificate  
- DDoS protection
- Automatic backups
- Performance optimization
- SEO tools
- Monitoring

**Total cost: $0/month** (only domain renewal ~$15/year)
