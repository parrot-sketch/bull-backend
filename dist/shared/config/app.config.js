"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    name: process.env.APP_NAME || 'iHosi Healthcare API',
    version: process.env.APP_VERSION || '1.0.0',
    description: process.env.APP_DESCRIPTION || 'Enterprise Healthcare Information Management System',
    environment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    apiVersion: process.env.API_VERSION || 'v1',
    api: {
        prefix: process.env.API_PREFIX || 'api',
        version: process.env.API_VERSION || 'v1',
        title: process.env.SWAGGER_TITLE || 'iHosi Healthcare API',
        description: process.env.SWAGGER_DESCRIPTION || 'Enterprise Healthcare Information Management System',
        swaggerVersion: process.env.SWAGGER_VERSION || '1.0.0',
        docsPath: process.env.API_DOCS_PATH || '/api/docs',
        docsEnabled: process.env.API_DOCS_ENABLED === 'true',
    },
    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
        credentials: process.env.CORS_CREDENTIALS === 'true',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    },
    security: {
        helmet: {
            cspEnabled: process.env.HELMET_CSP_ENABLED === 'true',
            hstsEnabled: process.env.HELMET_HSTS_ENABLED === 'true',
        },
        rateLimit: {
            ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
            limit: parseInt(process.env.RATE_LIMIT_LIMIT, 10) || 100,
        },
    },
    hipaa: {
        auditLogEnabled: process.env.AUDIT_LOG_ENABLED === 'true',
        auditLogLevel: process.env.AUDIT_LOG_LEVEL || 'info',
        dataEncryptionEnabled: process.env.DATA_ENCRYPTION_ENABLED === 'true',
        consentManagementEnabled: process.env.CONSENT_MANAGEMENT_ENABLED === 'true',
    },
    development: {
        debugEnabled: process.env.DEBUG_ENABLED === 'true',
        hotReload: process.env.NODE_ENV === 'development',
    },
}));
//# sourceMappingURL=app.config.js.map