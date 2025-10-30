import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  get user() { return this.prisma.user; }
  get userSession() { return this.prisma.userSession; }
  get mfaSettings() { return this.prisma.mfaSettings; }
  get auditLog() { return this.prisma.auditLog; }
  get consentRecord() { return this.prisma.consentRecord; }

  async findByEmail(email: string) {
    return this.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.user.findUnique({ where: { id } });
  }

  async createSession(userId: string, refreshToken: string, expiresAt: Date, opts: { deviceInfo?: any; ipAddress?: string; userAgent?: string } = {}) {
    // Create a user session using the schema fields (refreshToken, expiresAt, optional accessToken/device info)
    return this.userSession.create({
      data: {
        userId,
        refreshToken,
        expiresAt,
        accessToken: undefined,
        deviceInfo: opts.deviceInfo ?? null,
        ipAddress: opts.ipAddress ?? null,
        userAgent: opts.userAgent ?? null,
        isActive: true
      } as any
    });
  }

  async deleteSessionByRefreshToken(refreshToken: string) {
    return this.userSession.deleteMany({ where: { refreshToken } });
  }

  async invalidateSessions(userId: string) {
    // Soft-disable all active sessions for the user
    return this.userSession.updateMany({ where: { userId, isActive: true }, data: { isActive: false } as any });
  }

  async createUser(data: any) {
    return this.user.create({ data: data as any });
  }

  async updateUser(id: string, data: any) {
    return this.user.update({ where: { id }, data: data as any });
  }

  async logAudit(userId: string | null, action: string, details: any) {
    // Map `details` to the Prisma schema's `metadata` JSON field
    return this.auditLog.create({
      data: {
        userId: userId,
        action: action,
        metadata: typeof details !== 'undefined' ? details : null
      } as any
    });
  }
}