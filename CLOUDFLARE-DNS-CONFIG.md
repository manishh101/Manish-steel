# Cloudflare DNS Configuration for manishsteelfurniture.com.np

## DNS Records to Add in Cloudflare Dashboard

### Step 1: A Records
| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| A | @ | 76.76.19.61 | Proxied 🟠 | Auto |
| A | api | 216.24.57.1 | Proxied 🟠 | Auto |

### Step 2: CNAME Records  
| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| CNAME | www | cname.vercel-dns.com | Proxied 🟠 | Auto |

### Step 3: Verification Records (Optional but recommended)
| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| TXT | @ | v=spf1 include:_spf.google.com ~all | DNS Only ☁️ | Auto |

## SSL/TLS Settings

### Step 1: Navigate to SSL/TLS → Overview
- Set SSL/TLS encryption mode: **Full (strict)**

### Step 2: Navigate to SSL/TLS → Edge Certificates
- ✅ Always Use HTTPS: **ON**
- ✅ HTTP Strict Transport Security (HSTS): **Enable**
- ✅ Minimum TLS Version: **1.2**
- ✅ Opportunistic Encryption: **ON**
- ✅ TLS 1.3: **ON**
- ✅ Automatic HTTPS Rewrites: **ON**
- ✅ Certificate Transparency Monitoring: **ON**

## Speed Settings

### Step 1: Navigate to Speed → Optimization
- ✅ Auto Minify CSS: **ON**
- ✅ Auto Minify HTML: **ON**  
- ✅ Auto Minify JavaScript: **ON**
- ✅ Brotli: **ON**

### Step 2: Navigate to Caching → Configuration
- Browser Cache TTL: **1 year**
- Caching Level: **Standard**

## Page Rules (FREE plan allows 3 rules)

### Rule 1: Cache Everything
- URL: `*manishsteelfurniture.com.np/static/*`
- Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 year
  - Browser Cache TTL: 1 year

### Rule 2: API Caching
- URL: `api.manishsteelfurniture.com.np/api/products*`
- Settings:
  - Cache Level: Cache Everything  
  - Edge Cache TTL: 1 hour
  - Browser Cache TTL: 30 minutes

### Rule 3: Always Use HTTPS
- URL: `*manishsteelfurniture.com.np/*`
- Settings:
  - Always Use HTTPS: ON

## Security Settings

### Step 1: Navigate to Security → WAF
- Security Level: **Medium**
- ✅ Bot Fight Mode: **ON** (FREE)
- ✅ Challenge Passage: **30 minutes**

### Step 2: Navigate to Security → DDoS
- DDoS protection is automatic and included in FREE plan

## Analytics Setup

### Step 1: Navigate to Analytics & Logs → Web Analytics
- ✅ Enable Cloudflare Web Analytics: **ON**
- Add JavaScript beacon to your site (automatically handled)

## Mobile Optimization

### Step 1: Navigate to Speed → Optimization
- ✅ Rocket Loader™: **ON** (Improves JS loading)
- ✅ Mirage: **ON** (Image optimization - if available in FREE plan)

## Custom Domain Setup Commands

### For Vercel (Frontend)
```bash
# Add custom domains in Vercel dashboard:
# 1. manishsteelfurniture.com.np
# 2. www.manishsteelfurniture.com.np

# Environment variables to add in Vercel:
REACT_APP_API_URL=https://api.manishsteelfurniture.com.np
REACT_APP_SITE_URL=https://manishsteelfurniture.com.np
```

### For Render (Backend)  
```bash
# Add custom domain in Render dashboard:
# api.manishsteelfurniture.com.np

# Environment variables to add in Render:
FRONTEND_URL=https://manishsteelfurniture.com.np
CORS_ORIGIN=https://manishsteelfurniture.com.np,https://www.manishsteelfurniture.com.np
NODE_ENV=production
```

## Testing Commands

### Check DNS Propagation
```bash
# Check if DNS is working
nslookup manishsteelfurniture.com.np
nslookup www.manishsteelfurniture.com.np  
nslookup api.manishsteelfurniture.com.np

# Check SSL certificate
curl -I https://manishsteelfurniture.com.np
curl -I https://api.manishsteelfurniture.com.np
```

### Test Website Performance
```bash
# Test main site
curl -s -w "Connect: %{time_connect} TTFB: %{time_starttransfer} Total: %{time_total}\n" https://manishsteelfurniture.com.np

# Test API endpoint
curl -s https://api.manishsteelfurniture.com.np/api/products | head -c 200
```

## Monitoring Setup

### Cloudflare Analytics (FREE)
- Real-time traffic analytics
- Security threat monitoring  
- Performance insights
- Geographic data

### Uptime Monitoring (Optional FREE tools)
- UptimeRobot.com (50 monitors free)
- StatusCake.com (10 tests free)
- Pingdom (1 test free)

## Troubleshooting

### Common Issues

1. **DNS not resolving**
   - Wait 24-48 hours for full propagation
   - Clear browser cache
   - Use different DNS (8.8.8.8, 1.1.1.1)

2. **SSL certificate issues**
   - Ensure SSL mode is "Full (strict)"
   - Wait for certificate provisioning (up to 15 minutes)

3. **404 errors on refresh**
   - Check Vercel redirects in vercel.json
   - Ensure SPA routing is configured

4. **API not accessible**
   - Verify Render app is running
   - Check CORS settings
   - Verify DNS CNAME record

### Performance Optimization Checklist

- ✅ Cloudflare proxy enabled (orange cloud)
- ✅ Auto minification enabled
- ✅ Brotli compression enabled  
- ✅ Browser caching configured
- ✅ Image optimization enabled
- ✅ CDN caching rules set
- ✅ GZIP compression enabled (automatic)

## Expected Performance

### Speed Improvements with Cloudflare
- **Global CDN**: 200+ locations worldwide
- **Page Load Time**: 40-60% faster
- **Time to First Byte**: 50-70% improvement  
- **SEO Score**: +15-20 points
- **Mobile Performance**: +25-30% faster

### Cost Breakdown
- Cloudflare: **$0/month** (FREE plan)
- Vercel: **$0/month** (Hobby plan - 100GB bandwidth)
- Render: **$0/month** (Free plan - 750 hours)
- Domain: **Already owned**
- **Total: $0/month** 🎉

---

**Ready to implement? Run the setup script:**
```bash
chmod +x setup-free-hosting.sh
./setup-free-hosting.sh
```
