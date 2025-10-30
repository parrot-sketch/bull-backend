import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { UserRepository } from '@/database';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private userRepository;
    constructor(configService: ConfigService, userRepository: UserRepository);
    validate(payload: any): Promise<{
        userId: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        firstName: string;
        lastName: string;
    }>;
}
export {};
