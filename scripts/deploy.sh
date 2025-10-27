#!/bin/bash

# Deployment script for Render.com
echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build the application
echo "🏗️ Building application..."
npm run build

# Run database migrations
echo "🗄️ Running database migrations..."
npm run db:migrate:deploy

echo "✅ Deployment completed successfully!"
