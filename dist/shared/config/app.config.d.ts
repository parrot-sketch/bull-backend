declare const _default: (() => {
    name: string;
    version: string;
    description: string;
    environment: string;
    port: number;
    apiVersion: string;
    api: {
        prefix: string;
        version: string;
        title: string;
        description: string;
        swaggerVersion: string;
        docsPath: string;
        docsEnabled: boolean;
    };
    cors: {
        origin: string[];
        credentials: boolean;
        methods: string[];
        allowedHeaders: string[];
    };
    security: {
        helmet: {
            cspEnabled: boolean;
            hstsEnabled: boolean;
        };
        rateLimit: {
            ttl: number;
            limit: number;
        };
    };
    hipaa: {
        auditLogEnabled: boolean;
        auditLogLevel: string;
        dataEncryptionEnabled: boolean;
        consentManagementEnabled: boolean;
    };
    development: {
        debugEnabled: boolean;
        hotReload: boolean;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    name: string;
    version: string;
    description: string;
    environment: string;
    port: number;
    apiVersion: string;
    api: {
        prefix: string;
        version: string;
        title: string;
        description: string;
        swaggerVersion: string;
        docsPath: string;
        docsEnabled: boolean;
    };
    cors: {
        origin: string[];
        credentials: boolean;
        methods: string[];
        allowedHeaders: string[];
    };
    security: {
        helmet: {
            cspEnabled: boolean;
            hstsEnabled: boolean;
        };
        rateLimit: {
            ttl: number;
            limit: number;
        };
    };
    hipaa: {
        auditLogEnabled: boolean;
        auditLogLevel: string;
        dataEncryptionEnabled: boolean;
        consentManagementEnabled: boolean;
    };
    development: {
        debugEnabled: boolean;
        hotReload: boolean;
    };
}>;
export default _default;
