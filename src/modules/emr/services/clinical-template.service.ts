import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../auth/services/database.service';

@Injectable()
export class ClinicalTemplateService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Create clinical template
   */
  async createTemplate(templateData: {
    doctorId?: string;
    name: string;
    category: string;
    specialty?: string;
    isPublic?: boolean;
    subjectiveTemplate?: string;
    objectiveTemplate?: string;
    assessmentTemplate?: string;
    planTemplate?: string;
  }) {
    const template = await this.db.clinicalTemplate.create({
      data: {
        doctorId: templateData.doctorId,
        name: templateData.name,
        category: templateData.category as any,
        specialty: templateData.specialty,
        isPublic: templateData.isPublic || false,
        subjectiveTemplate: templateData.subjectiveTemplate,
        objectiveTemplate: templateData.objectiveTemplate,
        assessmentTemplate: templateData.assessmentTemplate,
        planTemplate: templateData.planTemplate,
      },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
    });

    return {
      success: true,
      data: template,
      message: 'Clinical template created successfully',
    };
  }

  /**
   * Get templates for doctor
   */
  async getDoctorTemplates(doctorId: string, filters?: {
    category?: string;
    specialty?: string;
    isPublic?: boolean;
  }) {
    const where: any = {
      OR: [
        { doctorId },
        { isPublic: true },
      ],
    };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.specialty) {
      where.specialty = filters.specialty;
    }

    if (filters?.isPublic !== undefined) {
      where.isPublic = filters.isPublic;
    }

    const templates = await this.db.clinicalTemplate.findMany({
      where,
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
      orderBy: [
        { isPublic: 'asc' }, // Personal templates first
        { usageCount: 'desc' },
        { name: 'asc' },
      ],
    });

    return {
      success: true,
      data: templates,
      message: 'Clinical templates retrieved successfully',
    };
  }

  /**
   * Get template by ID
   */
  async getTemplate(templateId: string) {
    const template = await this.db.clinicalTemplate.findUnique({
      where: { id: templateId },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException('Clinical template not found');
    }

    return {
      success: true,
      data: template,
      message: 'Clinical template retrieved successfully',
    };
  }

  /**
   * Update template
   */
  async updateTemplate(templateId: string, updateData: {
    name?: string;
    category?: string;
    specialty?: string;
    isPublic?: boolean;
    subjectiveTemplate?: string;
    objectiveTemplate?: string;
    assessmentTemplate?: string;
    planTemplate?: string;
  }) {
    const template = await this.db.clinicalTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException('Clinical template not found');
    }

    const updatedTemplate = await this.db.clinicalTemplate.update({
      where: { id: templateId },
      data: {
        name: updateData.name,
        category: updateData.category as any,
        specialty: updateData.specialty,
        isPublic: updateData.isPublic,
        subjectiveTemplate: updateData.subjectiveTemplate,
        objectiveTemplate: updateData.objectiveTemplate,
        assessmentTemplate: updateData.assessmentTemplate,
        planTemplate: updateData.planTemplate,
      },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
    });

    return {
      success: true,
      data: updatedTemplate,
      message: 'Clinical template updated successfully',
    };
  }

  /**
   * Delete template
   */
  async deleteTemplate(templateId: string) {
    const template = await this.db.clinicalTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException('Clinical template not found');
    }

    await this.db.clinicalTemplate.delete({
      where: { id: templateId },
    });

    return {
      success: true,
      message: 'Clinical template deleted successfully',
    };
  }

  /**
   * Use template (increment usage count)
   */
  async useTemplate(templateId: string) {
    const template = await this.db.clinicalTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException('Clinical template not found');
    }

    const updatedTemplate = await this.db.clinicalTemplate.update({
      where: { id: templateId },
      data: {
        usageCount: template.usageCount + 1,
      },
    });

    return {
      success: true,
      data: updatedTemplate,
      message: 'Template usage recorded',
    };
  }

  /**
   * Get popular templates
   */
  async getPopularTemplates(limit: number = 10) {
    const templates = await this.db.clinicalTemplate.findMany({
      where: { isPublic: true },
      orderBy: { usageCount: 'desc' },
      take: limit,
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
    });

    return {
      success: true,
      data: templates,
      message: 'Popular templates retrieved successfully',
    };
  }

  /**
   * Get template categories
   */
  async getTemplateCategories() {
    const categories = await this.db.clinicalTemplate.groupBy({
      by: ['category'],
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
    });

    return {
      success: true,
      data: categories.map(cat => ({
        category: cat.category,
        count: cat._count.category,
      })),
      message: 'Template categories retrieved successfully',
    };
  }

  /**
   * Get default SOAP templates
   */
  async getDefaultSOAPTemplates() {
    const defaultTemplates = [
      {
        name: 'General Consultation',
        category: 'SOAP_NOTE',
        subjectiveTemplate: `Chief Complaint: [Patient's main concern]

History of Present Illness:
- Onset: [When symptoms started]
- Duration: [How long symptoms have been present]
- Severity: [Rate 1-10]
- Associated symptoms: [Other symptoms]
- Relieving factors: [What helps]
- Aggravating factors: [What makes it worse]

Past Medical History: [Previous conditions]
Medications: [Current medications]
Allergies: [Known allergies]
Social History: [Smoking, alcohol, occupation]`,
        objectiveTemplate: `Vital Signs:
- Blood Pressure: [BP reading]
- Heart Rate: [HR]
- Temperature: [Temp]
- Respiratory Rate: [RR]
- Oxygen Saturation: [SpO2]

Physical Examination:
- General: [General appearance]
- HEENT: [Head, eyes, ears, nose, throat]
- Cardiovascular: [Heart exam]
- Pulmonary: [Lung exam]
- Abdomen: [Abdominal exam]
- Extremities: [Extremity exam]
- Neurological: [Neuro exam]`,
        assessmentTemplate: `Assessment:
1. [Primary diagnosis] - [ICD-10 code]
2. [Secondary diagnosis] - [ICD-10 code]

Clinical Reasoning:
[Explanation of diagnosis based on history and exam]`,
        planTemplate: `Plan:
1. [Primary treatment]
2. [Medications]
3. [Follow-up instructions]
4. [Patient education]
5. [Referrals if needed]

Follow-up: [When to return]
Patient Instructions: [Specific instructions for patient]`,
      },
      {
        name: 'Follow-up Visit',
        category: 'FOLLOW_UP',
        subjectiveTemplate: `Follow-up for: [Previous diagnosis]

Since last visit:
- Symptoms: [Better/worse/same]
- Medication compliance: [Taking medications as prescribed]
- Side effects: [Any side effects from medications]
- New symptoms: [Any new concerns]`,
        objectiveTemplate: `Vital Signs:
- Blood Pressure: [BP reading]
- Heart Rate: [HR]
- Weight: [Current weight]

Physical Examination:
- Focused exam based on condition
- [Specific findings]`,
        assessmentTemplate: `Assessment:
1. [Primary condition] - [Status: improved/stable/worsened]
2. [Any new findings]`,
        planTemplate: `Plan:
1. [Continue/adjust/discontinue medications]
2. [Additional treatments]
3. [Follow-up schedule]
4. [Patient education updates]`,
      },
      {
        name: 'Emergency Visit',
        category: 'EMERGENCY',
        subjectiveTemplate: `Chief Complaint: [Patient's main concern]

History of Present Illness:
- Onset: [When symptoms started]
- Duration: [How long]
- Severity: [Rate 1-10]
- Associated symptoms: [Other symptoms]
- Mechanism of injury: [If applicable]

Emergency History:
- Allergies: [Known allergies]
- Medications: [Current medications]
- Past medical history: [Relevant conditions]`,
        objectiveTemplate: `Vital Signs:
- Blood Pressure: [BP reading]
- Heart Rate: [HR]
- Temperature: [Temp]
- Respiratory Rate: [RR]
- Oxygen Saturation: [SpO2]
- Pain Score: [1-10]

Physical Examination:
- General: [General appearance, distress level]
- Focused exam based on chief complaint
- [Specific findings]`,
        assessmentTemplate: `Assessment:
1. [Primary diagnosis] - [ICD-10 code]
2. [Secondary diagnosis] - [ICD-10 code]

Emergency Severity:
- [Mild/Moderate/Severe]
- [Stable/Unstable]`,
        planTemplate: `Plan:
1. [Immediate treatment]
2. [Medications]
3. [Procedures if needed]
4. [Disposition: discharge/admit/transfer]
5. [Follow-up instructions]

Discharge Instructions: [Specific instructions]
Return Precautions: [When to return immediately]`,
      },
    ];

    return {
      success: true,
      data: defaultTemplates,
      message: 'Default SOAP templates retrieved successfully',
    };
  }

  /**
   * Generate SOAP note from template
   */
  async generateSOAPFromTemplate(templateId: string, patientData: any) {
    const template = await this.getTemplate(templateId);
    
    if (!template.success) {
      throw new NotFoundException('Template not found');
    }

    const soapNote = {
      subjective: this.fillTemplate(template.data.subjectiveTemplate, patientData),
      objective: this.fillTemplate(template.data.objectiveTemplate, patientData),
      assessment: this.fillTemplate(template.data.assessmentTemplate, patientData),
      plan: this.fillTemplate(template.data.planTemplate, patientData),
    };

    // Increment usage count
    await this.useTemplate(templateId);

    return {
      success: true,
      data: soapNote,
      message: 'SOAP note generated from template',
    };
  }

  /**
   * Fill template with patient data
   */
  private fillTemplate(template: string, patientData: any): string {
    if (!template) return '';

    let filledTemplate = template;

    // Replace common placeholders
    const replacements = {
      '[Patient Name]': patientData.name || '[Patient Name]',
      '[Patient Age]': patientData.age || '[Patient Age]',
      '[Patient Gender]': patientData.gender || '[Patient Gender]',
      '[Date]': new Date().toLocaleDateString(),
      '[Time]': new Date().toLocaleTimeString(),
    };

    Object.entries(replacements).forEach(([placeholder, value]) => {
      filledTemplate = filledTemplate.replace(new RegExp(placeholder, 'g'), value);
    });

    return filledTemplate;
  }
}
