# ✅ Deployment Checklist

Quick reference checklist for Vercel deployment.

---

## 🎯 Before You Start

- [ ] Have a Vercel account (https://vercel.com)
- [ ] Have MongoDB Atlas database ready
- [ ] Have Cloudinary account set up
- [ ] Have GitHub repository (optional but recommended)
- [ ] Know your frontend and backend URLs

---

## 📦 Backend Deployment (Deploy First!)

### Preparation
- [x] `server/index.js` exists (entry point)
- [x] `server/vercel.json` configured
- [x] `server/package.json` has all dependencies
- [x] `server/.env.example` template ready
- [ ] MongoDB connection string ready
- [ ] Cloudinary credentials ready
- [ ] JWT secret generated (min 32 characters)

### Deploy Steps
1. [ ] Go to https://vercel.com/new
2. [ ] Import your repository
3. [ ] Set **Root Directory** to `server`
4. [ ] Set **Framework Preset** to "Other"
5. [ ] Add environment variables:
   - [ ] `MONGO_URI`
   - [ ] `JWT_SECRET`
   - [ ] `CLOUDINARY_CLOUD_NAME`
   - [ ] `CLOUDINARY_API_KEY`
   - [ ] `CLOUDINARY_API_SECRET`
   - [ ] `NODE_ENV=production`
   - [ ] `ALLOWED_ORIGINS` (temporary: `*`)
6. [ ] Click "Deploy"
7. [ ] Wait for build to complete
8. [ ] **Copy backend URL**: ________________

### Verify Backend
- [ ] Test: `https://your-backend.vercel.app/api/health`
- [ ] Test: `https://your-backend.vercel.app/api/products`
- [ ] Check Vercel logs for errors
- [ ] Verify database connection works

---

## 🎨 Frontend Deployment (Deploy Second!)

### Preparation
- [x] `manish-steel-final/package.json` configured
- [x] `manish-steel-final/vercel.json` configured
- [ ] Backend URL from previous step: ________________

### Update Environment Variables
1. [ ] Edit `manish-steel-final/.env.production`:
   ```bash
   REACT_APP_API_URL=https://YOUR-BACKEND-URL.vercel.app/api
   ```
2. [ ] Commit changes to git (if using GitHub)

### Deploy Steps
1. [ ] Go to https://vercel.com/new
2. [ ] Import your repository (or create new project)
3. [ ] Set **Root Directory** to `manish-steel-final`
4. [ ] Set **Framework Preset** to "Create React App"
5. [ ] Confirm **Build Command**: `npm run build`
6. [ ] Confirm **Output Directory**: `build`
7. [ ] Add environment variables:
   - [ ] `REACT_APP_API_URL=https://your-backend.vercel.app/api`
   - [ ] `REACT_APP_NAME=Manish Steel Furniture`
   - [ ] `GENERATE_SOURCEMAP=false`
8. [ ] Click "Deploy"
9. [ ] Wait for build to complete
10. [ ] **Copy frontend URL**: ________________

### Verify Frontend
- [ ] Open frontend URL in browser
- [ ] Homepage loads correctly
- [ ] Products page works
- [ ] Images display properly
- [ ] Check browser console (no errors)
- [ ] Test on mobile device

---

## 🔄 Update CORS Settings

After frontend is deployed:

1. [ ] Go to backend Vercel project
2. [ ] Navigate to Settings → Environment Variables
3. [ ] Update `ALLOWED_ORIGINS`:
   ```
   https://your-frontend.vercel.app,https://www.your-frontend.vercel.app,http://localhost:3000
   ```
4. [ ] Save changes (Vercel will auto-redeploy)
5. [ ] Wait for redeployment
6. [ ] Test frontend again

---

## 🌐 Custom Domain Setup (Optional)

### For Frontend
1. [ ] Go to frontend project → Settings → Domains
2. [ ] Add domain: `manishsteelfurniture.com.np`
3. [ ] Follow DNS instructions
4. [ ] Wait for DNS propagation (5-30 mins)
5. [ ] Test custom domain

### For Backend
1. [ ] Go to backend project → Settings → Domains
2. [ ] Add domain: `api.manishsteelfurniture.com.np`
3. [ ] Update DNS records
4. [ ] Update frontend environment variable:
   ```
   REACT_APP_API_URL=https://api.manishsteelfurniture.com.np/api
   ```
5. [ ] Redeploy frontend

---

## ✅ Final Verification

### Test All Features
- [ ] Homepage displays correctly
- [ ] Product listing works
- [ ] Product details page works
- [ ] Category filtering works
- [ ] Search functionality works
- [ ] Contact form submits
- [ ] Admin login works
- [ ] Admin panel accessible
- [ ] Image uploads work (admin)
- [ ] All images load from Cloudinary

### Performance Check
- [ ] Page loads in < 3 seconds
- [ ] Images are optimized
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Works on different browsers

### Security Check
- [ ] `.env` files not in git
- [ ] Environment variables set in Vercel only
- [ ] CORS properly configured
- [ ] API endpoints secured
- [ ] Admin routes protected

---

## 🐛 Common Issues & Fixes

### Backend 500 Error
```bash
✗ Problem: Internal server error
✓ Fix: Check Vercel logs, verify MONGO_URI and credentials
```

### Frontend Shows Blank Page
```bash
✗ Problem: Blank page after deployment
✓ Fix: Check build logs, verify REACT_APP_API_URL is correct
```

### CORS Error in Browser
```bash
✗ Problem: CORS policy error
✓ Fix: Update ALLOWED_ORIGINS in backend to include frontend URL
```

### Images Don't Load
```bash
✗ Problem: Images show broken
✓ Fix: Verify Cloudinary credentials, check image URLs
```

### API Calls Fail
```bash
✗ Problem: Network errors
✓ Fix: Verify REACT_APP_API_URL matches backend URL exactly
```

---

## 📊 Your Deployment URLs

**Backend API:**
- Development: `http://localhost:5000`
- Production: `https://________________.vercel.app`
- Custom Domain: `https://api.________________.com`

**Frontend:**
- Development: `http://localhost:3000`
- Production: `https://________________.vercel.app`
- Custom Domain: `https://________________.com`

---

## 🎉 Success Criteria

Your deployment is successful when ALL these work:

✅ Backend health check responds  
✅ Frontend homepage loads  
✅ Products display with images  
✅ Category navigation works  
✅ Search functions correctly  
✅ Admin login successful  
✅ Forms submit properly  
✅ No console errors  
✅ Mobile version works  
✅ Custom domain active (if configured)  

---

## 📞 Resources

- **Full Guide**: `VERCEL-DEPLOYMENT-GUIDE.md`
- **Verification Script**: `./verify-deployment-ready.sh`
- **Vercel Docs**: https://vercel.com/docs
- **Support**: https://vercel.com/support

---

**Deployment Date:** ________________  
**Backend URL:** ________________  
**Frontend URL:** ________________  
**Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Complete  

---

**Last Updated:** November 19, 2025
