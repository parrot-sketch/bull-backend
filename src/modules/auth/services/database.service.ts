import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../../libs/database/src/prisma.service';

@Injectable()
export class DatabaseService extends PrismaService {
  constructor(configService: ConfigService) {
    super(configService);
  }
}


