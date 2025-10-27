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
const database_service_1 = require("./database.service");
let AuthService = class AuthService {
    constructor(db, jwtService) {
        this.db = db;
        this.jwtService = jwtService;
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';
        this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
    }
    async register(userData) {
        const existingUser = await this.db.user.findUnique({
            where: { email: userData.email },
        });
        if (existingUser) {
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
        const tokens = await this.generateTokens(user.id);
        return {
            success: true,
            message: 'User registered successfully',
            user: this.mapUserToResponse(user),
            ...tokens,
        };
    }
    async login(credentials) {
        console.log('🔐 Login attempt for:', credentials.email);
        const user = await this.db.user.findUnique({
            where: { email: credentials.email },
        });
        console.log('👤 User found:', !!user);
        console.log('👤 User active:', user?.isActive);
        console.log('👤 User verified:', user?.isVerified);
        if (!user || !user.isActive) {
            console.log('❌ User not found or not active');
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        console.log('🔑 Comparing password...');
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        console.log('🔑 Password valid:', isPasswordValid);
        if (!isPasswordValid) {
            console.log('❌ Invalid password');
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateTokens(user.id);
        return {
            success: true,
            user: this.mapUserToResponse(user),
            ...tokens,
        };
    }
    async refreshToken(refreshToken) {
        const session = await this.db.userSession.findUnique({
            where: { refreshToken },
            include: { user: true },
        });
        if (!session || !session.isActive || session.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const tokens = await this.generateTokens(session.userId);
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
    async logout(userId) {
        await this.db.userSession.updateMany({
            where: { userId },
            data: { isActive: false },
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
    async generateTokens(userId) {
        const accessToken = this.jwtService.sign({ userId, type: 'access' }, { expiresIn: this.jwtExpiresIn });
        const refreshToken = this.jwtService.sign({ userId, type: 'refresh' }, { expiresIn: this.refreshTokenExpiresIn });
        await this.db.userSession.create({
            data: {
                userId,
                refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return {
            accessToken,
            refreshToken,
            token: accessToken,
        };
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
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map