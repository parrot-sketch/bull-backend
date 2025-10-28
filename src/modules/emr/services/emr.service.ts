import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../auth/services/database.service';

@Injectable()
export class EmrService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Get comprehensive patient overview for dashboard
   */
  async getPatientOverview(patientId: string) {
    const patient = await this.db.user.findUnique({
      where: { id: patientId },
      include: {
        patientProfile: {
          include: {
            allergies: true,
            currentMedications: true,
            visits: {
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
              },
              orderBy: { visitDate: 'desc' },
              take: 5,
            },
            labResults: {
              orderBy: { reportedAt: 'desc' },
              take: 10,
            },
            imagingResults: {
              orderBy: { reportedAt: 'desc' },
              take: 5,
            },
            prescriptions: {
              where: { status: { not: 'CANCELLED' } },
              orderBy: { prescribedAt: 'desc' },
              take: 10,
            },
          },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    if (!patient.patientProfile) {
      throw new NotFoundException('Patient profile not found');
    }

    // Calculate health metrics
    const healthMetrics = await this.calculateHealthMetrics(patientId);

    return {
      success: true,
      data: {
        patient: {
          id: patient.id,
          name: `${patient.firstName} ${patient.lastName}`,
          email: patient.email,
          phoneNumber: patient.phoneNumber,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
        },
        profile: patient.patientProfile,
        healthMetrics,
        recentActivity: {
          visits: patient.patientProfile.visits,
          labResults: patient.patientProfile.labResults,
          imagingResults: patient.patientProfile.imagingResults,
          prescriptions: patient.patientProfile.prescriptions,
        },
      },
      message: 'Patient overview retrieved successfully',
    };
  }

  /**
   * Search patients by various criteria
   */
  async searchPatients(searchCriteria: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    medicalRecordNumber?: string;
    limit?: number;
  }) {
    const where: any = { role: 'PATIENT', isActive: true };

    if (searchCriteria.name) {
      where.OR = [
        { firstName: { contains: searchCriteria.name, mode: 'insensitive' } },
        { lastName: { contains: searchCriteria.name, mode: 'insensitive' } },
      ];
    }

    if (searchCriteria.email) {
      where.email = { contains: searchCriteria.email, mode: 'insensitive' };
    }

    if (searchCriteria.phoneNumber) {
      where.phoneNumber = { contains: searchCriteria.phoneNumber };
    }

    if (searchCriteria.dateOfBirth) {
      where.dateOfBirth = new Date(searchCriteria.dateOfBirth);
    }

    const patients = await this.db.user.findMany({
      where,
      include: {
        patientProfile: {
          include: {
            allergies: true,
            currentMedications: true,
          },
        },
      },
      take: searchCriteria.limit || 50,
      orderBy: { firstName: 'asc' },
    });

    return {
      success: true,
      data: patients.map(patient => ({
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        email: patient.email,
        phoneNumber: patient.phoneNumber,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        profile: patient.patientProfile,
      })),
      message: 'Patients retrieved successfully',
    };
  }

  /**
   * Get patient's complete medical history timeline
   */
  async getPatientTimeline(patientId: string, startDate?: string, endDate?: string) {
    const where: any = { patientId };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Get all medical events
    const [visits, labResults, imagingResults, prescriptions] = await Promise.all([
      this.db.patientVisit.findMany({
        where: { patientId },
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
        },
        orderBy: { visitDate: 'desc' },
      }),
      this.db.labResult.findMany({
        where: { patientId },
        orderBy: { reportedAt: 'desc' },
      }),
      this.db.imagingResult.findMany({
        where: { patientId },
        orderBy: { reportedAt: 'desc' },
      }),
      this.db.prescription.findMany({
        where: { patientId },
        include: {
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { prescribedAt: 'desc' },
      }),
    ]);

    // Combine and sort all events
    const timeline = [
      ...visits.map(visit => ({
        type: 'VISIT',
        date: visit.visitDate,
        data: visit,
      })),
      ...labResults.map(result => ({
        type: 'LAB_RESULT',
        date: result.reportedAt,
        data: result,
      })),
      ...imagingResults.map(result => ({
        type: 'IMAGING_RESULT',
        date: result.reportedAt,
        data: result,
      })),
      ...prescriptions.map(prescription => ({
        type: 'PRESCRIPTION',
        date: prescription.prescribedAt,
        data: prescription,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      success: true,
      data: timeline,
      message: 'Patient timeline retrieved successfully',
    };
  }

  /**
   * Calculate health metrics and risk factors
   */
  private async calculateHealthMetrics(patientId: string) {
    const profile = await this.db.patientProfile.findUnique({
      where: { patientId },
      include: {
        allergies: true,
        currentMedications: true,
        visits: {
          include: { diagnoses: true },
          orderBy: { visitDate: 'desc' },
        },
        labResults: {
          orderBy: { reportedAt: 'desc' },
        },
      },
    });

    if (!profile) {
      return {
        riskFactors: [],
        activeConditions: [],
        medicationCount: 0,
        allergyCount: 0,
        lastVisitDate: null,
        criticalLabResults: 0,
      };
    }

    // Extract active conditions from recent visits
    const activeConditions = profile.visits
      .flatMap(visit => visit.diagnoses)
      .map(diagnosis => diagnosis.diagnosisName)
      .filter((value, index, self) => self.indexOf(value) === index);

    // Count critical lab results
    const criticalLabResults = profile.labResults.filter(
      result => result.criticalValue || result.isAbnormal
    ).length;

    // Identify risk factors
    const riskFactors = [];
    if (profile.allergies.length > 0) {
      riskFactors.push('Known allergies');
    }
    if (profile.currentMedications.length > 5) {
      riskFactors.push('Multiple medications');
    }
    if (criticalLabResults > 0) {
      riskFactors.push('Abnormal lab values');
    }

    return {
      riskFactors,
      activeConditions,
      medicationCount: profile.currentMedications.length,
      allergyCount: profile.allergies.length,
      lastVisitDate: profile.visits[0]?.visitDate || null,
      criticalLabResults,
    };
  }

  /**
   * Get patient's vital signs history
   */
  async getVitalSignsHistory(patientId: string, limit: number = 50) {
    // This would typically come from a separate vital signs table
    // For now, we'll return a placeholder structure
    return {
      success: true,
      data: {
        bloodPressure: [],
        heartRate: [],
        temperature: [],
        weight: [],
        height: [],
      },
      message: 'Vital signs history retrieved successfully',
    };
  }

  /**
   * Generate patient summary report
   */
  async generatePatientSummary(patientId: string) {
    const overview = await this.getPatientOverview(patientId);
    const timeline = await this.getPatientTimeline(patientId);

    return {
      success: true,
      data: {
        ...overview.data,
        timeline: timeline.data,
        generatedAt: new Date(),
      },
      message: 'Patient summary generated successfully',
    };
  }
}

