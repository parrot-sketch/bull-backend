# 🚀 Complete Render Deployment Guide

## Prerequisites

1. **Aiven PostgreSQL Database** ✅ (Already set up)
2. **Optional: Aiven Redis Cache** (For session management and caching)

## Step 1: Add Redis to Aiven (Optional)

### Create Redis Service in Aiven Cloud

1. Go to [Aiven Cloud Dashboard](https://console.aiven.io/)
2. Click **"Create service"**
3. Select **"Redis"**
4. Choose **Service name**: `ihosi-redis`
5. Select **Plan**: Start with the smallest plan (free tier if available)
6. Click **"Create"**

### Get Redis Connection Details

After creation, you'll get connection details:
- **Host**: `ihosi-redis-project-bull.aivencloud.com`
- **Port**: `17681` (or similar)
- **Password**: (auto-generated)
- **Connection String**: `redis://avnadmin:PASSWORD@host:port`

## Step 2: Configure Render Deployment

### Basic Settings

1. **Environment**: `Node`
2. **Build Command**: `npm install && npm run build && npm run db:migrate:deploy`
3. **Start Command**: `npm run start:prod`
4. **Root Directory**: `backend` (if deploying from monorepo)

### Required Environment Variables

Add these to Render's environment variables:

```env
# Database (from Aiven PostgreSQL)
DATABASE_URL=postgres://avnadmin:YOUR_PASSWORD@pg-1e8a2e08-project-bull.k.aivencloud.com:17680/defaultdb?sslmode=require

# JWT Secrets (generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters-long-change-this

# Application
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
```

### Optional Redis Variables (If you added Redis)

```env
# Redis Configuration (only if you set up Redis on Aiven)
REDIS_HOST=ihosi-redis-project-bull.aivencloud.com
REDIS_PORT=17681
REDIS_PASSWORD=your-redis-password
REDIS_URL=redis://avnadmin:PASSWORD@ihosi-redis-project-bull.aivencloud.com:17681

# Redis Features
REDIS_SESSION_ENABLED=true
REDIS_CACHE_ENABLED=true
```

## Step 3: Deploy

1. Click **"Create Web Service"** in Render
2. Wait for the build to complete (usually 3-5 minutes)
3. Check build logs for any errors

## Step 4: Verify Deployment

Once deployed, you'll get a URL like: `https://bull-backend.onrender.com`

### Test Endpoints

1. **Health Check**:
   ```
   GET https://bull-backend.onrender.com/gateway/health
   ```

2. **API Documentation**:
   ```
   https://bull-backend.onrender.com/api/docs
   ```

## Step 5: Update Frontend

Update your frontend's API configuration to use the deployed backend:

```typescript
// config/app-config.ts
const getApiBaseUrl = () => {
  if (__DEV__) {
    // Local development
    const platform = require('react-native').Platform.OS;
    return platform === 'android' 
      ? 'http://10.0.2.2:3000'
      : 'http://localhost:3000';
  }
  
  // Production - use your Render URL
  return 'https://bull-backend.onrender.com';
};
```

## Troubleshooting

### Database Connection Issues

If you get database connection errors:
1. Check your `DATABASE_URL` format
2. Ensure Aiven PostgreSQL is running
3. Check if your IP is whitelisted in Aiven

### Missing Environment Variables

If the app fails to start:
1. Check Render logs for errors
2. Verify all environment variables are set
3. Ensure no trailing spaces in values

### Redis Optional

**Good news**: Your backend works WITHOUT Redis! 
- Redis is only for caching and session management
- You can deploy without it
- Add it later if needed for performance

## Next Steps

1. ✅ Deploy to Render
2. ✅ Test API endpoints
3. ✅ Update frontend API URL
4. ✅ Test login and scheduling features
5. (Optional) Add Redis for better performance

