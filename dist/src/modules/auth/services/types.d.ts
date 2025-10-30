export interface AuditContext {
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
}
export interface EmailTransportOptions {
    host: string;
    port: number;
    auth?: {
        user: string;
        pass: string;
    };
    secure?: boolean;
}
export interface EmailOptions {
    to: string;
    from: string;
    subject: string;
    text: string;
    html?: string;
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    token: string;
}
export interface OtpVerification {
    token: string;
    expiresAt: Date;
}
export interface MfaSetupResult {
    success: boolean;
    data: {
        secret: string;
        otpauthUrl: string;
    };
}
export interface MfaVerifyResult {
    success: boolean;
    data: {
        backupCodes: string[];
    };
}
export interface PasswordResetResult {
    success: boolean;
    message: string;
}
export declare class AuthError extends Error {
    readonly code: string;
    readonly httpStatus: number;
    constructor(message: string, code: string, httpStatus?: number);
}
export interface IAuthService {
    register(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: string;
    }, auditContext?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<any>;
    login(credentials: {
        email: string;
        password: string;
        mfaCode?: string;
    }, auditContext?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<any>;
    refreshToken(refreshToken: string): Promise<any>;
    logout(userId: string, auditContext?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<any>;
    setupMfa(userId: string): Promise<MfaSetupResult>;
    verifyMfa(userId: string, code: string): Promise<MfaVerifyResult>;
    requestPasswordReset(email: string, auditContext?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<PasswordResetResult>;
    resetPassword(email: string, token: string, newPassword: string, auditContext?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<PasswordResetResult>;
}
