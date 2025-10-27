declare const _default: (() => {
    url: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    pool: {
        min: number;
        max: number;
        acquireTimeoutMillis: number;
        createTimeoutMillis: number;
        destroyTimeoutMillis: number;
        idleTimeoutMillis: number;
        reapIntervalMillis: number;
        createRetryIntervalMillis: number;
    };
    ssl: {
        enabled: boolean;
        rejectUnauthorized: boolean;
        ca: string;
        cert: string;
        key: string;
    };
    migrations: {
        enabled: boolean;
        path: string;
        tableName: string;
    };
    logging: {
        enabled: boolean;
        level: string;
        slowQueryThreshold: number;
    };
    backup: {
        enabled: boolean;
        schedule: string;
        retention: number;
        path: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    url: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    pool: {
        min: number;
        max: number;
        acquireTimeoutMillis: number;
        createTimeoutMillis: number;
        destroyTimeoutMillis: number;
        idleTimeoutMillis: number;
        reapIntervalMillis: number;
        createRetryIntervalMillis: number;
    };
    ssl: {
        enabled: boolean;
        rejectUnauthorized: boolean;
        ca: string;
        cert: string;
        key: string;
    };
    migrations: {
        enabled: boolean;
        path: string;
        tableName: string;
    };
    logging: {
        enabled: boolean;
        level: string;
        slowQueryThreshold: number;
    };
    backup: {
        enabled: boolean;
        schedule: string;
        retention: number;
        path: string;
    };
}>;
export default _default;
