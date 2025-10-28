import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { AuditService } from './audit.service';
import { DatabaseService } from './database.service';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET!; // required via module
  private readonly jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
  private readonly refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }, auditContext?: { ipAddress?: string; userAgent?: string }) {
    // Check if user already exists
    const existingUser = await this.db.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      await this.auditService.log('REGISTER_FAILED', {
        resource: 'USER',
        ipAddress: auditContext?.ipAddress,
        userAgent: auditContext?.userAgent,
        metadata: { email: userData.email, reason: 'EMAIL_EXISTS' },
        severity: 'WARN',
      });
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await this.db.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: (userData.role as any) || 'PATIENT',
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    // Audit successful registration
    await this.auditService.log('REGISTER_SUCCESS', {
      userId: user.id,
      resource: 'USER',
      resourceId: user.id,
      ipAddress: auditContext?.ipAddress,
      userAgent: auditContext?.userAgent,
      metadata: { email: userData.email, role: user.role },
      severity: 'INFO',
    });

    return {
      success: true,
      message: 'User registered successfully',
      user: this.mapUserToResponse(user),
      ...tokens,
    };
  }

  async login(credentials: { email: string; password: string; mfaCode?: string }, auditContext?: { ipAddress?: string; userAgent?: string }) {
    console.log('🔐 Login attempt for:', credentials.email);
    
    // Find user
    const user = await this.db.user.findUnique({
      where: { email: credentials.email },
    });

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
    const mfaSettings = await this.db.mfaSettings.findUnique({ where: { userId: user.id } });
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

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    // Audit successful login
    await this.auditService.log('LOGIN_SUCCESS', {
      userId: user.id,
      resource: 'USER',
      resourceId: user.id,
      ipAddress: auditContext?.ipAddress,
      userAgent: auditContext?.userAgent,
      metadata: { email: credentials.email, role: user.role },
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
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const secret = speakeasy.generateSecret({ name: `iHosi (${user.email})`, length: 20 });
    await this.db.mfaSettings.upsert({
      where: { userId },
      update: { secret: secret.base32, method: 'TOTP', isEnabled: false },
      create: { userId, secret: secret.base32, method: 'TOTP', isEnabled: false },
    });
    await this.auditService.log('MFA_SETUP_REQUESTED', { userId, resource: 'USER', resourceId: userId, severity: 'INFO' });
    return { success: true, data: { secret: secret.base32, otpauthUrl: secret.otpauth_url } };
  }

  // MFA: Verify and enable
  async verifyMfa(userId: string, code: string) {
    const settings = await this.db.mfaSettings.findUnique({ where: { userId } });
    if (!settings || !settings.secret) {
      throw new BadRequestException('MFA not initialized');
    }
    const verified = speakeasy.totp.verify({ secret: settings.secret, encoding: 'base32', token: code, window: 1 });
    if (!verified) {
      throw new UnauthorizedException('Invalid MFA code');
    }
    const backupCodes = Array.from({ length: 8 }).map(() => Math.random().toString(36).slice(2, 10));
    await this.db.mfaSettings.update({ where: { userId }, data: { isEnabled: true, backupCodes } });
    await this.auditService.log('MFA_ENABLED', { userId, resource: 'USER', resourceId: userId, severity: 'INFO' });
    return { success: true, data: { backupCodes } };
  }

  async refreshToken(refreshToken: string) {
    // Find session
    const session = await this.db.userSession.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || !session.isActive || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(session.userId);

    // Update session with new refresh token
    await this.db.userSession.update({
      where: { id: session.id },
      data: {
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
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
    await this.db.userSession.updateMany({
      where: { userId },
      data: { isActive: false },
    });

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
    const user = await this.db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      success: true,
      data: this.mapUserToResponse(user),
    };
  }

  private async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign(
      { userId, type: 'access' },
      { expiresIn: this.jwtExpiresIn }
    );

    const refreshToken = this.jwtService.sign(
      { userId, type: 'refresh' },
      { expiresIn: this.refreshTokenExpiresIn }
    );

    // Store refresh token in database
    await this.db.userSession.create({
      data: {
        userId,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      accessToken,
      refreshToken,
      token: accessToken, // Alternative field name for compatibility
    };
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
}
