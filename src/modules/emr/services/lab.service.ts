import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../auth/services/database.service';

@Injectable()
export class LabService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Create lab order
   */
  async createLabOrder(orderData: {
    patientId: string;
    doctorId: string;
    visitId?: string;
    testsRequested: string[];
    clinicalNotes?: string;
    urgency?: string;
    labName?: string;
    labAddress?: string;
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

    const labOrder = await this.db.labOrder.create({
      data: {
        patientId: orderData.patientId,
        doctorId: orderData.doctorId,
        visitId: orderData.visitId,
        testsRequested: orderData.testsRequested,
        clinicalNotes: orderData.clinicalNotes,
        urgency: (orderData.urgency as any) || 'ROUTINE',
        labName: orderData.labName,
        labAddress: orderData.labAddress,
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
      data: labOrder,
      message: 'Lab order created successfully',
    };
  }

  /**
   * Upload lab result with OCR processing
   */
  async uploadLabResult(resultData: {
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

    // Analyze result for abnormalities
    const analysisResult = await this.analyzeLabResult(
      resultData.testName,
      resultData.resultValue,
      resultData.referenceRange
    );

    const labResult = await this.db.labResult.create({
      data: {
        patientId: resultData.patientId,
        orderId: resultData.orderId,
        doctorId: resultData.doctorId,
        testName: resultData.testName,
        testCategory: resultData.testCategory as any,
        resultValue: resultData.resultValue,
        resultUnit: resultData.resultUnit,
        referenceRange: resultData.referenceRange,
        isAbnormal: resultData.isAbnormal || analysisResult.isAbnormal,
        criticalValue: resultData.criticalValue || analysisResult.isCritical,
        reportFileUrl: resultData.reportFileUrl,
        ocrText,
        labName: resultData.labName,
        labAddress: resultData.labAddress,
        labPhone: resultData.labPhone,
        technicianName: resultData.technicianName,
        collectedAt: new Date(resultData.collectedAt),
        processedAt: resultData.processedAt ? new Date(resultData.processedAt) : null,
        reportedAt: new Date(),
        status: analysisResult.isCritical ? 'CRITICAL_ALERT_SENT' : 'PENDING_REVIEW',
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
            testsRequested: true,
            clinicalNotes: true,
          },
        },
      },
    });

    // Send critical alert if needed
    if (analysisResult.isCritical) {
      await this.sendCriticalAlert(labResult);
    }

    return {
      success: true,
      data: labResult,
      analysis: analysisResult,
      message: 'Lab result uploaded successfully',
    };
  }

  /**
   * Get lab results for patient
   */
  async getPatientLabResults(patientId: string, filters?: {
    testCategory?: string;
    startDate?: string;
    endDate?: string;
    isAbnormal?: boolean;
    criticalValue?: boolean;
    status?: string;
    limit?: number;
  }) {
    const where: any = { patientId };

    if (filters?.testCategory) {
      where.testCategory = filters.testCategory;
    }

    if (filters?.startDate || filters?.endDate) {
      where.reportedAt = {};
      if (filters?.startDate) where.reportedAt.gte = new Date(filters.startDate);
      if (filters?.endDate) where.reportedAt.lte = new Date(filters.endDate);
    }

    if (filters?.isAbnormal !== undefined) {
      where.isAbnormal = filters.isAbnormal;
    }

    if (filters?.criticalValue !== undefined) {
      where.criticalValue = filters.criticalValue;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    const labResults = await this.db.labResult.findMany({
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
            testsRequested: true,
            clinicalNotes: true,
          },
        },
      },
      orderBy: { reportedAt: 'desc' },
      take: filters?.limit || 50,
    });

    return {
      success: true,
      data: labResults,
      message: 'Lab results retrieved successfully',
    };
  }

  /**
   * Get lab result details
   */
  async getLabResult(resultId: string) {
    const labResult = await this.db.labResult.findUnique({
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
            testsRequested: true,
            clinicalNotes: true,
            urgency: true,
          },
        },
      },
    });

    if (!labResult) {
      throw new NotFoundException('Lab result not found');
    }

    return {
      success: true,
      data: labResult,
      message: 'Lab result retrieved successfully',
    };
  }

  /**
   * Review lab result
   */
  async reviewLabResult(resultId: string, doctorId: string, reviewNotes?: string) {
    const labResult = await this.db.labResult.findUnique({
      where: { id: resultId },
    });

    if (!labResult) {
      throw new NotFoundException('Lab result not found');
    }

    const updatedResult = await this.db.labResult.update({
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
      message: 'Lab result reviewed successfully',
    };
  }

  /**
   * Flag lab result for follow-up
   */
  async flagLabResult(resultId: string, doctorId: string, flagReason: string) {
    const labResult = await this.db.labResult.findUnique({
      where: { id: resultId },
    });

    if (!labResult) {
      throw new NotFoundException('Lab result not found');
    }

    const updatedResult = await this.db.labResult.update({
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
      message: 'Lab result flagged for follow-up',
    };
  }

  /**
   * Get critical lab results requiring immediate attention
   */
  async getCriticalLabResults(doctorId?: string) {
    const where: any = {
      criticalValue: true,
      status: 'PENDING_REVIEW',
    };

    if (doctorId) {
      where.doctorId = doctorId;
    }

    const criticalResults = await this.db.labResult.findMany({
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
      message: 'Critical lab results retrieved successfully',
    };
  }

  /**
   * Get lab statistics for dashboard
   */
  async getLabStatistics(doctorId?: string, startDate?: string, endDate?: string) {
    const where: any = {};

    if (doctorId) {
      where.doctorId = doctorId;
    }

    if (startDate || endDate) {
      where.reportedAt = {};
      if (startDate) where.reportedAt.gte = new Date(startDate);
      if (endDate) where.reportedAt.lte = new Date(endDate);
    }

    const [totalResults, abnormalResults, criticalResults, resultsByCategory] = await Promise.all([
      this.db.labResult.count({ where }),
      this.db.labResult.count({ where: { ...where, isAbnormal: true } }),
      this.db.labResult.count({ where: { ...where, criticalValue: true } }),
      this.db.labResult.groupBy({
        by: ['testCategory'],
        where,
        _count: { testCategory: true },
      }),
    ]);

    return {
      success: true,
      data: {
        totalResults,
        abnormalResults,
        criticalResults,
        resultsByCategory,
        abnormalRate: totalResults > 0 ? (abnormalResults / totalResults) * 100 : 0,
        criticalRate: totalResults > 0 ? (criticalResults / totalResults) * 100 : 0,
      },
      message: 'Lab statistics retrieved successfully',
    };
  }

  /**
   * Process OCR on lab report
   */
  private async processOCR(fileUrl: string): Promise<string> {
    // This would typically integrate with OCR services like Google Vision API, Azure Computer Vision, or AWS Textract
    // For now, return mock OCR text
    return `Mock OCR text extracted from ${fileUrl}`;
  }

  /**
   * Analyze lab result for abnormalities
   */
  private async analyzeLabResult(testName: string, resultValue: string, referenceRange?: string) {
    // This would typically use medical knowledge base or AI to analyze results
    // For now, return mock analysis
    const isAbnormal = Math.random() > 0.7; // 30% chance of abnormal
    const isCritical = Math.random() > 0.9; // 10% chance of critical

    return {
      isAbnormal,
      isCritical,
      interpretation: isAbnormal ? 'Result outside normal range' : 'Result within normal range',
      recommendations: isCritical ? 'Immediate medical attention required' : 'Follow up as needed',
    };
  }

  /**
   * Send critical alert to doctor
   */
  private async sendCriticalAlert(labResult: any) {
    // This would typically send notifications via email, SMS, or push notifications
    console.log(`CRITICAL ALERT: Lab result ${labResult.id} requires immediate attention for patient ${labResult.patient.firstName} ${labResult.patient.lastName}`);
    
    // Could integrate with notification service here
    return true;
  }

  /**
   * Get lab orders for patient
   */
  async getPatientLabOrders(patientId: string, filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    doctorId?: string;
    limit?: number;
  }) {
    const where: any = { patientId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
      where.orderedAt = {};
      if (filters?.startDate) where.orderedAt.gte = new Date(filters.startDate);
      if (filters?.endDate) where.orderedAt.lte = new Date(filters.endDate);
    }

    if (filters?.doctorId) {
      where.doctorId = filters.doctorId;
    }

    const labOrders = await this.db.labOrder.findMany({
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
            testName: true,
            resultValue: true,
            isAbnormal: true,
            criticalValue: true,
            status: true,
          },
        },
      },
      orderBy: { orderedAt: 'desc' },
      take: filters?.limit || 50,
    });

    return {
      success: true,
      data: labOrders,
      message: 'Lab orders retrieved successfully',
    };
  }
}
