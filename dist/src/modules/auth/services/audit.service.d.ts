import { UserRepository } from '@/database';
export declare class AuditService {
    private readonly userRepository;
    private readonly logger;
    constructor(userRepository: UserRepository);
    log(action: string, params?: {
        userId?: string;
        resource?: string;
        resourceId?: string;
        ipAddress?: string;
        userAgent?: string;
        metadata?: Record<string, unknown>;
        severity?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
    }): Promise<void>;
}
