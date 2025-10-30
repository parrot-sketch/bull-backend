import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });

    // Database connection established
    this.logger.log('Database connection established');
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database disconnected successfully');
    } catch (error) {
      this.logger.error('Failed to disconnect from database', error);
    }
  }

  /**
   * Health check for database connection
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return false;
    }
  }

  /**
   * Get database statistics (authentication-focused)
   */
  async getStats() {
    try {
      const [
        userCount,
        sessionCount,
        auditLogCount,
        consentRecordCount,
      ] = await Promise.all([
        this.user.count(),
        this.userSession.count(),
        this.auditLog.count(),
        this.consentRecord.count(),
      ]);

      return {
        users: userCount,
        sessions: sessionCount,
        auditLogs: auditLogCount,
        consentRecords: consentRecordCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Failed to get database statistics', error);
      throw error;
    }
  }

  /**
   * Clean up old sessions
   */
  async cleanupExpiredSessions() {
    try {
      const result = await this.userSession.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });
      
      this.logger.log(`Cleaned up ${result.count} expired sessions`);
      return result.count;
    } catch (error) {
      this.logger.error('Failed to cleanup expired sessions', error);
      throw error;
    }
  }

  /**
   * Clean up old audit logs (keep last 90 days)
   */
  async cleanupOldAuditLogs() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 90);

      const result = await this.auditLog.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate,
          },
        },
      });
      
      this.logger.log(`Cleaned up ${result.count} old audit logs`);
      return result.count;
    } catch (error) {
      this.logger.error('Failed to cleanup old audit logs', error);
      throw error;
    }
  }

  /**
   * Backup database (for development/testing)
   */
  async createBackup(): Promise<{ 
    users: any[],
    auditLogs: any[],
    timestamp: string
  }> {
    try {
      // This is a simplified backup - in production, use proper backup tools
      const backup = {
        timestamp: new Date().toISOString(),
        users: await this.user.findMany({
          include: {
            profile: true,
            sessions: true,
            mfaSettings: true,
            permissions: {
              include: {
                permission: true,
              },
            },
            consentRecords: true,
          },
        }),
        auditLogs: await this.auditLog.findMany({
          take: 1000, // Limit to prevent huge backups
        }),
      };
      
      this.logger.log('Database backup created');
      return backup;
    } catch (error) {
      this.logger.error('Failed to create database backup', error);
      throw error;
    }
  }

  /**
   * Transaction wrapper with retry logic
   */
  async transactionWithRetry<T>(
    fn: (prisma: PrismaClient) => Promise<T>,
    maxRetries: number = 3,
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.$transaction(fn);
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          this.logger.error(`Transaction failed after ${maxRetries} attempts`, error);
          throw lastError;
        }
        
        this.logger.warn(`Transaction attempt ${attempt} failed, retrying...`, error);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    throw lastError!;
  }
}