import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../../libs/database/src/prisma.service';
export declare class DatabaseService extends PrismaService {
    constructor(configService: ConfigService);
}
