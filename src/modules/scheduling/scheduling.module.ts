import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseService } from '../auth/services/database.service';
import { SchedulingController } from './controllers/scheduling.controller';
import { AppointmentManagementService } from './services/appointment-management.service';
import { DoctorAvailabilityService } from './services/doctor-availability.service';
import { SchedulingService } from './services/scheduling.service';
import { SlotEngineService } from './services/slot-engine.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [SchedulingController],
  providers: [
    SchedulingService,
    DoctorAvailabilityService,
    SlotEngineService,
    AppointmentManagementService,
    DatabaseService,
  ],
  exports: [
    SchedulingService,
    DoctorAvailabilityService,
    SlotEngineService,
    AppointmentManagementService,
  ],
})
export class SchedulingModule {}