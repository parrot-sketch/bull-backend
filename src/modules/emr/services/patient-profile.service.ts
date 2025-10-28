import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../auth/services/database.service';

@Injectable()
export class PatientProfileService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Create or update patient profile
   */
  async upsertPatientProfile(patientId: string, profileData: {
    dateOfBirth?: string;
    gender?: string;
    bloodType?: string;
    height?: number;
    weight?: number;
    emergencyContact?: string;
    emergencyPhone?: string;
    medicalHistory?: string[];
    surgicalHistory?: string[];
    familyHistory?: string[];
    socialHistory?: string;
    primaryInsurance?: string;
    insuranceNumber?: string;
    insuranceExpiry?: string;
    preferredLanguage?: string;
    communicationPref?: string;
  }) {
    // Verify patient exists
    const patient = await this.db.user.findUnique({
      where: { id: patientId, role: 'PATIENT' },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Prepare data for upsert
    const dataToUpsert: any = {};

    if (profileData.dateOfBirth) {
      dataToUpsert.dateOfBirth = new Date(profileData.dateOfBirth);
    }
    if (profileData.gender) {
      dataToUpsert.gender = profileData.gender;
    }
    if (profileData.bloodType) {
      dataToUpsert.bloodType = profileData.bloodType;
    }
    if (profileData.height !== undefined) {
      dataToUpsert.height = profileData.height;
    }
    if (profileData.weight !== undefined) {
      dataToUpsert.weight = profileData.weight;
    }
    if (profileData.emergencyContact) {
      dataToUpsert.emergencyContact = profileData.emergencyContact;
    }
    if (profileData.emergencyPhone) {
      dataToUpsert.emergencyPhone = profileData.emergencyPhone;
    }
    if (profileData.medicalHistory) {
      dataToUpsert.medicalHistory = profileData.medicalHistory;
    }
    if (profileData.surgicalHistory) {
      dataToUpsert.surgicalHistory = profileData.surgicalHistory;
    }
    if (profileData.familyHistory) {
      dataToUpsert.familyHistory = profileData.familyHistory;
    }
    if (profileData.socialHistory) {
      dataToUpsert.socialHistory = profileData.socialHistory;
    }
    if (profileData.primaryInsurance) {
      dataToUpsert.primaryInsurance = profileData.primaryInsurance;
    }
    if (profileData.insuranceNumber) {
      dataToUpsert.insuranceNumber = profileData.insuranceNumber;
    }
    if (profileData.insuranceExpiry) {
      dataToUpsert.insuranceExpiry = new Date(profileData.insuranceExpiry);
    }
    if (profileData.preferredLanguage) {
      dataToUpsert.preferredLanguage = profileData.preferredLanguage;
    }
    if (profileData.communicationPref) {
      dataToUpsert.communicationPref = profileData.communicationPref;
    }

    const profile = await this.db.patientProfile.upsert({
      where: { patientId },
      update: dataToUpsert,
      create: {
        patientId,
        ...dataToUpsert,
      },
      include: {
        allergies: true,
        currentMedications: true,
      },
    });

    return {
      success: true,
      data: profile,
      message: 'Patient profile updated successfully',
    };
  }

  /**
   * Get patient profile
   */
  async getPatientProfile(patientId: string) {
    const include = {
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
        },
        orderBy: { visitDate: 'desc' },
        take: 10,
      },
    } as const;

    let profile = await this.db.patientProfile.findUnique({
      where: { patientId },
      include,
    });

    if (!profile) {
      // Initialize a minimal patient profile so the app can function without 404s
      profile = await this.db.patientProfile.create({
        data: {
          patientId,
          preferredLanguage: 'English',
          communicationPref: 'EMAIL' as any,
        },
        include,
      });
      return {
        success: true,
        data: profile,
        message: 'Patient profile initialized',
      };
    }

    return {
      success: true,
      data: profile,
      message: 'Patient profile retrieved successfully',
    };
  }

  /**
   * Add allergy to patient profile
   */
  async addAllergy(patientId: string, allergyData: {
    allergen: string;
    severity: string;
    reaction: string;
    notes?: string;
    diagnosedAt?: string;
    diagnosedBy?: string;
  }) {
    const profile = await this.db.patientProfile.findUnique({
      where: { patientId },
    });

    if (!profile) {
      throw new NotFoundException('Patient profile not found');
    }

    const allergy = await this.db.patientAllergy.create({
      data: {
        patientId,
        allergen: allergyData.allergen,
        severity: allergyData.severity as any,
        reaction: allergyData.reaction,
        notes: allergyData.notes,
        diagnosedAt: allergyData.diagnosedAt ? new Date(allergyData.diagnosedAt) : null,
        diagnosedBy: allergyData.diagnosedBy,
      },
    });

    return {
      success: true,
      data: allergy,
      message: 'Allergy added successfully',
    };
  }

  /**
   * Update allergy
   */
  async updateAllergy(allergyId: string, allergyData: {
    allergen?: string;
    severity?: string;
    reaction?: string;
    notes?: string;
  }) {
    const allergy = await this.db.patientAllergy.update({
      where: { id: allergyId },
      data: {
        allergen: allergyData.allergen,
        severity: allergyData.severity as any,
        reaction: allergyData.reaction,
        notes: allergyData.notes,
      },
    });

    return {
      success: true,
      data: allergy,
      message: 'Allergy updated successfully',
    };
  }

  /**
   * Remove allergy
   */
  async removeAllergy(allergyId: string) {
    await this.db.patientAllergy.delete({
      where: { id: allergyId },
    });

    return {
      success: true,
      message: 'Allergy removed successfully',
    };
  }

  /**
   * Add current medication
   */
  async addCurrentMedication(patientId: string, medicationData: {
    medicationName: string;
    dosage: string;
    frequency: string;
    route?: string;
    startDate: string;
    endDate?: string;
    prescribedBy?: string;
    pharmacy?: string;
    notes?: string;
  }) {
    const profile = await this.db.patientProfile.findUnique({
      where: { patientId },
    });

    if (!profile) {
      throw new NotFoundException('Patient profile not found');
    }

    const medication = await this.db.patientMedication.create({
      data: {
        patientId,
        medicationName: medicationData.medicationName,
        dosage: medicationData.dosage,
        frequency: medicationData.frequency,
        route: medicationData.route,
        startDate: new Date(medicationData.startDate),
        endDate: medicationData.endDate ? new Date(medicationData.endDate) : null,
        prescribedBy: medicationData.prescribedBy,
        pharmacy: medicationData.pharmacy,
        notes: medicationData.notes,
      },
    });

    return {
      success: true,
      data: medication,
      message: 'Medication added successfully',
    };
  }

  /**
   * Update current medication
   */
  async updateCurrentMedication(medicationId: string, medicationData: {
    medicationName?: string;
    dosage?: string;
    frequency?: string;
    route?: string;
    endDate?: string;
    pharmacy?: string;
    notes?: string;
  }) {
    const updateData: any = {
      medicationName: medicationData.medicationName,
      dosage: medicationData.dosage,
      frequency: medicationData.frequency,
      route: medicationData.route,
      pharmacy: medicationData.pharmacy,
      notes: medicationData.notes,
    };

    if (medicationData.endDate) {
      updateData.endDate = new Date(medicationData.endDate);
    }

    const medication = await this.db.patientMedication.update({
      where: { id: medicationId },
      data: updateData,
    });

    return {
      success: true,
      data: medication,
      message: 'Medication updated successfully',
    };
  }

  /**
   * Remove current medication
   */
  async removeCurrentMedication(medicationId: string) {
    await this.db.patientMedication.delete({
      where: { id: medicationId },
    });

    return {
      success: true,
      message: 'Medication removed successfully',
    };
  }

  /**
   * Get patient's allergies
   */
  async getPatientAllergies(patientId: string) {
    const allergies = await this.db.patientAllergy.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: allergies,
      message: 'Allergies retrieved successfully',
    };
  }

  /**
   * Get patient's current medications
   */
  async getPatientMedications(patientId: string) {
    const medications = await this.db.patientMedication.findMany({
      where: { 
        patientId,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ],
      },
      orderBy: { startDate: 'desc' },
    });

    return {
      success: true,
      data: medications,
      message: 'Current medications retrieved successfully',
    };
  }
}
