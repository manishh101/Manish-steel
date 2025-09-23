# Manish Steel - Project Structure

## Production Structure

```
manish-steel-main/
├── manish-steel-final/          # Frontend React Application
│   ├── public/                  # Static assets
│   ├── src/                     # React source code
│   ├── package.json            # Frontend dependencies
│   └── vercel.json             # Vercel deployment config
├── server/                      # Backend Node.js API
│   ├── controllers/            # API controllers
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── middleware/             # Express middleware
│   ├── utils/                  # Utility functions
│   ├── config/                 # Configuration files
│   ├── seeders/                # Database seeders
│   ├── package.json           # Backend dependencies
│   └── vercel.json            # Vercel deployment config
├── README.md                   # Main project documentation
├── deploy.sh                   # Production deployment script
└── start.sh                    # Local development script
```

## Key Production Files

### Frontend (manish-steel-final/)
- **package.json**: Dependencies and build scripts
- **vercel.json**: Vercel deployment configuration
- **src/**: React application source code
- **public/**: Static assets and HTML template

### Backend (server/)
- **package.json**: Node.js dependencies
- **server.js**: Main server entry point
- **vercel.json**: Serverless deployment config
- **models/**: MongoDB schemas
- **routes/**: API endpoint definitions
- **controllers/**: Business logic

### Environment Variables
- **server/.env.example**: Backend environment template
- **manish-steel-final/.env.example**: Frontend environment template

## Deployment

1. **Frontend**: Deploy to Vercel from `manish-steel-final/` directory
2. **Backend**: Deploy to Render or Vercel from `server/` directory
3. **Database**: MongoDB Atlas (cloud database)

## Development

1. Install dependencies: `npm install` in both directories
2. Start backend: `cd server && npm start`
3. Start frontend: `cd manish-steel-final && npm start`
