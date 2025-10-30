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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../../../libs/database/src/prisma.service");
const user_repository_1 = require("../../../../libs/database/src/repositories/user.repository");
const audit_service_1 = require("./audit.service");
const email_service_1 = require("./email.service");
const user_role_enum_1 = require("../../../common/enums/user-role.enum");
const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
const google_auth_library_1 = require("google-auth-library");
let AuthService = AuthService_1 = class AuthService {
    constructor(userRepo, prisma, jwtService, auditService, emailService) {
        this.userRepo = userRepo;
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.auditService = auditService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.jwtSecret = process.env.JWT_SECRET;
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
        this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
        this.bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
        this.fromEmail = process.env.FROM_EMAIL || process.env.SMTP_FROM || 'noreply@ihosi.com';
        this.fromName = process.env.FROM_NAME || 'iHosi';
        this.googleClientIds = [
            process.env.GOOGLE_CLIENT_ID_ANDROID,
            process.env.GOOGLE_CLIENT_ID_IOS,
            process.env.GOOGLE_CLIENT_ID_WEB,
        ].filter(Boolean);
        this.VALID_ROLES = [
            user_role_enum_1.UserRole.PATIENT,
            user_role_enum_1.UserRole.DOCTOR,
            user_role_enum_1.UserRole.NURSE,
            user_role_enum_1.UserRole.ADMIN,
            user_role_enum_1.UserRole.TECHNICIAN,
            user_role_enum_1.UserRole.RECEPTIONIST,
        ];
        this.logger.log('AuthService initialized with email sender:', this.fromEmail);
    }
    createMailer() {
        const emailService = (process.env.EMAIL_SERVICE || '').toLowerCase();
        if (emailService === 'sendgrid') {
            return null;
        }
        const host = process.env.SMTP_HOST || 'localhost';
        const port = parseInt(process.env.SMTP_PORT || '1025', 10);
        const user = process.env.SMTP_USER || undefined;
        const pass = process.env.SMTP_PASS || undefined;
        const transportOptions = { host, port };
        if (user && pass) {
            transportOptions.auth = { user, pass };
            transportOptions.secure = Number(port) === 465;
        }
        return nodemailer.createTransport(transportOptions);
    }
    async sendEmail(opts) {
        const emailService = (process.env.EMAIL_SERVICE || '').toLowerCase();
        if (emailService === 'sendgrid') {
            const sendgridKey = process.env.SENDGRID_API_KEY;
            if (!sendgridKey) {
                console.error('EMAIL_SERVICE=sendgrid but SENDGRID_API_KEY is not set');
                throw new Error('SendGrid API key not configured');
            }
            try {
                sgMail.setApiKey(sendgridKey);
                await sgMail.send({
                    to: opts.to,
                    from: opts.from,
                    subject: opts.subject,
                    text: opts.text,
                    html: opts.html,
                });
                return;
            }
            catch (err) {
                console.error('SendGrid send failed:', err);
                throw err;
            }
        }
        try {
            const transporter = this.createMailer();
            if (!transporter) {
                throw new Error('SMTP transporter not available');
            }
            await transporter.sendMail({ from: opts.from, to: opts.to, subject: opts.subject, text: opts.text, html: opts.html });
        }
        catch (err) {
            console.error('SMTP send failed:', err);
        }
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    async register(userData, auditContext) {
        try {
            const normalizedEmail = this.normalizeEmail(userData.email);
            const sanitizedFirstName = this.sanitizeName(userData.firstName);
            const sanitizedLastName = this.sanitizeName(userData.lastName);
            const validatedRole = this.validateRole(userData.role);
            const existingUser = await this.userRepo.findByEmail(normalizedEmail);
            if (existingUser) {
                await this.auditService.log('REGISTER_FAILED', {
                    resource: 'USER',
                    ipAddress: auditContext?.ipAddress,
                    userAgent: auditContext?.userAgent,
                    metadata: { email: normalizedEmail, reason: 'EMAIL_EXISTS' },
                    severity: 'WARN',
                });
                throw new common_1.ConflictException('User with this email already exists');
            }
            let hashedPassword;
            try {
                hashedPassword = await bcrypt.hash(userData.password, this.bcryptRounds);
            }
            catch (error) {
                console.error('Password hashing failed:', error);
                await this.auditService.log('REGISTER_FAILED', {
                    resource: 'USER',
                    ipAddress: auditContext?.ipAddress,
                    userAgent: auditContext?.userAgent,
                    metadata: { email: normalizedEmail, reason: 'PASSWORD_HASH_ERROR' },
                    severity: 'ERROR',
                });
                throw new common_1.BadRequestException('Registration failed. Please try again.');
            }
            const refreshTokenExpiryMs = this.parseExpiryToMilliseconds(this.refreshTokenExpiresIn);
            const result = await this.prisma.$transaction(async (tx) => {
                const user = await tx.user.create({
                    data: {
                        email: normalizedEmail,
                        password: hashedPassword,
                        firstName: sanitizedFirstName,
                        lastName: sanitizedLastName,
                        role: validatedRole,
                    },
                });
                const tokens = this.generateJwtPair(user.id);
                await tx.userSession.create({
                    data: {
                        userId: user.id,
                        refreshToken: tokens.refreshToken,
                        expiresAt: new Date(Date.now() + refreshTokenExpiryMs),
                        isActive: true,
                        ipAddress: auditContext?.ipAddress,
                        userAgent: auditContext?.userAgent,
                    },
                });
                return { user, tokens };
            });
            await this.auditService.log('REGISTER_SUCCESS', {
                userId: result.user.id,
                resource: 'USER',
                resourceId: result.user.id,
                ipAddress: auditContext?.ipAddress,
                userAgent: auditContext?.userAgent,
                metadata: { email: normalizedEmail, role: result.user.role },
                severity: 'INFO',
            }).catch((error) => {
                console.error('Audit logging failed:', error);
            });
            return {
                success: true,
                message: 'User registered successfully',
                user: this.mapUserToResponse(result.user),
                ...result.tokens,
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Unexpected registration error:', error);
            await this.auditService.log('REGISTER_FAILED', {
                resource: 'USER',
                ipAddress: auditContext?.ipAddress,
                userAgent: auditContext?.userAgent,
                metadata: {
                    email: userData.email,
                    reason: 'UNEXPECTED_ERROR',
                    error: error instanceof Error ? error.message : 'Unknown error'
                },
                severity: 'ERROR',
            }).catch(() => {
            });
            throw new common_1.BadRequestException('Registration failed. Please try again.');
        }
    }
    async login(credentials, auditContext) {
        console.log('🔐 Login attempt for:', credentials.email);
        const normalizedEmail = this.normalizeEmail(credentials.email);
        const user = await this.userRepo.findByEmail(normalizedEmail);
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
        const mfaSettings = await this.prisma.mfaSettings.findUnique({ where: { userId: user.id } });
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
        const refreshTokenExpiryMs = this.parseExpiryToMilliseconds(this.refreshTokenExpiresIn);
        await this.userRepo.createSession(user.id, tokens.refreshToken, new Date(Date.now() + refreshTokenExpiryMs), {
            ipAddress: auditContext?.ipAddress,
            userAgent: auditContext?.userAgent,
        });
        await this.auditService.log('LOGIN_SUCCESS', {
            userId: user.id,
            resource: 'USER',
            resourceId: user.id,
            ipAddress: auditContext?.ipAddress,
            userAgent: auditContext?.userAgent,
            metadata: { email: normalizedEmail, role: user.role },
            severity: 'INFO',
        });
        return {
            success: true,
            user: this.mapUserToResponse(user),
            ...tokens,
        };
    }
    async setupMfa(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const secret = speakeasy.generateSecret({ name: `iHosi (${user.email})`, length: 20 });
        await this.prisma.mfaSettings.upsert({
            where: { userId },
            update: { secret: secret.base32, method: 'TOTP', isEnabled: false },
            create: { userId, secret: secret.base32, method: 'TOTP', isEnabled: false },
        });
        await this.auditService.log('MFA_SETUP_REQUESTED', { userId, resource: 'USER', resourceId: userId, severity: 'INFO' });
        return { success: true, data: { secret: secret.base32, otpauthUrl: secret.otpauth_url } };
    }
    async verifyMfa(userId, code) {
        const settings = await this.prisma.mfaSettings.findUnique({ where: { userId } });
        if (!settings || !settings.secret) {
            throw new common_1.BadRequestException('MFA not initialized');
        }
        const verified = speakeasy.totp.verify({ secret: settings.secret, encoding: 'base32', token: code, window: 1 });
        if (!verified) {
            throw new common_1.UnauthorizedException('Invalid MFA code');
        }
        const backupCodes = Array.from({ length: 8 }).map(() => Math.random().toString(36).slice(2, 10));
        await this.prisma.mfaSettings.update({ where: { userId }, data: { isEnabled: true, backupCodes } });
        await this.auditService.log('MFA_ENABLED', { userId, resource: 'USER', resourceId: userId, severity: 'INFO' });
        return { success: true, data: { backupCodes } };
    }
    async refreshToken(refreshToken) {
        const session = await this.prisma.userSession.findUnique({
            where: { refreshToken },
            include: { user: true },
        });
        if (!session || !session.isActive || session.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const tokens = this.generateJwtPair(session.userId);
        const refreshTokenExpiryMs = this.parseExpiryToMilliseconds(this.refreshTokenExpiresIn);
        await this.prisma.userSession.update({
            where: { id: session.id },
            data: {
                refreshToken: tokens.refreshToken,
                expiresAt: new Date(Date.now() + refreshTokenExpiryMs),
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
        await this.userRepo.invalidateSessions(userId);
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
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return {
            success: true,
            data: this.mapUserToResponse(user),
        };
    }
    async requestPasswordReset(email, auditContext) {
        const normalizedEmail = this.normalizeEmail(email);
        try {
            const user = await this.userRepo.findByEmail(normalizedEmail);
            if (!user) {
                await this.auditService.log('PASSWORD_RESET_REQUEST_UNKNOWN_EMAIL', {
                    resource: 'USER',
                    ipAddress: auditContext?.ipAddress,
                    userAgent: auditContext?.userAgent,
                    metadata: { email: normalizedEmail },
                    severity: 'INFO',
                }).catch(() => { });
                return { success: true, message: 'If an account with that email exists, an OTP has been sent.' };
            }
            const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
            const hashed = this.hashToken(otp);
            const expiresMs = parseInt(process.env.PASSWORD_RESET_EXPIRES_MS || String(15 * 60 * 1000), 10);
            const expiresAt = new Date(Date.now() + expiresMs);
            await this.userRepo.updateUser(user.id, { passwordResetToken: hashed, passwordResetExpires: expiresAt });
            const from = this.fromName ? `${this.fromName} <${this.fromEmail}>` : this.fromEmail;
            const subject = `${this.fromName} Password Reset Code`;
            const text = `Your ${this.fromName} password reset code is: ${otp}. It will expire in ${Math.round(expiresMs / 60000)} minutes. If you did not request this, please ignore this message.`;
            const html = `<p>Your ${this.fromName} password reset code is: <strong>${otp}</strong></p>
                  <p>It will expire in ${Math.round(expiresMs / 60000)} minutes.</p>
                  <p>If you did not request this, please ignore this message.</p>`;
            try {
                await this.emailService.sendEmail({
                    to: user.email,
                    from,
                    subject,
                    text,
                    html,
                });
                this.logger.debug(`Password reset email sent to ${user.email}`);
            }
            catch (err) {
                this.logger.error('Failed to send password reset email:', err);
            }
            await this.auditService.log('PASSWORD_RESET_REQUESTED', {
                userId: user.id,
                resource: 'USER',
                resourceId: user.id,
                ipAddress: auditContext?.ipAddress,
                userAgent: auditContext?.userAgent,
                metadata: { email: normalizedEmail, method: 'OTP' },
                severity: 'INFO',
            }).catch(() => { });
            return { success: true, message: 'If an account with that email exists, an OTP has been sent.' };
        }
        catch (error) {
            console.error('requestPasswordReset error:', error);
            await this.auditService.log('PASSWORD_RESET_ERROR', {
                resource: 'USER',
                ipAddress: auditContext?.ipAddress,
                userAgent: auditContext?.userAgent,
                metadata: { email: normalizedEmail, error: error instanceof Error ? error.message : 'Unknown' },
                severity: 'ERROR',
            }).catch(() => { });
            return { success: true, message: 'If an account with that email exists, an OTP has been sent.' };
        }
    }
    async resetPassword(email, token, newPassword, auditContext) {
        const normalizedEmail = this.normalizeEmail(email);
        const hashedToken = this.hashToken(token);
        const user = await this.userRepo.findByEmail(normalizedEmail);
        if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
            throw new common_1.BadRequestException('Invalid token or expired');
        }
        if (user.passwordResetExpires < new Date()) {
            throw new common_1.BadRequestException('Token has expired');
        }
        if (user.passwordResetToken !== hashedToken) {
            await this.auditService.log('PASSWORD_RESET_INVALID_TOKEN', {
                userId: user.id,
                resource: 'USER',
                resourceId: user.id,
                ipAddress: auditContext?.ipAddress,
                userAgent: auditContext?.userAgent,
                metadata: { email: normalizedEmail },
                severity: 'WARN',
            }).catch(() => { });
            throw new common_1.BadRequestException('Invalid token or expired');
        }
        const newHashed = await bcrypt.hash(newPassword, this.bcryptRounds);
        await this.prisma.$transaction(async (tx) => {
            await tx.user.update({ where: { id: user.id }, data: { password: newHashed, passwordResetToken: null, passwordResetExpires: null, lastPasswordChange: new Date() } });
            await tx.userSession.updateMany({ where: { userId: user.id }, data: { isActive: false } });
        });
        await this.auditService.log('PASSWORD_RESET_SUCCESS', {
            userId: user.id,
            resource: 'USER',
            resourceId: user.id,
            ipAddress: auditContext?.ipAddress,
            userAgent: auditContext?.userAgent,
            metadata: { email: normalizedEmail },
            severity: 'INFO',
        }).catch(() => { });
        return { success: true, message: 'Password reset successful' };
    }
    generateJwtPair(userId) {
        const accessToken = this.jwtService.sign({ userId, type: 'access' }, { expiresIn: this.jwtExpiresIn });
        const refreshToken = this.jwtService.sign({ userId, type: 'refresh' }, { expiresIn: this.refreshTokenExpiresIn });
        return { accessToken, refreshToken, token: accessToken };
    }
    normalizeEmail(email) {
        if (!email || typeof email !== 'string') {
            throw new common_1.BadRequestException('Email is required and must be a string');
        }
        return email.toLowerCase().trim();
    }
    sanitizeName(name) {
        if (!name || typeof name !== 'string') {
            throw new common_1.BadRequestException('Name fields are required');
        }
        const sanitized = name.trim().replace(/\s+/g, ' ');
        if (sanitized.length < 1 || sanitized.length > 50) {
            throw new common_1.BadRequestException('Name must be between 1 and 50 characters');
        }
        const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
        if (!nameRegex.test(sanitized)) {
            throw new common_1.BadRequestException('Name can only contain letters, spaces, hyphens, and apostrophes');
        }
        return sanitized;
    }
    validateRole(role) {
        if (!role) {
            return user_role_enum_1.UserRole.PATIENT;
        }
        const upperRole = role.toUpperCase();
        if (!this.VALID_ROLES.includes(upperRole)) {
            throw new common_1.BadRequestException(`Invalid role: ${role}. Allowed roles: ${this.VALID_ROLES.join(', ')}`);
        }
        return upperRole;
    }
    parseExpiryToMilliseconds(expiry) {
        const match = expiry.match(/^(\d+)([dhms])$/);
        if (!match) {
            console.warn(`Invalid expiry format: ${expiry}, defaulting to 7d`);
            return 7 * 24 * 60 * 60 * 1000;
        }
        const value = parseInt(match[1], 10);
        const unit = match[2];
        switch (unit) {
            case 'd':
                return value * 24 * 60 * 60 * 1000;
            case 'h':
                return value * 60 * 60 * 1000;
            case 'm':
                return value * 60 * 1000;
            case 's':
                return value * 1000;
            default:
                return 7 * 24 * 60 * 60 * 1000;
        }
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
    async googleLogin(idToken, auditContext) {
        if (!idToken) {
            throw new common_1.BadRequestException('Missing Google ID token');
        }
        const client = new google_auth_library_1.OAuth2Client();
        let payload;
        try {
            const ticket = await client.verifyIdToken({ idToken, audience: this.googleClientIds.length ? this.googleClientIds : undefined });
            payload = ticket.getPayload();
        }
        catch (e) {
            await this.auditService.log('LOGIN_FAILED', {
                resource: 'USER',
                ipAddress: auditContext?.ipAddress,
                userAgent: auditContext?.userAgent,
                metadata: { method: 'GOOGLE', reason: 'TOKEN_VERIFY_FAILED' },
                severity: 'WARN',
            });
            throw new common_1.UnauthorizedException('Invalid Google token');
        }
        if (!payload || !payload.email || payload.email_verified !== true) {
            throw new common_1.UnauthorizedException('Google account not verified');
        }
        const normalizedEmail = this.normalizeEmail(payload.email);
        const firstName = (payload.given_name || '').toString();
        const lastName = (payload.family_name || '').toString();
        let user = await this.userRepo.findByEmail(normalizedEmail);
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: normalizedEmail,
                    password: await bcrypt.hash(crypto.randomBytes(12).toString('hex'), this.bcryptRounds),
                    firstName: firstName || 'Google',
                    lastName: lastName || 'User',
                    isActive: true,
                    isVerified: true,
                    role: 'PATIENT',
                },
            });
        }
        else if (!user.isVerified) {
            await this.userRepo.updateUser(user.id, { isVerified: true });
            user.isVerified = true;
        }
        const tokens = this.generateJwtPair(user.id);
        const refreshTokenExpiryMs = this.parseExpiryToMilliseconds(this.refreshTokenExpiresIn);
        await this.userRepo.createSession(user.id, tokens.refreshToken, new Date(Date.now() + refreshTokenExpiryMs), {
            ipAddress: auditContext?.ipAddress,
            userAgent: auditContext?.userAgent,
        });
        await this.auditService.log('LOGIN_SUCCESS', {
            userId: user.id,
            resource: 'USER',
            resourceId: user.id,
            ipAddress: auditContext?.ipAddress,
            userAgent: auditContext?.userAgent,
            metadata: { method: 'GOOGLE', email: normalizedEmail },
            severity: 'INFO',
        });
        return {
            success: true,
            user: this.mapUserToResponse(user),
            ...tokens,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        prisma_service_1.PrismaService,
        jwt_1.JwtService,
        audit_service_1.AuditService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map