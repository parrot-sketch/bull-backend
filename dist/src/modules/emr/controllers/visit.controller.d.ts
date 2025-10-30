import { VisitService } from '../services/visit.service';
export declare class VisitController {
    private readonly visitService;
    constructor(visitService: VisitService);
    createVisit(req: any, visitData: {
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
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
            };
            diagnoses: {
                id: string;
                createdAt: Date;
                notes: string | null;
                visitId: string;
                icd10Code: string;
                diagnosisName: string;
                isPrimary: boolean;
            }[];
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
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
            };
            diagnoses: {
                id: string;
                createdAt: Date;
                notes: string | null;
                visitId: string;
                icd10Code: string;
                diagnosisName: string;
                isPrimary: boolean;
            }[];
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                status: import(".prisma/client").$Enums.PrescriptionStatus;
                patientId: string;
                duration: string;
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
                prescribedAt: Date;
                filledAt: Date | null;
                pickedUpAt: Date | null;
                qrCode: string | null;
                digitalSignature: string | null;
            })[];
            labOrders: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                status: import(".prisma/client").$Enums.LabOrderStatus;
                patientId: string;
                visitId: string | null;
                testsRequested: string[];
                clinicalNotes: string | null;
                urgency: import(".prisma/client").$Enums.OrderUrgency;
                labName: string | null;
                labAddress: string | null;
                orderedAt: Date;
                collectedAt: Date | null;
                completedAt: Date | null;
            }[];
            imagingOrders: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                status: import(".prisma/client").$Enums.ImagingOrderStatus;
                patientId: string;
                visitId: string | null;
                urgency: import(".prisma/client").$Enums.OrderUrgency;
                orderedAt: Date;
                completedAt: Date | null;
                studyType: import(".prisma/client").$Enums.ImagingStudyType;
                bodyPart: string;
                clinicalHistory: string | null;
                imagingCenter: string | null;
                centerAddress: string | null;
                scheduledAt: Date | null;
                performedAt: Date | null;
            }[];
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
            doctor: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                phoneNumber: string;
                specialization: string;
            };
            diagnoses: {
                id: string;
                createdAt: Date;
                notes: string | null;
                visitId: string;
                icd10Code: string;
                diagnosisName: string;
                isPrimary: boolean;
            }[];
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
        };
        message: string;
    }>;
    getPatientVisits(patientId: string, startDate?: string, endDate?: string, visitType?: string, doctorId?: string, limit?: number): Promise<{
        success: boolean;
        data: ({
            prescriptions: {
                id: string;
                status: import(".prisma/client").$Enums.PrescriptionStatus;
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
                notes: string | null;
                visitId: string;
                icd10Code: string;
                diagnosisName: string;
                isPrimary: boolean;
            }[];
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
            notes: string | null;
            visitId: string;
            icd10Code: string;
            diagnosisName: string;
            isPrimary: boolean;
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
            notes: string | null;
            visitId: string;
            icd10Code: string;
            diagnosisName: string;
            isPrimary: boolean;
        };
        message: string;
    }>;
    removeDiagnosis(diagnosisId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    processVoiceTranscription(visitId: string, transcriptionData: {
        voiceFileUrl: string;
        transcribedText: string;
    }): Promise<{
        success: boolean;
        data: {
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
        };
        message: string;
    }>;
}
