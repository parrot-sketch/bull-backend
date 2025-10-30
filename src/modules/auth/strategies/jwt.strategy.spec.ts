import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UserRepository } from '@/database';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  const mockUserRepo = {
    findById: jest.fn(),
  } as any;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: { get: () => 'secret' } },
        { provide: UserRepository, useValue: mockUserRepo },
      ],
    }).compile();

    strategy = moduleRef.get(JwtStrategy);
  });

  it('validates and returns sanitized user payload', async () => {
    mockUserRepo.findById.mockResolvedValue({
      id: 'u1',
      email: 'a@b.c',
      isActive: true,
      isLocked: false,
      firstName: 'A',
      lastName: 'B',
      role: 'PATIENT',
    });

    const res = await strategy.validate({ userId: 'u1' });
    expect(res.userId).toBe('u1');
    expect(res.email).toBe('a@b.c');
  });

  it('throws when user not found or inactive', async () => {
    mockUserRepo.findById.mockResolvedValue(null);
    await expect(strategy.validate({ userId: 'bad' })).rejects.toThrow(UnauthorizedException);
  });

  it('throws when account locked', async () => {
    mockUserRepo.findById.mockResolvedValue({
      id: 'u1', email: 'a@b.c', isActive: true, isLocked: true, lockedUntil: new Date(Date.now() + 10000)
    });
    await expect(strategy.validate({ userId: 'u1' })).rejects.toThrow(UnauthorizedException);
  });
});


