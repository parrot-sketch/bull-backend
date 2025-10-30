"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrugInteractionService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../auth/services/database.service");
let DrugInteractionService = class DrugInteractionService {
    constructor(db) {
        this.db = db;
    }
    async checkDrugInteractions(medications) {
        if (medications.length < 2) {
            return {
                success: true,
                data: {
                    interactions: [],
                    severity: 'NONE',
                    summary: 'No interactions possible with single medication',
                },
                message: 'Drug interaction check completed',
            };
        }
        const interactions = [];
        let maxSeverity = 'NONE';
        for (let i = 0; i < medications.length; i++) {
            for (let j = i + 1; j < medications.length; j++) {
                const interaction = await this.findDrugInteraction(medications[i], medications[j]);
                if (interaction) {
                    interactions.push(interaction);
                    if (this.getSeverityLevel(interaction.severity) > this.getSeverityLevel(maxSeverity)) {
                        maxSeverity = interaction.severity;
                    }
                }
            }
        }
        return {
            success: true,
            data: {
                interactions,
                severity: maxSeverity,
                summary: this.generateInteractionSummary(interactions, maxSeverity),
                recommendations: this.generateRecommendations(interactions),
            },
            message: 'Drug interaction check completed',
        };
    }
    async checkNewMedicationInteractions(patientId, newMedication) {
        const currentMedications = await this.db.patientMedication.findMany({
            where: {
                patientId,
                OR: [
                    { endDate: null },
                    { endDate: { gte: new Date() } },
                ],
            },
        });
        const medicationNames = currentMedications.map(med => med.medicationName);
        medicationNames.push(newMedication);
        return this.checkDrugInteractions(medicationNames);
    }
    async addDrug(drugData) {
        const existingDrug = await this.db.drug.findUnique({
            where: { name: drugData.name },
        });
        if (existingDrug) {
            throw new common_1.BadRequestException('Drug already exists in database');
        }
        const drug = await this.db.drug.create({
            data: {
                name: drugData.name,
                genericName: drugData.genericName,
                brandNames: drugData.brandNames || [],
                drugClass: drugData.drugClass,
                mechanism: drugData.mechanism,
                standardDosage: drugData.standardDosage,
                maxDosage: drugData.maxDosage,
                contraindications: drugData.contraindications || [],
            },
        });
        return {
            success: true,
            data: drug,
            message: 'Drug added to database successfully',
        };
    }
    async addDrugInteraction(interactionData) {
        const [drug, interactingDrug] = await Promise.all([
            this.findOrCreateDrug(interactionData.drugName),
            this.findOrCreateDrug(interactionData.interactingDrugName),
        ]);
        const existingInteraction = await this.db.drugInteraction.findFirst({
            where: {
                OR: [
                    {
                        drugId: drug.id,
                        interactingDrugId: interactingDrug.id,
                    },
                    {
                        drugId: interactingDrug.id,
                        interactingDrugId: drug.id,
                    },
                ],
            },
        });
        if (existingInteraction) {
            throw new common_1.BadRequestException('Drug interaction already exists');
        }
        const interaction = await this.db.drugInteraction.create({
            data: {
                drugId: drug.id,
                interactingDrugId: interactingDrug.id,
                severity: interactionData.severity,
                description: interactionData.description,
                clinicalEffect: interactionData.clinicalEffect,
                management: interactionData.management,
            },
            include: {
                drug: true,
                interactingDrug: true,
            },
        });
        return {
            success: true,
            data: interaction,
            message: 'Drug interaction added successfully',
        };
    }
    async searchDrugs(query, limit = 20) {
        const drugs = await this.db.drug.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { genericName: { contains: query, mode: 'insensitive' } },
                    { brandNames: { has: query } },
                    { drugClass: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: limit,
            orderBy: { name: 'asc' },
        });
        return {
            success: true,
            data: drugs,
            message: 'Drugs retrieved successfully',
        };
    }
    async getDrugDetails(drugId) {
        const drug = await this.db.drug.findUnique({
            where: { id: drugId },
            include: {
                interactions: {
                    include: {
                        interactingDrug: true,
                    },
                },
            },
        });
        if (!drug) {
            throw new common_1.NotFoundException('Drug not found');
        }
        return {
            success: true,
            data: drug,
            message: 'Drug details retrieved successfully',
        };
    }
    async getCommonDrugInteractions() {
        const commonInteractions = await this.db.drugInteraction.findMany({
            include: {
                drug: true,
                interactingDrug: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        return {
            success: true,
            data: commonInteractions,
            message: 'Common drug interactions retrieved successfully',
        };
    }
    async seedDrugDatabase() {
        const commonDrugs = [
            {
                name: 'Warfarin',
                genericName: 'Warfarin',
                brandNames: ['Coumadin', 'Jantoven'],
                drugClass: 'Anticoagulant',
                contraindications: ['Active bleeding', 'Severe liver disease'],
            },
            {
                name: 'Aspirin',
                genericName: 'Aspirin',
                brandNames: ['Bayer', 'Bufferin', 'Ecotrin'],
                drugClass: 'NSAID',
                contraindications: ['Active bleeding', 'Peptic ulcer disease'],
            },
            {
                name: 'Metformin',
                genericName: 'Metformin',
                brandNames: ['Glucophage', 'Fortamet'],
                drugClass: 'Biguanide',
                contraindications: ['Severe kidney disease', 'Severe liver disease'],
            },
            {
                name: 'Lisinopril',
                genericName: 'Lisinopril',
                brandNames: ['Prinivil', 'Zestril'],
                drugClass: 'ACE Inhibitor',
                contraindications: ['Pregnancy', 'Bilateral renal artery stenosis'],
            },
            {
                name: 'Atorvastatin',
                genericName: 'Atorvastatin',
                brandNames: ['Lipitor'],
                drugClass: 'Statin',
                contraindications: ['Active liver disease', 'Pregnancy'],
            },
        ];
        for (const drugData of commonDrugs) {
            try {
                await this.addDrug(drugData);
            }
            catch (error) {
            }
        }
        const commonInteractions = [
            {
                drugName: 'Warfarin',
                interactingDrugName: 'Aspirin',
                severity: 'MAJOR',
                description: 'Increased risk of bleeding',
                clinicalEffect: 'Enhanced anticoagulant effect',
                management: 'Monitor INR closely, consider reducing warfarin dose',
            },
            {
                drugName: 'Warfarin',
                interactingDrugName: 'Atorvastatin',
                severity: 'MODERATE',
                description: 'Increased warfarin effect',
                clinicalEffect: 'Enhanced anticoagulation',
                management: 'Monitor INR, may need warfarin dose reduction',
            },
            {
                drugName: 'Metformin',
                interactingDrugName: 'Lisinopril',
                severity: 'MINOR',
                description: 'Increased risk of hyperkalemia',
                clinicalEffect: 'Elevated potassium levels',
                management: 'Monitor potassium levels',
            },
        ];
        for (const interactionData of commonInteractions) {
            try {
                await this.addDrugInteraction(interactionData);
            }
            catch (error) {
            }
        }
        return {
            success: true,
            message: 'Drug database seeded successfully',
        };
    }
    async findDrugInteraction(medication1, medication2) {
        const interaction = await this.db.drugInteraction.findFirst({
            where: {
                OR: [
                    {
                        drug: { name: { contains: medication1, mode: 'insensitive' } },
                        interactingDrug: { name: { contains: medication2, mode: 'insensitive' } },
                    },
                    {
                        drug: { name: { contains: medication2, mode: 'insensitive' } },
                        interactingDrug: { name: { contains: medication1, mode: 'insensitive' } },
                    },
                ],
            },
            include: {
                drug: true,
                interactingDrug: true,
            },
        });
        return interaction;
    }
    async findOrCreateDrug(drugName) {
        let drug = await this.db.drug.findFirst({
            where: {
                OR: [
                    { name: { contains: drugName, mode: 'insensitive' } },
                    { genericName: { contains: drugName, mode: 'insensitive' } },
                ],
            },
        });
        if (!drug) {
            drug = await this.db.drug.create({
                data: {
                    name: drugName,
                    genericName: drugName,
                    brandNames: [],
                    contraindications: [],
                },
            });
        }
        return drug;
    }
    getSeverityLevel(severity) {
        const levels = {
            'MINOR': 1,
            'MODERATE': 2,
            'MAJOR': 3,
            'CONTRAINDICATED': 4,
        };
        return levels[severity] || 0;
    }
    generateInteractionSummary(interactions, maxSeverity) {
        if (interactions.length === 0) {
            return 'No drug interactions detected';
        }
        const severityCounts = interactions.reduce((acc, interaction) => {
            acc[interaction.severity] = (acc[interaction.severity] || 0) + 1;
            return acc;
        }, {});
        const summary = Object.entries(severityCounts)
            .map(([severity, count]) => `${count} ${severity.toLowerCase()} interaction${count > 1 ? 's' : ''}`)
            .join(', ');
        return `${interactions.length} drug interaction${interactions.length > 1 ? 's' : ''} detected: ${summary}`;
    }
    generateRecommendations(interactions) {
        const recommendations = [];
        if (interactions.some(i => i.severity === 'CONTRAINDICATED')) {
            recommendations.push('Consider alternative medications - contraindicated interactions detected');
        }
        if (interactions.some(i => i.severity === 'MAJOR')) {
            recommendations.push('Monitor patient closely - major interactions detected');
        }
        if (interactions.some(i => i.severity === 'MODERATE')) {
            recommendations.push('Consider dose adjustments - moderate interactions detected');
        }
        if (interactions.some(i => i.severity === 'MINOR')) {
            recommendations.push('Monitor for side effects - minor interactions detected');
        }
        return recommendations;
    }
};
exports.DrugInteractionService = DrugInteractionService;
exports.DrugInteractionService = DrugInteractionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DrugInteractionService);
//# sourceMappingURL=drug-interaction.service.js.map