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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const audit_service_1 = require("./audit.service");
const database_service_1 = require("./database.service");
let AuthService = class AuthService {
    constructor(db, jwtService, auditService) {
        this.db = db;
        this.jwtService = jwtService;
        this.auditService = auditService;
        this.jwtSecret = process.env.JWT_SECRET;
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
        this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
    }
    async register(userData, auditContext) {
        const existingUser = await this.db.user.findUnique({
            where: { email: userData.email },
        });
        if (existingUser) {
            await this.auditService.log('REGISTER_FAILED', {
                resource: 'USER',
                ipAddress: auditContext?.ipAddress,
                userAgent: auditContext?.userAgent,
                metadata: { email: userData.email, reason: 'EMAIL_EXISTS' },
                severity: 'WARN',
            });
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.db.user.create({
            data: {
                email: userData.email,
                password: hashedPassword,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role || 'PATIENT',
            },
        });
        const tokens = this.generateJwtPair(user.id);
        await this.db.userSession.create({
            data: {
                userId: user.id,
                refreshToken: tokens.refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
        });
        await this.auditService.log('REGISTER_SUCCESS', {
            userId: user.id,
            resource: 'USER',
            resourceId: user.id,
            ipAddress: auditContext?.ipAddress,
            userAgent: auditContext?.userAgent,
            metadata: { email: userData.email, role: user.role },
            severity: 'INFO',
        });
        return {
            success: true,
            message: 'User registered successfully',
            user: this.mapUserToResponse(user),
            ...tokens,
        };
    }
    async login(credentials, auditContext) {
        console.log('🔐 Login attempt for:', credentials.email);
        const user = await this.db.user.findUnique({
            where: { email: credentials.email },
        });
        console.log('👤 User found:', !!user);
        console.log('👤 User active:', user?.isActive);
        console.log('👤 User verified:', user?.isVerified);
        if (!user || !user.isActive) {
            console.log('❌ User not found or not active');
            await this.auditService.log('LOGIN_FAILED', {
                resource: 'USER',
                ipAddress: auditContext?.ipAddress,
                userAgent: auditContext?.userAgent,
                metadata: { email: credentials.email, reason: 'USER_NOT_FOUND_OR_INACTIVE' },
                severity: 'WARN',
            });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        console.log('🔑 Comparing password...');
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        console.log('🔑 Password valid:', isPasswordValid);
        if (!isPasswordValid) {
            console.log('❌ Invalid password');
            await this.auditService.log('LOGIN_FAILED', {
                userId: user.id,
                resource: 'USER',
                resourceId: user.id,
                ipAddress: auditContext?.ipAddress,
                userAgent: auditContext?.userAgent,
                metadata: { email: credentials.email, reason: 'INVALID_PASSWORD' },
                severity: 'WARN',
            });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const mfaSettings = await this.db.mfaSettings.findUnique({ where: { userId: user.id } });
        if (mfaSettings?.isEnabled) {
            if (!credentials.mfaCode) {
                await this.auditService.log('LOGIN_MFA_REQUIRED', {
                    userId: user.id,
                    resource: 'USER',
                    resourceId: user.id,
                    ipAddress: auditContext?.ipAddress,
                    userAgent: auditContext?.userAgent,
                    severity: 'INFO',
                });
                return {
                    success: true,
                    mfaRequired: true,
                    user: this.mapUserToResponse(user),
                };
            }
            const validMfa = speakeasy.totp.verify({
                secret: mfaSettings.secret || '',
                encoding: 'base32',
                token: credentials.mfaCode,
                window: 1,
            });
            if (!validMfa) {
                await this.auditService.log('LOGIN_FAILED', {
                    userId: user.id,
                    resource: 'USER',
                    resourceId: user.id,
                    ipAddress: auditContext?.ipAddress,
                    userAgent: auditContext?.userAgent,
                    metadata: { reason: 'INVALID_MFA_CODE' },
                    severity: 'WARN',
                });
                throw new common_1.UnauthorizedException('Invalid MFA code');
            }
        }
        const tokens = this.generateJwtPair(user.id);
        await this.db.userSession.create({
            data: {
                userId: user.id,
                refreshToken: tokens.refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
        });
        await this.auditService.log('LOGIN_SUCCESS', {
            userId: user.id,
            resource: 'USER',
            resourceId: user.id,
            ipAddress: auditContext?.ipAddress,
            userAgent: auditContext?.userAgent,
            metadata: { email: credentials.email, role: user.role },
            severity: 'INFO',
        });
        return {
            success: true,
            user: this.mapUserToResponse(user),
            ...tokens,
        };
    }
    async setupMfa(userId) {
        const user = await this.db.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const secret = speakeasy.generateSecret({ name: `iHosi (${user.email})`, length: 20 });
        await this.db.mfaSettings.upsert({
            where: { userId },
            update: { secret: secret.base32, method: 'TOTP', isEnabled: false },
            create: { userId, secret: secret.base32, method: 'TOTP', isEnabled: false },
        });
        await this.auditService.log('MFA_SETUP_REQUESTED', { userId, resource: 'USER', resourceId: userId, severity: 'INFO' });
        return { success: true, data: { secret: secret.base32, otpauthUrl: secret.otpauth_url } };
    }
    async verifyMfa(userId, code) {
        const settings = await this.db.mfaSettings.findUnique({ where: { userId } });
        if (!settings || !settings.secret) {
            throw new common_1.BadRequestException('MFA not initialized');
        }
        const verified = speakeasy.totp.verify({ secret: settings.secret, encoding: 'base32', token: code, window: 1 });
        if (!verified) {
            throw new common_1.UnauthorizedException('Invalid MFA code');
        }
        const backupCodes = Array.from({ length: 8 }).map(() => Math.random().toString(36).slice(2, 10));
        await this.db.mfaSettings.update({ where: { userId }, data: { isEnabled: true, backupCodes } });
        await this.auditService.log('MFA_ENABLED', { userId, resource: 'USER', resourceId: userId, severity: 'INFO' });
        return { success: true, data: { backupCodes } };
    }
    async refreshToken(refreshToken) {
        const session = await this.db.userSession.findUnique({
            where: { refreshToken },
            include: { user: true },
        });
        if (!session || !session.isActive || session.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const tokens = this.generateJwtPair(session.userId);
        await this.db.userSession.update({
            where: { id: session.id },
            data: {
                refreshToken: tokens.refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return {
            success: true,
            data: {
                user: this.mapUserToResponse(session.user),
                token: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            },
        };
    }
    async logout(userId, auditContext) {
        await this.db.userSession.updateMany({
            where: { userId },
            data: { isActive: false },
        });
        await this.auditService.log('LOGOUT_SUCCESS', {
            userId,
            resource: 'USER',
            resourceId: userId,
            ipAddress: auditContext?.ipAddress,
            userAgent: auditContext?.userAgent,
            metadata: { userId },
            severity: 'INFO',
        });
        return {
            success: true,
            message: 'Logout successful',
        };
    }
    async getCurrentUser(userId) {
        const user = await this.db.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return {
            success: true,
            data: this.mapUserToResponse(user),
        };
    }
    generateJwtPair(userId) {
        const accessToken = this.jwtService.sign({ userId, type: 'access' }, { expiresIn: this.jwtExpiresIn });
        const refreshToken = this.jwtService.sign({ userId, type: 'refresh' }, { expiresIn: this.refreshTokenExpiresIn });
        return { accessToken, refreshToken, token: accessToken };
    }
    mapUserToResponse(user) {
        return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            avatar: user.avatar,
            department: user.department,
            specialization: user.specialization,
            isVerified: user.isVerified,
            mfaEnabled: false,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        jwt_1.JwtService,
        audit_service_1.AuditService])
], AuthService);
//# sourceMappingURL=auth.service.js.map