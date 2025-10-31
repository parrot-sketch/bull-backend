import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PatientProfileService } from '../services/patient-profile.service';

@ApiTags('Patient Profile')
@Controller('patient-profile')
export class PatientProfileController {
  constructor(private readonly patientProfileService: PatientProfileService) {}

  @Post('upsert')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or update patient profile' })
  @ApiResponse({ status: 200, description: 'Patient profile updated successfully' })
  async upsertPatientProfile(
    @Request() req: any,
    @Body() profileData: {
      dateOfBirth?: string;
      gender?: string;
      bloodType?: string;
      height?: number;
      weight?: number;
      emergencyContact?: string;
      emergencyPhone?: string;
      medicalHistory?: string[];
      surgicalHistory?: string[];
      familyHistory?: string[];
      socialHistory?: string;
      primaryInsurance?: string;
      insuranceNumber?: string;
      insuranceExpiry?: string;
      preferredLanguage?: string;
      communicationPref?: string;
    },
  ) {
    return this.patientProfileService.upsertPatientProfile(req.user.userId, profileData);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current patient profile' })
  @ApiResponse({ status: 200, description: 'Patient profile retrieved successfully' })
  async getPatientProfile(@Request() req: any) {
    return this.patientProfileService.getPatientProfile(req.user.userId);
  }

  @Post('allergies')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add allergy to patient profile' })
  @ApiResponse({ status: 200, description: 'Allergy added successfully' })
  async addAllergy(
    @Request() req: any,
    @Body() allergyData: {
      allergen: string;
      severity: string;
      reaction: string;
      notes?: string;
      diagnosedAt?: string;
      diagnosedBy?: string;
    },
  ) {
    return this.patientProfileService.addAllergy(req.user.userId, allergyData);
  }

  @Put('allergies/:allergyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update allergy' })
  @ApiResponse({ status: 200, description: 'Allergy updated successfully' })
  async updateAllergy(
    @Param('allergyId') allergyId: string,
    @Body() allergyData: {
      allergen?: string;
      severity?: string;
      reaction?: string;
      notes?: string;
    },
  ) {
    return this.patientProfileService.updateAllergy(allergyId, allergyData);
  }

  @Delete('allergies/:allergyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove allergy' })
  @ApiResponse({ status: 200, description: 'Allergy removed successfully' })
  async removeAllergy(@Param('allergyId') allergyId: string) {
    return this.patientProfileService.removeAllergy(allergyId);
  }

  @Get('allergies')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get patient allergies' })
  @ApiResponse({ status: 200, description: 'Allergies retrieved successfully' })
  async getPatientAllergies(@Request() req: any) {
    return this.patientProfileService.getPatientAllergies(req.user.userId);
  }

  @Post('medications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add current medication' })
  @ApiResponse({ status: 200, description: 'Medication added successfully' })
  async addCurrentMedication(
    @Request() req: any,
    @Body() medicationData: {
      medicationName: string;
      dosage: string;
      frequency: string;
      route?: string;
      startDate: string;
      endDate?: string;
      prescribedBy?: string;
      pharmacy?: string;
      notes?: string;
    },
  ) {
    return this.patientProfileService.addCurrentMedication(req.user.userId, medicationData);
  }

  @Put('medications/:medicationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current medication' })
  @ApiResponse({ status: 200, description: 'Medication updated successfully' })
  async updateCurrentMedication(
    @Param('medicationId') medicationId: string,
    @Body() medicationData: {
      medicationName?: string;
      dosage?: string;
      frequency?: string;
      route?: string;
      endDate?: string;
      pharmacy?: string;
      notes?: string;
    },
  ) {
    return this.patientProfileService.updateCurrentMedication(medicationId, medicationData);
  }

  @Delete('medications/:medicationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove current medication' })
  @ApiResponse({ status: 200, description: 'Medication removed successfully' })
  async removeCurrentMedication(@Param('medicationId') medicationId: string) {
    return this.patientProfileService.removeCurrentMedication(medicationId);
  }

  @Get('medications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get patient current medications' })
  @ApiResponse({ status: 200, description: 'Current medications retrieved successfully' })
  async getPatientMedications(@Request() req: any) {
    return this.patientProfileService.getPatientMedications(req.user.userId);
  }
}













