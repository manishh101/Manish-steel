# 🔄 FRONTEND BACKEND CONNECTION UPDATE

## ✅ FRONTEND UPDATED!

I've updated your frontend configuration to connect to your backend.

### Updated File:
`manish-steel-final/.env.production`

### New Backend URL:
```
REACT_APP_API_URL=https://manish-steel.vercel.app/api
```

---

## 📋 WHAT TO DO NOW:

### Step 1: Commit and Push Frontend Changes
```bash
cd /home/manish/Manish-steel
git add manish-steel-final/.env.production
git commit -m "Update: Connect frontend to deployed backend"
git push origin main
```

### Step 2: Update Backend ALLOWED_ORIGINS

Go to your **backend** Vercel project settings:

1. **Go to:** https://vercel.com/dashboard
2. **Select:** manish-steel (backend project)
3. **Navigate:** Settings → Environment Variables
4. **Find:** `ALLOWED_ORIGINS`
5. **Update value to:**
   ```
   https://www.manishsteelfurniture.com.np,https://manishsteelfurniture.com.np,http://localhost:3000
   ```
6. **Click:** Save
7. **Wait:** Vercel will auto-redeploy (~2 minutes)

### Step 3: Redeploy Frontend

After pushing the changes:
1. Go to your **frontend** Vercel project
2. It will auto-deploy when you push to GitHub
3. **OR** manually: Deployments → Click "Redeploy"

---

## 🧪 TESTING

### Test Backend:
```
https://manish-steel.vercel.app/api/health
```
**Expected:** `{"status":"ok","message":"API is running"}`

### Test Frontend:
```
https://www.manishsteelfurniture.com.np
```
**Expected:** 
- ✅ Products load
- ✅ No CORS errors
- ✅ No 404 errors
- ✅ Images display

---

## 🔍 VERIFY CONNECTION

Open browser console (F12) on your website and check:

**Before Fix:**
```
❌ CORS policy error
❌ Failed to load resource: 404
❌ Network Error
```

**After Fix:**
```
✅ 200 OK
✅ Products loaded
✅ No errors
```

---

## 📊 CONFIGURATION SUMMARY

### Backend (manish-steel.vercel.app):
- **URL:** https://manish-steel.vercel.app
- **API Endpoints:** /api/health, /api/products, etc.
- **ALLOWED_ORIGINS:** Update to include frontend domains

### Frontend (www.manishsteelfurniture.com.np):
- **URL:** https://www.manishsteelfurniture.com.np
- **API URL:** https://manish-steel.vercel.app/api
- **Status:** ✅ Updated in .env.production

---

## 🚀 QUICK COMMANDS

```bash
# Push frontend changes
cd /home/manish/Manish-steel
git add manish-steel-final/.env.production
git commit -m "Update: Connect frontend to backend at manish-steel.vercel.app"
git push origin main

# Then update ALLOWED_ORIGINS in Vercel dashboard (backend project)
```

---

## ⚠️ IMPORTANT NOTES

1. **Backend MUST update ALLOWED_ORIGINS** or you'll still get CORS errors
2. **Frontend will auto-deploy** when you push to GitHub
3. **Test both** backend and frontend after deployment
4. **Clear browser cache** if you see old errors

---

## ✅ CHECKLIST

- [x] Frontend `.env.production` updated with backend URL
- [ ] Push frontend changes to GitHub
- [ ] Update backend `ALLOWED_ORIGINS` in Vercel
- [ ] Wait for auto-deployment (2-3 minutes)
- [ ] Test backend: https://manish-steel.vercel.app/api/health
- [ ] Test frontend: https://www.manishsteelfurniture.com.np
- [ ] Verify no CORS errors in browser console
- [ ] Verify products load correctly

---

**Next:** Run the git commands above to push your changes!
