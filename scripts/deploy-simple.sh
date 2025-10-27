#!/bin/bash

# iHosi Simple Backend Deployment Script
# This script deploys the backend with API Gateway and Authentication

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting iHosi Backend Deployment${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose and try again.${NC}"
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Creating environment file...${NC}"
    cat > ".env" << EOF
# Environment Variables
NODE_ENV=production
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://ihosi:ihosi123@postgres:5432/ihosi
POSTGRES_DB=ihosi
POSTGRES_USER=ihosi
POSTGRES_PASSWORD=ihosi123

# Redis Configuration
REDIS_URL=redis://redis:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Service URLs (for future microservices)
AUTH_SERVICE_URL=http://localhost:3000
PATIENT_SERVICE_URL=http://localhost:3000
APPOINTMENT_SERVICE_URL=http://localhost:3000
COMMUNICATION_SERVICE_URL=http://localhost:3000
FILE_SERVICE_URL=http://localhost:3000
ANALYTICS_SERVICE_URL=http://localhost:3000
AUDIT_SERVICE_URL=http://localhost:3000
EOF
    echo -e "${GREEN}✅ Environment file created${NC}"
fi

# Build and start services
echo -e "${BLUE}🔨 Building and starting services...${NC}"
docker-compose -f docker-compose.simple.yml up -d --build

# Wait for services to be ready
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
sleep 30

# Check service health
echo -e "${BLUE}🏥 Checking service health...${NC}"

# Check API Gateway
if curl -f http://localhost:3000/gateway/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API Gateway is healthy${NC}"
else
    echo -e "${RED}❌ API Gateway is not responding${NC}"
    echo -e "${YELLOW}💡 Check logs: docker-compose -f docker-compose.simple.yml logs api-gateway${NC}"
fi

# Check Auth Service
if curl -f http://localhost:3000/auth/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Auth Service is healthy${NC}"
else
    echo -e "${RED}❌ Auth Service is not responding${NC}"
    echo -e "${YELLOW}💡 Check logs: docker-compose -f docker-compose.simple.yml logs api-gateway${NC}"
fi

# Check Nginx
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Nginx is healthy${NC}"
else
    echo -e "${RED}❌ Nginx is not responding${NC}"
    echo -e "${YELLOW}💡 Check logs: docker-compose -f docker-compose.simple.yml logs nginx${NC}"
fi

# Display service information
echo -e "${BLUE}📊 Service Information:${NC}"
echo -e "${GREEN}🌐 API Gateway: http://localhost:3000${NC}"
echo -e "${GREEN}🔐 Auth Service: http://localhost:3000/auth${NC}"
echo -e "${GREEN}🌐 Nginx Load Balancer: http://localhost${NC}"
echo -e "${GREEN}🗄️  PostgreSQL: localhost:5432${NC}"
echo -e "${GREEN}📦 Redis: localhost:6379${NC}"

# Display API endpoints
echo -e "${BLUE}🔗 API Endpoints:${NC}"
echo -e "${GREEN}📚 API Documentation: http://localhost:3000/api/docs${NC}"
echo -e "${GREEN}🔐 Authentication: http://localhost:3000/auth${NC}"
echo -e "${GREEN}🏥 Health Check: http://localhost:3000/gateway/health${NC}"

# Display management commands
echo -e "${BLUE}🛠️  Management Commands:${NC}"
echo -e "${YELLOW}View logs:${NC}"
echo -e "${YELLOW}  docker-compose -f docker-compose.simple.yml logs -f${NC}"
echo -e "${YELLOW}  docker-compose -f docker-compose.simple.yml logs -f api-gateway${NC}"
echo -e "${YELLOW}Stop services:${NC}"
echo -e "${YELLOW}  docker-compose -f docker-compose.simple.yml down${NC}"
echo -e "${YELLOW}Restart services:${NC}"
echo -e "${YELLOW}  docker-compose -f docker-compose.simple.yml restart${NC}"

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}📱 Your mobile app can now connect to: http://localhost:3000${NC}"
echo -e "${YELLOW}🧪 Run authentication tests: ./scripts/test-auth.sh${NC}"

