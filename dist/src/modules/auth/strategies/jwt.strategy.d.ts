import { PrismaService } from '@/database';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private db;
    constructor(configService: ConfigService, db: PrismaService);
    validate(payload: any): Promise<{
        userId: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        firstName: string;
        lastName: string;
    }>;
}
export {};
