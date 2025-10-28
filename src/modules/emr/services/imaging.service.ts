import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../auth/services/database.service';

@Injectable()
export class ImagingService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Create imaging order
   */
  async createImagingOrder(orderData: {
    patientId: string;
    doctorId: string;
    visitId?: string;
    studyType: string;
    bodyPart: string;
    clinicalHistory?: string;
    urgency?: string;
    imagingCenter?: string;
    centerAddress?: string;
  }) {
    // Verify patient and doctor exist
    const [patient, doctor] = await Promise.all([
      this.db.user.findUnique({ where: { id: orderData.patientId, role: 'PATIENT' } }),
      this.db.user.findUnique({ where: { id: orderData.doctorId, role: 'DOCTOR' } }),
    ]);

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const imagingOrder = await this.db.imagingOrder.create({
      data: {
        patientId: orderData.patientId,
        doctorId: orderData.doctorId,
        visitId: orderData.visitId,
        studyType: orderData.studyType as any,
        bodyPart: orderData.bodyPart,
        clinicalHistory: orderData.clinicalHistory,
        urgency: (orderData.urgency as any) || 'ROUTINE',
        imagingCenter: orderData.imagingCenter,
        centerAddress: orderData.centerAddress,
        status: 'PENDING',
      },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
        visit: {
          select: {
            id: true,
            visitDate: true,
            chiefComplaint: true,
          },
        },
      },
    });

    return {
      success: true,
      data: imagingOrder,
      message: 'Imaging order created successfully',
    };
  }

  /**
   * Upload imaging result with OCR processing
   */
  async uploadImagingResult(resultData: {
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
  }) {
    // Verify patient exists
    const patient = await this.db.user.findUnique({
      where: { id: resultData.patientId, role: 'PATIENT' },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Process OCR if not provided
    let ocrText = resultData.ocrText;
    if (!ocrText && resultData.reportFileUrl) {
      ocrText = await this.processOCR(resultData.reportFileUrl);
    }

    // Analyze findings for critical results
    const analysisResult = await this.analyzeImagingFindings(
      resultData.findings,
      resultData.impression
    );

    const imagingResult = await this.db.imagingResult.create({
      data: {
        patientId: resultData.patientId,
        orderId: resultData.orderId,
        doctorId: resultData.doctorId,
        studyType: resultData.studyType as any,
        bodyPart: resultData.bodyPart,
        technique: resultData.technique,
        contrastUsed: resultData.contrastUsed || false,
        findings: resultData.findings,
        impression: resultData.impression,
        recommendations: resultData.recommendations,
        imageUrls: resultData.imageUrls,
        reportFileUrl: resultData.reportFileUrl,
        ocrText,
        radiologistName: resultData.radiologistName,
        radiologistId: resultData.radiologistId,
        performedAt: new Date(resultData.performedAt),
        reportedAt: new Date(),
        status: analysisResult.isCritical ? 'CRITICAL_FINDING_ALERT' : 'PENDING_REVIEW',
      },
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
        order: {
          select: {
            id: true,
            studyType: true,
            bodyPart: true,
            clinicalHistory: true,
          },
        },
      },
    });

    // Send critical alert if needed
    if (analysisResult.isCritical) {
      await this.sendCriticalImagingAlert(imagingResult);
    }

    return {
      success: true,
      data: imagingResult,
      analysis: analysisResult,
      message: 'Imaging result uploaded successfully',
    };
  }

  /**
   * Get imaging results for patient
   */
  async getPatientImagingResults(patientId: string, filters?: {
    studyType?: string;
    bodyPart?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    limit?: number;
  }) {
    const where: any = { patientId };

    if (filters?.studyType) {
      where.studyType = filters.studyType;
    }

    if (filters?.bodyPart) {
      where.bodyPart = { contains: filters.bodyPart, mode: 'insensitive' };
    }

    if (filters?.startDate || filters?.endDate) {
      where.reportedAt = {};
      if (filters?.startDate) where.reportedAt.gte = new Date(filters.startDate);
      if (filters?.endDate) where.reportedAt.lte = new Date(filters.endDate);
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    const imagingResults = await this.db.imagingResult.findMany({
      where,
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
        order: {
          select: {
            id: true,
            studyType: true,
            bodyPart: true,
            clinicalHistory: true,
          },
        },
      },
      orderBy: { reportedAt: 'desc' },
      take: filters?.limit || 50,
    });

    return {
      success: true,
      data: imagingResults,
      message: 'Imaging results retrieved successfully',
    };
  }

  /**
   * Get imaging result details
   */
  async getImagingResult(resultId: string) {
    const imagingResult = await this.db.imagingResult.findUnique({
      where: { id: resultId },
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
        order: {
          select: {
            id: true,
            studyType: true,
            bodyPart: true,
            clinicalHistory: true,
            urgency: true,
          },
        },
      },
    });

    if (!imagingResult) {
      throw new NotFoundException('Imaging result not found');
    }

    return {
      success: true,
      data: imagingResult,
      message: 'Imaging result retrieved successfully',
    };
  }

  /**
   * Review imaging result
   */
  async reviewImagingResult(resultId: string, doctorId: string, reviewNotes?: string) {
    const imagingResult = await this.db.imagingResult.findUnique({
      where: { id: resultId },
    });

    if (!imagingResult) {
      throw new NotFoundException('Imaging result not found');
    }

    const updatedResult = await this.db.imagingResult.update({
      where: { id: resultId },
      data: {
        status: 'REVIEWED',
        reviewedAt: new Date(),
        reviewedBy: doctorId,
      },
    });

    return {
      success: true,
      data: updatedResult,
      message: 'Imaging result reviewed successfully',
    };
  }

  /**
   * Flag imaging result for follow-up
   */
  async flagImagingResult(resultId: string, doctorId: string, flagReason: string) {
    const imagingResult = await this.db.imagingResult.findUnique({
      where: { id: resultId },
    });

    if (!imagingResult) {
      throw new NotFoundException('Imaging result not found');
    }

    const updatedResult = await this.db.imagingResult.update({
      where: { id: resultId },
      data: {
        status: 'FLAGGED_FOR_FOLLOWUP',
        reviewedAt: new Date(),
        reviewedBy: doctorId,
      },
    });

    return {
      success: true,
      data: updatedResult,
      message: 'Imaging result flagged for follow-up',
    };
  }

  /**
   * Get critical imaging results requiring immediate attention
   */
  async getCriticalImagingResults(doctorId?: string) {
    const where: any = {
      status: 'CRITICAL_FINDING_ALERT',
    };

    if (doctorId) {
      where.doctorId = doctorId;
    }

    const criticalResults = await this.db.imagingResult.findMany({
      where,
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
      orderBy: { reportedAt: 'asc' },
    });

    return {
      success: true,
      data: criticalResults,
      message: 'Critical imaging results retrieved successfully',
    };
  }

  /**
   * Get imaging statistics for dashboard
   */
  async getImagingStatistics(doctorId?: string, startDate?: string, endDate?: string) {
    const where: any = {};

    if (doctorId) {
      where.doctorId = doctorId;
    }

    if (startDate || endDate) {
      where.reportedAt = {};
      if (startDate) where.reportedAt.gte = new Date(startDate);
      if (endDate) where.reportedAt.lte = new Date(endDate);
    }

    const [totalResults, criticalResults, resultsByType] = await Promise.all([
      this.db.imagingResult.count({ where }),
      this.db.imagingResult.count({ where: { ...where, status: 'CRITICAL_FINDING_ALERT' } }),
      this.db.imagingResult.groupBy({
        by: ['studyType'],
        where,
        _count: { studyType: true },
      }),
    ]);

    return {
      success: true,
      data: {
        totalResults,
        criticalResults,
        resultsByType,
        criticalRate: totalResults > 0 ? (criticalResults / totalResults) * 100 : 0,
      },
      message: 'Imaging statistics retrieved successfully',
    };
  }

  /**
   * Get imaging orders for patient
   */
  async getPatientImagingOrders(patientId: string, filters?: {
    status?: string;
    studyType?: string;
    startDate?: string;
    endDate?: string;
    doctorId?: string;
    limit?: number;
  }) {
    const where: any = { patientId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.studyType) {
      where.studyType = filters.studyType;
    }

    if (filters?.startDate || filters?.endDate) {
      where.orderedAt = {};
      if (filters?.startDate) where.orderedAt.gte = new Date(filters.startDate);
      if (filters?.endDate) where.orderedAt.lte = new Date(filters.endDate);
    }

    if (filters?.doctorId) {
      where.doctorId = filters.doctorId;
    }

    const imagingOrders = await this.db.imagingOrder.findMany({
      where,
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
        visit: {
          select: {
            id: true,
            visitDate: true,
            chiefComplaint: true,
          },
        },
        results: {
          select: {
            id: true,
            studyType: true,
            bodyPart: true,
            findings: true,
            impression: true,
            status: true,
          },
        },
      },
      orderBy: { orderedAt: 'desc' },
      take: filters?.limit || 50,
    });

    return {
      success: true,
      data: imagingOrders,
      message: 'Imaging orders retrieved successfully',
    };
  }

  /**
   * Process OCR on imaging report
   */
  private async processOCR(fileUrl: string): Promise<string> {
    // This would typically integrate with OCR services
    // For now, return mock OCR text
    return `Mock OCR text extracted from imaging report ${fileUrl}`;
  }

  /**
   * Analyze imaging findings for critical results
   */
  private async analyzeImagingFindings(findings?: string, impression?: string) {
    // This would typically use AI or medical knowledge base to analyze findings
    // For now, return mock analysis
    const criticalKeywords = ['mass', 'tumor', 'fracture', 'hemorrhage', 'pneumonia', 'stroke'];
    const text = `${findings || ''} ${impression || ''}`.toLowerCase();
    
    const isCritical = criticalKeywords.some(keyword => text.includes(keyword));
    const isAbnormal = Math.random() > 0.6; // 40% chance of abnormal

    return {
      isCritical,
      isAbnormal,
      interpretation: isCritical ? 'Critical finding detected' : 'Routine imaging study',
      recommendations: isCritical ? 'Immediate medical attention required' : 'Follow up as needed',
    };
  }

  /**
   * Send critical imaging alert to doctor
   */
  private async sendCriticalImagingAlert(imagingResult: any) {
    // This would typically send notifications via email, SMS, or push notifications
    console.log(`CRITICAL IMAGING ALERT: Result ${imagingResult.id} requires immediate attention for patient ${imagingResult.patient.firstName} ${imagingResult.patient.lastName}`);
    
    // Could integrate with notification service here
    return true;
  }

  /**
   * Update imaging order status
   */
  async updateImagingOrderStatus(orderId: string, status: string, notes?: string) {
    const order = await this.db.imagingOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Imaging order not found');
    }

    const updateData: any = { status: status as any };

    if (status === 'SCHEDULED') {
      updateData.scheduledAt = new Date();
    } else if (status === 'IN_PROGRESS') {
      updateData.performedAt = new Date();
    } else if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    const updatedOrder = await this.db.imagingOrder.update({
      where: { id: orderId },
      data: updateData,
    });

    return {
      success: true,
      data: updatedOrder,
      message: `Imaging order status updated to ${status}`,
    };
  }
}
