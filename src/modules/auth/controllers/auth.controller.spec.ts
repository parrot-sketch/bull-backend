import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = {
    login: jest.fn(),
    register: jest.fn(),
    refreshToken: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
    setupMfa: jest.fn(),
    verifyMfa: jest.fn(),
  } as any;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('login forwards to service with audit context', async () => {
    authService.login.mockResolvedValue({ success: true });
    const req = { ip: '1.1.1.1', headers: { 'user-agent': 'ua' } } as any;
    const res = await controller.login({ email: 'a', password: 'b' } as any, req);
    expect(res.success).toBe(true);
    expect(authService.login).toHaveBeenCalled();
  });

  it('register forwards to service', async () => {
    authService.register.mockResolvedValue({ success: true });
    const res = await controller.register({ email: 'a', password: 'Bbbbbb1!', firstName: 'x', lastName: 'y' } as any, { ip: '1', headers: {} } as any);
    expect(res.success).toBe(true);
  });

  it('refresh forwards to service', async () => {
    authService.refreshToken.mockResolvedValue({ success: true });
    const res = await controller.refreshToken({ refreshToken: 'r' });
    expect(res.success).toBe(true);
  });

  it('forgot/reset password forward to service', async () => {
    authService.requestPasswordReset.mockResolvedValue({ success: true });
    authService.resetPassword.mockResolvedValue({ success: true });
    await controller.forgotPassword({ email: 'e@x.com' } as any, { ip: '1', headers: {} } as any);
    const res = await controller.resetPassword({ email: 'e@x.com', token: 't', newPassword: 'NewPass1!' } as any, { ip: '1', headers: {} } as any);
    expect(res.success).toBe(true);
  });

  it('me/logout/mfa endpoints forward to service', async () => {
    authService.getCurrentUser.mockResolvedValue({ success: true });
    authService.logout.mockResolvedValue({ success: true });
    authService.setupMfa.mockResolvedValue({ success: true, data: {} });
    authService.verifyMfa.mockResolvedValue({ success: true, data: {} });

    const req = { user: { userId: 'u1' }, ip: '1', headers: {} } as any;
    await controller.getCurrentUser(req);
    await controller.logout(req);
    await controller.mfaSetup(req);
    await controller.mfaVerify(req, { code: '123456' } as any);

    expect(authService.getCurrentUser).toHaveBeenCalledWith('u1');
    expect(authService.logout).toHaveBeenCalledWith('u1', expect.any(Object));
  });
});


