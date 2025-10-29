import { DatabaseService } from '../../auth/services/database.service';
export declare class ImagingService {
    private readonly db;
    constructor(db: DatabaseService);
    createImagingOrder(orderData: {
        patientId: string;
        doctorId: string;
        visitId?: string;
        studyType: string;
        bodyPart: string;
        clinicalHistory?: string;
        urgency?: string;
        imagingCenter?: string;
        centerAddress?: string;
    }): Promise<{
        success: boolean;
        data: {
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
            };
            visit: {
                id: string;
                visitDate: Date;
                chiefComplaint: string;
            };
        } & {
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
        };
        message: string;
    }>;
    uploadImagingResult(resultData: {
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
            order: {
                id: string;
                studyType: import(".prisma/client").$Enums.ImagingStudyType;
                bodyPart: string;
                clinicalHistory: string;
            };
        } & {
            status: import(".prisma/client").$Enums.ImagingResultStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            patientId: string;
            reportedAt: Date;
            orderId: string | null;
            reportFileUrl: string | null;
            ocrText: string | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
            studyType: import(".prisma/client").$Enums.ImagingStudyType;
            bodyPart: string;
            technique: string | null;
            contrastUsed: boolean;
            findings: string | null;
            impression: string | null;
            recommendations: string | null;
            imageUrls: string[];
            radiologistName: string | null;
            radiologistId: string | null;
            performedAt: Date;
        };
        analysis: {
            isCritical: boolean;
            isAbnormal: boolean;
            interpretation: string;
            recommendations: string;
        };
        message: string;
    }>;
    getPatientImagingResults(patientId: string, filters?: {
        studyType?: string;
        bodyPart?: string;
        startDate?: string;
        endDate?: string;
        status?: string;
        limit?: number;
    }): Promise<{
        success: boolean;
        data: ({
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
            };
            order: {
                id: string;
                studyType: import(".prisma/client").$Enums.ImagingStudyType;
                bodyPart: string;
                clinicalHistory: string;
            };
        } & {
            status: import(".prisma/client").$Enums.ImagingResultStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            patientId: string;
            reportedAt: Date;
            orderId: string | null;
            reportFileUrl: string | null;
            ocrText: string | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
            studyType: import(".prisma/client").$Enums.ImagingStudyType;
            bodyPart: string;
            technique: string | null;
            contrastUsed: boolean;
            findings: string | null;
            impression: string | null;
            recommendations: string | null;
            imageUrls: string[];
            radiologistName: string | null;
            radiologistId: string | null;
            performedAt: Date;
        })[];
        message: string;
    }>;
    getImagingResult(resultId: string): Promise<{
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
            order: {
                id: string;
                studyType: import(".prisma/client").$Enums.ImagingStudyType;
                bodyPart: string;
                clinicalHistory: string;
                urgency: import(".prisma/client").$Enums.OrderUrgency;
            };
        } & {
            status: import(".prisma/client").$Enums.ImagingResultStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            patientId: string;
            reportedAt: Date;
            orderId: string | null;
            reportFileUrl: string | null;
            ocrText: string | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
            studyType: import(".prisma/client").$Enums.ImagingStudyType;
            bodyPart: string;
            technique: string | null;
            contrastUsed: boolean;
            findings: string | null;
            impression: string | null;
            recommendations: string | null;
            imageUrls: string[];
            radiologistName: string | null;
            radiologistId: string | null;
            performedAt: Date;
        };
        message: string;
    }>;
    reviewImagingResult(resultId: string, doctorId: string, reviewNotes?: string): Promise<{
        success: boolean;
        data: {
            status: import(".prisma/client").$Enums.ImagingResultStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            patientId: string;
            reportedAt: Date;
            orderId: string | null;
            reportFileUrl: string | null;
            ocrText: string | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
            studyType: import(".prisma/client").$Enums.ImagingStudyType;
            bodyPart: string;
            technique: string | null;
            contrastUsed: boolean;
            findings: string | null;
            impression: string | null;
            recommendations: string | null;
            imageUrls: string[];
            radiologistName: string | null;
            radiologistId: string | null;
            performedAt: Date;
        };
        message: string;
    }>;
    flagImagingResult(resultId: string, doctorId: string, flagReason: string): Promise<{
        success: boolean;
        data: {
            status: import(".prisma/client").$Enums.ImagingResultStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            patientId: string;
            reportedAt: Date;
            orderId: string | null;
            reportFileUrl: string | null;
            ocrText: string | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
            studyType: import(".prisma/client").$Enums.ImagingStudyType;
            bodyPart: string;
            technique: string | null;
            contrastUsed: boolean;
            findings: string | null;
            impression: string | null;
            recommendations: string | null;
            imageUrls: string[];
            radiologistName: string | null;
            radiologistId: string | null;
            performedAt: Date;
        };
        message: string;
    }>;
    getCriticalImagingResults(doctorId?: string): Promise<{
        success: boolean;
        data: ({
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
        } & {
            status: import(".prisma/client").$Enums.ImagingResultStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            patientId: string;
            reportedAt: Date;
            orderId: string | null;
            reportFileUrl: string | null;
            ocrText: string | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
            studyType: import(".prisma/client").$Enums.ImagingStudyType;
            bodyPart: string;
            technique: string | null;
            contrastUsed: boolean;
            findings: string | null;
            impression: string | null;
            recommendations: string | null;
            imageUrls: string[];
            radiologistName: string | null;
            radiologistId: string | null;
            performedAt: Date;
        })[];
        message: string;
    }>;
    getImagingStatistics(doctorId?: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: {
            totalResults: number;
            criticalResults: number;
            resultsByType: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ImagingResultGroupByOutputType, "studyType"[]> & {
                _count: {
                    studyType: number;
                };
            })[];
            criticalRate: number;
        };
        message: string;
    }>;
    getPatientImagingOrders(patientId: string, filters?: {
        status?: string;
        studyType?: string;
        startDate?: string;
        endDate?: string;
        doctorId?: string;
        limit?: number;
    }): Promise<{
        success: boolean;
        data: ({
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
            };
            visit: {
                id: string;
                visitDate: Date;
                chiefComplaint: string;
            };
            results: {
                status: import(".prisma/client").$Enums.ImagingResultStatus;
                id: string;
                studyType: import(".prisma/client").$Enums.ImagingStudyType;
                bodyPart: string;
                findings: string;
                impression: string;
            }[];
        } & {
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
        })[];
        message: string;
    }>;
    private processOCR;
    private analyzeImagingFindings;
    private sendCriticalImagingAlert;
    updateImagingOrderStatus(orderId: string, status: string, notes?: string): Promise<{
        success: boolean;
        data: {
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
        };
        message: string;
    }>;
}
