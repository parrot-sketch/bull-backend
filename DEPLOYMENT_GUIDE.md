# 🚀 iHosi Backend Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the iHosi healthcare backend API with authentication and API gateway functionality.

## Prerequisites

### System Requirements
- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Node.js**: Version 18 or higher (for development)
- **Git**: For cloning the repository
- **curl**: For testing endpoints

### Hardware Requirements
- **CPU**: 2+ cores
- **RAM**: 4GB+ (8GB recommended)
- **Storage**: 10GB+ free space
- **Network**: Internet connection for pulling images

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd iHosi-app/backend
```

### 2. Set Up Environment
```bash
# Copy environment template
cp env.example .env.production

# Edit environment variables
nano .env.production
```

### 3. Deploy Services
```bash
# Make deployment script executable
chmod +x src/gateway/deployment/deploy.sh

# Run deployment
./src/gateway/deployment/deploy.sh
```

### 4. Test Authentication
```bash
# Make test script executable
chmod +x scripts/test-auth.sh

# Run authentication tests
./scripts/test-auth.sh
```

## Detailed Deployment

### Step 1: Environment Configuration

Create `.env.production` file:

```bash
# Production Environment Variables
NODE_ENV=production

# Database Configuration
POSTGRES_DB=ihosi
POSTGRES_USER=ihosi
POSTGRES_PASSWORD=your-secure-password
DATABASE_URL=postgresql://ihosi:your-secure-password@postgres:5432/ihosi

# Redis Configuration
REDIS_URL=redis://redis:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Service URLs
AUTH_SERVICE_URL=http://auth-service:3001
PATIENT_SERVICE_URL=http://patient-service:3002
APPOINTMENT_SERVICE_URL=http://appointment-service:3003
COMMUNICATION_SERVICE_URL=http://communication-service:3004
FILE_SERVICE_URL=http://file-service:3005
ANALYTICS_SERVICE_URL=http://analytics-service:3006
AUDIT_SERVICE_URL=http://audit-service:3007
```

### Step 2: Deploy with Docker Compose

```bash
# Deploy all services
docker-compose -f src/gateway/deployment/docker-compose.gateway.yml up -d

# Check service status
docker-compose -f src/gateway/deployment/docker-compose.gateway.yml ps

# View logs
docker-compose -f src/gateway/deployment/docker-compose.gateway.yml logs -f
```

### Step 3: Verify Deployment

```bash
# Check API Gateway health
curl http://localhost:3000/gateway/health

# Check Auth Service health
curl http://localhost:3001/health

