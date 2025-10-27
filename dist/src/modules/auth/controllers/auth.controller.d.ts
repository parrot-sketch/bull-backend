import { AuthService } from '../services/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(credentials: {
        email: string;
        password: string;
        mfaCode?: string;
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
    register(userData: any): Promise<{
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
    refreshToken(body: {
        refreshToken: string;
    }): Promise<{
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
    logout(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getCurrentUser(req: any): Promise<{
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
}
