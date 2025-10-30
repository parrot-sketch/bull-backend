import { DatabaseService } from '../../auth/services/database.service';
export declare class DrugInteractionService {
    private readonly db;
    constructor(db: DatabaseService);
    checkDrugInteractions(medications: string[]): Promise<{
        success: boolean;
        data: {
            interactions: any[];
            severity: string;
            summary: string;
            recommendations?: undefined;
        };
        message: string;
    } | {
        success: boolean;
        data: {
            interactions: any[];
            severity: string;
            summary: string;
            recommendations: string[];
        };
        message: string;
    }>;
    checkNewMedicationInteractions(patientId: string, newMedication: string): Promise<{
        success: boolean;
        data: {
            interactions: any[];
            severity: string;
            summary: string;
            recommendations?: undefined;
        };
        message: string;
    } | {
        success: boolean;
        data: {
            interactions: any[];
            severity: string;
            summary: string;
            recommendations: string[];
        };
        message: string;
    }>;
    addDrug(drugData: {
        name: string;
        genericName?: string;
        brandNames?: string[];
        drugClass?: string;
        mechanism?: string;
        standardDosage?: string;
        maxDosage?: string;
        contraindications?: string[];
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            genericName: string | null;
            contraindications: string[];
            brandNames: string[];
            drugClass: string | null;
            mechanism: string | null;
            standardDosage: string | null;
            maxDosage: string | null;
        };
        message: string;
    }>;
    addDrugInteraction(interactionData: {
        drugName: string;
        interactingDrugName: string;
        severity: string;
        description: string;
        clinicalEffect?: string;
        management?: string;
    }): Promise<{
        success: boolean;
        data: {
            drug: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                genericName: string | null;
                contraindications: string[];
                brandNames: string[];
                drugClass: string | null;
                mechanism: string | null;
                standardDosage: string | null;
                maxDosage: string | null;
            };
            interactingDrug: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                genericName: string | null;
                contraindications: string[];
                brandNames: string[];
                drugClass: string | null;
                mechanism: string | null;
                standardDosage: string | null;
                maxDosage: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            severity: import(".prisma/client").$Enums.InteractionSeverity;
            description: string;
            drugId: string;
            interactingDrugId: string;
            clinicalEffect: string | null;
            management: string | null;
        };
        message: string;
    }>;
    searchDrugs(query: string, limit?: number): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            genericName: string | null;
            contraindications: string[];
            brandNames: string[];
            drugClass: string | null;
            mechanism: string | null;
            standardDosage: string | null;
            maxDosage: string | null;
        }[];
        message: string;
    }>;
    getDrugDetails(drugId: string): Promise<{
        success: boolean;
        data: {
            interactions: ({
                interactingDrug: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    genericName: string | null;
                    contraindications: string[];
                    brandNames: string[];
                    drugClass: string | null;
                    mechanism: string | null;
                    standardDosage: string | null;
                    maxDosage: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                severity: import(".prisma/client").$Enums.InteractionSeverity;
                description: string;
                drugId: string;
                interactingDrugId: string;
                clinicalEffect: string | null;
                management: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            genericName: string | null;
            contraindications: string[];
            brandNames: string[];
            drugClass: string | null;
            mechanism: string | null;
            standardDosage: string | null;
            maxDosage: string | null;
        };
        message: string;
    }>;
    getCommonDrugInteractions(): Promise<{
        success: boolean;
        data: ({
            drug: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                genericName: string | null;
                contraindications: string[];
                brandNames: string[];
                drugClass: string | null;
                mechanism: string | null;
                standardDosage: string | null;
                maxDosage: string | null;
            };
            interactingDrug: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                genericName: string | null;
                contraindications: string[];
                brandNames: string[];
                drugClass: string | null;
                mechanism: string | null;
                standardDosage: string | null;
                maxDosage: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            severity: import(".prisma/client").$Enums.InteractionSeverity;
            description: string;
            drugId: string;
            interactingDrugId: string;
            clinicalEffect: string | null;
            management: string | null;
        })[];
        message: string;
    }>;
    seedDrugDatabase(): Promise<{
        success: boolean;
        message: string;
    }>;
    private findDrugInteraction;
    private findOrCreateDrug;
    private getSeverityLevel;
    private generateInteractionSummary;
    private generateRecommendations;
}
