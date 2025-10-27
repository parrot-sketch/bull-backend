#!/bin/bash

# iHosi Backend Setup Script
echo "🏥 Setting up iHosi Healthcare Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version 20+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker is installed"

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker Compose is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "📋 Creating environment file..."
    cp env.example .env
    echo "⚠️  Please update .env file with your configuration"
fi

# Start development services
echo "🐳 Starting development services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Run database migrations
echo "🗄️  Running database migrations..."
npm run db:migrate

# Seed database (if seed file exists)
if [ -f "prisma/seed.ts" ]; then
    echo "🌱 Seeding database..."
    npm run db:seed
fi

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run start:dev"
echo ""
echo "📚 API Documentation:"
echo "   http://localhost:3000/api/docs"
echo ""
echo "🔍 Monitoring:"
echo "   Grafana: http://localhost:3001"
echo "   Prometheus: http://localhost:9090"
echo "   Kibana: http://localhost:5601"
echo ""
echo "📧 Email Testing:"
echo "   Mailhog: http://localhost:8025"
echo ""
echo "💾 File Storage:"
echo "   MinIO: http://localhost:9001"
