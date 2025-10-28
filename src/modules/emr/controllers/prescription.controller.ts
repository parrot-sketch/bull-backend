import { Body, Controller, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PrescriptionService } from '../services/prescription.service';

@ApiTags('Prescriptions')
@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new prescription with drug interaction checking' })
  @ApiResponse({ status: 201, description: 'Prescription created successfully' })
  async createPrescription(
    @Request() req: any,
    @Body() prescriptionData: {
      patientId: string;
      doctorId: string;
      visitId?: string;
      medicationName: string;
      genericName?: string;
      dosage: string;
      frequency: string;
      duration: string;
      quantity: number;
      refills?: number;
      instructions?: string;
      pharmacyName?: string;
      pharmacyAddress?: string;
      pharmacyPhone?: string;
      deliveryMethod?: string;
    },
  ) {
    return this.prescriptionService.createPrescription(prescriptionData);
  }

  @Put(':prescriptionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update prescription' })
  @ApiResponse({ status: 200, description: 'Prescription updated successfully' })
  async updatePrescription(
    @Param('prescriptionId') prescriptionId: string,
    @Body() updateData: {
      dosage?: string;
      frequency?: string;
      duration?: string;
      quantity?: number;
      refills?: number;
      instructions?: string;
      pharmacyName?: string;
      pharmacyAddress?: string;
      pharmacyPhone?: string;
      deliveryMethod?: string;
    },
  ) {
    return this.prescriptionService.updatePrescription(prescriptionId, updateData);
  }

  @Get(':prescriptionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get prescription details' })
  @ApiResponse({ status: 200, description: 'Prescription retrieved successfully' })
  async getPrescription(@Param('prescriptionId') prescriptionId: string) {
    return this.prescriptionService.getPrescription(prescriptionId);
  }

  @Get('patient/:patientId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get patient prescriptions' })
  @ApiResponse({ status: 200, description: 'Patient prescriptions retrieved successfully' })
  async getPatientPrescriptions(
    @Param('patientId') patientId: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('doctorId') doctorId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.prescriptionService.getPatientPrescriptions(patientId, {
      status,
      startDate,
      endDate,
      doctorId,
      limit,
    });
  }

  @Put(':prescriptionId/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update prescription status' })
  @ApiResponse({ status: 200, description: 'Prescription status updated successfully' })
  async updatePrescriptionStatus(
    @Param('prescriptionId') prescriptionId: string,
    @Body() statusData: {
      status: string;
      notes?: string;
    },
  ) {
    return this.prescriptionService.updatePrescriptionStatus(
      prescriptionId,
      statusData.status,
      statusData.notes,
    );
  }

  @Put(':prescriptionId/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel prescription' })
  @ApiResponse({ status: 200, description: 'Prescription cancelled successfully' })
  async cancelPrescription(
    @Param('prescriptionId') prescriptionId: string,
    @Body() cancelData: {
      reason?: string;
    },
  ) {
    return this.prescriptionService.cancelPrescription(
      prescriptionId,
      cancelData.reason,
    );
  }

  @Get('doctor/:doctorId/statistics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get prescription statistics for a doctor' })
  @ApiResponse({ status: 200, description: 'Prescription statistics retrieved successfully' })
  async getPrescriptionStatistics(
    @Param('doctorId') doctorId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.prescriptionService.getPrescriptionStatistics(doctorId, startDate, endDate);
  }

  @Get('medications/search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search for medications in drug database' })
  @ApiResponse({ status: 200, description: 'Medications retrieved successfully' })
  async searchMedications(@Query('query') query: string) {
    return this.prescriptionService.searchMedications(query);
  }

  @Post('interactions/check')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check drug interactions for medication list' })
  @ApiResponse({ status: 200, description: 'Drug interaction check completed' })
  async checkDrugInteractions(
    @Body() interactionData: {
      medications: string[];
      patientId: string;
    },
  ) {
    const newMedication = interactionData.medications?.[0] || '';
    return (this.prescriptionService as any).checkDrugInteractions(interactionData.patientId, newMedication);
  }

  @Post('interactions/check-new')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check interactions for new medication with existing medications' })
  @ApiResponse({ status: 200, description: 'Drug interaction check completed' })
  async checkNewMedicationInteractions(
    @Body() interactionData: {
      patientId: string;
      newMedication: string;
    },
  ) {
    return (this.prescriptionService as any).checkDrugInteractions(
      interactionData.patientId,
      interactionData.newMedication,
    );
  }
}
