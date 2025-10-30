import { Module } from '@nestjs/common';
import { DatabaseModule, PrismaService } from '@/database';
import { DatabaseService } from '../auth/services/database.service';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationController],
  providers: [NotificationService, { provide: DatabaseService, useExisting: PrismaService }],
  exports: [NotificationService],
})
export class NotificationsModule {}