# Check Nginx load balancer
curl http://localhost/health
```

### Step 4: Test Authentication Flow

```bash
# Run comprehensive authentication tests
./scripts/test-auth.sh
```

## Service Architecture

### Deployed Services

| Service | Port | Health Check | Description |
|---------|------|--------------|-------------|
| **API Gateway** | 3000 | `/gateway/health` | Main gateway service |
| **Auth Service** | 3001 | `/health` | Authentication & authorization |
| **Patient Service** | 3002 | `/health` | Patient management |
| **Appointment Service** | 3003 | `/health` | Appointment scheduling |
| **Communication Service** | 3004 | `/health` | Messaging & notifications |
| **File Service** | 3005 | `/health` | File upload & management |
| **Analytics Service** | 3006 | `/health` | Analytics & reporting |
| **Audit Service** | 3007 | `/health` | Audit logging |
| **PostgreSQL** | 5432 | - | Primary database |
| **Redis** | 6379 | - | Cache & session store |
| **Nginx** | 80/443 | `/health` | Load balancer |

### API Endpoints

#### Public Endpoints (No Authentication)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset with token
- `POST /auth/verify-email` - Email verification
- `POST /auth/resend-verification` - Resend verification email

#### Protected Endpoints (Authentication Required)
- `GET /auth/me` - Get current user profile
- `PUT /auth/profile` - Update user profile
- `PUT /auth/change-password` - Change password
- `POST /auth/logout` - Logout user

#### Gateway Endpoints
- `GET /gateway/health` - Gateway health check
- `GET /gateway/stats` - Gateway statistics
- `GET /gateway/services/:serviceName/*` - Route to microservices

## Mobile App Integration

### API Base URL
```
http://localhost:3000
```

### Authentication Flow

1. **Register User**:
   ```bash
   POST /auth/register
   {
     "email": "user@example.com",
     "password": "SecurePass123!",
     "firstName": "John",
     "lastName": "Doe",
     "role": "PATIENT"
   }
   ```

2. **Login User**:
   ```bash
   POST /auth/login
   {
     "email": "user@example.com",
     "password": "SecurePass123!"
   }
   ```

3. **Use Access Token**:
   ```bash
   GET /auth/me
   Authorization: Bearer <access-token>
   ```

### Example Mobile App Code

```typescript
// API Client Configuration
const API_BASE_URL = 'http://localhost:3000';

// Authentication Service
class AuthService {
  async register(userData: RegisterData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  async getCurrentUser(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  }
}
```

## Production Deployment

### 1. Environment Setup

```bash
# Create production environment
cp .env.production .env

# Update with production values
nano .env
```

### 2. Security Configuration

```bash
# Generate secure JWT secrets
openssl rand -base64 32
openssl rand -base64 32

# Update database passwords
# Update Redis passwords
# Configure SSL certificates
```

### 3. SSL Configuration

```bash
# Create SSL directory
mkdir -p src/gateway/deployment/nginx/ssl

# Copy SSL certificates
cp your-cert.pem src/gateway/deployment/nginx/ssl/cert.pem
cp your-key.pem src/gateway/deployment/nginx/ssl/key.pem
```

### 4. Production Deployment

```bash
# Deploy with production configuration
docker-compose -f src/gateway/deployment/docker-compose.gateway.yml up -d

# Verify deployment
curl https://your-domain.com/health
```

## Monitoring and Maintenance

### Health Monitoring

```bash
# Check all services
curl http://localhost:3000/gateway/health

# Check individual services
curl http://localhost:3001/health
curl http://localhost:3002/health
```

### Log Monitoring

```bash
# View all logs
docker-compose -f src/gateway/deployment/docker-compose.gateway.yml logs -f

# View specific service logs
docker-compose -f src/gateway/deployment/docker-compose.gateway.yml logs -f api-gateway
docker-compose -f src/gateway/deployment/docker-compose.gateway.yml logs -f auth-service
```

### Performance Monitoring

```bash
# Check service statistics
curl http://localhost:3000/gateway/stats

# Monitor resource usage
docker stats
```

## Troubleshooting

### Common Issues

1. **Services Not Starting**:
   ```bash
   # Check Docker status
   docker ps
   
   # Check service logs
   docker-compose -f src/gateway/deployment/docker-compose.gateway.yml logs
   ```

2. **Database Connection Issues**:
   ```bash
   # Check PostgreSQL status
   docker-compose -f src/gateway/deployment/docker-compose.gateway.yml logs postgres
   
   # Test database connection
   docker-compose -f src/gateway/deployment/docker-compose.gateway.yml exec postgres psql -U ihosi -d ihosi
   ```

3. **Authentication Issues**:
   ```bash
   # Check auth service logs
   docker-compose -f src/gateway/deployment/docker-compose.gateway.yml logs auth-service
   
   # Test authentication endpoints
   curl http://localhost:3000/auth/health
   ```

4. **Network Issues**:
   ```bash
   # Check network connectivity
   docker network ls
   docker network inspect ihosi-network
   ```

### Debug Commands

```bash
# Check service status
docker-compose -f src/gateway/deployment/docker-compose.gateway.yml ps

# Restart services
docker-compose -f src/gateway/deployment/docker-compose.gateway.yml restart

# Update services
docker-compose -f src/gateway/deployment/docker-compose.gateway.yml pull
docker-compose -f src/gateway/deployment/docker-compose.gateway.yml up -d
```

## Scaling

### Horizontal Scaling

```bash
# Scale specific services
docker-compose -f src/gateway/deployment/docker-compose.gateway.yml up -d --scale auth-service=3
docker-compose -f src/gateway/deployment/docker-compose.gateway.yml up -d --scale patient-service=2
```

### Load Balancing

The Nginx load balancer automatically distributes traffic across multiple service instances.

## Backup and Recovery

### Database Backup

```bash
# Create database backup
docker-compose -f src/gateway/deployment/docker-compose.gateway.yml exec postgres pg_dump -U ihosi ihosi > backup.sql

# Restore database
docker-compose -f src/gateway/deployment/docker-compose.gateway.yml exec -T postgres psql -U ihosi ihosi < backup.sql
```

### Configuration Backup

```bash
# Backup environment files
cp .env.production .env.production.backup
cp src/gateway/deployment/nginx.conf nginx.conf.backup
```

## Security Considerations

### Production Security

1. **Change Default Passwords**: Update all default passwords
2. **Use Strong JWT Secrets**: Generate cryptographically secure secrets
3. **Enable HTTPS**: Use SSL certificates in production
4. **Firewall Configuration**: Restrict access to necessary ports
5. **Regular Updates**: Keep Docker images and dependencies updated

### Network Security

1. **Internal Networks**: Use Docker internal networks
2. **Port Exposure**: Only expose necessary ports
3. **SSL/TLS**: Encrypt all communications
4. **Rate Limiting**: Implement rate limiting for API endpoints

## Support

### Documentation
- API Documentation: `http://localhost:3000/api/docs`
- Health Checks: `http://localhost:3000/gateway/health`
- Service Stats: `http://localhost:3000/gateway/stats`

### Logs
- Application Logs: Docker container logs
- Access Logs: Nginx access logs
- Error Logs: Application error logs

### Monitoring
- Health Monitoring: Automated health checks
- Performance Monitoring: Response time tracking
- Error Monitoring: Error rate tracking
