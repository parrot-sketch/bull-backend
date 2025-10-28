import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../auth/services/database.service';

@Injectable()
export class DrugInteractionService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Check drug interactions for a medication list
   */
  async checkDrugInteractions(medications: string[]) {
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

    // Check all pairwise interactions
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const interaction = await this.findDrugInteraction(medications[i], medications[j]);
        if (interaction) {
          interactions.push(interaction);
          
          // Update max severity
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

  /**
   * Check interactions for a new medication with existing medications
   */
  async checkNewMedicationInteractions(patientId: string, newMedication: string) {
    // Get patient's current medications
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

  /**
   * Add drug to database
   */
  async addDrug(drugData: {
    name: string;
    genericName?: string;
    brandNames?: string[];
    drugClass?: string;
    mechanism?: string;
    standardDosage?: string;
    maxDosage?: string;
    contraindications?: string[];
  }) {
    const existingDrug = await this.db.drug.findUnique({
      where: { name: drugData.name },
    });

    if (existingDrug) {
      throw new BadRequestException('Drug already exists in database');
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

  /**
   * Add drug interaction
   */
  async addDrugInteraction(interactionData: {
    drugName: string;
    interactingDrugName: string;
    severity: string;
    description: string;
    clinicalEffect?: string;
    management?: string;
  }) {
    // Find or create drugs
    const [drug, interactingDrug] = await Promise.all([
      this.findOrCreateDrug(interactionData.drugName),
      this.findOrCreateDrug(interactionData.interactingDrugName),
    ]);

    // Check if interaction already exists
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
      throw new BadRequestException('Drug interaction already exists');
    }

    const interaction = await this.db.drugInteraction.create({
      data: {
        drugId: drug.id,
        interactingDrugId: interactingDrug.id,
        severity: interactionData.severity as any,
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

  /**
   * Search drugs
   */
  async searchDrugs(query: string, limit: number = 20) {
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

  /**
   * Get drug details
   */
  async getDrugDetails(drugId: string) {
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
      throw new NotFoundException('Drug not found');
    }

    return {
      success: true,
      data: drug,
      message: 'Drug details retrieved successfully',
    };
  }

  /**
   * Get common drug interactions
   */
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

  /**
   * Seed database with common drugs and interactions
   */
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

    // Add drugs
    for (const drugData of commonDrugs) {
      try {
        await this.addDrug(drugData);
      } catch (error) {
        // Drug might already exist, continue
      }
    }

    // Add common interactions
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
      } catch (error) {
        // Interaction might already exist, continue
      }
    }

    return {
      success: true,
      message: 'Drug database seeded successfully',
    };
  }

  /**
   * Find drug interaction between two medications
   */
  private async findDrugInteraction(medication1: string, medication2: string) {
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

  /**
   * Find or create drug
   */
  private async findOrCreateDrug(drugName: string) {
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

  /**
   * Get severity level for comparison
   */
  private getSeverityLevel(severity: string): number {
    const levels = {
      'MINOR': 1,
      'MODERATE': 2,
      'MAJOR': 3,
      'CONTRAINDICATED': 4,
    };
    return levels[severity] || 0;
  }

  /**
   * Generate interaction summary
   */
  private generateInteractionSummary(interactions: any[], maxSeverity: string): string {
    if (interactions.length === 0) {
      return 'No drug interactions detected';
    }

    const severityCounts = interactions.reduce((acc, interaction) => {
      acc[interaction.severity] = (acc[interaction.severity] || 0) + 1;
      return acc;
    }, {});

    const summary = Object.entries(severityCounts as Record<string, number>)
      .map(([severity, count]) => `${count} ${severity.toLowerCase()} interaction${(count as number) > 1 ? 's' : ''}`)
      .join(', ');

    return `${interactions.length} drug interaction${interactions.length > 1 ? 's' : ''} detected: ${summary}`;
  }

  /**
   * Generate recommendations based on interactions
   */
  private generateRecommendations(interactions: any[]): string[] {
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
}
