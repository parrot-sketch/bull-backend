# 🚀 iHosi Backend Setup Guide

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### 1. Clone and Setup
```bash
# Navigate to backend directory
cd backend

# Run setup script
./scripts/setup.sh
```

### 2. Manual Setup (Alternative)
```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start development services
docker-compose up -d

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Start development server
npm run start:dev
```

## Development Services

The setup includes the following services:

| Service | URL | Purpose |
|---------|-----|---------|
| **API Server** | http://localhost:3000 | Main application |
| **API Docs** | http://localhost:3000/api/docs | Swagger documentation |
| **PostgreSQL** | localhost:5432 | Primary database |
| **Redis** | localhost:6379 | Cache and sessions |
| **Elasticsearch** | http://localhost:9200 | Search engine |
| **Kibana** | http://localhost:5601 | Log analysis |
| **Kafka** | localhost:9092 | Message queue |
| **Prometheus** | http://localhost:9090 | Metrics collection |
| **Grafana** | http://localhost:3001 | Monitoring dashboard |
| **Mailhog** | http://localhost:8025 | Email testing |
| **MinIO** | http://localhost:9001 | File storage |

## Environment Configuration

Update the `.env` file with your configuration:

```bash
# Database
DATABASE_URL="postgresql://ihosi_user:ihosi_password@localhost:5432/ihosi_healthcare?schema=public"

# JWT Secrets (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Available Scripts

```bash
# Development
npm run start:dev          # Start development server
npm run start:debug        # Start with debugging
npm run build              # Build for production
npm run start:prod         # Start production server

# Database
npm run db:generate        # Generate Prisma client
npm run db:push            # Push schema to database
npm run db:migrate         # Run migrations
npm run db:seed            # Seed database
npm run db:studio          # Open Prisma Studio

# Docker
npm run docker:up          # Start all services
npm run docker:down        # Stop all services
npm run docker:logs        # View logs

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
npm run security:audit     # Run security audit
npm run security:scan      # Run Snyk security scan
```

## Project Structure

```
backend/
├── apps/                          # Microservices (future)
├── libs/                          # Shared libraries
│   ├── common/                    # Common utilities
│   ├── database/                  # Database utilities
│   ├── security/                  # Security utilities
│   ├── validation/                # Validation utilities
│   └── logging/                   # Logging utilities
├── shared/                        # Shared configurations
│   ├── config/                    # Configuration files
│   ├── types/                     # TypeScript types
│   └── constants/                 # Application constants
├── src/                          # Main application
│   ├── health/                   # Health check endpoints
│   ├── app.module.ts             # Main application module
│   └── main.ts                   # Application entry point
├── prisma/                       # Database schema and migrations
├── infrastructure/               # Infrastructure as Code
├── scripts/                      # Build and deployment scripts
└── docs/                        # Documentation
```

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities:

- **Users**: Authentication and user management
- **Patients**: Patient records and medical information
- **Appointments**: Scheduling and appointment management
- **Messages**: Communication system
- **Notifications**: Alert and notification system
- **AuditLogs**: Compliance and audit tracking

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API abuse prevention
- **CORS Protection**: Cross-origin request security
- **Helmet Security**: HTTP security headers
- **Audit Logging**: Comprehensive activity tracking

## Monitoring and Observability

- **Health Checks**: Application and database health monitoring
- **Metrics**: Prometheus metrics collection
- **Logging**: Structured logging with Winston
- **Tracing**: Request correlation and tracing
- **Alerting**: Automated alerting system

## Development Workflow

1. **Start Services**: `docker-compose up -d`
2. **Run Migrations**: `npm run db:migrate`
3. **Start Development**: `npm run start:dev`
4. **View Documentation**: http://localhost:3000/api/docs
5. **Monitor Services**: http://localhost:3001 (Grafana)

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 3000, 5432, 6379, 9200 are available
2. **Database Connection**: Check PostgreSQL is running and accessible
3. **Redis Connection**: Verify Redis is running on port 6379
4. **Permission Issues**: Ensure Docker has proper permissions

### Reset Everything

```bash
# Stop all services
docker-compose down -v

# Remove all volumes
docker volume prune -f

# Start fresh
./scripts/setup.sh
```

### Database Reset

```bash
# Reset database
npm run db:push --force-reset

# Seed database
npm run db:seed
```

## Next Steps

1. **Authentication Service**: Implement user authentication
2. **Patient Service**: Build patient management
3. **Appointment Service**: Create scheduling system
4. **Communication Service**: Add messaging features
5. **File Service**: Implement file upload/management
6. **Analytics Service**: Add reporting capabilities
7. **Audit Service**: Complete compliance features

## Support

For issues and questions:
- Check the logs: `npm run docker:logs`
- Review documentation: `/docs` folder
- Create an issue in the repository
- Contact the development team
