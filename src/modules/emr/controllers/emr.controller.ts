import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EmrService } from '../services/emr.service';

@ApiTags('EMR')
@Controller('emr')
export class EmrController {
  constructor(private readonly emrService: EmrService) {}

  @Get('patient/:patientId/overview')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get comprehensive patient overview' })
  @ApiResponse({ status: 200, description: 'Patient overview retrieved successfully' })
  async getPatientOverview(@Param('patientId') patientId: string) {
    return this.emrService.getPatientOverview(patientId);
  }

  @Get('patients/search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search patients by various criteria' })
  @ApiResponse({ status: 200, description: 'Patients retrieved successfully' })
  async searchPatients(
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phoneNumber') phoneNumber?: string,
    @Query('dateOfBirth') dateOfBirth?: string,
    @Query('medicalRecordNumber') medicalRecordNumber?: string,
    @Query('limit') limit?: number,
  ) {
    return this.emrService.searchPatients({
      name,
      email,
      phoneNumber,
      dateOfBirth,
      medicalRecordNumber,
      limit,
    });
  }

  @Get('patient/:patientId/timeline')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get patient medical history timeline' })
  @ApiResponse({ status: 200, description: 'Patient timeline retrieved successfully' })
  async getPatientTimeline(
    @Param('patientId') patientId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.emrService.getPatientTimeline(patientId, startDate, endDate);
  }

  @Get('patient/:patientId/vital-signs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get patient vital signs history' })
  @ApiResponse({ status: 200, description: 'Vital signs history retrieved successfully' })
  async getVitalSignsHistory(
    @Param('patientId') patientId: string,
    @Query('limit') limit?: number,
  ) {
    return this.emrService.getVitalSignsHistory(patientId, limit);
  }

  @Post('patient/:patientId/summary')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate comprehensive patient summary report' })
  @ApiResponse({ status: 200, description: 'Patient summary generated successfully' })
  async generatePatientSummary(@Param('patientId') patientId: string) {
    return this.emrService.generatePatientSummary(patientId);
  }
}

