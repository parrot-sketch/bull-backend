import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Injectable()
export class AuditService {
  constructor(private readonly db: DatabaseService) {}

  async log(action: string, params: {
    userId?: string;
    resource?: string;
    resourceId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
    severity?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  } = {}) {
    try {
      await this.db.auditLog.create({
        data: {
          userId: params.userId ?? null,
          action,
          resource: params.resource,
          resourceId: params.resourceId,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          metadata: params.metadata ?? {},
          severity: (params.severity as any) || 'INFO',
        },
      });
    } catch (e) {
      // Swallow audit errors to not block auth flow
      // Consider routing to external log sink as fallback
    }
  }
}


