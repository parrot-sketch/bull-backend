
import { UserRepository } from '@/database';
import { Injectable, Logger } from '@nestjs/common';


@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async log(action: string, params: {
    userId?: string;
    resource?: string;
    resourceId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
    severity?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  } = {}) {
    try {
      await this.userRepository.logAudit(
        params.userId ?? null,
        action,
        {
          resource: params.resource,
          resourceId: params.resourceId,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          metadata: params.metadata ?? {},
          severity: params.severity ?? 'INFO'
        }
      );
    } catch (error) {
      // Log error but don't block auth flow
      this.logger.error(
        `Failed to log audit event: ${action}`,
        error instanceof Error ? error.stack : undefined
      );
    }
  }
}


