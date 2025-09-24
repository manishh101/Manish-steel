#!/bin/bash

# Manish Steel Furniture - VPS Deployment Script
# Run this script on your VPS server

echo "🚀 Setting up Manish Steel Furniture on VPS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root. Use a sudo-enabled user."
    exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
print_status "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
node_version=$(node --version)
npm_version=$(npm --version)
print_status "Node.js version: $node_version"
print_status "NPM version: $npm_version"

# Install PM2 globally
print_status "Installing PM2 process manager..."
sudo npm install -g pm2

# Install Nginx
print_status "Installing Nginx..."
sudo apt install -y nginx

# Install Git (if not already installed)
print_status "Installing Git..."
sudo apt install -y git

# Install MongoDB (optional - can use MongoDB Atlas)
read -p "Do you want to install MongoDB locally? (y/N): " install_mongo
if [[ $install_mongo =~ ^[Yy]$ ]]; then
    print_status "Installing MongoDB..."
    curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    sudo apt update
    sudo apt install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
fi

# Install SSL certificate tool
print_status "Installing Certbot for SSL certificates..."
sudo apt install -y certbot python3-certbot-nginx

# Setup firewall
print_status "Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Create application directory
print_status "Creating application directories..."
sudo mkdir -p /var/www/manishsteelfurniture
sudo chown $USER:$USER /var/www/manishsteelfurniture

# Create environment file template
print_status "Creating environment file template..."
cat > /var/www/manishsteelfurniture/.env.example << EOF
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/manishsteel
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/manishsteel

# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=https://manishsteelfurniture.com.np
EOF

# Create Nginx configuration
print_status "Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/manishsteelfurniture.com.np << EOF
server {
    listen 80;
    server_name manishsteelfurniture.com.np www.manishsteelfurniture.com.np;
    
    # Redirect to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name manishsteelfurniture.com.np www.manishsteelfurniture.com.np;
    
    # SSL certificates (will be configured by certbot)
    ssl_certificate /etc/letsencrypt/live/manishsteelfurniture.com.np/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/manishsteelfurniture.com.np/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Frontend (React build)
    location / {
        root /var/www/manishsteelfurniture/frontend/build;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
        root /var/www/manishsteelfurniture/frontend/build;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# API subdomain (optional)
server {
    listen 80;
    server_name api.manishsteelfurniture.com.np;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.manishsteelfurniture.com.np;
    
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/api.manishsteelfurniture.com.np/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.manishsteelfurniture.com.np/privkey.pem;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
print_status "Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/manishsteelfurniture.com.np /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
print_status "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    print_status "Nginx configuration is valid!"
else
    print_error "Nginx configuration has errors. Please check."
    exit 1
fi

# Create PM2 ecosystem file
print_status "Creating PM2 ecosystem file..."
cat > /var/www/manishsteelfurniture/ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'manish-steel-backend',
      script: './server/index.js',
      cwd: '/var/www/manishsteelfurniture',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};
EOF

# Create logs directory
mkdir -p /var/www/manishsteelfurniture/logs

# Create deployment script
print_status "Creating deployment script..."
cat > /var/www/manishsteelfurniture/deploy.sh << 'EOF'
#!/bin/bash

# Manish Steel Furniture Deployment Script

echo "🚀 Deploying Manish Steel Furniture..."

# Navigate to project directory
cd /var/www/manishsteelfurniture

# Pull latest changes from git
echo "📥 Pulling latest changes..."
git pull origin main

# Install/update backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install --production

# Build frontend
echo "🏗️  Building frontend..."
cd ../manish-steel-final
npm install
npm run build

# Copy build to serve location
echo "📋 Copying frontend build..."
rm -rf /var/www/manishsteelfurniture/frontend/build
mkdir -p /var/www/manishsteelfurniture/frontend
cp -r build /var/www/manishsteelfurniture/frontend/

# Restart backend with PM2
echo "🔄 Restarting backend..."
cd /var/www/manishsteelfurniture
pm2 restart ecosystem.config.js

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo nginx -s reload

echo "✅ Deployment complete!"
echo "🌐 Your site should be available at: https://manishsteelfurniture.com.np"
EOF

chmod +x /var/www/manishsteelfurniture/deploy.sh

print_status "VPS setup completed! 🎉"
print_warning "Next steps:"
echo "1. Clone your repository to /var/www/manishsteelfurniture"
echo "2. Copy .env.example to .env and configure your environment variables"
echo "3. Run the deployment script: ./deploy.sh"
echo "4. Setup SSL certificates: sudo certbot --nginx -d manishsteelfurniture.com.np -d www.manishsteelfurniture.com.np"
echo "5. Start PM2: pm2 start ecosystem.config.js"
echo "6. Save PM2 configuration: pm2 save && pm2 startup"

print_status "Your VPS is ready for deployment! 🚀"
