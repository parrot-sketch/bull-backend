import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { VisitService } from '../services/visit.service';

@ApiTags('Patient Visits')
@Controller('visits')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new patient visit (SOAP note)' })
  @ApiResponse({ status: 201, description: 'Visit created successfully' })
  async createVisit(
    @Request() req: any,
    @Body() visitData: {
      patientId: string;
      doctorId: string;
      appointmentId?: string;
      visitType: string;
      chiefComplaint: string;
      subjective?: string;
      objective?: string;
      assessment?: string;
      plan?: string;
      voiceNotes?: string;
      voiceFileUrl?: string;
      diagnoses?: Array<{
        icd10Code: string;
        diagnosisName: string;
        isPrimary: boolean;
        notes?: string;
      }>;
      followUpRequired?: boolean;
      followUpDate?: string;
      followUpNotes?: string;
    },
  ) {
    return this.visitService.createVisit(visitData);
  }

  @Put(':visitId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update visit (SOAP note)' })
  @ApiResponse({ status: 200, description: 'Visit updated successfully' })
  async updateVisit(
    @Param('visitId') visitId: string,
    @Body() updateData: {
      visitType?: string;
      chiefComplaint?: string;
      subjective?: string;
      objective?: string;
      assessment?: string;
      plan?: string;
      voiceNotes?: string;
      voiceFileUrl?: string;
      followUpRequired?: boolean;
      followUpDate?: string;
      followUpNotes?: string;
    },
  ) {
    return this.visitService.updateVisit(visitId, updateData);
  }

  @Get(':visitId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get visit details' })
  @ApiResponse({ status: 200, description: 'Visit retrieved successfully' })
  async getVisit(@Param('visitId') visitId: string) {
    return this.visitService.getVisit(visitId);
  }

  @Get('patient/:patientId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get patient visit history' })
  @ApiResponse({ status: 200, description: 'Patient visits retrieved successfully' })
  async getPatientVisits(
    @Param('patientId') patientId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('visitType') visitType?: string,
    @Query('doctorId') doctorId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.visitService.getPatientVisits(patientId, {
      startDate,
      endDate,
      visitType,
      doctorId,
      limit,
    });
  }

  @Post(':visitId/diagnoses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add diagnosis to visit' })
  @ApiResponse({ status: 200, description: 'Diagnosis added successfully' })
  async addDiagnosis(
    @Param('visitId') visitId: string,
    @Body() diagnosisData: {
      icd10Code: string;
      diagnosisName: string;
      isPrimary: boolean;
      notes?: string;
    },
  ) {
    return this.visitService.addDiagnosis(visitId, diagnosisData);
  }

  @Put('diagnoses/:diagnosisId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update diagnosis' })
  @ApiResponse({ status: 200, description: 'Diagnosis updated successfully' })
  async updateDiagnosis(
    @Param('diagnosisId') diagnosisId: string,
    @Body() diagnosisData: {
      icd10Code?: string;
      diagnosisName?: string;
      isPrimary?: boolean;
      notes?: string;
    },
  ) {
    return this.visitService.updateDiagnosis(diagnosisId, diagnosisData);
  }

  @Delete('diagnoses/:diagnosisId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove diagnosis' })
  @ApiResponse({ status: 200, description: 'Diagnosis removed successfully' })
  async removeDiagnosis(@Param('diagnosisId') diagnosisId: string) {
    return this.visitService.removeDiagnosis(diagnosisId);
  }

  @Post(':visitId/voice-transcription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process voice-to-text transcription' })
  @ApiResponse({ status: 200, description: 'Voice transcription processed successfully' })
  async processVoiceTranscription(
    @Param('visitId') visitId: string,
    @Body() transcriptionData: {
      voiceFileUrl: string;
      transcribedText: string;
    },
  ) {
    return this.visitService.processVoiceTranscription(
      visitId,
      transcriptionData.voiceFileUrl,
      transcriptionData.transcribedText,
    );
  }

  @Get('icd10/suggestions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ICD-10 code suggestions based on symptoms' })
  @ApiResponse({ status: 200, description: 'ICD-10 suggestions retrieved successfully' })
  async getIcd10Suggestions(@Query('symptoms') symptoms: string) {
    return this.visitService.getIcd10Suggestions(symptoms);
  }

  @Get('doctor/:doctorId/statistics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get visit statistics for a doctor' })
  @ApiResponse({ status: 200, description: 'Visit statistics retrieved successfully' })
  async getVisitStatistics(
    @Param('doctorId') doctorId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.visitService.getVisitStatistics(doctorId, startDate, endDate);
  }
}













