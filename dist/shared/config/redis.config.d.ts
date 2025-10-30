declare const _default: (() => {
    host: string;
    port: number;
    password: string;
    db: number;
    connection: {
        connectTimeout: number;
        commandTimeout: number;
        retryDelayOnFailover: number;
        maxRetriesPerRequest: number;
        lazyConnect: boolean;
        keepAlive: number;
    };
    cluster: {
        enabled: boolean;
        nodes: string[];
        options: {
            redisOptions: {
                password: string;
                db: number;
            };
            enableOfflineQueue: boolean;
            maxRedirections: number;
            retryDelayOnFailover: number;
        };
    };
    session: {
        enabled: boolean;
        ttl: number;
        prefix: string;
    };
    cache: {
        enabled: boolean;
        ttl: number;
        prefix: string;
        maxMemory: string;
        evictionPolicy: string;
    };
    pubsub: {
        enabled: boolean;
        channels: {
            notifications: string;
            appointments: string;
            messages: string;
            audit: string;
        };
    };
    healthCheck: {
        enabled: boolean;
        timeout: number;
        interval: number;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    host: string;
    port: number;
    password: string;
    db: number;
    connection: {
        connectTimeout: number;
        commandTimeout: number;
        retryDelayOnFailover: number;
        maxRetriesPerRequest: number;
        lazyConnect: boolean;
        keepAlive: number;
    };
    cluster: {
        enabled: boolean;
        nodes: string[];
        options: {
            redisOptions: {
                password: string;
                db: number;
            };
            enableOfflineQueue: boolean;
            maxRedirections: number;
            retryDelayOnFailover: number;
        };
    };
    session: {
        enabled: boolean;
        ttl: number;
        prefix: string;
    };
    cache: {
        enabled: boolean;
        ttl: number;
        prefix: string;
        maxMemory: string;
        evictionPolicy: string;
    };
    pubsub: {
        enabled: boolean;
        channels: {
            notifications: string;
            appointments: string;
            messages: string;
            audit: string;
        };
    };
    healthCheck: {
        enabled: boolean;
        timeout: number;
        interval: number;
    };
}>;
export default _default;
