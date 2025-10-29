import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PatientBookingController } from './controllers/patient-booking.controller';
import { PatientBookingService } from './services/patient-booking.service';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [PatientBookingController],
  providers: [PatientBookingService],
  exports: [PatientBookingService],
})
export class PatientBookingModule {}

