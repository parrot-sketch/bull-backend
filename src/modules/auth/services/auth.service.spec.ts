import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../libs/database/src/prisma.service';
import { UserRepository } from '../../../../libs/database/src/repositories/user.repository';
import { UserRole } from '../../../common/enums/user-role.enum';
import { AuditService } from './audit.service';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(async (plain: string, hash: string) => plain === 'Password123!' && !!hash),
  hash: jest.fn(async (val: string) => `hashed:${val}`),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: UserRepository;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let auditService: AuditService;
  let emailService: EmailService;

  const mockUserRepo = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    createSession: jest.fn(),
    invalidateSessions: jest.fn(),
  };

  const mockPrisma = {
    $transaction: jest.fn(),
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    userSession: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    mfaSettings: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn().mockResolvedValue(undefined),
  };

  const mockEmailService = {
    sendEmail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    jest.resetModules();

    // ensure audit log resolves
    mockAuditService.log.mockResolvedValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: mockUserRepo },
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<UserRepository>(UserRepository);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    auditService = module.get<AuditService>(AuditService);
    emailService = module.get<EmailService>(EmailService);
  });

  describe('registration', () => {
    const mockRegistration = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashed:Password123!';
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockPrisma.$transaction.mockImplementation((cb) => cb(mockPrisma));
      mockPrisma.user.create.mockResolvedValue({
        id: 'user123',
        ...mockRegistration,
        password: hashedPassword,
        role: UserRole.PATIENT,
      });

      const result = await service.register(mockRegistration);

      expect(result.success).toBe(true);
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(mockRegistration.email.toLowerCase());
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(mockAuditService.log).toHaveBeenCalledWith('REGISTER_SUCCESS', expect.any(Object));
    });

    it('should throw ConflictException if email exists', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({ id: 'existing123' });

      await expect(service.register(mockRegistration))
        .rejects
        .toThrow(ConflictException);

      expect(mockAuditService.log).toHaveBeenCalledWith('REGISTER_FAILED', expect.any(Object));
    });
  });

  describe('login', () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('should login successfully', async () => {
      const mockUser = {
        id: 'user123',
        email: mockCredentials.email,
        password: 'hashed:Password123!',
        isActive: true,
      };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mockToken');

      const result = await service.login(mockCredentials);

      expect(result.success).toBe(true);
      expect(mockAuditService.log).toHaveBeenCalledWith('LOGIN_SUCCESS', expect.any(Object));
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(service.login(mockCredentials))
        .rejects
        .toThrow(UnauthorizedException);

      expect(mockAuditService.log).toHaveBeenCalledWith('LOGIN_FAILED', expect.any(Object));
    });

    it('should require MFA when enabled and no code provided', async () => {
      const mockUser = {
        id: 'user123',
        email: mockCredentials.email,
        password: 'hashed:Password123!',
        isActive: true,
      };
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      mockPrisma.mfaSettings.findUnique.mockResolvedValue({ userId: 'user123', isEnabled: true, secret: 'ABC' });

      const result = await service.login(mockCredentials);
      expect(result.mfaRequired).toBe(true);
    });
  });

  describe('refresh token', () => {
    it('should refresh token successfully', async () => {
      const mockSession = {
        id: 'session123',
        userId: 'user123',
        refreshToken: 'validRefreshToken',
        isActive: true,
        expiresAt: new Date(Date.now() + 3600000),
        user: { id: 'user123', email: 'test@example.com' },
      };

      mockPrisma.userSession.findUnique.mockResolvedValue(mockSession);
      mockJwtService.sign.mockReturnValue('newToken');

      const result = await service.refreshToken('validRefreshToken');

      expect(result.success).toBe(true);
      expect(result.data.token).toBeDefined();
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      mockPrisma.userSession.findUnique.mockResolvedValue(null);

      await expect(service.refreshToken('invalidToken'))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('password reset', () => {
    it('should request password reset successfully', async () => {
      const email = 'test@example.com';
      const mockUser = { id: 'user123', email };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser);

      const result = await service.requestPasswordReset(email);

      expect(result.success).toBe(true);
      expect(mockEmailService.sendEmail).toHaveBeenCalled();
      expect(mockAuditService.log).toHaveBeenCalledWith('PASSWORD_RESET_REQUESTED', expect.any(Object));
    });

    it('should reset password successfully', async () => {
      const mockData = {
        email: 'test@example.com',
        token: 'validToken',
        newPassword: 'NewPassword123!',
      };

      const hashedToken = (service as any).hashToken('validToken');
      const mockUser = {
        id: 'user123',
        email: mockData.email,
        passwordResetToken: hashedToken,
        passwordResetExpires: new Date(Date.now() + 3600000),
      };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      mockPrisma.$transaction.mockImplementation((cb) => cb(mockPrisma));

      const result = await service.resetPassword(
        mockData.email,
        mockData.token,
        mockData.newPassword,
      );

      expect(result.success).toBe(true);
      expect(mockAuditService.log).toHaveBeenCalledWith('PASSWORD_RESET_SUCCESS', expect.any(Object));
    });
  });

  describe('logout and me', () => {
    it('should logout by invalidating sessions', async () => {
      mockUserRepo.invalidateSessions.mockResolvedValue({ count: 1 });
      const res = await service.logout('user123');
      expect(res.success).toBe(true);
      expect(mockUserRepo.invalidateSessions).toHaveBeenCalledWith('user123');
    });

    it('should get current user', async () => {
      const user = { id: 'user123', email: 'test@example.com' };
      mockUserRepo.findById.mockResolvedValue(user);
      const res = await service.getCurrentUser('user123');
      expect(res.success).toBe(true);
      expect(res.data.id).toBe('user123');
    });

    it('should throw Unauthorized when user missing', async () => {
      mockUserRepo.findById.mockResolvedValue(null);
      await expect(service.getCurrentUser('bad')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('MFA setup/verify', () => {
    it('should setup MFA and return secret', async () => {
      mockUserRepo.findById.mockResolvedValue({ id: 'user123', email: 'e@x.com' });
      mockPrisma.mfaSettings.upsert.mockResolvedValue({});
      const res = await service.setupMfa('user123');
      expect(res.success).toBe(true);
    });

    it('should fail verifyMfa when not initialized', async () => {
      mockPrisma.mfaSettings.findUnique.mockResolvedValue(null);
      await expect(service.verifyMfa('user123', '000000')).rejects.toThrow(BadRequestException);
    });
  });
});