# 🚀 Render.com Environment Variables - Complete Setup

## Required Variables (CRITICAL - Must Have)

These are the **minimum required** variables for your app to run:

```env
# Database - Aiven PostgreSQL
DATABASE_URL=postgres://avnadmin:YOUR_PASSWORD@pg-1e8a2e08-project-bull.k.aivencloud.com:17680/defaultdb?sslmode=require

# JWT Secrets - REQUIRED
JWT_SECRET=ihosi-production-super-secret-jwt-key-2024-minimum-32-characters-long
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=ihosi-production-super-secret-refresh-key-2024-minimum-32-characters-long
JWT_REFRESH_EXPIRES_IN=7d

# Application
NODE_ENV=production
PORT=3000
```

## Recommended Variables (Good to Have)

These improve functionality but aren't strictly required:

```env
# API Configuration
API_VERSION=v1
CORS_ORIGIN=*

# Encryption (if you use it)
ENCRYPTION_KEY=your-32-character-encryption-key-here-change-this
```

## Optional Variables (Advanced Features)

These are for features you might not be using yet:

### Redis (Optional - Your app works without it)
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### Email/SMS (Only if you need notifications)
```env
# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@ihosi.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### File Storage (Only if you need file uploads)
```env
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=ihosi-healthcare-files
```

### Kafka/Elasticsearch (Only if you need these services)
```env
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=ihosi-backend
KAFKA_GROUP_ID=ihosi-group

ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=
ELASTICSEARCH_PASSWORD=
```

## What You ACTUALLY Need

Based on your current code, you **only need**:

1. **DATABASE_URL** - Aiven PostgreSQL connection
2. **JWT_SECRET** - For authentication
3. **JWT_REFRESH_SECRET** - For refresh tokens
4. **NODE_ENV** - Set to "production"
5. **PORT** - Render sets this automatically

## Render Configuration Summary

### Minimum Setup for Production:
```env
DATABASE_URL=postgres://avnadmin:YOUR_PASSWORD@pg-1e8a2e08-project-bull.k.aivencloud.com:17680/defaultdb?sslmode=require
JWT_SECRET=ihosi-production-jwt-secret-key-32-chars-minimum
JWT_REFRESH_SECRET=ihosi-production-refresh-secret-key-32-chars-minimum
NODE_ENV=production
```

That's it! Your app will run with just these 4 variables.

## Steps to Deploy

1. ✅ Connect your GitHub repo to Render
2. ✅ Select the `backend` root directory
3. ✅ Add the 4 environment variables above
4. ✅ Set Build Command: `npm install && npm run build && npm run db:migrate:deploy`
5. ✅ Set Start Command: `npm run start:prod`
6. ✅ Deploy!

## Notes

- **Redis is NOT used** in your current code, so you don't need it
- **Email/SMS services** are optional
- **File storage** (AWS S3) is only if you upload files
- **Kafka/Elasticsearch** are only for advanced features

Your backend is **simple and focused** - it only needs PostgreSQL and JWT!

