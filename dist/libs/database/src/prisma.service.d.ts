import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    isHealthy(): Promise<boolean>;
    getStats(): Promise<{
        users: number;
        sessions: number;
        auditLogs: number;
        consentRecords: number;
        timestamp: string;
    }>;
    cleanupExpiredSessions(): Promise<number>;
    cleanupOldAuditLogs(): Promise<number>;
    createBackup(): Promise<{
        users: any[];
        auditLogs: any[];
        timestamp: string;
    }>;
    transactionWithRetry<T>(fn: (prisma: PrismaClient) => Promise<T>, maxRetries?: number): Promise<T>;
}
