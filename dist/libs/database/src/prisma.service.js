"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    constructor(configService) {
        super({
            datasources: {
                db: {
                    url: configService.get('DATABASE_URL'),
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
        this.configService = configService;
        this.logger = new common_1.Logger(PrismaService_1.name);
        this.logger.log('Database connection established');
    }
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Database connected successfully');
        }
        catch (error) {
            this.logger.error('Failed to connect to database', error);
            throw error;
        }
    }
    async onModuleDestroy() {
        try {
            await this.$disconnect();
            this.logger.log('Database disconnected successfully');
        }
        catch (error) {
            this.logger.error('Failed to disconnect from database', error);
        }
    }
    async isHealthy() {
        try {
            await this.$queryRaw `SELECT 1`;
            return true;
        }
        catch (error) {
            this.logger.error('Database health check failed', error);
            return false;
        }
    }
    async getStats() {
        try {
            const [userCount, sessionCount, auditLogCount, consentRecordCount,] = await Promise.all([
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
        }
        catch (error) {
            this.logger.error('Failed to get database statistics', error);
            throw error;
        }
    }
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
        }
        catch (error) {
            this.logger.error('Failed to cleanup expired sessions', error);
            throw error;
        }
    }
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
        }
        catch (error) {
            this.logger.error('Failed to cleanup old audit logs', error);
            throw error;
        }
    }
    async createBackup() {
        try {
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
                    take: 1000,
                }),
            };
            this.logger.log('Database backup created');
            return backup;
        }
        catch (error) {
            this.logger.error('Failed to create database backup', error);
            throw error;
        }
    }
    async transactionWithRetry(fn, maxRetries = 3) {
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.$transaction(fn);
            }
            catch (error) {
                lastError = error;
                if (attempt === maxRetries) {
                    this.logger.error(`Transaction failed after ${maxRetries} attempts`, error);
                    throw lastError;
                }
                this.logger.warn(`Transaction attempt ${attempt} failed, retrying...`, error);
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
        throw lastError;
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map