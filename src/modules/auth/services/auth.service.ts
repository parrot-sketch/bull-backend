import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from './database.service';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  private readonly jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';
  private readonly refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) {
    // Check if user already exists
    const existingUser = await this.db.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
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

    return {
      success: true,
      message: 'User registered successfully',
      user: this.mapUserToResponse(user),
      ...tokens,
    };
  }

  async login(credentials: { email: string; password: string }) {
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
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    console.log('🔑 Comparing password...');
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    console.log('🔑 Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    return {
      success: true,
      user: this.mapUserToResponse(user),
      ...tokens,
    };
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

  async logout(userId: string) {
    // Deactivate all user sessions
    await this.db.userSession.updateMany({
      where: { userId },
      data: { isActive: false },
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
