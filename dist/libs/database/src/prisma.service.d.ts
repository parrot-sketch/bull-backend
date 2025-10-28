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
        timestamp: string;
        users: ({
            mfaSettings: {
                id: string;
                method: import(".prisma/client").$Enums.MfaMethod;
                userId: string;
                phoneNumber: string | null;
                createdAt: Date;
                updatedAt: Date;
                isEnabled: boolean;
                secret: string | null;
                backupCodes: string[];
                emailVerified: boolean;
                recoveryCodes: string[];
            };
            profile: {
                id: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                bio: string | null;
                preferences: import("@prisma/client/runtime/library").JsonValue | null;
                timezone: string;
                language: string;
                emergencyContactName: string | null;
                emergencyContactPhone: string | null;
                emergencyContactRelation: string | null;
                allergies: string[];
                medications: string[];
                medicalConditions: string[];
                bloodType: string | null;
            };
            sessions: {
                id: string;
                ipAddress: string | null;
                userAgent: string | null;
                userId: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                refreshToken: string;
                accessToken: string | null;
                deviceInfo: import("@prisma/client/runtime/library").JsonValue | null;
                expiresAt: Date;
                lastActivity: Date;
                isSecure: boolean;
                location: string | null;
            }[];
            permissions: ({
                permission: {
                    description: string;
                    id: string;
                    action: string;
                    resource: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                resourceId: string | null;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                permissionId: string;
                conditions: import("@prisma/client/runtime/library").JsonValue | null;
            })[];
            consentRecords: {
                description: string;
                type: import(".prisma/client").$Enums.ConsentType;
                id: string;
                ipAddress: string | null;
                userAgent: string | null;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                version: string;
                granted: boolean;
                grantedAt: Date | null;
                revokedAt: Date | null;
            }[];
        } & {
            role: import(".prisma/client").$Enums.UserRole;
            id: string;
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            isVerified: boolean;
            isLocked: boolean;
            lockedUntil: Date | null;
            avatar: string | null;
            phoneNumber: string | null;
            dateOfBirth: Date | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            address: string | null;
            city: string | null;
            state: string | null;
            zipCode: string | null;
            country: string;
            department: string | null;
            specialization: string | null;
            licenseNumber: string | null;
            npiNumber: string | null;
            lastLoginAt: Date | null;
            lastPasswordChange: Date;
            passwordResetToken: string | null;
            passwordResetExpires: Date | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        auditLogs: {
            id: string;
            action: string;
            resource: string | null;
            resourceId: string | null;
            ipAddress: string | null;
            userAgent: string | null;
            method: string | null;
            endpoint: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            severity: import(".prisma/client").$Enums.AuditSeverity;
            timestamp: Date;
            userId: string | null;
        }[];
    }>;
    transactionWithRetry<T>(fn: (prisma: PrismaClient) => Promise<T>, maxRetries?: number): Promise<T>;
}
