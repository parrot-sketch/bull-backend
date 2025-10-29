import { Module } from '@nestjs/common';
import { DatabaseService } from '../auth/services/database.service';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, DatabaseService],
  exports: [NotificationService],
})
export class NotificationsModule {}

