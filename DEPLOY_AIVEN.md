# ☁️ Deploy iHosi Backend to Aiven

Aiven provides managed PostgreSQL databases and other services.

## Option 1: Railway + Aiven (Recommended)

**Why**: Railway free plan is limited, but you can use Aiven's PostgreSQL with a separate backend host.

### Architecture
```
- Railway: PostgreSQL database (you have this)
- Aiven/Other: NestJS backend API
```

**OR**

### Railway Database + Render/Fly.io Backend

```
- Railway PostgreSQL (free tier)
- Render.com backend (free tier)
- OR Fly.io backend (free tier)
```

## Option 2: Aiven for Everything

### Aiven Services Needed

1. **Aiven PostgreSQL**
2. **Aiven for Redis** (optional)

### Setup Steps

1. **Sign up**: https://aiven.io/
2. **Create PostgreSQL Service**:
   - Service Type: PostgreSQL
   - Plan: Hobbyist (Free tier available)
   - Cloud Provider: Choose nearest location
   - Click "Create Service"

3. **Get Connection Details**:
   - Copy `HOSTNAME`, `PORT`, `DATABASE`, `USER`, `PASSWORD`
   - Format: `postgresql://user:pass@hostname:port/database`

4. **For Backend Hosting**:
   **Option A: Render.com** (FREE)
   - Sign up: https://render.com/
   - Connect GitHub repo
   - Select `bull-backend`
   - Add environment variables from Aiven
   - Deploy

   **Option B: Fly.io** (FREE)
   - Sign up: https://fly.io/
   - Install CLI: `curl -L https://fly.io/install.sh | sh`
   - Login: `fly auth login`
   - Deploy: `fly launch` in your backend directory
   - Add secrets from Aiven

## Quick Start: Render.com (Easiest)

1. Go to: https://render.com/dashboard
2. **"New +"** → **"Web Service"**
3. **"Connect GitHub"** → Select `parrot-sketch/bull-backend`
4. **Settings**:
   ```
   Name: ihosi-backend
   Environment: Node
   Root Directory: backend
   Build Command: npm install && npm run build
   Start Command: npm run start:prod
   ```

5. **Environment Variables**:
   ```env
   DATABASE_URL=postgresql://... (from Aiven or Railway)
   JWT_SECRET=your-jwt-secret
   JWT_REFRESH_SECRET=your-refresh-secret
   NODE_ENV=production
   PORT=3000
   CORS_ORIGIN=*
   ```

6. **Deploy**

## Recommended Setup (Free Tier)

**Database**: Keep Railway PostgreSQL (you already have it)
**Backend**: Deploy to Render.com (FREE, includes HTTPS)

Steps:
1. Keep using Railway PostgreSQL
2. Deploy backend to Render.com
3. Connect both services

Would you like to proceed with Render.com or explore Aiven setup?

