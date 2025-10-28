import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../auth/services/database.service';

@Injectable()
export class PrescriptionService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Create a new prescription with drug interaction checking
   */
  async createPrescription(prescriptionData: {
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
  }) {
    // Verify patient and doctor exist
    const [patient, doctor] = await Promise.all([
      this.db.user.findUnique({ where: { id: prescriptionData.patientId, role: 'PATIENT' } }),
      this.db.user.findUnique({ where: { id: prescriptionData.doctorId, role: 'DOCTOR' } }),
    ]);

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Check for drug interactions
    const interactions = await this.checkDrugInteractions(
      prescriptionData.patientId,
      prescriptionData.medicationName
    );

    // Generate QR code for digital prescription
    const qrCode = await this.generatePrescriptionQR(prescriptionData);

    // Create prescription
    const prescription = await this.db.prescription.create({
      data: {
        patientId: prescriptionData.patientId,
        doctorId: prescriptionData.doctorId,
        visitId: prescriptionData.visitId,
        medicationName: prescriptionData.medicationName,
        genericName: prescriptionData.genericName,
        dosage: prescriptionData.dosage,
        frequency: prescriptionData.frequency,
        duration: prescriptionData.duration,
        quantity: prescriptionData.quantity,
        refills: prescriptionData.refills || 0,
        instructions: prescriptionData.instructions,
        drugInteractions: interactions.map(i => i.description),
        contraindications: [], // Would be populated from drug database
        pharmacyName: prescriptionData.pharmacyName,
        pharmacyAddress: prescriptionData.pharmacyAddress,
        pharmacyPhone: prescriptionData.pharmacyPhone,
        deliveryMethod: (prescriptionData.deliveryMethod as any) || 'PICKUP',
        qrCode,
        status: 'PENDING',
      },
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
            licenseNumber: true,
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
      data: prescription,
      interactions,
      message: 'Prescription created successfully',
    };
  }

  /**
   * Update prescription
   */
  async updatePrescription(prescriptionId: string, updateData: {
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
  }) {
    const prescription = await this.db.prescription.findUnique({
      where: { id: prescriptionId },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    const updatedPrescription = await this.db.prescription.update({
      where: { id: prescriptionId },
      data: {
        dosage: updateData.dosage,
        frequency: updateData.frequency,
        duration: updateData.duration,
        quantity: updateData.quantity,
        refills: updateData.refills,
        instructions: updateData.instructions,
        pharmacyName: updateData.pharmacyName,
        pharmacyAddress: updateData.pharmacyAddress,
        pharmacyPhone: updateData.pharmacyPhone,
        deliveryMethod: updateData.deliveryMethod as any,
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
      },
    });

    return {
      success: true,
      data: updatedPrescription,
      message: 'Prescription updated successfully',
    };
  }

  /**
   * Get prescription details
   */
  async getPrescription(prescriptionId: string) {
    const prescription = await this.db.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
            licenseNumber: true,
            npiNumber: true,
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

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    return {
      success: true,
      data: prescription,
      message: 'Prescription retrieved successfully',
    };
  }

  /**
   * Get patient's prescriptions
   */
  async getPatientPrescriptions(patientId: string, filters?: {
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
      where.prescribedAt = {};
      if (filters?.startDate) where.prescribedAt.gte = new Date(filters.startDate);
      if (filters?.endDate) where.prescribedAt.lte = new Date(filters.endDate);
    }

    if (filters?.doctorId) {
      where.doctorId = filters.doctorId;
    }

    const prescriptions = await this.db.prescription.findMany({
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
      },
      orderBy: { prescribedAt: 'desc' },
      take: filters?.limit || 50,
    });

    return {
      success: true,
      data: prescriptions,
      message: 'Patient prescriptions retrieved successfully',
    };
  }

  /**
   * Update prescription status
   */
  async updatePrescriptionStatus(prescriptionId: string, status: string, notes?: string) {
    const prescription = await this.db.prescription.findUnique({
      where: { id: prescriptionId },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    const updateData: any = { status: status as any };

    if (status === 'FILLED') {
      updateData.filledAt = new Date();
    } else if (status === 'PICKED_UP') {
      updateData.pickedUpAt = new Date();
    }

    const updatedPrescription = await this.db.prescription.update({
      where: { id: prescriptionId },
      data: updateData,
    });

    return {
      success: true,
      data: updatedPrescription,
      message: `Prescription status updated to ${status}`,
    };
  }

  /**
   * Cancel prescription
   */
  async cancelPrescription(prescriptionId: string, reason?: string) {
    const prescription = await this.db.prescription.findUnique({
      where: { id: prescriptionId },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    if (prescription.status === 'CANCELLED') {
      throw new BadRequestException('Prescription is already cancelled');
    }

    const updatedPrescription = await this.db.prescription.update({
      where: { id: prescriptionId },
      data: {
        status: 'CANCELLED',
        instructions: reason ? `${prescription.instructions}\n\nCancellation reason: ${reason}` : prescription.instructions,
      },
    });

    return {
      success: true,
      data: updatedPrescription,
      message: 'Prescription cancelled successfully',
    };
  }

  /**
   * Check for drug interactions
   */
  private async checkDrugInteractions(patientId: string, newMedication: string) {
    // Get patient's current medications
    const currentMedications = await this.db.patientMedication.findMany({
      where: {
        patientId,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ],
      },
    });

    // Get patient's allergies
    const allergies = await this.db.patientAllergy.findMany({
      where: { patientId },
    });

    const interactions = [];

    // Check for drug-drug interactions
    for (const medication of currentMedications) {
      const interaction = await this.db.drugInteraction.findFirst({
        where: {
          OR: [
            {
              drug: { name: { contains: newMedication, mode: 'insensitive' } },
              interactingDrug: { name: { contains: medication.medicationName, mode: 'insensitive' } },
            },
            {
              drug: { name: { contains: medication.medicationName, mode: 'insensitive' } },
              interactingDrug: { name: { contains: newMedication, mode: 'insensitive' } },
            },
          ],
        },
        include: {
          drug: true,
          interactingDrug: true,
        },
      });

      if (interaction) {
        interactions.push({
          type: 'DRUG_INTERACTION',
          severity: interaction.severity,
          description: interaction.description,
          clinicalEffect: interaction.clinicalEffect,
          management: interaction.management,
          medications: [newMedication, medication.medicationName],
        });
      }
    }

    // Check for drug-allergy interactions
    for (const allergy of allergies) {
      if (newMedication.toLowerCase().includes(allergy.allergen.toLowerCase())) {
        interactions.push({
          type: 'DRUG_ALLERGY',
          severity: 'CONTRAINDICATED',
          description: `Patient is allergic to ${allergy.allergen}`,
          clinicalEffect: allergy.reaction,
          management: 'Do not prescribe this medication',
          medications: [newMedication],
        });
      }
    }

    return interactions;
  }

  /**
   * Generate QR code for prescription verification
   */
  private async generatePrescriptionQR(prescriptionData: any): Promise<string> {
    // This would typically generate a QR code containing prescription details
    // For now, return a mock QR code data
    const qrData = {
      prescriptionId: 'temp-id',
      patientId: prescriptionData.patientId,
      doctorId: prescriptionData.doctorId,
      medication: prescriptionData.medicationName,
      dosage: prescriptionData.dosage,
      timestamp: new Date().toISOString(),
    };

    return Buffer.from(JSON.stringify(qrData)).toString('base64');
  }

  /**
   * Get prescription statistics for a doctor
   */
  async getPrescriptionStatistics(doctorId: string, startDate?: string, endDate?: string) {
    const where: any = { doctorId };

    if (startDate || endDate) {
      where.prescribedAt = {};
      if (startDate) where.prescribedAt.gte = new Date(startDate);
      if (endDate) where.prescribedAt.lte = new Date(endDate);
    }

    const [totalPrescriptions, prescriptionsByStatus, recentPrescriptions] = await Promise.all([
      this.db.prescription.count({ where }),
      this.db.prescription.groupBy({
        by: ['status'],
        where,
        _count: { status: true },
      }),
      this.db.prescription.findMany({
        where,
        include: {
          patient: true,
        },
        orderBy: { prescribedAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      success: true,
      data: {
        totalPrescriptions,
        prescriptionsByStatus,
        recentPrescriptions,
      },
      message: 'Prescription statistics retrieved successfully',
    };
  }

  /**
   * Search for medications in drug database
   */
  async searchMedications(query: string) {
    const medications = await this.db.drug.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { genericName: { contains: query, mode: 'insensitive' } },
          { brandNames: { has: query } },
        ],
      },
      take: 20,
    });

    return {
      success: true,
      data: medications,
      message: 'Medications retrieved successfully',
    };
  }
}
