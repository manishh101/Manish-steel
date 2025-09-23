# Production Deployment Checklist

## Pre-Deployment

### Backend Setup
- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with read/write permissions
- [ ] Network access configured (0.0.0.0/0 for production)
- [ ] Cloudinary account setup with API credentials
- [ ] Server `.env` file configured with production values
- [ ] JWT secret generated (use strong random string)

### Frontend Setup
- [ ] Frontend `.env.production` configured
- [ ] API URL points to production backend
- [ ] Build optimization enabled (`GENERATE_SOURCEMAP=false`)
- [ ] All hardcoded localhost URLs removed

### Security
- [ ] Strong JWT secret (minimum 32 characters)
- [ ] CORS origins properly configured
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] No sensitive data in client-side code

## Deployment Steps

### 1. Backend Deployment (Render)
- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set build command: `cd server && npm install`
- [ ] Set start command: `cd server && npm start`
- [ ] Add environment variables:
  - [ ] `MONGO_URI`
  - [ ] `JWT_SECRET`
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`
  - [ ] `NODE_ENV=production`
  - [ ] `ALLOWED_ORIGINS`
- [ ] Deploy and verify health endpoint

### 2. Frontend Deployment (Vercel)
- [ ] Create new project on Vercel
- [ ] Connect GitHub repository
- [ ] Set root directory: `manish-steel-final`
- [ ] Add environment variables:
  - [ ] `REACT_APP_API_URL` (backend URL)
  - [ ] `REACT_APP_NAME`
  - [ ] `REACT_APP_VERSION`
- [ ] Deploy and verify build

### 3. Domain & DNS (Optional)
- [ ] Purchase custom domain
- [ ] Configure DNS settings
- [ ] Update CORS origins with new domain
- [ ] Setup SSL certificate (automatic with Vercel/Render)

## Post-Deployment Testing

### Backend Testing
- [ ] Health endpoint responds: `GET /health`
- [ ] Products API works: `GET /api/products`
- [ ] Categories API works: `GET /api/categories`
- [ ] Contact form works: `POST /api/inquiries`
- [ ] Admin login works: `POST /api/auth`
- [ ] Image upload works (admin panel)

### Frontend Testing
- [ ] Homepage loads correctly
- [ ] Product catalog displays
- [ ] Category filtering works
- [ ] Search functionality works
- [ ] Contact form submits successfully
- [ ] Admin panel accessible and functional
- [ ] Responsive design on mobile devices
- [ ] Page load speed acceptable (<3 seconds)

### Performance & SEO
- [ ] Google PageSpeed Insights score >90
- [ ] Images optimized and loading fast
- [ ] Meta tags properly set
- [ ] Sitemap generated (if applicable)
- [ ] Google Analytics setup (if required)

## Monitoring & Maintenance

### Setup Monitoring
- [ ] Error tracking (Sentry or similar)
- [ ] Uptime monitoring (UptimeRobot or similar)
- [ ] Performance monitoring
- [ ] Database backup schedule

### Regular Maintenance
- [ ] Update dependencies monthly
- [ ] Monitor error logs weekly
- [ ] Database cleanup quarterly
- [ ] Security audit annually

## Emergency Contacts
- Database: MongoDB Atlas Support
- Frontend: Vercel Support
- Backend: Render Support
- Domain: Your domain registrar support
