import { DatabaseService } from './database.service';
export declare class AuditService {
    private readonly db;
    constructor(db: DatabaseService);
    log(action: string, params?: {
        userId?: string;
        resource?: string;
        resourceId?: string;
        ipAddress?: string;
        userAgent?: string;
        metadata?: any;
        severity?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
    }): Promise<void>;
}
