#!/bin/bash

# FREE Custom Domain Setup Script
# For manishsteelfurniture.com.np

echo "🎉 Setting up FREE Custom Domain Hosting..."
echo "Domain: manishsteelfurniture.com.np"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}📋 Step $1: $2${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Step 1: Environment Setup
print_step "1" "Preparing Environment Variables"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Please run this script from the manish-steel-final directory${NC}"
    exit 1
fi

# Create production environment file
cat > .env.production << EOF
# Production Environment Variables for manishsteelfurniture.com.np
REACT_APP_API_URL=https://api.manishsteelfurniture.com.np
REACT_APP_SITE_URL=https://manishsteelfurniture.com.np
GENERATE_SOURCEMAP=false
PUBLIC_URL=https://manishsteelfurniture.com.np

# Analytics
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Features
REACT_APP_ENABLE_PWA=true
REACT_APP_ENABLE_OFFLINE=true
EOF

print_success "Created .env.production file"

# Create Vercel configuration
cat > vercel.json << EOF
{
  "version": 2,
  "name": "manish-steel-furniture",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot))",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
EOF

print_success "Created vercel.json configuration"

# Step 2: Update package.json for production
print_step "2" "Updating package.json for production"

# Add homepage field to package.json
if command -v jq > /dev/null; then
    # Use jq if available
    jq '.homepage = "https://manishsteelfurniture.com.np"' package.json > package.json.tmp
    mv package.json.tmp package.json
    print_success "Updated homepage in package.json"
else
    print_warning "jq not found. Please manually add 'homepage': 'https://manishsteelfurniture.com.np' to package.json"
fi

# Step 3: Create sitemap
print_step "3" "Creating sitemap.xml"

cat > public/sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://manishsteelfurniture.com.np/</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://manishsteelfurniture.com.np/products</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://manishsteelfurniture.com.np/about</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://manishsteelfurniture.com.np/contact</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://manishsteelfurniture.com.np/gallery</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://manishsteelfurniture.com.np/custom-order</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
EOF

print_success "Created sitemap.xml"

# Step 4: Create robots.txt
print_step "4" "Creating robots.txt"

cat > public/robots.txt << EOF
User-agent: *
Allow: /

Sitemap: https://manishsteelfurniture.com.np/sitemap.xml

# Block access to admin areas
Disallow: /admin
Disallow: /api
Disallow: /_next
Disallow: /static
EOF

print_success "Created robots.txt"

# Step 5: Update index.html with SEO
print_step "5" "Updating SEO meta tags"

# Create a backup of index.html
cp public/index.html public/index.html.backup

# Update meta tags in index.html
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#0057A3" />
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="Premium steel furniture manufacturer in Nepal. Quality office and household furniture at affordable prices. Serving Biratnagar, Dharan, Itahari and across Nepal with fast delivery and installation." />
  <meta name="keywords" content="steel furniture nepal, furniture biratnagar, office furniture nepal, household furniture, steel almari, manish steel, furniture dharan, furniture itahari" />
  <meta name="author" content="Shree Manish Steel Furniture Udhyog Pvt. Ltd." />
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="Manish Steel Furniture - Premium Steel Furniture Nepal" />
  <meta property="og:description" content="Quality steel furniture for homes and offices. Best prices in Nepal with free delivery in Biratnagar, Dharan, Itahari." />
  <meta property="og:image" content="%PUBLIC_URL%/manish-steel-logo.png" />
  <meta property="og:url" content="https://manishsteelfurniture.com.np" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Manish Steel Furniture - Premium Steel Furniture Nepal" />
  <meta name="twitter:description" content="Quality steel furniture for homes and offices. Best prices in Nepal." />
  <meta name="twitter:image" content="%PUBLIC_URL%/manish-steel-logo.png" />
  
  <!-- Additional SEO -->
  <meta name="robots" content="index, follow" />
  <meta name="googlebot" content="index, follow" />
  <link rel="canonical" href="https://manishsteelfurniture.com.np" />
  
  <!-- Apple Touch Icons -->
  <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
  
  <!-- Manifest -->
  <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
  
  <!-- Preconnect to external domains -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <title>Manish Steel Furniture - Premium Steel Furniture Nepal | Biratnagar, Dharan, Itahari</title>
  
  <!-- Google Analytics (Replace G-XXXXXXXXXX with your actual GA4 ID) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "name": "Shree Manish Steel Furniture Udhyog Pvt. Ltd.",
    "url": "https://manishsteelfurniture.com.np",
    "logo": "https://manishsteelfurniture.com.np/manish-steel-logo.png",
    "image": "https://manishsteelfurniture.com.np/manish-steel-logo.png",
    "description": "Premium steel furniture manufacturer in Nepal serving Biratnagar, Dharan, Itahari and across Nepal.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Dharan Rd",
      "addressLocality": "Biratnagar", 
      "postalCode": "56613",
      "addressCountry": "NP"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.4998067,
      "longitude": 87.2776309
    },
    "telephone": "+977-982-4336371",
    "email": "shreemanishfurniture@gmail.com",
    "openingHours": "Mo-Fr 08:00-19:00, Sa 08:00-12:00",
    "priceRange": "$$",
    "currenciesAccepted": "NPR",
    "paymentAccepted": "Cash, Bank Transfer"
  }
  </script>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>
