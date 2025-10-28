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
exports.ClinicalTemplateService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../auth/services/database.service");
let ClinicalTemplateService = class ClinicalTemplateService {
    constructor(db) {
        this.db = db;
    }
    async createTemplate(templateData) {
        const template = await this.db.clinicalTemplate.create({
            data: {
                doctorId: templateData.doctorId,
                name: templateData.name,
                category: templateData.category,
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
    async getDoctorTemplates(doctorId, filters) {
        const where = {
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
                { isPublic: 'asc' },
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
    async getTemplate(templateId) {
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
            throw new common_1.NotFoundException('Clinical template not found');
        }
        return {
            success: true,
            data: template,
            message: 'Clinical template retrieved successfully',
        };
    }
    async updateTemplate(templateId, updateData) {
        const template = await this.db.clinicalTemplate.findUnique({
            where: { id: templateId },
        });
        if (!template) {
            throw new common_1.NotFoundException('Clinical template not found');
        }
        const updatedTemplate = await this.db.clinicalTemplate.update({
            where: { id: templateId },
            data: {
                name: updateData.name,
                category: updateData.category,
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
    async deleteTemplate(templateId) {
        const template = await this.db.clinicalTemplate.findUnique({
            where: { id: templateId },
        });
        if (!template) {
            throw new common_1.NotFoundException('Clinical template not found');
        }
        await this.db.clinicalTemplate.delete({
            where: { id: templateId },
        });
        return {
            success: true,
            message: 'Clinical template deleted successfully',
        };
    }
    async useTemplate(templateId) {
        const template = await this.db.clinicalTemplate.findUnique({
            where: { id: templateId },
        });
        if (!template) {
            throw new common_1.NotFoundException('Clinical template not found');
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
    async getPopularTemplates(limit = 10) {
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
    async generateSOAPFromTemplate(templateId, patientData) {
        const template = await this.getTemplate(templateId);
        if (!template.success) {
            throw new common_1.NotFoundException('Template not found');
        }
        const soapNote = {
            subjective: this.fillTemplate(template.data.subjectiveTemplate, patientData),
            objective: this.fillTemplate(template.data.objectiveTemplate, patientData),
            assessment: this.fillTemplate(template.data.assessmentTemplate, patientData),
            plan: this.fillTemplate(template.data.planTemplate, patientData),
        };
        await this.useTemplate(templateId);
        return {
            success: true,
            data: soapNote,
            message: 'SOAP note generated from template',
        };
    }
    fillTemplate(template, patientData) {
        if (!template)
            return '';
        let filledTemplate = template;
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
};
exports.ClinicalTemplateService = ClinicalTemplateService;
exports.ClinicalTemplateService = ClinicalTemplateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ClinicalTemplateService);
//# sourceMappingURL=clinical-template.service.js.map