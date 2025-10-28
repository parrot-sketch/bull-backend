import { DatabaseService } from '../../auth/services/database.service';
export declare class ClinicalTemplateService {
    private readonly db;
    constructor(db: DatabaseService);
    createTemplate(templateData: {
        doctorId?: string;
        name: string;
        category: string;
        specialty?: string;
        isPublic?: boolean;
        subjectiveTemplate?: string;
        objectiveTemplate?: string;
        assessmentTemplate?: string;
        planTemplate?: string;
    }): Promise<{
        success: boolean;
        data: {
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
            };
        } & {
            isPublic: boolean;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            category: import(".prisma/client").$Enums.TemplateCategory;
            specialty: string | null;
            subjectiveTemplate: string | null;
            objectiveTemplate: string | null;
            assessmentTemplate: string | null;
            planTemplate: string | null;
            usageCount: number;
        };
        message: string;
    }>;
    getDoctorTemplates(doctorId: string, filters?: {
        category?: string;
        specialty?: string;
        isPublic?: boolean;
    }): Promise<{
        success: boolean;
        data: ({
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
            };
        } & {
            isPublic: boolean;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            category: import(".prisma/client").$Enums.TemplateCategory;
            specialty: string | null;
            subjectiveTemplate: string | null;
            objectiveTemplate: string | null;
            assessmentTemplate: string | null;
            planTemplate: string | null;
            usageCount: number;
        })[];
        message: string;
    }>;
    getTemplate(templateId: string): Promise<{
        success: boolean;
        data: {
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
            };
        } & {
            isPublic: boolean;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            category: import(".prisma/client").$Enums.TemplateCategory;
            specialty: string | null;
            subjectiveTemplate: string | null;
            objectiveTemplate: string | null;
            assessmentTemplate: string | null;
            planTemplate: string | null;
            usageCount: number;
        };
        message: string;
    }>;
    updateTemplate(templateId: string, updateData: {
        name?: string;
        category?: string;
        specialty?: string;
        isPublic?: boolean;
        subjectiveTemplate?: string;
        objectiveTemplate?: string;
        assessmentTemplate?: string;
        planTemplate?: string;
    }): Promise<{
        success: boolean;
        data: {
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
            };
        } & {
            isPublic: boolean;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            category: import(".prisma/client").$Enums.TemplateCategory;
            specialty: string | null;
            subjectiveTemplate: string | null;
            objectiveTemplate: string | null;
            assessmentTemplate: string | null;
            planTemplate: string | null;
            usageCount: number;
        };
        message: string;
    }>;
    deleteTemplate(templateId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    useTemplate(templateId: string): Promise<{
        success: boolean;
        data: {
            isPublic: boolean;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            category: import(".prisma/client").$Enums.TemplateCategory;
            specialty: string | null;
            subjectiveTemplate: string | null;
            objectiveTemplate: string | null;
            assessmentTemplate: string | null;
            planTemplate: string | null;
            usageCount: number;
        };
        message: string;
    }>;
    getPopularTemplates(limit?: number): Promise<{
        success: boolean;
        data: ({
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
            };
        } & {
            isPublic: boolean;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string | null;
            category: import(".prisma/client").$Enums.TemplateCategory;
            specialty: string | null;
            subjectiveTemplate: string | null;
            objectiveTemplate: string | null;
            assessmentTemplate: string | null;
            planTemplate: string | null;
            usageCount: number;
        })[];
        message: string;
    }>;
    getTemplateCategories(): Promise<{
        success: boolean;
        data: {
            category: import(".prisma/client").$Enums.TemplateCategory;
            count: number;
        }[];
        message: string;
    }>;
    getDefaultSOAPTemplates(): Promise<{
        success: boolean;
        data: {
            name: string;
            category: string;
            subjectiveTemplate: string;
            objectiveTemplate: string;
            assessmentTemplate: string;
            planTemplate: string;
        }[];
        message: string;
    }>;
    generateSOAPFromTemplate(templateId: string, patientData: any): Promise<{
        success: boolean;
        data: {
            subjective: string;
            objective: string;
            assessment: string;
            plan: string;
        };
        message: string;
    }>;
    private fillTemplate;
}
