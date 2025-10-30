import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../libs/database/src/prisma.service';
import { UserRepository } from '../../../../libs/database/src/repositories/user.repository';
import { AuditService } from './audit.service';
import { EmailService } from './email.service';
import { IAuthService } from './types';
export declare class AuthService implements IAuthService {
    private readonly userRepo;
    private readonly prisma;
    private readonly jwtService;
    private readonly auditService;
    private readonly emailService;
    private readonly logger;
    private readonly jwtSecret;
    private readonly jwtExpiresIn;
    private readonly refreshTokenExpiresIn;
    private readonly bcryptRounds;
    private readonly fromEmail;
    private readonly fromName;
    private readonly googleClientIds;
    private readonly VALID_ROLES;
    constructor(userRepo: UserRepository, prisma: PrismaService, jwtService: JwtService, auditService: AuditService, emailService: EmailService);
    private createMailer;
    private sendEmail;
    private hashToken;
    register(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: string;
    }, auditContext?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        token: string;
        success: boolean;
        message: string;
        user: {
            id: any;
            email: any;
            name: string;
            role: any;
            avatar: any;
            department: any;
            specialization: any;
            isVerified: any;
            mfaEnabled: boolean;
        };
    }>;
    login(credentials: {
        email: string;
        password: string;
        mfaCode?: string;
    }, auditContext?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
        success: boolean;
        mfaRequired: boolean;
        user: {
            id: any;
            email: any;
            name: string;
            role: any;
            avatar: any;
            department: any;
            specialization: any;
            isVerified: any;
            mfaEnabled: boolean;
        };
    } | {
        accessToken: string;
        refreshToken: string;
        token: string;
        success: boolean;
        user: {
            id: any;
            email: any;
            name: string;
            role: any;
            avatar: any;
            department: any;
            specialization: any;
            isVerified: any;
            mfaEnabled: boolean;
        };
        mfaRequired?: undefined;
    }>;
    setupMfa(userId: string): Promise<{
        success: boolean;
        data: {
            secret: any;
            otpauthUrl: any;
        };
    }>;
    verifyMfa(userId: string, code: string): Promise<{
        success: boolean;
        data: {
            backupCodes: string[];
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        success: boolean;
        data: {
            user: {
                id: any;
                email: any;
                name: string;
                role: any;
                avatar: any;
                department: any;
                specialization: any;
                isVerified: any;
                mfaEnabled: boolean;
            };
            token: string;
            refreshToken: string;
        };
    }>;
    logout(userId: string, auditContext?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    getCurrentUser(userId: string): Promise<{
        success: boolean;
        data: {
            id: any;
            email: any;
            name: string;
            role: any;
            avatar: any;
            department: any;
            specialization: any;
            isVerified: any;
            mfaEnabled: boolean;
        };
    }>;
    requestPasswordReset(email: string, auditContext?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(email: string, token: string, newPassword: string, auditContext?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    private generateJwtPair;
    private normalizeEmail;
    private sanitizeName;
    private validateRole;
    private parseExpiryToMilliseconds;
    private mapUserToResponse;
    googleLogin(idToken: string, auditContext?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        token: string;
        success: boolean;
        user: {
            id: any;
            email: any;
            name: string;
            role: any;
            avatar: any;
            department: any;
            specialization: any;
            isVerified: any;
            mfaEnabled: boolean;
        };
    }>;
}
