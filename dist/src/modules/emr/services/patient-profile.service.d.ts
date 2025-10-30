import { DatabaseService } from '../../auth/services/database.service';
export declare class PatientProfileService {
    private readonly db;
    constructor(db: DatabaseService);
    upsertPatientProfile(patientId: string, profileData: {
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
    }): Promise<{
        success: boolean;
        data: {
            allergies: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                severity: import(".prisma/client").$Enums.AllergySeverity;
                notes: string | null;
                patientId: string;
                allergen: string;
                reaction: string;
                diagnosedAt: Date | null;
                diagnosedBy: string | null;
            }[];
            currentMedications: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                notes: string | null;
                patientId: string;
                medicationName: string;
                dosage: string;
                frequency: string;
                startDate: Date;
                endDate: Date | null;
                route: string | null;
                prescribedBy: string | null;
                pharmacy: string | null;
            }[];
        } & {
            id: string;
            dateOfBirth: Date | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            bloodType: import(".prisma/client").$Enums.BloodType | null;
            height: number | null;
            weight: number | null;
            emergencyContact: string | null;
            emergencyPhone: string | null;
            medicalHistory: string[];
            surgicalHistory: string[];
            familyHistory: string[];
            socialHistory: string | null;
            primaryInsurance: string | null;
            insuranceNumber: string | null;
            insuranceExpiry: Date | null;
            preferredLanguage: string;
            communicationPref: import(".prisma/client").$Enums.CommunicationPreference;
        };
        message: string;
    }>;
    getPatientProfile(patientId: string): Promise<{
        success: boolean;
        data: {
            allergies: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                severity: import(".prisma/client").$Enums.AllergySeverity;
                notes: string | null;
                patientId: string;
                allergen: string;
                reaction: string;
                diagnosedAt: Date | null;
                diagnosedBy: string | null;
            }[];
            currentMedications: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                notes: string | null;
                patientId: string;
                medicationName: string;
                dosage: string;
                frequency: string;
                startDate: Date;
                endDate: Date | null;
                route: string | null;
                prescribedBy: string | null;
                pharmacy: string | null;
            }[];
            visits: ({
                doctor: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    specialization: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                appointmentId: string | null;
                patientId: string;
                visitDate: Date;
                visitType: import(".prisma/client").$Enums.VisitType;
                chiefComplaint: string;
                subjective: string | null;
                objective: string | null;
                assessment: string | null;
                plan: string | null;
                voiceNotes: string | null;
                voiceFileUrl: string | null;
                followUpRequired: boolean;
                followUpDate: Date | null;
                followUpNotes: string | null;
            })[];
        } & {
            id: string;
            dateOfBirth: Date | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            bloodType: import(".prisma/client").$Enums.BloodType | null;
            height: number | null;
            weight: number | null;
            emergencyContact: string | null;
            emergencyPhone: string | null;
            medicalHistory: string[];
            surgicalHistory: string[];
            familyHistory: string[];
            socialHistory: string | null;
            primaryInsurance: string | null;
            insuranceNumber: string | null;
            insuranceExpiry: Date | null;
            preferredLanguage: string;
            communicationPref: import(".prisma/client").$Enums.CommunicationPreference;
        };
        message: string;
    }>;
    addAllergy(patientId: string, allergyData: {
        allergen: string;
        severity: string;
        reaction: string;
        notes?: string;
        diagnosedAt?: string;
        diagnosedBy?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            severity: import(".prisma/client").$Enums.AllergySeverity;
            notes: string | null;
            patientId: string;
            allergen: string;
            reaction: string;
            diagnosedAt: Date | null;
            diagnosedBy: string | null;
        };
        message: string;
    }>;
    updateAllergy(allergyId: string, allergyData: {
        allergen?: string;
        severity?: string;
        reaction?: string;
        notes?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            severity: import(".prisma/client").$Enums.AllergySeverity;
            notes: string | null;
            patientId: string;
            allergen: string;
            reaction: string;
            diagnosedAt: Date | null;
            diagnosedBy: string | null;
        };
        message: string;
    }>;
    removeAllergy(allergyId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addCurrentMedication(patientId: string, medicationData: {
        medicationName: string;
        dosage: string;
        frequency: string;
        route?: string;
        startDate: string;
        endDate?: string;
        prescribedBy?: string;
        pharmacy?: string;
        notes?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            patientId: string;
            medicationName: string;
            dosage: string;
            frequency: string;
            startDate: Date;
            endDate: Date | null;
            route: string | null;
            prescribedBy: string | null;
            pharmacy: string | null;
        };
        message: string;
    }>;
    updateCurrentMedication(medicationId: string, medicationData: {
        medicationName?: string;
        dosage?: string;
        frequency?: string;
        route?: string;
        endDate?: string;
        pharmacy?: string;
        notes?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            patientId: string;
            medicationName: string;
            dosage: string;
            frequency: string;
            startDate: Date;
            endDate: Date | null;
            route: string | null;
            prescribedBy: string | null;
            pharmacy: string | null;
        };
        message: string;
    }>;
    removeCurrentMedication(medicationId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getPatientAllergies(patientId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            severity: import(".prisma/client").$Enums.AllergySeverity;
            notes: string | null;
            patientId: string;
            allergen: string;
            reaction: string;
            diagnosedAt: Date | null;
            diagnosedBy: string | null;
        }[];
        message: string;
    }>;
    getPatientMedications(patientId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            patientId: string;
            medicationName: string;
            dosage: string;
            frequency: string;
            startDate: Date;
            endDate: Date | null;
            route: string | null;
            prescribedBy: string | null;
            pharmacy: string | null;
        }[];
        message: string;
    }>;
}
