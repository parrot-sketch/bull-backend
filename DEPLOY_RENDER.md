# 🎨 Deploy to Render.com (Best Free Option)

Render.com offers a free tier for Node.js apps with HTTPS included.

## Setup (5 minutes)

### Step 1: Sign up
1. Go to: https://render.com
2. Sign up with GitHub (use `parrot-sketch` account)
3. Verify email

### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Click **"Connect Account"** (GitHub)
3. Search for: `bull-backend`
4. Select: `parrot-sketch/bull-backend`
5. Click **"Connect"**

### Step 3: Configure
- **Name**: `ihosi-backend`
- **Environment**: `Node`
- **Region**: Choose nearest (e.g., `Frankfurt` or `Oregon`)
- **Branch**: `main`
- **Root Directory**: `backend` (important!)
- **Runtime**: `Node 18` or `Node 20`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`

### Step 4: Environment Variables
Click **"Add Environment Variable"** for each:

```env
DATABASE_URL=${{postgres.DATABASE_URL}}
# OR if using Aiven, paste from Aiven dashboard

JWT_SECRET=ihosi-super-secret-jwt-key-change-in-production-2024
JWT_REFRESH_SECRET=ihosi-super-secret-refresh-key-change-in-production-2024
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
```

### Step 5: Advanced Settings
- **Auto-Deploy**: `Yes`
- **Health Check Path**: `/gateway/health` (if you have one)

### Step 6: Deploy
Click **"Create Web Service"**

Render will:
1. Clone your repo
2. Build the app
3. Start the service
4. Give you a URL: `https://ihosi-backend.onrender.com`

### Step 7: Get Your URL
After deployment:
1. Click on your service
2. Copy the URL from the top
3. Use this URL in your mobile app

## Update Mobile App

Once Render gives you the URL, update your app:

```typescript
// config/app-config.ts
const getApiBaseUrl = () => {
  if (__DEV__) {
    return 'http://10.0.2.2:3000'; // Local development
  }
  return 'https://ihosi-backend.onrender.com'; // Render production
};
```

## Free Tier Limits
- ✅ 750 hours/month free
- ✅ HTTPS included
- ✅ Auto-deployments
- ⚠️ Spins down after 15 min inactivity (first request takes ~30s)

## Upgrade Options
If you need faster response times:
- **Starter Plan**: $7/month (always-on)
- Keep free tier for development

## Next Steps
1. Deploy to Render
2. Test the API endpoint
3. Update mobile app with Render URL
4. Test login flow

