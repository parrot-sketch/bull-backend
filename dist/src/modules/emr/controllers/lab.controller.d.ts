import { LabService } from '../services/lab.service';
export declare class LabController {
    private readonly labService;
    constructor(labService: LabService);
    createLabOrder(req: any, orderData: {
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
        };
        message: string;
    }>;
    uploadLabResult(req: any, resultData: {
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
                testsRequested: string[];
                clinicalNotes: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            status: import(".prisma/client").$Enums.LabResultStatus;
            patientId: string;
            labName: string;
            labAddress: string | null;
            collectedAt: Date;
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
            labPhone: string | null;
            technicianName: string | null;
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
    getPatientLabResults(patientId: string, testCategory?: string, startDate?: string, endDate?: string, isAbnormal?: boolean, criticalValue?: boolean, status?: string, limit?: number): Promise<{
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            status: import(".prisma/client").$Enums.LabResultStatus;
            patientId: string;
            labName: string;
            labAddress: string | null;
            collectedAt: Date;
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
            labPhone: string | null;
            technicianName: string | null;
            processedAt: Date | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
        })[];
        message: string;
    }>;
    getLabResult(resultId: string): Promise<{
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
                testsRequested: string[];
                clinicalNotes: string;
                urgency: import(".prisma/client").$Enums.OrderUrgency;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            status: import(".prisma/client").$Enums.LabResultStatus;
            patientId: string;
            labName: string;
            labAddress: string | null;
            collectedAt: Date;
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
            labPhone: string | null;
            technicianName: string | null;
            processedAt: Date | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
        };
        message: string;
    }>;
    reviewLabResult(resultId: string, req: any, reviewData: {
        reviewNotes?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            status: import(".prisma/client").$Enums.LabResultStatus;
            patientId: string;
            labName: string;
            labAddress: string | null;
            collectedAt: Date;
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
            labPhone: string | null;
            technicianName: string | null;
            processedAt: Date | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
        };
        message: string;
    }>;
    flagLabResult(resultId: string, req: any, flagData: {
        flagReason: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            status: import(".prisma/client").$Enums.LabResultStatus;
            patientId: string;
            labName: string;
            labAddress: string | null;
            collectedAt: Date;
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
            labPhone: string | null;
            technicianName: string | null;
            processedAt: Date | null;
            reviewedAt: Date | null;
            reviewedBy: string | null;
        };
        message: string;
    }>;
    getCriticalLabResults(doctorId?: string): Promise<{
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
            status: import(".prisma/client").$Enums.LabResultStatus;
            patientId: string;
            labName: string;
            labAddress: string | null;
            collectedAt: Date;
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
            labPhone: string | null;
            technicianName: string | null;
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
    getPatientLabOrders(patientId: string, status?: string, startDate?: string, endDate?: string, doctorId?: string, limit?: number): Promise<{
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
                status: import(".prisma/client").$Enums.LabResultStatus;
                testName: string;
                resultValue: string;
                isAbnormal: boolean;
                criticalValue: boolean;
            }[];
        } & {
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
        })[];
        message: string;
    }>;
}
