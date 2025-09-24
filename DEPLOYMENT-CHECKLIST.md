# 🚀 DEPLOYMENT CHECKLIST - manishsteelfurniture.com.np

## ✅ Phase 1: Prepare Project (COMPLETED)
- [x] Run setup script
- [x] Build React app  
- [x] Create production configs
- [x] Update SEO settings

## 📋 Phase 2: Deploy Services (DO THIS FIRST)

### Vercel Deployment (Frontend)
```bash
# 1. Go to https://vercel.com
# 2. Sign up with GitHub
# 3. Import your repository
# 4. Configure:

Project Name: manish-steel-furniture
Framework: Create React App
Root Directory: manish-steel-final
Build Command: npm run build
Output Directory: build
```

### Render Deployment (Backend)  
```bash
# 1. Go to https://render.com
# 2. Sign up with GitHub
# 3. Create Web Service
# 4. Configure:

Name: manish-steel-api
Root Directory: server
Build Command: npm install  
Start Command: node server.js
Environment: Node
Plan: Free
```

## 🌐 Phase 3: Get Real DNS Values

### From Vercel Dashboard:
1. **Add Domain:** `manishsteelfurniture.com.np`
2. **Vercel Shows:** 
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   
   Type: A
   Name: @  
   Value: 76.223.126.88
   ```

3. **Add WWW Domain:** `www.manishsteelfurniture.com.np`  
4. **Vercel Shows:**
   ```
   Type: CNAME
   Name: www
   Value: manish-steel-furniture-xyz.vercel.app
   ```

### From Render Dashboard:
1. **Add Custom Domain:** `api.manishsteelfurniture.com.np`
2. **Render Shows:**
   ```
   CNAME: api.manishsteelfurniture.com.np
   Points to: manish-steel-api-abc123.onrender.com
   ```

## ☁️ Phase 4: Setup Cloudflare  

### Sign Up & Add Domain
1. Go to https://cloudflare.com
2. Create free account
3. Click "+ Add Site"
4. Enter: `manishsteelfurniture.com.np`
5. Choose FREE plan

### Add DNS Records (Use REAL values from Phase 3)
| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | @ | `76.76.19.61` | 🟠 Proxied |
| A | @ | `76.223.126.88` | 🟠 Proxied |
| CNAME | www | `[FROM VERCEL]` | 🟠 Proxied |
| CNAME | api | `[FROM RENDER]` | 🟠 Proxied |

### Update Nameservers
Cloudflare will show nameservers like:
```
ns1.cloudflare.com
ns2.cloudflare.com
```
Update these at your domain registrar.

## 🔧 Phase 5: Configure Settings

### Vercel Environment Variables
```
REACT_APP_API_URL=https://api.manishsteelfurniture.com.np
REACT_APP_SITE_URL=https://manishsteelfurniture.com.np
GENERATE_SOURCEMAP=false
```

### Render Environment Variables  
```
MONGODB_URI=your_mongodb_uri
FRONTEND_URL=https://manishsteelfurniture.com.np
CORS_ORIGIN=https://manishsteelfurniture.com.np,https://www.manishsteelfurniture.com.np
NODE_ENV=production
```

### Cloudflare Settings
- **SSL:** Full (Strict)
- **Auto Minify:** CSS, JS, HTML ✅
- **Brotli:** ✅  
- **Always HTTPS:** ✅

## 🧪 Phase 6: Testing

### Test Commands
```bash
# Make testing script executable
chmod +x test-domain-setup.sh

# Run tests  
./test-domain-setup.sh

# Manual tests
curl -I https://manishsteelfurniture.com.np
curl -I https://www.manishsteelfurniture.com.np
curl -I https://api.manishsteelfurniture.com.np
```

## ⏰ Timeline

| Phase | Time | Status |
|-------|------|--------|
| 1. Project Setup | 5 min | ✅ DONE |
| 2. Deploy Services | 10 min | 🔲 TODO |  
| 3. Get DNS Values | 2 min | 🔲 TODO |
| 4. Cloudflare Setup | 8 min | 🔲 TODO |
| 5. Configure Settings | 5 min | 🔲 TODO |
| 6. Testing | 3 min | 🔲 TODO |
| **DNS Propagation** | **24-48h** | **⏳ AUTO** |

## 💰 Cost: $0/month (100% FREE)

## 🆘 Need Help?
- **Detailed Guide:** `CORRECT-DNS-SETUP.md`
- **DNS Config:** `CLOUDFLARE-DNS-CONFIG.md`  
- **Full Guide:** `FREE-HOSTING-GUIDE.md`

---

**Next Step:** Deploy to Vercel & Render to get real CNAME values!
