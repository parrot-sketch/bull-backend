import { DatabaseService } from '../../auth/services/database.service';
export declare class VisitService {
    private readonly db;
    constructor(db: DatabaseService);
    createVisit(visitData: {
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
    }): Promise<{
        success: boolean;
        data: {
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
            };
            patient: {
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
            diagnoses: {
                id: string;
                createdAt: Date;
                visitId: string;
                icd10Code: string;
                diagnosisName: string;
                isPrimary: boolean;
                notes: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            visitDate: Date;
            patientId: string;
            appointmentId: string | null;
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
        };
        message: string;
    }>;
    updateVisit(visitId: string, updateData: {
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
    }): Promise<{
        success: boolean;
        data: {
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
            };
            patient: {
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
            diagnoses: {
                id: string;
                createdAt: Date;
                visitId: string;
                icd10Code: string;
                diagnosisName: string;
                isPrimary: boolean;
                notes: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            visitDate: Date;
            patientId: string;
            appointmentId: string | null;
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
        };
        message: string;
    }>;
    getVisit(visitId: string): Promise<{
        success: boolean;
        data: {
            prescriptions: ({
                doctor: {
                    id: string;
                    firstName: string;
                    lastName: string;
                };
            } & {
                status: import(".prisma/client").$Enums.PrescriptionStatus;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                duration: string;
                patientId: string;
                prescribedAt: Date;
                visitId: string | null;
                medicationName: string;
                genericName: string | null;
                dosage: string;
                frequency: string;
                quantity: number;
                refills: number;
                instructions: string | null;
                drugInteractions: string[];
                contraindications: string[];
                pharmacyName: string | null;
                pharmacyAddress: string | null;
                pharmacyPhone: string | null;
                deliveryMethod: import(".prisma/client").$Enums.DeliveryMethod;
                filledAt: Date | null;
                pickedUpAt: Date | null;
                qrCode: string | null;
                digitalSignature: string | null;
            })[];
            labOrders: {
                status: import(".prisma/client").$Enums.LabOrderStatus;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                patientId: string;
                labName: string | null;
                labAddress: string | null;
                collectedAt: Date | null;
                visitId: string | null;
                urgency: import(".prisma/client").$Enums.OrderUrgency;
                orderedAt: Date;
                completedAt: Date | null;
                testsRequested: string[];
                clinicalNotes: string | null;
            }[];
            imagingOrders: {
                status: import(".prisma/client").$Enums.ImagingOrderStatus;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                patientId: string;
                studyType: import(".prisma/client").$Enums.ImagingStudyType;
                bodyPart: string;
                performedAt: Date | null;
                visitId: string | null;
                clinicalHistory: string | null;
                urgency: import(".prisma/client").$Enums.OrderUrgency;
                imagingCenter: string | null;
                centerAddress: string | null;
                orderedAt: Date;
                scheduledAt: Date | null;
                completedAt: Date | null;
            }[];
            doctor: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                phoneNumber: string;
                specialization: string;
            };
            patient: {
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
            diagnoses: {
                id: string;
                createdAt: Date;
                visitId: string;
                icd10Code: string;
                diagnosisName: string;
                isPrimary: boolean;
                notes: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            visitDate: Date;
            patientId: string;
            appointmentId: string | null;
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
        };
        message: string;
    }>;
    getPatientVisits(patientId: string, filters?: {
        startDate?: string;
        endDate?: string;
        visitType?: string;
        doctorId?: string;
        limit?: number;
    }): Promise<{
        success: boolean;
        data: ({
            prescriptions: {
                status: import(".prisma/client").$Enums.PrescriptionStatus;
                id: string;
                medicationName: string;
            }[];
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
            };
            diagnoses: {
                id: string;
                createdAt: Date;
                visitId: string;
                icd10Code: string;
                diagnosisName: string;
                isPrimary: boolean;
                notes: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            visitDate: Date;
            patientId: string;
            appointmentId: string | null;
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
        message: string;
    }>;
    addDiagnosis(visitId: string, diagnosisData: {
        icd10Code: string;
        diagnosisName: string;
        isPrimary: boolean;
        notes?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            visitId: string;
            icd10Code: string;
            diagnosisName: string;
            isPrimary: boolean;
            notes: string | null;
        };
        message: string;
    }>;
    updateDiagnosis(diagnosisId: string, diagnosisData: {
        icd10Code?: string;
        diagnosisName?: string;
        isPrimary?: boolean;
        notes?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            visitId: string;
            icd10Code: string;
            diagnosisName: string;
            isPrimary: boolean;
            notes: string | null;
        };
        message: string;
    }>;
    removeDiagnosis(diagnosisId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    processVoiceTranscription(visitId: string, voiceFileUrl: string, transcribedText: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            visitDate: Date;
            patientId: string;
            appointmentId: string | null;
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
        };
        message: string;
    }>;
    getIcd10Suggestions(symptoms: string): Promise<{
        success: boolean;
        data: {
            code: string;
            description: string;
            category: string;
        }[];
        message: string;
    }>;
    getVisitStatistics(doctorId: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: {
            totalVisits: number;
            visitsByType: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PatientVisitGroupByOutputType, "visitType"[]> & {
                _count: {
                    visitType: number;
                };
            })[];
            recentVisits: ({
                patient: {
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
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                visitDate: Date;
                patientId: string;
                appointmentId: string | null;
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
        };
        message: string;
    }>;
}
