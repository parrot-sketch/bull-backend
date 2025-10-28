"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => ({
    url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/ihosi_healthcare?schema=public',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME || 'username',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'ihosi_healthcare',
    pool: {
        min: parseInt(process.env.DATABASE_POOL_MIN, 10) || 2,
        max: parseInt(process.env.DATABASE_POOL_MAX, 10) || 10,
        acquireTimeoutMillis: parseInt(process.env.DATABASE_ACQUIRE_TIMEOUT, 10) || 60000,
        createTimeoutMillis: parseInt(process.env.DATABASE_CREATE_TIMEOUT, 10) || 30000,
        destroyTimeoutMillis: parseInt(process.env.DATABASE_DESTROY_TIMEOUT, 10) || 5000,
        idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT, 10) || 30000,
        reapIntervalMillis: parseInt(process.env.DATABASE_REAP_INTERVAL, 10) || 1000,
        createRetryIntervalMillis: parseInt(process.env.DATABASE_CREATE_RETRY_INTERVAL, 10) || 200,
    },
    ssl: {
        enabled: process.env.DATABASE_SSL_ENABLED === 'true',
        rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true',
        ca: process.env.DATABASE_SSL_CA,
        cert: process.env.DATABASE_SSL_CERT,
        key: process.env.DATABASE_SSL_KEY,
    },
    migrations: {
        enabled: process.env.DATABASE_MIGRATIONS_ENABLED === 'true',
        path: process.env.DATABASE_MIGRATIONS_PATH || './prisma/migrations',
        tableName: process.env.DATABASE_MIGRATIONS_TABLE || '_prisma_migrations',
    },
    logging: {
        enabled: process.env.DATABASE_LOGGING_ENABLED === 'true',
        level: process.env.DATABASE_LOGGING_LEVEL || 'query',
        slowQueryThreshold: parseInt(process.env.DATABASE_SLOW_QUERY_THRESHOLD, 10) || 1000,
    },
    backup: {
        enabled: process.env.DATABASE_BACKUP_ENABLED === 'true',
        schedule: process.env.DATABASE_BACKUP_SCHEDULE || '0 2 * * *',
        retention: parseInt(process.env.DATABASE_BACKUP_RETENTION, 10) || 30,
        path: process.env.DATABASE_BACKUP_PATH || './backups',
    },
}));
//# sourceMappingURL=database.config.js.map