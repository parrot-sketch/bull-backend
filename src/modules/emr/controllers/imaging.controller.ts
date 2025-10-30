import { Body, Controller, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ImagingService } from '../services/imaging.service';

@ApiTags('Imaging Results')
@Controller('imaging')
export class ImagingController {
  constructor(private readonly imagingService: ImagingService) {}

  @Post('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create imaging order' })
  @ApiResponse({ status: 201, description: 'Imaging order created successfully' })
  async createImagingOrder(
    @Request() req: any,
    @Body() orderData: {
      patientId: string;
      doctorId: string;
      visitId?: string;
      studyType: string;
      bodyPart: string;
      clinicalHistory?: string;
      urgency?: string;
      imagingCenter?: string;
      centerAddress?: string;
    },
  ) {
    return this.imagingService.createImagingOrder(orderData);
  }

  @Post('results')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload imaging result with OCR processing' })
  @ApiResponse({ status: 201, description: 'Imaging result uploaded successfully' })
  async uploadImagingResult(
    @Request() req: any,
    @Body() resultData: {
      patientId: string;
      orderId?: string;
      doctorId?: string;
      studyType: string;
      bodyPart: string;
      technique?: string;
      contrastUsed?: boolean;
      findings?: string;
      impression?: string;
      recommendations?: string;
      imageUrls: string[];
      reportFileUrl?: string;
      ocrText?: string;
      radiologistName?: string;
      radiologistId?: string;
      performedAt: string;
    },
  ) {
    return this.imagingService.uploadImagingResult(resultData);
  }

  @Get('results/patient/:patientId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get imaging results for patient' })
  @ApiResponse({ status: 200, description: 'Imaging results retrieved successfully' })
  async getPatientImagingResults(
    @Param('patientId') patientId: string,
    @Query('studyType') studyType?: string,
    @Query('bodyPart') bodyPart?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
  ) {
    return this.imagingService.getPatientImagingResults(patientId, {
      studyType,
      bodyPart,
      startDate,
      endDate,
      status,
      limit,
    });
  }

  @Get('results/:resultId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get imaging result details' })
  @ApiResponse({ status: 200, description: 'Imaging result retrieved successfully' })
  async getImagingResult(@Param('resultId') resultId: string) {
    return this.imagingService.getImagingResult(resultId);
  }

  @Put('results/:resultId/review')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Review imaging result' })
  @ApiResponse({ status: 200, description: 'Imaging result reviewed successfully' })
  async reviewImagingResult(
    @Param('resultId') resultId: string,
    @Request() req: any,
    @Body() reviewData: {
      reviewNotes?: string;
    },
  ) {
    return this.imagingService.reviewImagingResult(resultId, req.user.userId, reviewData.reviewNotes);
  }

  @Put('results/:resultId/flag')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Flag imaging result for follow-up' })
  @ApiResponse({ status: 200, description: 'Imaging result flagged for follow-up' })
  async flagImagingResult(
    @Param('resultId') resultId: string,
    @Request() req: any,
    @Body() flagData: {
      flagReason: string;
    },
  ) {
    return this.imagingService.flagImagingResult(resultId, req.user.userId, flagData.flagReason);
  }

  @Get('results/critical')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get critical imaging results requiring immediate attention' })
  @ApiResponse({ status: 200, description: 'Critical imaging results retrieved successfully' })
  async getCriticalImagingResults(@Query('doctorId') doctorId?: string) {
    return this.imagingService.getCriticalImagingResults(doctorId);
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get imaging statistics for dashboard' })
  @ApiResponse({ status: 200, description: 'Imaging statistics retrieved successfully' })
  async getImagingStatistics(
    @Query('doctorId') doctorId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.imagingService.getImagingStatistics(doctorId, startDate, endDate);
  }

  @Get('orders/patient/:patientId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get imaging orders for patient' })
  @ApiResponse({ status: 200, description: 'Imaging orders retrieved successfully' })
  async getPatientImagingOrders(
    @Param('patientId') patientId: string,
    @Query('status') status?: string,
    @Query('studyType') studyType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('doctorId') doctorId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.imagingService.getPatientImagingOrders(patientId, {
      status,
      studyType,
      startDate,
      endDate,
      doctorId,
      limit,
    });
  }

  @Put('orders/:orderId/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update imaging order status' })
  @ApiResponse({ status: 200, description: 'Imaging order status updated successfully' })
  async updateImagingOrderStatus(
    @Param('orderId') orderId: string,
    @Body() statusData: {
      status: string;
      notes?: string;
    },
  ) {
    return this.imagingService.updateImagingOrderStatus(orderId, statusData.status, statusData.notes);
  }
}








