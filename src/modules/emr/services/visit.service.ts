import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../auth/services/database.service';

@Injectable()
export class VisitService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Create a new patient visit (SOAP note)
   */
  async createVisit(visitData: {
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
  }) {
    // Verify patient and doctor exist
    const [patient, doctor] = await Promise.all([
      this.db.user.findUnique({ where: { id: visitData.patientId, role: 'PATIENT' } }),
      this.db.user.findUnique({ where: { id: visitData.doctorId, role: 'DOCTOR' } }),
    ]);

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Create the visit
    const visit = await this.db.patientVisit.create({
      data: {
        patientId: visitData.patientId,
        doctorId: visitData.doctorId,
        appointmentId: visitData.appointmentId,
        visitType: visitData.visitType as any,
        chiefComplaint: visitData.chiefComplaint,
        subjective: visitData.subjective,
        objective: visitData.objective,
        assessment: visitData.assessment,
        plan: visitData.plan,
        voiceNotes: visitData.voiceNotes,
        voiceFileUrl: visitData.voiceFileUrl,
        followUpRequired: visitData.followUpRequired || false,
        followUpDate: visitData.followUpDate ? new Date(visitData.followUpDate) : null,
        followUpNotes: visitData.followUpNotes,
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
        diagnoses: true,
      },
    });

    // Add diagnoses if provided
    if (visitData.diagnoses && visitData.diagnoses.length > 0) {
      await Promise.all(
        visitData.diagnoses.map(diagnosis =>
          this.db.visitDiagnosis.create({
            data: {
              visitId: visit.id,
              icd10Code: diagnosis.icd10Code,
              diagnosisName: diagnosis.diagnosisName,
              isPrimary: diagnosis.isPrimary,
              notes: diagnosis.notes,
            },
          })
        )
      );
    }

    return {
      success: true,
      data: visit,
      message: 'Visit created successfully',
    };
  }

  /**
   * Update visit (SOAP note)
   */
  async updateVisit(visitId: string, updateData: {
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
  }) {
    const visit = await this.db.patientVisit.findUnique({
      where: { id: visitId },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    const updatedVisit = await this.db.patientVisit.update({
      where: { id: visitId },
      data: {
        visitType: updateData.visitType as any,
        chiefComplaint: updateData.chiefComplaint,
        subjective: updateData.subjective,
        objective: updateData.objective,
        assessment: updateData.assessment,
        plan: updateData.plan,
        voiceNotes: updateData.voiceNotes,
        voiceFileUrl: updateData.voiceFileUrl,
        followUpRequired: updateData.followUpRequired,
        followUpDate: updateData.followUpDate ? new Date(updateData.followUpDate) : null,
        followUpNotes: updateData.followUpNotes,
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
        diagnoses: true,
      },
    });

    return {
      success: true,
      data: updatedVisit,
      message: 'Visit updated successfully',
    };
  }

  /**
   * Get visit details
   */
  async getVisit(visitId: string) {
    const visit = await this.db.patientVisit.findUnique({
      where: { id: visitId },
        include: {
          patient: true,
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
            email: true,
            phoneNumber: true,
          },
        },
        diagnoses: true,
        prescriptions: {
          include: {
            doctor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        labOrders: true,
        imagingOrders: true,
      },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    return {
      success: true,
      data: visit,
      message: 'Visit retrieved successfully',
    };
  }

  /**
   * Get patient's visit history
   */
  async getPatientVisits(patientId: string, filters?: {
    startDate?: string;
    endDate?: string;
    visitType?: string;
    doctorId?: string;
    limit?: number;
  }) {
    const where: any = { patientId };

    if (filters?.startDate || filters?.endDate) {
      where.visitDate = {};
      if (filters?.startDate) where.visitDate.gte = new Date(filters.startDate);
      if (filters?.endDate) where.visitDate.lte = new Date(filters.endDate);
    }

    if (filters?.visitType) {
      where.visitType = filters.visitType;
    }

    if (filters?.doctorId) {
      where.doctorId = filters.doctorId;
    }

    const visits = await this.db.patientVisit.findMany({
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
        diagnoses: true,
        prescriptions: {
          select: {
            id: true,
            medicationName: true,
            status: true,
          },
        },
      },
      orderBy: { visitDate: 'desc' },
      take: filters?.limit || 50,
    });

    return {
      success: true,
      data: visits,
      message: 'Patient visits retrieved successfully',
    };
  }

  /**
   * Add diagnosis to visit
   */
  async addDiagnosis(visitId: string, diagnosisData: {
    icd10Code: string;
    diagnosisName: string;
    isPrimary: boolean;
    notes?: string;
  }) {
    const visit = await this.db.patientVisit.findUnique({
      where: { id: visitId },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    const diagnosis = await this.db.visitDiagnosis.create({
      data: {
        visitId,
        icd10Code: diagnosisData.icd10Code,
        diagnosisName: diagnosisData.diagnosisName,
        isPrimary: diagnosisData.isPrimary,
        notes: diagnosisData.notes,
      },
    });

    return {
      success: true,
      data: diagnosis,
      message: 'Diagnosis added successfully',
    };
  }

  /**
   * Update diagnosis
   */
  async updateDiagnosis(diagnosisId: string, diagnosisData: {
    icd10Code?: string;
    diagnosisName?: string;
    isPrimary?: boolean;
    notes?: string;
  }) {
    const diagnosis = await this.db.visitDiagnosis.update({
      where: { id: diagnosisId },
      data: {
        icd10Code: diagnosisData.icd10Code,
        diagnosisName: diagnosisData.diagnosisName,
        isPrimary: diagnosisData.isPrimary,
        notes: diagnosisData.notes,
      },
    });

    return {
      success: true,
      data: diagnosis,
      message: 'Diagnosis updated successfully',
    };
  }

  /**
   * Remove diagnosis
   */
  async removeDiagnosis(diagnosisId: string) {
    await this.db.visitDiagnosis.delete({
      where: { id: diagnosisId },
    });

    return {
      success: true,
      message: 'Diagnosis removed successfully',
    };
  }

  /**
   * Process voice-to-text transcription
   */
  async processVoiceTranscription(visitId: string, voiceFileUrl: string, transcribedText: string) {
    const visit = await this.db.patientVisit.findUnique({
      where: { id: visitId },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    const updatedVisit = await this.db.patientVisit.update({
      where: { id: visitId },
      data: {
        voiceFileUrl,
        voiceNotes: transcribedText,
      },
    });

    return {
      success: true,
      data: updatedVisit,
      message: 'Voice transcription processed successfully',
    };
  }

  /**
   * Get ICD-10 code suggestions based on symptoms
   */
  async getIcd10Suggestions(symptoms: string) {
    // This would typically integrate with an ICD-10 API or database
    // For now, return mock suggestions based on common symptoms
    const suggestions = [
      {
        code: 'R50.9',
        description: 'Fever, unspecified',
        category: 'Symptoms and signs',
      },
      {
        code: 'R06.02',
        description: 'Shortness of breath',
        category: 'Symptoms and signs',
      },
      {
        code: 'R10.9',
        description: 'Unspecified abdominal pain',
        category: 'Symptoms and signs',
      },
    ];

    return {
      success: true,
      data: suggestions,
      message: 'ICD-10 suggestions retrieved successfully',
    };
  }

  /**
   * Get visit statistics for a doctor
   */
  async getVisitStatistics(doctorId: string, startDate?: string, endDate?: string) {
    const where: any = { doctorId };

    if (startDate || endDate) {
      where.visitDate = {};
      if (startDate) where.visitDate.gte = new Date(startDate);
      if (endDate) where.visitDate.lte = new Date(endDate);
    }

    const [totalVisits, visitsByType, recentVisits] = await Promise.all([
      this.db.patientVisit.count({ where }),
      this.db.patientVisit.groupBy({
        by: ['visitType'],
        where,
        _count: { visitType: true },
      }),
      this.db.patientVisit.findMany({
        where,
        include: {
          patient: true,
        },
        orderBy: { visitDate: 'desc' },
        take: 10,
      }),
    ]);

    return {
      success: true,
      data: {
        totalVisits,
        visitsByType,
        recentVisits,
      },
      message: 'Visit statistics retrieved successfully',
    };
  }
}
