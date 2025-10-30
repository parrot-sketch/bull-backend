// Common context types
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

// Email types
export interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
}

// Token types
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  token: string; // Alias for accessToken for backward compatibility
}

// OTP / MFA types
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

// Password reset types
export interface PasswordResetResult {
  success: boolean;
  message: string;
}

// Error types
export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly httpStatus: number = 400
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Service interfaces
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
  
  resetPassword(
    email: string,
    token: string,
    newPassword: string,
    auditContext?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<PasswordResetResult>;
}