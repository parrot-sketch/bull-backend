import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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
    ThrottlerModule.forRoot([{ ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10), limit: parseInt(process.env.RATE_LIMIT_LIMIT || '100', 10) }]),
    AuthModule,
    DoctorProfileModule,
    SchedulingModule,
    PatientBookingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}