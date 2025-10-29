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
exports.VisitService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../auth/services/database.service");
let VisitService = class VisitService {
    constructor(db) {
        this.db = db;
    }
    async createVisit(visitData) {
        const [patient, doctor] = await Promise.all([
            this.db.user.findUnique({ where: { id: visitData.patientId, role: 'PATIENT' } }),
            this.db.user.findUnique({ where: { id: visitData.doctorId, role: 'DOCTOR' } }),
        ]);
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const visit = await this.db.patientVisit.create({
            data: {
                patientId: visitData.patientId,
                doctorId: visitData.doctorId,
                appointmentId: visitData.appointmentId,
                visitType: visitData.visitType,
                chiefComplaint: visitData.chiefComplaint,
                subjective: visitData.subjective,
                objective: visitData.objective,
                assessment: visitData.assessment,
                plan: visitData.plan,
                voiceNotes: visitData.voiceNotes,
                voiceFileUrl: visitData.voiceFileUrl,
                followUpRequired: visitData.followUpRequired || false,
                followUpDate: visitData.followUpDate ? new Date(visitData.followUpDate) : null,
                followUpNotes: visitData.followUpNotes,
            },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                diagnoses: true,
            },
        });
        if (visitData.diagnoses && visitData.diagnoses.length > 0) {
            await Promise.all(visitData.diagnoses.map(diagnosis => this.db.visitDiagnosis.create({
                data: {
                    visitId: visit.id,
                    icd10Code: diagnosis.icd10Code,
                    diagnosisName: diagnosis.diagnosisName,
                    isPrimary: diagnosis.isPrimary,
                    notes: diagnosis.notes,
                },
            })));
        }
        return {
            success: true,
            data: visit,
            message: 'Visit created successfully',
        };
    }
    async updateVisit(visitId, updateData) {
        const visit = await this.db.patientVisit.findUnique({
            where: { id: visitId },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
        }
        const updatedVisit = await this.db.patientVisit.update({
            where: { id: visitId },
            data: {
                visitType: updateData.visitType,
                chiefComplaint: updateData.chiefComplaint,
                subjective: updateData.subjective,
                objective: updateData.objective,
                assessment: updateData.assessment,
                plan: updateData.plan,
                voiceNotes: updateData.voiceNotes,
                voiceFileUrl: updateData.voiceFileUrl,
                followUpRequired: updateData.followUpRequired,
                followUpDate: updateData.followUpDate ? new Date(updateData.followUpDate) : null,
                followUpNotes: updateData.followUpNotes,
            },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                diagnoses: true,
            },
        });
        return {
            success: true,
            data: updatedVisit,
            message: 'Visit updated successfully',
        };
    }
    async getVisit(visitId) {
        const visit = await this.db.patientVisit.findUnique({
            where: { id: visitId },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                        email: true,
                        phoneNumber: true,
                    },
                },
                diagnoses: true,
                prescriptions: {
                    include: {
                        doctor: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
                labOrders: true,
                imagingOrders: true,
            },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
        }
        return {
            success: true,
            data: visit,
            message: 'Visit retrieved successfully',
        };
    }
    async getPatientVisits(patientId, filters) {
        const where = { patientId };
        if (filters?.startDate || filters?.endDate) {
            where.visitDate = {};
            if (filters?.startDate)
                where.visitDate.gte = new Date(filters.startDate);
            if (filters?.endDate)
                where.visitDate.lte = new Date(filters.endDate);
        }
        if (filters?.visitType) {
            where.visitType = filters.visitType;
        }
        if (filters?.doctorId) {
            where.doctorId = filters.doctorId;
        }
        const visits = await this.db.patientVisit.findMany({
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
                diagnoses: true,
                prescriptions: {
                    select: {
                        id: true,
                        medicationName: true,
                        status: true,
                    },
                },
            },
            orderBy: { visitDate: 'desc' },
            take: filters?.limit || 50,
        });
        return {
            success: true,
            data: visits,
            message: 'Patient visits retrieved successfully',
        };
    }
    async addDiagnosis(visitId, diagnosisData) {
        const visit = await this.db.patientVisit.findUnique({
            where: { id: visitId },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
        }
        const diagnosis = await this.db.visitDiagnosis.create({
            data: {
                visitId,
                icd10Code: diagnosisData.icd10Code,
                diagnosisName: diagnosisData.diagnosisName,
                isPrimary: diagnosisData.isPrimary,
                notes: diagnosisData.notes,
            },
        });
        return {
            success: true,
            data: diagnosis,
            message: 'Diagnosis added successfully',
        };
    }
    async updateDiagnosis(diagnosisId, diagnosisData) {
        const diagnosis = await this.db.visitDiagnosis.update({
            where: { id: diagnosisId },
            data: {
                icd10Code: diagnosisData.icd10Code,
                diagnosisName: diagnosisData.diagnosisName,
                isPrimary: diagnosisData.isPrimary,
                notes: diagnosisData.notes,
            },
        });
        return {
            success: true,
            data: diagnosis,
            message: 'Diagnosis updated successfully',
        };
    }
    async removeDiagnosis(diagnosisId) {
        await this.db.visitDiagnosis.delete({
            where: { id: diagnosisId },
        });
        return {
            success: true,
            message: 'Diagnosis removed successfully',
        };
    }
    async processVoiceTranscription(visitId, voiceFileUrl, transcribedText) {
        const visit = await this.db.patientVisit.findUnique({
            where: { id: visitId },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
        }
        const updatedVisit = await this.db.patientVisit.update({
            where: { id: visitId },
            data: {
                voiceFileUrl,
                voiceNotes: transcribedText,
            },
        });
        return {
            success: true,
            data: updatedVisit,
            message: 'Voice transcription processed successfully',
        };
    }
    async getIcd10Suggestions(symptoms) {
        const suggestions = [
            {
                code: 'R50.9',
                description: 'Fever, unspecified',
                category: 'Symptoms and signs',
            },
            {
                code: 'R06.02',
                description: 'Shortness of breath',
                category: 'Symptoms and signs',
            },
            {
                code: 'R10.9',
                description: 'Unspecified abdominal pain',
                category: 'Symptoms and signs',
            },
        ];
        return {
            success: true,
            data: suggestions,
            message: 'ICD-10 suggestions retrieved successfully',
        };
    }
    async getVisitStatistics(doctorId, startDate, endDate) {
        const where = { doctorId };
        if (startDate || endDate) {
            where.visitDate = {};
            if (startDate)
                where.visitDate.gte = new Date(startDate);
            if (endDate)
                where.visitDate.lte = new Date(endDate);
        }
        const [totalVisits, visitsByType, recentVisits] = await Promise.all([
            this.db.patientVisit.count({ where }),
            this.db.patientVisit.groupBy({
                by: ['visitType'],
                where,
                _count: { visitType: true },
            }),
            this.db.patientVisit.findMany({
                where,
                include: {
                    patient: true,
                },
                orderBy: { visitDate: 'desc' },
                take: 10,
            }),
        ]);
        return {
            success: true,
            data: {
                totalVisits,
                visitsByType,
                recentVisits,
            },
            message: 'Visit statistics retrieved successfully',
        };
    }
};
exports.VisitService = VisitService;
exports.VisitService = VisitService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], VisitService);
//# sourceMappingURL=visit.service.js.map