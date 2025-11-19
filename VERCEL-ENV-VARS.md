# 🔐 VERCEL ENVIRONMENT VARIABLES

## Copy These Exact Values to Vercel Dashboard

When creating your new Vercel project, add these environment variables in **Settings → Environment Variables**:

---

### 1. MONGO_URI
```
mongodb+srv://manish-steel:Manishsteel@manish-steel-cluster.1cxhr9g.mongodb.net/manish-steel?retryWrites=true&w=majority&appName=manish-steel-cluster
```
**Description:** MongoDB Atlas connection string

---

### 2. JWT_SECRET
```
mysecrettoken
```
**⚠️ WARNING:** This is a weak secret! 

**Recommended:** Generate a stronger one:
```bash
# Run this in terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

For now, use: `mysecrettoken` (but change it later!)

---

### 3. CLOUDINARY_CLOUD_NAME
```
dwrrja8cz
```

---

### 4. CLOUDINARY_API_KEY
```
747568555475638
```

---

### 5. CLOUDINARY_API_SECRET
```
ps6vt8q6mtzu2vIPeHEBNFFnkFY
```

---

### 6. NODE_ENV
```
production
```

---

### 7. ALLOWED_ORIGINS
```
*
```
**Note:** Use `*` for now. After deployment, update to your actual frontend URL:
```
https://www.manishsteelfurniture.com.np,https://manishsteelfurniture.com.np
```

---

### 8. PORT (Optional - Vercel auto-assigns)
```
5000
```
**Note:** Not needed for Vercel, but won't hurt if added.

---

## 📋 QUICK COPY-PASTE FORMAT

For Vercel Dashboard (one per line):

```
Name: MONGO_URI
Value: mongodb+srv://manish-steel:Manishsteel@manish-steel-cluster.1cxhr9g.mongodb.net/manish-steel?retryWrites=true&w=majority&appName=manish-steel-cluster

Name: JWT_SECRET
Value: mysecrettoken

Name: CLOUDINARY_CLOUD_NAME
Value: dwrrja8cz

Name: CLOUDINARY_API_KEY
Value: 747568555475638

Name: CLOUDINARY_API_SECRET
Value: ps6vt8q6mtzu2vIPeHEBNFFnkFY

Name: NODE_ENV
Value: production

Name: ALLOWED_ORIGINS
Value: *
```

---

## 🎯 HOW TO ADD IN VERCEL

### During Project Creation:
1. After selecting repository and root directory
2. Click **"Environment Variables"** section
3. For each variable:
   - **Name:** (e.g., `MONGO_URI`)
   - **Value:** (paste the value)
   - **Environment:** Select "Production" (default)
   - Click **"Add"**
4. Repeat for all 7 variables

### After Project Creation:
1. Go to project **Settings**
2. Click **"Environment Variables"**
3. Click **"Add New"**
4. Enter **Name** and **Value**
5. Click **"Save"**
6. Redeploy after adding all

---

## ✅ VERIFICATION CHECKLIST

After adding all variables:

- [ ] MONGO_URI - Contains `mongodb+srv://`
- [ ] JWT_SECRET - At least 10 characters
- [ ] CLOUDINARY_CLOUD_NAME - Set to `dwrrja8cz`
- [ ] CLOUDINARY_API_KEY - Set to `747568555475638`
- [ ] CLOUDINARY_API_SECRET - Set to `ps6vt8q6mtzu2vIPeHEBNFFnkFY`
- [ ] NODE_ENV - Set to `production`
- [ ] ALLOWED_ORIGINS - Set to `*`

---

## 🔒 SECURITY NOTES

### After Deployment Works:

1. **Update ALLOWED_ORIGINS:**
   ```
   https://www.manishsteelfurniture.com.np,https://manishsteelfurniture.com.np,http://localhost:3000
   ```

2. **Consider Stronger JWT_SECRET:**
   Generate a new one with:
   ```bash
   openssl rand -base64 32
   ```
   Or:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Rotate Cloudinary Keys** (if exposed publicly):
   - Go to Cloudinary Dashboard
   - Settings → Security
   - Regenerate API Secret

---

## 📊 SUMMARY

**Total Variables:** 7 (8 with optional PORT)  
**Required:** All 7 are required  
**Sensitive:** MONGO_URI, JWT_SECRET, CLOUDINARY_API_SECRET  

**Status:** ✅ All values found and ready to use!

---

## 🚀 NEXT STEPS

1. Copy these values
2. Delete old Vercel project
3. Create new project with Root Directory = `server`
4. Add all 7 environment variables
5. Deploy
6. Test: `https://your-backend.vercel.app/api/health`
7. Success! 🎉

---

**⚠️ IMPORTANT:** Never commit these values to Git!  
They should only exist in:
- Your local `.env` file
- Vercel Dashboard (Environment Variables)

---

**Last Updated:** November 19, 2025  
**Source:** `/home/manish/Manish-steel/server/.env`
