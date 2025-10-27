# 🚂 Railway Deployment - Step by Step

Your backend is now on GitHub at: **parrot-sketch/bull-backend**

## Railway Setup Steps

### 1. Go to Your Railway Dashboard
Visit: https://railway.app/dashboard
- Make sure you're logged into the account that has the `project-bull` project

### 2. Add Backend Service from GitHub
1. Open your Railway project (`project-bull`)
2. You should already have PostgreSQL running
3. Click **"New"** or **"+"** button
4. Select **"GitHub Repo"**
5. Search for: `bull-backend`
6. Select: `parrot-sketch/bull-backend`
7. Railway will automatically:
   - Clone the repository
   - Detect it's a Node.js app
   - Install dependencies
   - Build the app

### 3. Configure Root Directory
When Railway asks for "Root Directory":
- Set it to: `backend` (since the backend code is in the backend folder)

### 4. Connect to PostgreSQL
The PostgreSQL database should already exist. Configure the connection:
1. In your backend service, go to **"Variables"** tab
2. Add these environment variables:

```env
# Database (from PostgreSQL service)
DATABASE_URL=${{postgres.DATABASE_URL}}

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters-long

# App
NODE_ENV=production
PORT=3000

# CORS (allow mobile app)
CORS_ORIGIN=*
```

### 5. Build Settings
Railway will auto-detect, but check:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`

### 6. Get Your Public URL
1. After deployment, go to your backend service
2. Click **"Settings"** → **"Networking"**
3. Click **"Generate Domain"**
4. Copy the URL: e.g., `https://bull-backend-production.up.railway.app`

### 7. Run Database Migrations
After first deployment:
1. Go to your backend service in Railway
2. Open the deployment logs
3. Use Railway CLI to run migrations:
   ```bash
   railway run npm run db:push
   ```

### 8. Update Your Mobile App
Update your frontend to use the Railway URL:

```typescript
// config/app-config.ts
const getApiBaseUrl = () => {
  if (__DEV__) {
    return 'http://10.0.2.2:3000'; // Local development
  }
  return 'https://bull-backend-production.up.railway.app'; // Production
};
```

## What You Already Have
✅ PostgreSQL database on Railway
✅ Backend code on GitHub
✅ SSH key configured

## What's Next
1. Connect backend service to Railway
2. Configure environment variables
3. Deploy
4. Get public URL
5. Update mobile app

## Common Issues

**Build Fails**: Check if `package.json` has correct scripts
**Database Connection**: Ensure `DATABASE_URL` is set
**Deployment Timeout**: Increase build timeout in Railway settings

