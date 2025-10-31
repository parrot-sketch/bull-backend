import { Module } from '@nestjs/common';
import { DatabaseModule, PrismaService } from '@/database';
import { DatabaseService } from '../auth/services/database.service';
import { AuthModule } from '../auth/auth.module';
import { EmrController } from './controllers/emr.controller';
import { ImagingController } from './controllers/imaging.controller';
import { LabController } from './controllers/lab.controller';
import { PatientProfileController } from './controllers/patient-profile.controller';
import { PrescriptionController } from './controllers/prescription.controller';
import { VisitController } from './controllers/visit.controller';
import { ClinicalTemplateService } from './services/clinical-template.service';
import { DrugInteractionService } from './services/drug-interaction.service';
import { EmrService } from './services/emr.service';
import { ImagingService } from './services/imaging.service';
import { LabService } from './services/lab.service';
import { PatientProfileService } from './services/patient-profile.service';
import { PrescriptionService } from './services/prescription.service';
import { VisitService } from './services/visit.service';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [
    EmrController,
    PatientProfileController,
    VisitController,
    PrescriptionController,
    LabController,
    ImagingController,
  ],
  providers: [
    { provide: DatabaseService, useExisting: PrismaService },
    EmrService,
    PatientProfileService,
    VisitService,
    PrescriptionService,
    LabService,
    ImagingService,
    ClinicalTemplateService,
    DrugInteractionService,
  ],
  exports: [
    EmrService,
    PatientProfileService,
    VisitService,
    PrescriptionService,
    LabService,
    ImagingService,
    ClinicalTemplateService,
    DrugInteractionService,
  ],
})
export class EmrModule {}













