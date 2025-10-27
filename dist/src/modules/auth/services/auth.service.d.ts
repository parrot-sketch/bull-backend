import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from './database.service';
export declare class AuthService {
    private readonly db;
    private readonly jwtService;
    private readonly jwtSecret;
    private readonly jwtExpiresIn;
    private readonly refreshTokenExpiresIn;
    constructor(db: DatabaseService, jwtService: JwtService);
    register(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: string;
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
    logout(userId: string): Promise<{
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
    private generateTokens;
    private mapUserToResponse;
}
