import { ImagingService } from '../services/imaging.service';
export declare class ImagingController {
    private readonly imagingService;
    constructor(imagingService: ImagingService);
    createImagingOrder(req: any, orderData: {
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
        };
        message: string;
    }>;
    uploadImagingResult(req: any, resultData: {
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
            order: {
                id: string;
                studyType: import(".prisma/client").$Enums.ImagingStudyType;
                bodyPart: string;
                clinicalHistory: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            status: import(".prisma/client").$Enums.ImagingResultStatus;
            patientId: string;
            studyType: import(".prisma/client").$Enums.ImagingStudyType;
            bodyPart: string;
            performedAt: Date;
            reportedAt: Date;
            orderId: string | null;
            reportFileUrl: string | null;
            ocrText: string | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
            technique: string | null;
            contrastUsed: boolean;
            findings: string | null;
            impression: string | null;
            recommendations: string | null;
            imageUrls: string[];
            radiologistName: string | null;
            radiologistId: string | null;
        };
        analysis: {
            isCritical: boolean;
            isAbnormal: boolean;
            interpretation: string;
            recommendations: string;
        };
        message: string;
    }>;
    getPatientImagingResults(patientId: string, studyType?: string, bodyPart?: string, startDate?: string, endDate?: string, status?: string, limit?: number): Promise<{
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            status: import(".prisma/client").$Enums.ImagingResultStatus;
            patientId: string;
            studyType: import(".prisma/client").$Enums.ImagingStudyType;
            bodyPart: string;
            performedAt: Date;
            reportedAt: Date;
            orderId: string | null;
            reportFileUrl: string | null;
            ocrText: string | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
            technique: string | null;
            contrastUsed: boolean;
            findings: string | null;
            impression: string | null;
            recommendations: string | null;
            imageUrls: string[];
            radiologistName: string | null;
            radiologistId: string | null;
        })[];
        message: string;
    }>;
    getImagingResult(resultId: string): Promise<{
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
            order: {
                id: string;
                urgency: import(".prisma/client").$Enums.OrderUrgency;
                studyType: import(".prisma/client").$Enums.ImagingStudyType;
                bodyPart: string;
                clinicalHistory: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            status: import(".prisma/client").$Enums.ImagingResultStatus;
            patientId: string;
            studyType: import(".prisma/client").$Enums.ImagingStudyType;
            bodyPart: string;
            performedAt: Date;
            reportedAt: Date;
            orderId: string | null;
            reportFileUrl: string | null;
            ocrText: string | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
            technique: string | null;
            contrastUsed: boolean;
            findings: string | null;
            impression: string | null;
            recommendations: string | null;
            imageUrls: string[];
            radiologistName: string | null;
            radiologistId: string | null;
        };
        message: string;
    }>;
    reviewImagingResult(resultId: string, req: any, reviewData: {
        reviewNotes?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            status: import(".prisma/client").$Enums.ImagingResultStatus;
            patientId: string;
            studyType: import(".prisma/client").$Enums.ImagingStudyType;
            bodyPart: string;
            performedAt: Date;
            reportedAt: Date;
            orderId: string | null;
            reportFileUrl: string | null;
            ocrText: string | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
            technique: string | null;
            contrastUsed: boolean;
            findings: string | null;
            impression: string | null;
            recommendations: string | null;
            imageUrls: string[];
            radiologistName: string | null;
            radiologistId: string | null;
        };
        message: string;
    }>;
    flagImagingResult(resultId: string, req: any, flagData: {
        flagReason: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            status: import(".prisma/client").$Enums.ImagingResultStatus;
            patientId: string;
            studyType: import(".prisma/client").$Enums.ImagingStudyType;
            bodyPart: string;
            performedAt: Date;
            reportedAt: Date;
            orderId: string | null;
            reportFileUrl: string | null;
            ocrText: string | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
            technique: string | null;
            contrastUsed: boolean;
            findings: string | null;
            impression: string | null;
            recommendations: string | null;
            imageUrls: string[];
            radiologistName: string | null;
            radiologistId: string | null;
        };
        message: string;
    }>;
    getCriticalImagingResults(doctorId?: string): Promise<{
        success: boolean;
        data: ({
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
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            status: import(".prisma/client").$Enums.ImagingResultStatus;
            patientId: string;
            studyType: import(".prisma/client").$Enums.ImagingStudyType;
            bodyPart: string;
            performedAt: Date;
            reportedAt: Date;
            orderId: string | null;
            reportFileUrl: string | null;
            ocrText: string | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
            technique: string | null;
            contrastUsed: boolean;
            findings: string | null;
            impression: string | null;
            recommendations: string | null;
            imageUrls: string[];
            radiologistName: string | null;
            radiologistId: string | null;
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
    getPatientImagingOrders(patientId: string, status?: string, studyType?: string, startDate?: string, endDate?: string, doctorId?: string, limit?: number): Promise<{
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
                id: string;
                status: import(".prisma/client").$Enums.ImagingResultStatus;
                studyType: import(".prisma/client").$Enums.ImagingStudyType;
                bodyPart: string;
                findings: string;
                impression: string;
            }[];
        } & {
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
        })[];
        message: string;
    }>;
    updateImagingOrderStatus(orderId: string, statusData: {
        status: string;
        notes?: string;
    }): Promise<{
        success: boolean;
        data: {
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
        };
        message: string;
    }>;
}
