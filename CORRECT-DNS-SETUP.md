# 🎯 CORRECT STEP-BY-STEP: Getting Vercel CNAME Records

## Phase 1: Deploy to Vercel (5 minutes)

### Step 1.1: Go to Vercel
1. Visit: https://vercel.com
2. Click "Sign Up" 
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub

### Step 1.2: Import Your Project
1. Click "Add New..." → "Project"
2. Find your repository: `Manish-steel` or `manishh101/Manish-steel`
3. Click "Import"

### Step 1.3: Configure Deployment
```
Project Name: manish-steel-furniture
Framework Preset: Create React App
Root Directory: manish-steel-final/
Build Command: npm run build
Output Directory: build/
Install Command: npm install
```

### Step 1.4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build
3. You'll get a URL like: `https://manish-steel-furniture.vercel.app`

## Phase 2: Add Custom Domain (Get CNAME)

### Step 2.1: Add Your Domain
1. Go to your project dashboard
2. Click "Settings" tab
3. Click "Domains" in sidebar
4. Click "Add Domain"
5. Enter: `manishsteelfurniture.com.np`
6. Click "Add"

### Step 2.2: Get Your CNAME Record
After adding the domain, Vercel will show:

```
To configure your domain, add these DNS records:

Type: CNAME
Name: @
Value: cname.vercel-dns.com

OR it might show a specific subdomain like:

Type: CNAME  
Name: @
Value: your-project-name.vercel.app
```

### Step 2.3: Add WWW Domain
1. Click "Add Domain" again
2. Enter: `www.manishsteelfurniture.com.np`
3. Vercel will show another CNAME record

## Phase 3: Real DNS Configuration

### What Vercel Actually Gives You:

**Option A - Generic Vercel DNS:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Option B - Project-Specific:**
```
Type: CNAME
Name: www  
Value: manish-steel-furniture-xyz123.vercel.app
```

**Option C - A Records (More Common):**
```
Type: A
Name: @
Value: 76.76.19.61

Type: A  
Name: @
Value: 76.223.126.88
```

### Updated DNS Records for Cloudflare:

| Type | Name | Content | Proxy | Notes |
|------|------|---------|--------|-------|
| A | @ | `76.76.19.61` | 🟠 | Main domain |
| A | @ | `76.223.126.88` | 🟠 | Backup IP |
| CNAME | www | `[GET FROM VERCEL]` | 🟠 | WWW redirect |
| CNAME | api | `[GET FROM RENDER]` | 🟠 | Backend API |

## Phase 4: Backend - Render Setup

### Step 4.1: Deploy Backend First
1. Go to: https://render.com
2. Sign up with GitHub
3. Click "New Web Service"
4. Select your repository
5. Configure:
   ```
   Name: manish-steel-api
   Root Directory: server
   Build Command: npm install
   Start Command: node server.js
   ```

### Step 4.2: Get Render URL
After deployment, you'll get:
```
Your service URL: https://manish-steel-api-abc123.onrender.com
```

### Step 4.3: Add Custom Domain to Render
1. Go to service dashboard
2. Click "Settings" → "Custom Domains"
3. Add: `api.manishsteelfurniture.com.np`
4. Render will give you a CNAME like:
   ```
   CNAME: api → manish-steel-api-abc123.onrender.com
   ```

## ✅ CORRECTED Setup Process

### 1. First: Deploy Both Services
- Deploy React app to Vercel
- Deploy Node.js API to Render

### 2. Then: Get Real DNS Values
- Copy exact CNAME from Vercel dashboard
- Copy exact CNAME from Render dashboard

### 3. Finally: Configure Cloudflare DNS
Use the REAL values you got from step 2
