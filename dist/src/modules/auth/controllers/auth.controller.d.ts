import { ForgotPasswordDto, LoginDto, RefreshDto, RegisterDto, ResetPasswordDto, GoogleLoginDto } from '../dto';
import { AuthService } from '../services/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(credentials: LoginDto, req: any): Promise<{
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
    register(userData: RegisterDto, req: any): Promise<{
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
    forgotPassword(body: ForgotPasswordDto, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(body: ResetPasswordDto, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    refreshToken(body: RefreshDto): Promise<{
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
    googleLogin(body: GoogleLoginDto, req: any): Promise<{
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
    mfaSetup(req: any): Promise<{
        success: boolean;
        data: {
            secret: any;
            otpauthUrl: any;
        };
    }>;
    mfaVerify(req: any, body: {
        code: string;
    }): Promise<{
        success: boolean;
        data: {
            backupCodes: string[];
        };
    }>;
    registerTestPatient(req: any): Promise<{
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
    registerTestDoctor(req: any): Promise<{
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
}
