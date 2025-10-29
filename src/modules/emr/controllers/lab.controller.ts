import { Body, Controller, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LabService } from '../services/lab.service';

@ApiTags('Lab Results')
@Controller('lab')
export class LabController {
  constructor(private readonly labService: LabService) {}

  @Post('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create lab order' })
  @ApiResponse({ status: 201, description: 'Lab order created successfully' })
  async createLabOrder(
    @Request() req: any,
    @Body() orderData: {
      patientId: string;
      doctorId: string;
      visitId?: string;
      testsRequested: string[];
      clinicalNotes?: string;
      urgency?: string;
      labName?: string;
      labAddress?: string;
    },
  ) {
    return this.labService.createLabOrder(orderData);
  }

  @Post('results')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload lab result with OCR processing' })
  @ApiResponse({ status: 201, description: 'Lab result uploaded successfully' })
  async uploadLabResult(
    @Request() req: any,
    @Body() resultData: {
      patientId: string;
      orderId?: string;
      doctorId?: string;
      testName: string;
      testCategory: string;
      resultValue: string;
      resultUnit?: string;
      referenceRange?: string;
      isAbnormal?: boolean;
      criticalValue?: boolean;
      reportFileUrl: string;
      ocrText?: string;
      labName: string;
      labAddress?: string;
      labPhone?: string;
      technicianName?: string;
      collectedAt: string;
      processedAt?: string;
    },
  ) {
    return this.labService.uploadLabResult(resultData);
  }

  @Get('results/patient/:patientId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lab results for patient' })
  @ApiResponse({ status: 200, description: 'Lab results retrieved successfully' })
  async getPatientLabResults(
    @Param('patientId') patientId: string,
    @Query('testCategory') testCategory?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('isAbnormal') isAbnormal?: boolean,
    @Query('criticalValue') criticalValue?: boolean,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
  ) {
    return this.labService.getPatientLabResults(patientId, {
      testCategory,
      startDate,
      endDate,
      isAbnormal,
      criticalValue,
      status,
      limit,
    });
  }

  @Get('results/:resultId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lab result details' })
  @ApiResponse({ status: 200, description: 'Lab result retrieved successfully' })
  async getLabResult(@Param('resultId') resultId: string) {
    return this.labService.getLabResult(resultId);
  }

  @Put('results/:resultId/review')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Review lab result' })
  @ApiResponse({ status: 200, description: 'Lab result reviewed successfully' })
  async reviewLabResult(
    @Param('resultId') resultId: string,
    @Request() req: any,
    @Body() reviewData: {
      reviewNotes?: string;
    },
  ) {
    return this.labService.reviewLabResult(resultId, req.user.userId, reviewData.reviewNotes);
  }

  @Put('results/:resultId/flag')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Flag lab result for follow-up' })
  @ApiResponse({ status: 200, description: 'Lab result flagged for follow-up' })
  async flagLabResult(
    @Param('resultId') resultId: string,
    @Request() req: any,
    @Body() flagData: {
      flagReason: string;
    },
  ) {
    return this.labService.flagLabResult(resultId, req.user.userId, flagData.flagReason);
  }

  @Get('results/critical')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get critical lab results requiring immediate attention' })
  @ApiResponse({ status: 200, description: 'Critical lab results retrieved successfully' })
  async getCriticalLabResults(@Query('doctorId') doctorId?: string) {
    return this.labService.getCriticalLabResults(doctorId);
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lab statistics for dashboard' })
  @ApiResponse({ status: 200, description: 'Lab statistics retrieved successfully' })
  async getLabStatistics(
    @Query('doctorId') doctorId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.labService.getLabStatistics(doctorId, startDate, endDate);
  }

  @Get('orders/patient/:patientId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lab orders for patient' })
  @ApiResponse({ status: 200, description: 'Lab orders retrieved successfully' })
  async getPatientLabOrders(
    @Param('patientId') patientId: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('doctorId') doctorId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.labService.getPatientLabOrders(patientId, {
      status,
      startDate,
      endDate,
      doctorId,
      limit,
    });
  }
}



