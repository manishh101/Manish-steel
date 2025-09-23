#!/bin/bash

echo "🔧 Setting up Production Environment Configuration"
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "\n${BLUE}1. Creating production environment files...${NC}"

# Create production environment for frontend
cat > "manish-steel-final/.env.production" << 'EOF'
# Production Environment Configuration
REACT_APP_API_URL=https://manish-steel-api.onrender.com/api
REACT_APP_NAME=Manish Steel Furniture
REACT_APP_VERSION=1.0.0
GENERATE_SOURCEMAP=false
EOF

echo -e "${GREEN}✓ Created manish-steel-final/.env.production${NC}"

# Update frontend .env.example
cat > "manish-steel-final/.env.example" << 'EOF'
# Frontend Environment Variables Template
# Copy this file to .env.local for development or .env.production for production

# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# App Configuration
REACT_APP_NAME=Manish Steel Furniture
REACT_APP_VERSION=1.0.0

# Build Configuration (production only)
GENERATE_SOURCEMAP=false
EOF

echo -e "${GREEN}✓ Updated manish-steel-final/.env.example${NC}"

# Update server .env.example
cat > "server/.env.example" << 'EOF'
# Backend Environment Variables Template
# Copy this file to .env and fill in your actual values

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/manish-steel

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration (for image storage)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration (comma-separated origins)
ALLOWED_ORIGINS=https://manish-steel-furniture.vercel.app,http://localhost:3000

# Optional: Force database reseeding (development only)
FORCE_RESEED=false
EOF

echo -e "${GREEN}✓ Updated server/.env.example${NC}"

echo -e "\n${BLUE}2. Creating deployment configuration...${NC}"

# Update package.json scripts for production
if [ -f "manish-steel-final/package.json" ]; then
    # Create a temporary backup
    cp "manish-steel-final/package.json" "manish-steel-final/package.json.bak"
    
    # Update build script to use production environment
    sed -i 's/"build": "react-scripts build"/"build": "GENERATE_SOURCEMAP=false react-scripts build"/' "manish-steel-final/package.json"
    
    echo -e "${GREEN}✓ Updated frontend build configuration${NC}"
fi

# Update server package.json for production
if [ -f "server/package.json" ]; then
    # Check if start script needs updating
    if grep -q '"start": "node server.js"' "server/package.json"; then
        echo -e "${GREEN}✓ Server start script already configured for production${NC}"
    else
        # Create a temporary backup
        cp "server/package.json" "server/package.json.bak"
        echo -e "${YELLOW}ℹ Server package.json may need manual review${NC}"
    fi
fi

echo -e "\n${BLUE}3. Creating production checklist...${NC}"

cat > "PRODUCTION_CHECKLIST.md" << 'EOF'
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
EOF

echo -e "${GREEN}✓ Created PRODUCTION_CHECKLIST.md${NC}"

echo -e "\n${BLUE}4. Creating quick deployment script...${NC}"

# Update the existing deploy.sh for production
cat > "deploy.sh" << 'EOF'
#!/bin/bash

echo "🚀 Deploying Manish Steel to Production"
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -d "manish-steel-final" ] || [ ! -d "server" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Pre-deployment checks...${NC}"

# Check if environment files exist
if [ ! -f "server/.env" ]; then
    echo -e "${RED}❌ Missing server/.env file${NC}"
    echo "Please copy server/.env.example to server/.env and configure it"
    exit 1
fi

if [ ! -f "manish-steel-final/.env.production" ]; then
    echo -e "${RED}❌ Missing frontend production environment${NC}"
    echo "Please ensure manish-steel-final/.env.production exists"
    exit 1
fi

echo -e "${GREEN}✅ Environment files found${NC}"

# Test backend dependencies
echo -e "${YELLOW}🔧 Checking backend dependencies...${NC}"
cd server
if ! npm install --only=production --silent; then
    echo -e "${RED}❌ Backend dependency installation failed${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}✅ Backend dependencies OK${NC}"

# Test frontend dependencies
echo -e "${YELLOW}🔧 Checking frontend dependencies...${NC}"
cd manish-steel-final
if ! npm install --silent; then
    echo -e "${RED}❌ Frontend dependency installation failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend dependencies OK${NC}"

# Test production build
echo -e "${YELLOW}🏗️ Testing production build...${NC}"
if ! npm run build; then
    echo -e "${RED}❌ Production build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Production build successful${NC}"

cd ..

echo -e "\n${GREEN}🎉 Pre-deployment checks passed!${NC}"
echo -e "\n${YELLOW}📚 Next steps:${NC}"
echo "1. Deploy backend to Render:"
echo "   - Connect GitHub repo"
echo "   - Set build: 'cd server && npm install'"
echo "   - Set start: 'cd server && npm start'"
echo "   - Add environment variables from server/.env"
echo ""
echo "2. Deploy frontend to Vercel:"
echo "   - Connect GitHub repo"
echo "   - Set root directory: 'manish-steel-final'"
echo "   - Add environment variables from .env.production"
echo ""
echo "3. Update CORS origins with production URLs"
echo ""
echo "4. Test production deployment thoroughly"
echo ""
echo -e "${GREEN}📖 See PRODUCTION_CHECKLIST.md for detailed steps${NC}"
EOF

chmod +x deploy.sh
echo -e "${GREEN}✓ Updated deploy.sh${NC}"

echo -e "\n${GREEN}✅ Production environment setup completed!${NC}"
echo -e "\n${YELLOW}📁 Files created/updated:${NC}"
echo "- manish-steel-final/.env.production"
echo "- manish-steel-final/.env.example (updated)"
echo "- server/.env.example (updated)"
echo "- PRODUCTION_CHECKLIST.md"
echo "- deploy.sh (updated)"

echo -e "\n${BLUE}🚀 Ready for production deployment!${NC}"
echo "Run './deploy.sh' to perform pre-deployment checks"
