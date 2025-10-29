declare const _default: (() => {
    secret: string;
    expiresIn: string;
    algorithm: string;
    issuer: string;
    audience: string;
    refresh: {
        secret: string;
        expiresIn: string;
        algorithm: string;
    };
    access: {
        secret: string;
        expiresIn: string;
        algorithm: string;
    };
    validation: {
        clockTolerance: number;
        ignoreExpiration: boolean;
        ignoreNotBefore: boolean;
    };
    security: {
        requireExp: boolean;
        requireIat: boolean;
        requireNbf: boolean;
        requireSub: boolean;
    };
    mfa: {
        enabled: boolean;
        totpSecret: string;
        totpWindow: number;
        backupCodes: {
            enabled: boolean;
            count: number;
            length: number;
        };
    };
    session: {
        enabled: boolean;
        ttl: number;
        maxSessions: number;
        concurrentSessions: boolean;
    };
    blacklist: {
        enabled: boolean;
        ttl: number;
        prefix: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    secret: string;
    expiresIn: string;
    algorithm: string;
    issuer: string;
    audience: string;
    refresh: {
        secret: string;
        expiresIn: string;
        algorithm: string;
    };
    access: {
        secret: string;
        expiresIn: string;
        algorithm: string;
    };
    validation: {
        clockTolerance: number;
        ignoreExpiration: boolean;
        ignoreNotBefore: boolean;
    };
    security: {
        requireExp: boolean;
        requireIat: boolean;
        requireNbf: boolean;
        requireSub: boolean;
    };
    mfa: {
        enabled: boolean;
        totpSecret: string;
        totpWindow: number;
        backupCodes: {
            enabled: boolean;
            count: number;
            length: number;
        };
    };
    session: {
        enabled: boolean;
        ttl: number;
        maxSessions: number;
        concurrentSessions: boolean;
    };
    blacklist: {
        enabled: boolean;
        ttl: number;
        prefix: string;
    };
}>;
export default _default;
