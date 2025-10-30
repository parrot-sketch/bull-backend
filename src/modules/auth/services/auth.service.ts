// Core NestJS imports
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Database and services
import { PrismaService } from '../../../../libs/database/src/prisma.service';
import { UserRepository } from '../../../../libs/database/src/repositories/user.repository';
import { AuditService } from './audit.service';
import { EmailService } from './email.service';

// Domain types
import { UserRole } from '../../../common/enums/user-role.enum';

// Third party dependencies
import * as sgMail from '@sendgrid/mail';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import * as speakeasy from 'speakeasy';
import { OAuth2Client } from 'google-auth-library';

// Type definitions
import {
  IAuthService
} from './types';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name);
  
  // Authentication settings
  private readonly jwtSecret = process.env.JWT_SECRET!; // required via module
  private readonly jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
  private readonly refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
  private readonly bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

  // Email settings
  private readonly fromEmail = process.env.FROM_EMAIL || process.env.SMTP_FROM || 'noreply@ihosi.com';
  private readonly fromName = process.env.FROM_NAME || 'iHosi';
  private readonly googleClientIds = [
    process.env.GOOGLE_CLIENT_ID_ANDROID,
    process.env.GOOGLE_CLIENT_ID_IOS,
    process.env.GOOGLE_CLIENT_ID_WEB,
  ].filter(Boolean) as string[];

  // Valid user roles
  private readonly VALID_ROLES: UserRole[] = [
    UserRole.PATIENT,
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.ADMIN,
    UserRole.TECHNICIAN,
    UserRole.RECEPTIONIST,
  ];

  constructor(
    private readonly userRepo: UserRepository,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
    private readonly emailService: EmailService,
  ) {
    this.logger.log('AuthService initialized with email sender:', this.fromEmail);
  }

  /**
   * Helper: create nodemailer transporter using environment variables (Mailhog or real SMTP)
   *
   * Behavior:
   * - If EMAIL_SERVICE is set to 'sendgrid' we prefer the SendGrid HTTP API and return null here
   *   (the sendEmail helper will use the SendGrid SDK). This ensures the code path is explicit
   *   and controlled by configuration.
   * - If EMAIL_SERVICE is not 'sendgrid', or SendGrid is not configured, we create an SMTP
   *   transporter. This fallback is intentionally kept for local development (MailHog) or
   *   environments where only SMTP is available.
   */
  private createMailer() {
    const emailService = (process.env.EMAIL_SERVICE || '').toLowerCase();

    // If explicitly configured to use SendGrid, signal that by returning null so callers
    // use the SendGrid HTTP API path. Rely on the sendEmail helper to validate the API key.
    if (emailService === 'sendgrid') {
      return null;
    }

    // Fallback to generic SMTP configuration (Mailhog/dev or any SMTP provider)
    const host = process.env.SMTP_HOST || 'localhost';
    const port = parseInt(process.env.SMTP_PORT || '1025', 10); // Mailhog default 1025
    const user = process.env.SMTP_USER || undefined;
    const pass = process.env.SMTP_PASS || undefined;

    const transportOptions: any = { host, port };
    if (user && pass) {
      transportOptions.auth = { user, pass };
      transportOptions.secure = Number(port) === 465; // use secure only on 465
    }

    return nodemailer.createTransport(transportOptions);
  }

  // Unified sendEmail helper - uses SendGrid HTTP API when available, otherwise nodemailer transport
  private async sendEmail(opts: { to: string; from: string; subject: string; text: string; html?: string }) {
    const emailService = (process.env.EMAIL_SERVICE || '').toLowerCase();

    // If configured to use SendGrid, use the SDK and throw/log if missing
    if (emailService === 'sendgrid') {
      const sendgridKey = process.env.SENDGRID_API_KEY;
      if (!sendgridKey) {
        console.error('EMAIL_SERVICE=sendgrid but SENDGRID_API_KEY is not set');
        throw new Error('SendGrid API key not configured');
      }

      try {
        sgMail.setApiKey(sendgridKey);
        await sgMail.send({
          to: opts.to,
          from: opts.from,
          subject: opts.subject,
          text: opts.text,
          html: opts.html,
        });
        return;
      } catch (err) {
        console.error('SendGrid send failed:', err);
        throw err; // bubble up so caller can decide (we don't silently fallback when explicitly configured)
      }
    }

    // Otherwise use SMTP transporter (local dev / MailHog / legacy SMTP)
    try {
      const transporter = this.createMailer();
      if (!transporter) {
        throw new Error('SMTP transporter not available');
      }
      await transporter.sendMail({ from: opts.from, to: opts.to, subject: opts.subject, text: opts.text, html: opts.html });
    } catch (err) {
      console.error('SMTP send failed:', err);
      // Do not rethrow here - email delivery failures should not break the calling flow
    }
  }

  // Helper: hash token using SHA-256 for storage
  private hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }, auditContext?: { ipAddress?: string; userAgent?: string }) {
    try {
      // Normalize and validate email
      const normalizedEmail = this.normalizeEmail(userData.email);
      
      // Validate and sanitize name fields
      const sanitizedFirstName = this.sanitizeName(userData.firstName);
      const sanitizedLastName = this.sanitizeName(userData.lastName);
      
      // Validate role
      const validatedRole = this.validateRole(userData.role);

      // Check if user already exists (with normalized email)
      const existingUser = await this.userRepo.findByEmail(normalizedEmail);

      if (existingUser) {
        await this.auditService.log('REGISTER_FAILED', {
          resource: 'USER',
          ipAddress: auditContext?.ipAddress,
          userAgent: auditContext?.userAgent,
          metadata: { email: normalizedEmail, reason: 'EMAIL_EXISTS' },
          severity: 'WARN',
        });
        throw new ConflictException('User with this email already exists');
      }

      // Hash password with configurable rounds (default 12 for production-grade security)
      let hashedPassword: string;
      try {
        hashedPassword = await bcrypt.hash(userData.password, this.bcryptRounds);
      } catch (error) {
        console.error('Password hashing failed:', error);
        await this.auditService.log('REGISTER_FAILED', {
          resource: 'USER',
          ipAddress: auditContext?.ipAddress,
          userAgent: auditContext?.userAgent,
          metadata: { email: normalizedEmail, reason: 'PASSWORD_HASH_ERROR' },
          severity: 'ERROR',
        });
        throw new BadRequestException('Registration failed. Please try again.');
      }

      // Calculate refresh token expiry from environment variable
      const refreshTokenExpiryMs = this.parseExpiryToMilliseconds(this.refreshTokenExpiresIn);

  // Create user and session atomically in a transaction
  const result = await this.prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            email: normalizedEmail,
            password: hashedPassword,
            firstName: sanitizedFirstName,
            lastName: sanitizedLastName,
            role: validatedRole,
          },
        });

        // Generate tokens
        const tokens = this.generateJwtPair(user.id);

        // Create session
        await tx.userSession.create({
          data: {
            userId: user.id,
            refreshToken: tokens.refreshToken,
            expiresAt: new Date(Date.now() + refreshTokenExpiryMs),
            isActive: true,
            ipAddress: auditContext?.ipAddress,
            userAgent: auditContext?.userAgent,
          },
        });

        return { user, tokens };
      });

      // Audit successful registration (outside transaction to not block on audit failure)
      await this.auditService.log('REGISTER_SUCCESS', {
        userId: result.user.id,
        resource: 'USER',
        resourceId: result.user.id,
        ipAddress: auditContext?.ipAddress,
        userAgent: auditContext?.userAgent,
        metadata: { email: normalizedEmail, role: result.user.role },
        severity: 'INFO',
      }).catch((error) => {
        // Log audit failure but don't fail registration
        console.error('Audit logging failed:', error);
      });

      return {
        success: true,
        message: 'User registered successfully',
        user: this.mapUserToResponse(result.user),
        ...result.tokens,
      };
    } catch (error) {
      // Re-throw known exceptions
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      // Log unexpected errors
      console.error('Unexpected registration error:', error);
      await this.auditService.log('REGISTER_FAILED', {
        resource: 'USER',
        ipAddress: auditContext?.ipAddress,
        userAgent: auditContext?.userAgent,
        metadata: { 
          email: userData.email, 
          reason: 'UNEXPECTED_ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        severity: 'ERROR',
      }).catch(() => {
        // Ignore audit failures during error handling
      });

      throw new BadRequestException('Registration failed. Please try again.');
    }
  }

  async login(credentials: { email: string; password: string; mfaCode?: string }, auditContext?: { ipAddress?: string; userAgent?: string }) {
    console.log('🔐 Login attempt for:', credentials.email);
    
    // Normalize email for lookup
    const normalizedEmail = this.normalizeEmail(credentials.email);
    
    // Find user
    const user = await this.userRepo.findByEmail(normalizedEmail);

    console.log('👤 User found:', !!user);
    console.log('👤 User active:', user?.isActive);
    console.log('👤 User verified:', user?.isVerified);

    if (!user || !user.isActive) {
      console.log('❌ User not found or not active');
      await this.auditService.log('LOGIN_FAILED', {
        resource: 'USER',
        ipAddress: auditContext?.ipAddress,
        userAgent: auditContext?.userAgent,
        metadata: { email: credentials.email, reason: 'USER_NOT_FOUND_OR_INACTIVE' },
        severity: 'WARN',
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    console.log('🔑 Comparing password...');
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    console.log('🔑 Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      await this.auditService.log('LOGIN_FAILED', {
        userId: user.id,
        resource: 'USER',
        resourceId: user.id,
        ipAddress: auditContext?.ipAddress,
        userAgent: auditContext?.userAgent,
        metadata: { email: credentials.email, reason: 'INVALID_PASSWORD' },
        severity: 'WARN',
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // MFA check
  const mfaSettings = await this.prisma.mfaSettings.findUnique({ where: { userId: user.id } });
    if (mfaSettings?.isEnabled) {
      if (!credentials.mfaCode) {
        await this.auditService.log('LOGIN_MFA_REQUIRED', {
          userId: user.id,
          resource: 'USER',
          resourceId: user.id,
          ipAddress: auditContext?.ipAddress,
          userAgent: auditContext?.userAgent,
          severity: 'INFO',
        });
        return {
          success: true,
          mfaRequired: true,
          user: this.mapUserToResponse(user),
        };
      }
      const validMfa = speakeasy.totp.verify({
        secret: mfaSettings.secret || '',
        encoding: 'base32',
        token: credentials.mfaCode,
        window: 1,
      });
      if (!validMfa) {
        await this.auditService.log('LOGIN_FAILED', {
          userId: user.id,
          resource: 'USER',
          resourceId: user.id,
          ipAddress: auditContext?.ipAddress,
          userAgent: auditContext?.userAgent,
          metadata: { reason: 'INVALID_MFA_CODE' },
          severity: 'WARN',
        });
        throw new UnauthorizedException('Invalid MFA code');
      }
    }

    // Generate tokens and create session explicitly
    const tokens = this.generateJwtPair(user.id);
    const refreshTokenExpiryMs = this.parseExpiryToMilliseconds(this.refreshTokenExpiresIn);
    await this.userRepo.createSession(user.id, tokens.refreshToken, new Date(Date.now() + refreshTokenExpiryMs), {
      ipAddress: auditContext?.ipAddress,
      userAgent: auditContext?.userAgent,
    });

    // Audit successful login
    await this.auditService.log('LOGIN_SUCCESS', {
      userId: user.id,
      resource: 'USER',
      resourceId: user.id,
      ipAddress: auditContext?.ipAddress,
      userAgent: auditContext?.userAgent,
      metadata: { email: normalizedEmail, role: user.role },
      severity: 'INFO',
    });

    return {
      success: true,
      user: this.mapUserToResponse(user),
      ...tokens,
    };
  }

  // MFA: Setup TOTP
  async setupMfa(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const secret = speakeasy.generateSecret({ name: `iHosi (${user.email})`, length: 20 });
    await this.prisma.mfaSettings.upsert({
      where: { userId },
      update: { secret: secret.base32, method: 'TOTP', isEnabled: false },
      create: { userId, secret: secret.base32, method: 'TOTP', isEnabled: false },
    });
    await this.auditService.log('MFA_SETUP_REQUESTED', { userId, resource: 'USER', resourceId: userId, severity: 'INFO' });
    return { success: true, data: { secret: secret.base32, otpauthUrl: secret.otpauth_url } };
  }

  // MFA: Verify and enable
  async verifyMfa(userId: string, code: string) {
    const settings = await this.prisma.mfaSettings.findUnique({ where: { userId } });
    if (!settings || !settings.secret) {
      throw new BadRequestException('MFA not initialized');
    }
    const verified = speakeasy.totp.verify({ secret: settings.secret, encoding: 'base32', token: code, window: 1 });
    if (!verified) {
      throw new UnauthorizedException('Invalid MFA code');
    }
    const backupCodes = Array.from({ length: 8 }).map(() => Math.random().toString(36).slice(2, 10));
  await this.prisma.mfaSettings.update({ where: { userId }, data: { isEnabled: true, backupCodes } });
    await this.auditService.log('MFA_ENABLED', { userId, resource: 'USER', resourceId: userId, severity: 'INFO' });
    return { success: true, data: { backupCodes } };
  }

  async refreshToken(refreshToken: string) {
    // Find session
    const session = await this.prisma.userSession.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || !session.isActive || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new token pair (no new session)
    const tokens = this.generateJwtPair(session.userId);

    // Update session with new refresh token
    const refreshTokenExpiryMs = this.parseExpiryToMilliseconds(this.refreshTokenExpiresIn);
    await this.prisma.userSession.update({
      where: { id: session.id },
      data: {
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + refreshTokenExpiryMs),
      },
    });

    return {
      success: true,
      data: {
        user: this.mapUserToResponse(session.user),
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }

  async logout(userId: string, auditContext?: { ipAddress?: string; userAgent?: string }) {
    // Deactivate all user sessions
    await this.userRepo.invalidateSessions(userId);

    // Audit logout
    await this.auditService.log('LOGOUT_SUCCESS', {
      userId,
      resource: 'USER',
      resourceId: userId,
      ipAddress: auditContext?.ipAddress,
      userAgent: auditContext?.userAgent,
      metadata: { userId },
      severity: 'INFO',
    });

    return {
      success: true,
      message: 'Logout successful',
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      success: true,
      data: this.mapUserToResponse(user),
    };
  }

  /**
   * Request a password reset for an email - generates a 6-digit OTP, stores a hashed token and expiry,
   * and sends the OTP to the user's preferred channel (email/SMS). For security we always return success
   * regardless of whether the user exists to avoid account enumeration.
   */
  async requestPasswordReset(email: string, auditContext?: { ipAddress?: string; userAgent?: string }) {
    const normalizedEmail = this.normalizeEmail(email);

    try {
      const user = await this.userRepo.findByEmail(normalizedEmail);

      // Always respond success to avoid revealing whether the email exists
      if (!user) {
        await this.auditService.log('PASSWORD_RESET_REQUEST_UNKNOWN_EMAIL', {
          resource: 'USER',
          ipAddress: auditContext?.ipAddress,
          userAgent: auditContext?.userAgent,
          metadata: { email: normalizedEmail },
          severity: 'INFO',
        }).catch(() => {});
        return { success: true, message: 'If an account with that email exists, an OTP has been sent.' };
      }

      // Generate a 6-digit numeric OTP (not cryptographically long, but suitable for OTP)
      const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
      const hashed = this.hashToken(otp);
      const expiresMs = parseInt(process.env.PASSWORD_RESET_EXPIRES_MS || String(15 * 60 * 1000), 10);
      const expiresAt = new Date(Date.now() + expiresMs);

      // Store hashed token and expiry on user record
      await this.userRepo.updateUser(user.id, { passwordResetToken: hashed, passwordResetExpires: expiresAt });

      // Send OTP via email using EmailService
      const from = this.fromName ? `${this.fromName} <${this.fromEmail}>` : this.fromEmail;
      const subject = `${this.fromName} Password Reset Code`;
      const text = `Your ${this.fromName} password reset code is: ${otp}. It will expire in ${Math.round(expiresMs / 60000)} minutes. If you did not request this, please ignore this message.`;
      const html = `<p>Your ${this.fromName} password reset code is: <strong>${otp}</strong></p>
                  <p>It will expire in ${Math.round(expiresMs / 60000)} minutes.</p>
                  <p>If you did not request this, please ignore this message.</p>`;

      // Try to send email via EmailService
      try {
        await this.emailService.sendEmail({
          to: user.email,
          from,
          subject,
          text,
          html,
        });
        this.logger.debug(`Password reset email sent to ${user.email}`);
      } catch (err) {
        this.logger.error('Failed to send password reset email:', err);
      }

      await this.auditService.log('PASSWORD_RESET_REQUESTED', {
        userId: user.id,
        resource: 'USER',
        resourceId: user.id,
        ipAddress: auditContext?.ipAddress,
        userAgent: auditContext?.userAgent,
        metadata: { email: normalizedEmail, method: 'OTP' },
        severity: 'INFO',
      }).catch(() => {});

      return { success: true, message: 'If an account with that email exists, an OTP has been sent.' };
    } catch (error) {
      console.error('requestPasswordReset error:', error);
      // For security, respond success but log server error
      await this.auditService.log('PASSWORD_RESET_ERROR', {
        resource: 'USER',
        ipAddress: auditContext?.ipAddress,
        userAgent: auditContext?.userAgent,
        metadata: { email: normalizedEmail, error: error instanceof Error ? error.message : 'Unknown' },
        severity: 'ERROR',
      }).catch(() => {});
      return { success: true, message: 'If an account with that email exists, an OTP has been sent.' };
    }
  }

  /**
   * Reset password using the OTP/token previously issued. Token is expected to be the plaintext OTP
   * which will be hashed and compared to the stored hash. On success, update the user's password and
   * clear reset fields and invalidate sessions.
   */
  async resetPassword(email: string, token: string, newPassword: string, auditContext?: { ipAddress?: string; userAgent?: string }) {
    const normalizedEmail = this.normalizeEmail(email);
    const hashedToken = this.hashToken(token);

    const user = await this.userRepo.findByEmail(normalizedEmail);
    if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
      // Do not reveal missing token/user
      throw new BadRequestException('Invalid token or expired');
    }

    if (user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Token has expired');
    }

    if (user.passwordResetToken !== hashedToken) {
      await this.auditService.log('PASSWORD_RESET_INVALID_TOKEN', {
        userId: user.id,
        resource: 'USER',
        resourceId: user.id,
        ipAddress: auditContext?.ipAddress,
        userAgent: auditContext?.userAgent,
        metadata: { email: normalizedEmail },
        severity: 'WARN',
      }).catch(() => {});
      throw new BadRequestException('Invalid token or expired');
    }

    // Hash new password and update user, clear reset token, and invalidate sessions
    const newHashed = await bcrypt.hash(newPassword, this.bcryptRounds);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: user.id }, data: { password: newHashed, passwordResetToken: null, passwordResetExpires: null, lastPasswordChange: new Date() } });
      // Invalidate sessions using transaction
      await tx.userSession.updateMany({ where: { userId: user.id }, data: { isActive: false } });
    });

    await this.auditService.log('PASSWORD_RESET_SUCCESS', {
      userId: user.id,
      resource: 'USER',
      resourceId: user.id,
      ipAddress: auditContext?.ipAddress,
      userAgent: auditContext?.userAgent,
      metadata: { email: normalizedEmail },
      severity: 'INFO',
    }).catch(() => {});

    return { success: true, message: 'Password reset successful' };
  }

  private generateJwtPair(userId: string) {
    const accessToken = this.jwtService.sign(
      { userId, type: 'access' },
      { expiresIn: this.jwtExpiresIn }
    );
    const refreshToken = this.jwtService.sign(
      { userId, type: 'refresh' },
      { expiresIn: this.refreshTokenExpiresIn }
    );
    return { accessToken, refreshToken, token: accessToken };
  }

  /**
   * Normalize email address to lowercase and trim whitespace
   * Enterprise-grade: Ensures email uniqueness regardless of case
   */
  private normalizeEmail(email: string): string {
    if (!email || typeof email !== 'string') {
      throw new BadRequestException('Email is required and must be a string');
    }
    return email.toLowerCase().trim();
  }

  /**
   * Sanitize and validate name fields
   * Enterprise-grade: Removes extra whitespace and validates length
   */
  private sanitizeName(name: string): string {
    if (!name || typeof name !== 'string') {
      throw new BadRequestException('Name fields are required');
    }
    
    // Trim and normalize whitespace
    const sanitized = name.trim().replace(/\s+/g, ' ');
    
    // Validate length (1-50 characters)
    if (sanitized.length < 1 || sanitized.length > 50) {
      throw new BadRequestException('Name must be between 1 and 50 characters');
    }
    
    // Validate format (allow letters, spaces, hyphens, apostrophes for international names)
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    if (!nameRegex.test(sanitized)) {
      throw new BadRequestException('Name can only contain letters, spaces, hyphens, and apostrophes');
    }
    
    return sanitized;
  }

  /**
   * Validate role against allowed enum values
   * Enterprise-grade: Prevents invalid role assignments
   */
  private validateRole(role?: string): UserRole {
    if (!role) {
      return UserRole.PATIENT; // Default role
    }
    
    const upperRole = role.toUpperCase();
    if (!this.VALID_ROLES.includes(upperRole as UserRole)) {
      throw new BadRequestException(
        `Invalid role: ${role}. Allowed roles: ${this.VALID_ROLES.join(', ')}`
      );
    }
    
    return upperRole as UserRole;
  }

  /**
   * Parse expiry string (e.g., "7d", "24h", "30m") to milliseconds
   * Enterprise-grade: Flexible configuration via environment variables
   */
  private parseExpiryToMilliseconds(expiry: string): number {
    const match = expiry.match(/^(\d+)([dhms])$/);
    if (!match) {
      // Default to 7 days if parsing fails
      console.warn(`Invalid expiry format: ${expiry}, defaulting to 7d`);
      return 7 * 24 * 60 * 60 * 1000;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'm':
        return value * 60 * 1000;
      case 's':
        return value * 1000;
      default:
        return 7 * 24 * 60 * 60 * 1000; // Default to 7 days
    }
  }

  private mapUserToResponse(user: any) {
    return {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      avatar: user.avatar,
      department: user.department,
      specialization: user.specialization,
      isVerified: user.isVerified,
      mfaEnabled: false, // Not implemented yet
    };
  }

  async googleLogin(idToken: string, auditContext?: { ipAddress?: string; userAgent?: string }) {
    if (!idToken) {
      throw new BadRequestException('Missing Google ID token');
    }

    // Verify Google ID token
    const client = new OAuth2Client();
    let payload: any;
    try {
      const ticket = await client.verifyIdToken({ idToken, audience: this.googleClientIds.length ? this.googleClientIds : undefined });
      payload = ticket.getPayload();
    } catch (e) {
      await this.auditService.log('LOGIN_FAILED', {
        resource: 'USER',
        ipAddress: auditContext?.ipAddress,
        userAgent: auditContext?.userAgent,
        metadata: { method: 'GOOGLE', reason: 'TOKEN_VERIFY_FAILED' },
        severity: 'WARN',
      });
      throw new UnauthorizedException('Invalid Google token');
    }

    if (!payload || !payload.email || payload.email_verified !== true) {
      throw new UnauthorizedException('Google account not verified');
    }

    const normalizedEmail = this.normalizeEmail(payload.email);
    const firstName = (payload.given_name || '').toString();
    const lastName = (payload.family_name || '').toString();

    // Upsert user
    let user = await this.userRepo.findByEmail(normalizedEmail);
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          password: await bcrypt.hash(crypto.randomBytes(12).toString('hex'), this.bcryptRounds),
          firstName: firstName || 'Google',
          lastName: lastName || 'User',
          isActive: true,
          isVerified: true,
          role: 'PATIENT',
        },
      });
    } else if (!user.isVerified) {
      await this.userRepo.updateUser(user.id, { isVerified: true });
      user.isVerified = true;
    }

    // Issue tokens and create session
    const tokens = this.generateJwtPair(user.id);
    const refreshTokenExpiryMs = this.parseExpiryToMilliseconds(this.refreshTokenExpiresIn);
    await this.userRepo.createSession(user.id, tokens.refreshToken, new Date(Date.now() + refreshTokenExpiryMs), {
      ipAddress: auditContext?.ipAddress,
      userAgent: auditContext?.userAgent,
    });

    await this.auditService.log('LOGIN_SUCCESS', {
      userId: user.id,
      resource: 'USER',
      resourceId: user.id,
      ipAddress: auditContext?.ipAddress,
      userAgent: auditContext?.userAgent,
      metadata: { method: 'GOOGLE', email: normalizedEmail },
      severity: 'INFO',
    });

    return {
      success: true,
      user: this.mapUserToResponse(user),
      ...tokens,
    };
  }
}
