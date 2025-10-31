import { Module } from '@nestjs/common';
import { DatabaseService } from '../auth/services/database.service';
import { DoctorProfileController } from './controllers/doctor-profile.controller';
import { DoctorProfileService } from './services/doctor-profile.service';

@Module({
  controllers: [DoctorProfileController],
  providers: [DoctorProfileService, DatabaseService],
  exports: [DoctorProfileService],
})
export class DoctorProfileModule {}