EOF

print_success "Updated index.html with SEO meta tags"

# Step 6: Build the project
print_step "6" "Building production version"

print_info "Installing dependencies..."
npm install

print_info "Building for production..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Production build completed successfully!"
else
    print_warning "Build failed. Please check for errors above."
    exit 1
fi

# Step 7: Instructions
print_step "7" "Next Steps"

echo ""
echo "🎉 ${GREEN}Frontend is ready for deployment!${NC}"
echo ""
echo "${BLUE}Next steps:${NC}"
echo ""
echo "1. ${YELLOW}Setup Cloudflare:${NC}"
echo "   - Sign up at https://cloudflare.com (FREE)"
echo "   - Add domain: manishsteelfurniture.com.np"
echo "   - Update nameservers at your domain registrar"
echo ""
echo "2. ${YELLOW}Deploy to Vercel:${NC}"
echo "   - Connect GitHub at https://vercel.com (FREE)"
echo "   - Import this repository"
echo "   - Add custom domains in Vercel dashboard"
echo ""
echo "3. ${YELLOW}Setup Backend on Render:${NC}"
echo "   - Connect GitHub at https://render.com (FREE)"
echo "   - Deploy the 'server' folder"
echo "   - Add environment variables"
echo ""
echo "4. ${YELLOW}Configure DNS in Cloudflare:${NC}"
echo "   - A record: @ → 76.76.19.61 (Proxied)"
echo "   - A record: @ → 76.223.126.88 (Proxied)" 
echo "   - CNAME: www → [GET FROM VERCEL DASHBOARD] (Proxied)"
echo "   - CNAME: api → [GET FROM RENDER DASHBOARD] (Proxied)"
echo ""
echo "5. ${YELLOW}Enable Cloudflare Features:${NC}"
echo "   - SSL/TLS: Full (Strict)"
echo "   - Auto Minify: CSS, JS, HTML"
echo "   - Brotli compression"
echo ""
echo "📱 ${GREEN}Total Monthly Cost: $0 (FREE!)${NC}"
echo "🌐 ${GREEN}Your site will be: https://manishsteelfurniture.com.np${NC}"
echo ""
echo "Need help? Check the detailed guide: FREE-HOSTING-GUIDE.md"

echo ""
echo "📋 ${BLUE}How to get CNAME values:${NC}"
echo ""  
echo "${YELLOW}For Vercel CNAME:${NC}"
echo "1. Deploy to Vercel first: https://vercel.com"
echo "2. Add custom domain: manishsteelfurniture.com.np"
echo "3. Vercel will show exact CNAME record"
echo "4. Copy that value (NOT cname.vercel-dns.com)"
echo ""
echo "${YELLOW}For Render CNAME:${NC}"
echo "1. Deploy backend to Render: https://render.com"  
echo "2. Add custom domain: api.manishsteelfurniture.com.np"
echo "3. Render will show: yourapp-abc123.onrender.com"
echo "4. Use that as CNAME value"
echo ""
echo "📖 ${BLUE}Detailed guide: CORRECT-DNS-SETUP.md${NC}"
