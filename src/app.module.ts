import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { DoctorProfileModule } from './modules/doctor-profile/doctor-profile.module';
import { PatientBookingModule } from './modules/patient-booking/patient-booking.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    DoctorProfileModule,
    SchedulingModule,
    PatientBookingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}