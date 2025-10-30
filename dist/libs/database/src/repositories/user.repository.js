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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let UserRepository = class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    get user() { return this.prisma.user; }
    get userSession() { return this.prisma.userSession; }
    get mfaSettings() { return this.prisma.mfaSettings; }
    get auditLog() { return this.prisma.auditLog; }
    get consentRecord() { return this.prisma.consentRecord; }
    async findByEmail(email) {
        return this.user.findUnique({ where: { email } });
    }
    async findById(id) {
        return this.user.findUnique({ where: { id } });
    }
    async createSession(userId, refreshToken, expiresAt, opts = {}) {
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
            }
        });
    }
    async deleteSessionByRefreshToken(refreshToken) {
        return this.userSession.deleteMany({ where: { refreshToken } });
    }
    async invalidateSessions(userId) {
        return this.userSession.updateMany({ where: { userId, isActive: true }, data: { isActive: false } });
    }
    async createUser(data) {
        return this.user.create({ data: data });
    }
    async updateUser(id, data) {
        return this.user.update({ where: { id }, data: data });
    }
    async logAudit(userId, action, details) {
        return this.auditLog.create({
            data: {
                userId: userId,
                action: action,
                metadata: typeof details !== 'undefined' ? details : null
            }
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map