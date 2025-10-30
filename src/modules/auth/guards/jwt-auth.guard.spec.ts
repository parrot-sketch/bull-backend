import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  const reflector = { getAllAndOverride: jest.fn() } as any as Reflector;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [JwtAuthGuard, { provide: Reflector, useValue: reflector }],
    }).compile();
    guard = moduleRef.get(JwtAuthGuard);
  });

  it('allows public routes', async () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(true);
    const ctx = { getHandler: jest.fn(), getClass: jest.fn() } as any as ExecutionContext;
    expect(await guard.canActivate(ctx)).toBe(true);
  });

  it('throws on handleRequest when no user', () => {
    expect(() => guard.handleRequest(null, null as any, null as any, {} as any)).toThrow(UnauthorizedException);
  });
});


