import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { BookingRepository } from './repositories/booking.repository';
import { DoctorProfileRepository } from './repositories/doctor-profile.repository';
import { EMRRepository } from './repositories/emr.repository';
import { NotificationRepository } from './repositories/notification.repository';
import { SchedulingRepository } from './repositories/scheduling.repository';
import { UserRepository } from './repositories/user.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    UserRepository,
    DoctorProfileRepository,
    EMRRepository,
    NotificationRepository,
    BookingRepository,
    SchedulingRepository,
  ],
  exports: [
    PrismaService,
    UserRepository,
    DoctorProfileRepository,
    EMRRepository,
    NotificationRepository,
    BookingRepository,
    SchedulingRepository,
  ],
})
export class DatabaseModule {}