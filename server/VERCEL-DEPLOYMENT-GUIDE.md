# Backend Deployment Guide - Vercel

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **Vercel CLI**: Install globally
   ```bash
   npm install -g vercel
   ```

## Step-by-Step Deployment

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Test Locally

```bash
# Start the server locally
npm run dev

# Test API endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/products
```

### Step 3: Login to Vercel

```bash
vercel login
```

### Step 4: Deploy to Vercel

```bash
# Deploy to production
vercel --prod

# Or deploy to preview environment first
vercel
```

### Step 5: Set Environment Variables

After deployment, set the required environment variables in Vercel Dashboard:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ALLOWED_ORIGINS=https://manishsteelfurniture.com.np,https://www.manishsteelfurniture.com.np
NODE_ENV=production
```

**Or use CLI:**

```bash
vercel env add MONGO_URI production
vercel env add JWT_SECRET production
vercel env add CLOUDINARY_CLOUD_NAME production
vercel env add CLOUDINARY_API_KEY production
vercel env add CLOUDINARY_API_SECRET production
```

### Step 6: Update Frontend API URL

Update the API base URL in your frontend to point to the new Vercel deployment:

```javascript
// manish-steel-final/src/config/api.js or similar
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  'https://your-project-name.vercel.app';
```

### Step 7: Test Production Deployment

```bash
# Test the deployed API
curl https://your-project-name.vercel.app/api/health
curl https://your-project-name.vercel.app/api/products
```

## Vercel CLI Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove a deployment
vercel rm <deployment-url>

# View project info
vercel inspect

# Pull environment variables
vercel env pull
```

## Troubleshooting

### Issue: Cold Start Delays

**Solution**: Vercel serverless functions have minimal cold starts compared to Render. The first request might take ~500ms, but subsequent requests will be <100ms.

### Issue: Database Connection Errors

**Solution**: 
1. Ensure MongoDB connection string is correct
2. Whitelist Vercel IPs in MongoDB Atlas (or allow all: 0.0.0.0/0)
3. Check connection logs: `vercel logs`

### Issue: CORS Errors

**Solution**: 
1. Update `ALLOWED_ORIGINS` environment variable
2. Verify frontend URL is included in the list
3. Check vercel.json CORS headers

### Issue: Large File Uploads Fail

**Solution**: 
- Vercel has a 4.5MB request body limit
- Use Cloudinary direct upload for images
- Already implemented in your project

### Issue: Function Timeout

**Solution**: 
- Free tier: 10 seconds max
- Pro tier: 60 seconds max
- Optimize database queries
- Use indexes (already implemented)

## Performance Monitoring

### Vercel Analytics (Free)

1. Go to your project dashboard
2. Click **Analytics** tab
3. View real-time performance metrics

### Custom Monitoring

Add response time logging to your API:

```javascript
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

## Cost Estimation

### Vercel Free Tier (Hobby)
- **Bandwidth**: 100GB/month
- **Serverless Functions**: Unlimited invocations
- **Execution Time**: 100GB-hours
- **Max Duration**: 10 seconds per function
- **Memory**: 1GB per function
- **Builds**: 6000 minutes/month

### Expected Usage (Small Website)
- Monthly bandwidth: ~5-10GB
- Function invocations: ~50,000-100,000
- Execution time: ~10-20GB-hours
- **Cost**: $0 (within free tier)

### When to Upgrade to Pro ($20/month)
- More than 100GB bandwidth
- Need longer function execution time (60s)
- Need team collaboration
- Need advanced analytics

## Rollback Strategy

If something goes wrong, rollback to previous deployment:

```bash
# List deployments
vercel ls

# Find the previous working deployment
# Click on it in Vercel dashboard and select "Promote to Production"
# Or use CLI
vercel alias set <previous-deployment-url> production
```

## Continuous Deployment

### Option 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. In Vercel Dashboard:
   - Click **New Project**
   - Import from GitHub
   - Select repository
   - Configure build settings:
     - Framework Preset: Other
     - Root Directory: `server`
     - Build Command: (leave empty)
     - Output Directory: (leave empty)
   - Deploy

Now every push to `main` branch will auto-deploy!

### Option 2: CLI Deployment

```bash
# Create deployment script
cat > deploy.sh << 'EOF'
#!/bin/bash
cd server
npm install
vercel --prod
EOF

chmod +x deploy.sh
./deploy.sh
```

## Migration from Render

### Current Setup (Render)
- ❌ Cold starts: 20-30 seconds
- ❌ Limited free tier hours
- ❌ Slower performance

### New Setup (Vercel)
- ✅ Minimal cold starts: <500ms
- ✅ Generous free tier
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Easy rollback

### Migration Steps

1. ✅ Deploy to Vercel (follow steps above)
2. ✅ Test Vercel deployment
3. ✅ Update frontend API URL
4. ✅ Test end-to-end functionality
5. ✅ Monitor for 24 hours
6. ✅ Delete Render deployment (optional)

## Best Practices

1. **Use Environment Variables**: Never commit secrets
2. **Enable Caching**: Already implemented in middleware
3. **Monitor Logs**: Use `vercel logs` regularly
4. **Test Before Production**: Deploy to preview first
5. **Keep Dependencies Updated**: Run `npm audit` regularly
6. **Use Compression**: Already implemented
7. **Optimize Database Queries**: Use `.lean()` and indexes
8. **Set Appropriate Cache Headers**: Already configured

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Community**: https://github.com/vercel/vercel/discussions
- **Status Page**: https://vercel-status.com

## Next Steps

1. ✅ Deploy backend to Vercel
2. ✅ Update frontend API URL
3. ✅ Test all endpoints
4. ✅ Monitor performance
5. ✅ Optimize based on metrics
