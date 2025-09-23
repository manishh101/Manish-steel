# Manish Steel Furniture - Production Ready

A modern, full-stack web application for Manish Steel Furniture, featuring a React frontend and Node.js backend with MongoDB database.

## 🚀 Live Demo

- **Frontend**: [https://manish-steel-furniture.vercel.app](https://manish-steel-furniture.vercel.app)
- **API**: [https://manish-steel-api.onrender.com](https://manish-steel-api.onrender.com)

## 📋 Project Overview

Manish Steel Furniture is a comprehensive e-commerce platform showcasing high-quality steel and wooden furniture. The application includes:

- **Customer Interface**: Product catalog, categories, search, contact forms
- **Admin Panel**: Product management, category management, inquiry handling, content management
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Performance Optimized**: Fast loading, image optimization, caching

## 🏗️ Architecture

### Frontend (React.js)
- **Framework**: React 18 with modern hooks
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API
- **Routing**: React Router DOM
- **HTTP Client**: Axios with retry logic
- **Deployment**: Vercel (Static + Serverless)

### Backend (Node.js)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **File Upload**: Cloudinary integration
- **Security**: CORS, rate limiting, input validation
- **Deployment**: Render (Containerized)

### Database (MongoDB)
- **Hosting**: MongoDB Atlas (Cloud)
- **Collections**: Products, Categories, Users, Inquiries, About
- **Features**: Indexing, aggregation, text search

## 📁 Project Structure

```
manish-steel-main/
├── manish-steel-final/          # Frontend React Application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── contexts/           # React contexts
│   │   ├── utils/              # Utility functions
│   │   └── assets/             # Images and static files
│   ├── package.json
│   └── vercel.json
├── server/                      # Backend Node.js API
│   ├── controllers/            # Business logic
│   ├── models/                 # Database schemas
│   ├── routes/                 # API endpoints
│   ├── middleware/             # Express middleware
│   ├── utils/                  # Helper functions
│   ├── config/                 # Configuration
│   ├── seeders/                # Database seeders
│   ├── package.json
│   └── vercel.json
├── deploy.sh                   # Production deployment
├── start.sh                    # Development startup
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Cloudinary account (for image hosting)

### 1. Clone Repository
```bash
git clone https://github.com/manishh101/Manish-steel.git
cd Manish-steel-main
```

### 2. Backend Setup
```bash
cd server
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
# CLOUDINARY_API_KEY=your_cloudinary_api_key
# CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Start backend server
npm start
```

### 3. Frontend Setup
```bash
cd ../manish-steel-final
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local:
# REACT_APP_API_URL=http://localhost:5000/api

# Start frontend development server
npm start
```

### 4. Development
- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:3000
- Admin panel: http://localhost:3000/admin

## 🔧 Environment Variables

### Backend (.env)
```bash
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/manish-steel

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=5000
NODE_ENV=production

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=https://manish-steel-furniture.vercel.app,http://localhost:3000
```

### Frontend (.env.production)
```bash
# API Configuration
REACT_APP_API_URL=https://manish-steel-api.onrender.com/api

# App Configuration
REACT_APP_NAME=Manish Steel Furniture
REACT_APP_VERSION=1.0.0
```

## 🚀 Deployment

### Automated Deployment
```bash
# Run the deployment script
./deploy.sh
```

### Manual Deployment

#### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build directory: `manish-steel-final`
3. Add environment variables in Vercel dashboard
4. Deploy automatically on git push

#### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables in Render dashboard

#### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Configure network access (0.0.0.0/0 for production)
3. Create database user
4. Get connection string for MONGO_URI

## 📊 Features

### Customer Features
- ✅ Product catalog with categories and subcategories
- ✅ Advanced search and filtering
- ✅ Responsive design for all devices
- ✅ Product image galleries
- ✅ Contact forms and inquiries
- ✅ Company information and about page

### Admin Features
- ✅ Secure admin authentication
- ✅ Product management (CRUD operations)
- ✅ Category and subcategory management
- ✅ Image upload with Cloudinary
- ✅ Inquiry management system
- ✅ Content management for about page
- ✅ Dashboard with analytics

### Technical Features
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ Image optimization and CDN
- ✅ Database indexing and optimization
- ✅ Error handling and logging
- ✅ Rate limiting and security
- ✅ Responsive caching
- ✅ SEO optimization

## 🔒 Security

- **Authentication**: JWT tokens with refresh mechanism
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Server-side validation for all inputs
- **CORS**: Configured for specific origins
- **Environment Variables**: Sensitive data in environment files
- **Database Security**: MongoDB connection with authentication

## 📈 Performance

- **Frontend**: Lazy loading, code splitting, image optimization
- **Backend**: Database indexing, query optimization, caching
- **CDN**: Cloudinary for image delivery
- **Monitoring**: Error tracking and performance monitoring

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd manish-steel-final
npm test
```

## 📝 API Documentation

### Main Endpoints
- `GET /api/products` - Get all products
- `GET /api/categories` - Get all categories
- `POST /api/inquiries` - Submit contact form
- `POST /api/auth` - Admin authentication

### Admin Endpoints (Requires Authentication)
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/inquiries` - Get all inquiries

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Manish H
- **Company**: Shree Manish Steel Furniture
- **Location**: Nepal

## 📞 Support

For support and queries:
- **Email**: contact@manishsteel.com
- **Phone**: +977-XXXXXXXXXX
- **Address**: Nepal

---

**Made with ❤️ for Manish Steel Furniture**
