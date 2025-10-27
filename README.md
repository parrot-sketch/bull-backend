# 🏥 iHosi Backend - Enterprise Healthcare API

## Project Structure

This is the backend implementation for the iHosi healthcare application, built with enterprise-grade architecture principles.

## Architecture Overview

- **Monorepo Structure**: Organized for easy microservice extraction
- **Domain-Driven Design**: Services organized by healthcare domains
- **TypeScript First**: Full type safety across the application
- **NestJS Framework**: Enterprise-grade Node.js framework
- **Prisma ORM**: Type-safe database access
- **Microservices Ready**: Can be easily split into independent services

## Services

### Core Services
- **API Gateway**: Request routing, authentication, rate limiting
- **Auth Service**: Authentication, authorization, user management
- **Patient Service**: Patient management, medical records
- **Appointment Service**: Scheduling, availability management
- **Communication Service**: Messaging, notifications
- **File Service**: Document and media management
- **Analytics Service**: Reporting and business intelligence
- **Audit Service**: Compliance and audit logging

### Shared Libraries
- **Common**: Shared utilities, types, and configurations
- **Database**: Prisma schema and database utilities
- **Security**: Authentication, encryption, and security utilities
- **Validation**: Request validation and sanitization
- **Logging**: Centralized logging and monitoring

## Development Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose

### Quick Start
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Configure your environment variables

# Start development services
docker-compose up -d

# Run database migrations
npm run db:migrate

# Start development server
npm run start:dev
```

## Project Structure

```
backend/
├── apps/                          # Application services
│   ├── api-gateway/              # API Gateway service
│   ├── auth-service/             # Authentication service
│   ├── patient-service/          # Patient management service
│   ├── appointment-service/      # Appointment scheduling service
│   ├── communication-service/    # Messaging service
│   ├── file-service/            # File management service
│   ├── analytics-service/        # Analytics and reporting
│   └── audit-service/           # Audit and compliance
├── libs/                         # Shared libraries
│   ├── common/                  # Common utilities
│   ├── database/                # Database utilities
│   ├── security/                # Security utilities
│   ├── validation/              # Validation utilities
│   └── logging/                 # Logging utilities
├── shared/                      # Shared configurations
│   ├── config/                 # Environment configurations
│   ├── types/                  # TypeScript type definitions
│   └── constants/              # Application constants
├── infrastructure/              # Infrastructure as Code
│   ├── docker/                 # Docker configurations
│   ├── kubernetes/             # Kubernetes manifests
│   └── terraform/              # Terraform configurations
├── docs/                       # Documentation
├── tests/                      # Test suites
└── scripts/                   # Build and deployment scripts
```

## Technology Stack

- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: NestJS with microservices support
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for sessions and caching
- **Message Queue**: Apache Kafka for event streaming
- **Search**: Elasticsearch for full-text search
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Container**: Docker + Kubernetes
- **CI/CD**: GitHub Actions

## Development Guidelines

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with healthcare-specific rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality assurance
- **Jest**: Comprehensive testing suite

### Security Standards
- **HIPAA Compliance**: Healthcare data protection
- **Input Validation**: All inputs validated and sanitized
- **SQL Injection Prevention**: Parameterized queries only
- **XSS Protection**: Output encoding and CSP headers
- **Rate Limiting**: API abuse prevention
- **Audit Logging**: Comprehensive activity logging

### Testing Strategy
- **Unit Tests**: Individual function testing
- **Integration Tests**: Service integration testing
- **E2E Tests**: End-to-end workflow testing
- **Security Tests**: Penetration testing and vulnerability scanning
- **Performance Tests**: Load testing and performance monitoring

## Deployment

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Docker
```bash
docker-compose up -d
```

### Kubernetes
```bash
kubectl apply -f infrastructure/kubernetes/
```

## Monitoring

### Health Checks
- **Liveness**: Service health monitoring
- **Readiness**: Service readiness checks
- **Startup**: Service startup validation

### Metrics
- **Application Metrics**: Custom business metrics
- **Infrastructure Metrics**: System resource usage
- **Security Metrics**: Security event monitoring
- **Performance Metrics**: Response times and throughput

### Logging
- **Structured Logging**: JSON format with correlation IDs
- **Log Levels**: Debug, Info, Warn, Error, Fatal
- **Audit Logging**: All user actions logged
- **Error Tracking**: Comprehensive error monitoring

## Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests for new functionality**
5. **Ensure all tests pass**
6. **Submit a pull request**

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
