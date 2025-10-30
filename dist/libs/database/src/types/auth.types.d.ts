export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}
export interface AuthCredentials {
    email: string;
    password: string;
}
export interface RegisterUserData extends AuthCredentials {
    firstName: string;
    lastName: string;
    role?: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}
