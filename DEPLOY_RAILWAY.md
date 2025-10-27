# 🚀 Deploy iHosi Backend to Railway

This guide will help you deploy the iHosi backend to Railway in minutes.

## Prerequisites

1. [Railway Account](https://railway.app)
2. GitHub repository with the backend code
3. Domain name (optional, Railway provides one)

## Quick Deploy Steps

### 1. Push to GitHub

```bash
cd backend
git add .
git commit -m "Add Railway deployment config"
git push origin main
```

### 2. Deploy to Railway

1. **Go to Railway Dashboard**
   - Visit https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically create a PostgreSQL database
   - Note the `DATABASE_URL` connection string

4. **Add Redis (Optional)**
   - Click "New" → "Database" → "Redis"
   - For caching and sessions

5. **Configure Environment Variables**
   - Go to your service → "Variables"
   - Add these environment variables:
   
   ```env
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=${{PGDATABASE_URL}}
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters
   REDIS_HOST=${{REDIS.HOST}}
   REDIS_PORT=${{REDIS.PORT}}
   REDIS_PASSWORD=${{REDIS.PASSWORD}}
   ```

6. **Deploy**
   - Railway will automatically detect the Dockerfile or nixpacks config
   - Click "Deploy"
   - Wait for the build to complete

7. **Get Your URL**
   - Railway provides a public URL like: `https://your-project.up.railway.app`
   - Copy this URL

### 3. Update App Configuration

Update your React Native app to use the Railway URL:

```typescript
// config/app-config.ts
const getApiBaseUrl = () => {
  if (__DEV__) {
    return 'http://10.0.2.2:3000'; // For local development
  }
  return 'https://your-project.up.railway.app'; // Production
};
```

### 4. Run Database Migrations

```bash
# Via Railway Dashboard
# Go to your PostgreSQL database → "Connect" → "Query"
# Or via Railway CLI
railway run npx prisma migrate deploy
```

### 5. Seed the Database (Optional)

```bash
railway run npx prisma db seed
```

## Railway Features

✅ **Auto-scaling**: Automatically handles traffic spikes  
✅ **Auto-deploy**: Deploys on every GitHub push  
✅ **HTTPS**: Built-in SSL certificates  
✅ **Custom Domain**: Add your own domain  
✅ **Metrics**: Built-in monitoring  
✅ **Logs**: Real-time log streaming  
✅ **Backups**: Automatic database backups  

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string (automatically set by Railway)
- `JWT_SECRET` - 32+ character secret for JWT signing
- `JWT_REFRESH_SECRET` - 32+ character secret for refresh tokens

### Optional
- `REDIS_HOST` - Redis connection host
- `REDIS_PORT` - Redis connection port
- `REDIS_PASSWORD` - Redis password
- `CORS_ORIGIN` - Allowed CORS origins
- `LOG_LEVEL` - Logging level (debug, info, warn, error)

## Local Development

Railway provides a public URL, so you can:
- Use the public Railway URL in your local development
- Or continue using localhost for faster iteration

```typescript
// config/app-config.ts
const getApiBaseUrl = () => {
  return 'https://your-project.up.railway.app';
};
```

## Monitoring

Railway provides:
- Real-time logs
- Resource usage metrics
- Request monitoring
- Database connection pooling

## Troubleshooting

### Build Fails
- Check the build logs in Railway dashboard
- Ensure all dependencies are in package.json
- Verify environment variables are set

### Database Connection Issues
- Check DATABASE_URL is correctly set
- Run migrations: `railway run npx prisma migrate deploy`

### App Can't Connect
- Verify the Railway URL is correct
- Check CORS settings in backend
- Ensure HTTPS is used in production

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Update app config with Railway URL
3. ✅ Test authentication flow
4. ✅ Test scheduling endpoints
5. ⭐ Enjoy your deployed backend!

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

