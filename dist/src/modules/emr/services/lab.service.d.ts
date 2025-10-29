import { DatabaseService } from '../../auth/services/database.service';
export declare class LabService {
    private readonly db;
    constructor(db: DatabaseService);
    createLabOrder(orderData: {
        patientId: string;
        doctorId: string;
        visitId?: string;
        testsRequested: string[];
        clinicalNotes?: string;
        urgency?: string;
        labName?: string;
        labAddress?: string;
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
        };
        message: string;
    }>;
    uploadLabResult(resultData: {
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
                testsRequested: string[];
                clinicalNotes: string;
            };
        } & {
            status: import(".prisma/client").$Enums.LabResultStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            patientId: string;
            reportedAt: Date;
            orderId: string | null;
            testName: string;
            testCategory: import(".prisma/client").$Enums.LabTestCategory;
            resultValue: string;
            resultUnit: string | null;
            referenceRange: string | null;
            isAbnormal: boolean;
            criticalValue: boolean;
            reportFileUrl: string | null;
            ocrText: string | null;
            labName: string;
            labAddress: string | null;
            labPhone: string | null;
            technicianName: string | null;
            collectedAt: Date;
            processedAt: Date | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
        };
        analysis: {
            isAbnormal: boolean;
            isCritical: boolean;
            interpretation: string;
            recommendations: string;
        };
        message: string;
    }>;
    getPatientLabResults(patientId: string, filters?: {
        testCategory?: string;
        startDate?: string;
        endDate?: string;
        isAbnormal?: boolean;
        criticalValue?: boolean;
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
                testsRequested: string[];
                clinicalNotes: string;
            };
        } & {
            status: import(".prisma/client").$Enums.LabResultStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            patientId: string;
            reportedAt: Date;
            orderId: string | null;
            testName: string;
            testCategory: import(".prisma/client").$Enums.LabTestCategory;
            resultValue: string;
            resultUnit: string | null;
            referenceRange: string | null;
            isAbnormal: boolean;
            criticalValue: boolean;
            reportFileUrl: string | null;
            ocrText: string | null;
            labName: string;
            labAddress: string | null;
            labPhone: string | null;
            technicianName: string | null;
            collectedAt: Date;
            processedAt: Date | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
        })[];
        message: string;
    }>;
    getLabResult(resultId: string): Promise<{
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
                urgency: import(".prisma/client").$Enums.OrderUrgency;
                testsRequested: string[];
                clinicalNotes: string;
            };
        } & {
            status: import(".prisma/client").$Enums.LabResultStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            patientId: string;
            reportedAt: Date;
            orderId: string | null;
            testName: string;
            testCategory: import(".prisma/client").$Enums.LabTestCategory;
            resultValue: string;
            resultUnit: string | null;
            referenceRange: string | null;
            isAbnormal: boolean;
            criticalValue: boolean;
            reportFileUrl: string | null;
            ocrText: string | null;
            labName: string;
            labAddress: string | null;
            labPhone: string | null;
            technicianName: string | null;
            collectedAt: Date;
            processedAt: Date | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
        };
        message: string;
    }>;
    reviewLabResult(resultId: string, doctorId: string, reviewNotes?: string): Promise<{
        success: boolean;
        data: {
            status: import(".prisma/client").$Enums.LabResultStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            patientId: string;
            reportedAt: Date;
            orderId: string | null;
            testName: string;
            testCategory: import(".prisma/client").$Enums.LabTestCategory;
            resultValue: string;
            resultUnit: string | null;
            referenceRange: string | null;
            isAbnormal: boolean;
            criticalValue: boolean;
            reportFileUrl: string | null;
            ocrText: string | null;
            labName: string;
            labAddress: string | null;
            labPhone: string | null;
            technicianName: string | null;
            collectedAt: Date;
            processedAt: Date | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
        };
        message: string;
    }>;
    flagLabResult(resultId: string, doctorId: string, flagReason: string): Promise<{
        success: boolean;
        data: {
            status: import(".prisma/client").$Enums.LabResultStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            patientId: string;
            reportedAt: Date;
            orderId: string | null;
            testName: string;
            testCategory: import(".prisma/client").$Enums.LabTestCategory;
            resultValue: string;
            resultUnit: string | null;
            referenceRange: string | null;
            isAbnormal: boolean;
            criticalValue: boolean;
            reportFileUrl: string | null;
            ocrText: string | null;
            labName: string;
            labAddress: string | null;
            labPhone: string | null;
            technicianName: string | null;
            collectedAt: Date;
            processedAt: Date | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
        };
        message: string;
    }>;
    getCriticalLabResults(doctorId?: string): Promise<{
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
            status: import(".prisma/client").$Enums.LabResultStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            patientId: string;
            reportedAt: Date;
            orderId: string | null;
            testName: string;
            testCategory: import(".prisma/client").$Enums.LabTestCategory;
            resultValue: string;
            resultUnit: string | null;
            referenceRange: string | null;
            isAbnormal: boolean;
            criticalValue: boolean;
            reportFileUrl: string | null;
            ocrText: string | null;
            labName: string;
            labAddress: string | null;
            labPhone: string | null;
            technicianName: string | null;
            collectedAt: Date;
            processedAt: Date | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
        })[];
        message: string;
    }>;
    getLabStatistics(doctorId?: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: {
            totalResults: number;
            abnormalResults: number;
            criticalResults: number;
            resultsByCategory: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.LabResultGroupByOutputType, "testCategory"[]> & {
                _count: {
                    testCategory: number;
                };
            })[];
            abnormalRate: number;
            criticalRate: number;
        };
        message: string;
    }>;
    private processOCR;
    private analyzeLabResult;
    private sendCriticalAlert;
    getPatientLabOrders(patientId: string, filters?: {
        status?: string;
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
                status: import(".prisma/client").$Enums.LabResultStatus;
                id: string;
                testName: string;
                resultValue: string;
                isAbnormal: boolean;
                criticalValue: boolean;
            }[];
        } & {
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
        })[];
        message: string;
    }>;
}
