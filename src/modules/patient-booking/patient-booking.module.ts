import { Module } from '@nestjs/common';
import { DatabaseModule, PrismaService } from '@/database';
import { DatabaseService } from '../auth/services/database.service';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PatientBookingController } from './controllers/patient-booking.controller';
import { PatientBookingService } from './services/patient-booking.service';

@Module({
  imports: [AuthModule, NotificationsModule, DatabaseModule],
  controllers: [PatientBookingController],
  providers: [PatientBookingService, { provide: DatabaseService, useExisting: PrismaService }],
  exports: [PatientBookingService],
})
export class PatientBookingModule {}

