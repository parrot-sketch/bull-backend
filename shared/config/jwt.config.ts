import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  // JWT Configuration
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  algorithm: process.env.JWT_ALGORITHM || 'HS256',
  issuer: process.env.JWT_ISSUER || 'ihosi-healthcare',
  audience: process.env.JWT_AUDIENCE || 'ihosi-users',
  
  // Refresh Token Configuration
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-this-in-production',
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    algorithm: process.env.JWT_REFRESH_ALGORITHM || 'HS256',
  },
  
  // Access Token Configuration
  access: {
    secret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    algorithm: process.env.JWT_ACCESS_ALGORITHM || 'HS256',
  },
  
  // Token Validation Configuration
  validation: {
    clockTolerance: parseInt(process.env.JWT_CLOCK_TOLERANCE, 10) || 0,
    ignoreExpiration: process.env.JWT_IGNORE_EXPIRATION === 'true',
    ignoreNotBefore: process.env.JWT_IGNORE_NOT_BEFORE === 'true',
  },
  
  // Security Configuration
  security: {
    requireExp: process.env.JWT_REQUIRE_EXP === 'true',
    requireIat: process.env.JWT_REQUIRE_IAT === 'true',
    requireNbf: process.env.JWT_REQUIRE_NBF === 'true',
    requireSub: process.env.JWT_REQUIRE_SUB === 'true',
  },
  
  // Multi-Factor Authentication Configuration
  mfa: {
    enabled: process.env.JWT_MFA_ENABLED === 'true',
    totpSecret: process.env.JWT_MFA_TOTP_SECRET || 'ihosi-mfa-totp-secret',
    totpWindow: parseInt(process.env.JWT_MFA_TOTP_WINDOW, 10) || 2,
    backupCodes: {
      enabled: process.env.JWT_MFA_BACKUP_CODES_ENABLED === 'true',
      count: parseInt(process.env.JWT_MFA_BACKUP_CODES_COUNT, 10) || 10,
      length: parseInt(process.env.JWT_MFA_BACKUP_CODES_LENGTH, 10) || 8,
    },
  },
  
  // Session Configuration
  session: {
    enabled: process.env.JWT_SESSION_ENABLED === 'true',
    ttl: parseInt(process.env.JWT_SESSION_TTL, 10) || 86400, // 24 hours
    maxSessions: parseInt(process.env.JWT_MAX_SESSIONS, 10) || 5,
    concurrentSessions: process.env.JWT_CONCURRENT_SESSIONS === 'true',
  },
  
  // Token Blacklist Configuration
  blacklist: {
    enabled: process.env.JWT_BLACKLIST_ENABLED === 'true',
    ttl: parseInt(process.env.JWT_BLACKLIST_TTL, 10) || 86400, // 24 hours
    prefix: process.env.JWT_BLACKLIST_PREFIX || 'ihosi:blacklist:',
  },
}));
