import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database';
import { DoctorProfileController } from './controllers/doctor-profile.controller';
import { DoctorProfileService } from './services/doctor-profile.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DoctorProfileController],
  providers: [DoctorProfileService],
  exports: [DoctorProfileService],
})
export class DoctorProfileModule {}



