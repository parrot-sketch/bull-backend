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
exports.EmrService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../auth/services/database.service");
let EmrService = class EmrService {
    constructor(db) {
        this.db = db;
    }
    async getPatientOverview(patientId) {
        const patient = await this.db.user.findUnique({
            where: { id: patientId },
            include: {
                patientProfile: {
                    include: {
                        allergies: true,
                        currentMedications: true,
                        visits: {
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
                            },
                            orderBy: { visitDate: 'desc' },
                            take: 5,
                        },
                        labResults: {
                            orderBy: { reportedAt: 'desc' },
                            take: 10,
                        },
                        imagingResults: {
                            orderBy: { reportedAt: 'desc' },
                            take: 5,
                        },
                        prescriptions: {
                            where: { status: { not: 'CANCELLED' } },
                            orderBy: { prescribedAt: 'desc' },
                            take: 10,
                        },
                    },
                },
            },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        if (!patient.patientProfile) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        const healthMetrics = await this.calculateHealthMetrics(patientId);
        return {
            success: true,
            data: {
                patient: {
                    id: patient.id,
                    name: `${patient.firstName} ${patient.lastName}`,
                    email: patient.email,
                    phoneNumber: patient.phoneNumber,
                    dateOfBirth: patient.dateOfBirth,
                    gender: patient.gender,
                },
                profile: patient.patientProfile,
                healthMetrics,
                recentActivity: {
                    visits: patient.patientProfile.visits,
                    labResults: patient.patientProfile.labResults,
                    imagingResults: patient.patientProfile.imagingResults,
                    prescriptions: patient.patientProfile.prescriptions,
                },
            },
            message: 'Patient overview retrieved successfully',
        };
    }
    async searchPatients(searchCriteria) {
        const where = { role: 'PATIENT', isActive: true };
        if (searchCriteria.name) {
            where.OR = [
                { firstName: { contains: searchCriteria.name, mode: 'insensitive' } },
                { lastName: { contains: searchCriteria.name, mode: 'insensitive' } },
            ];
        }
        if (searchCriteria.email) {
            where.email = { contains: searchCriteria.email, mode: 'insensitive' };
        }
        if (searchCriteria.phoneNumber) {
            where.phoneNumber = { contains: searchCriteria.phoneNumber };
        }
        if (searchCriteria.dateOfBirth) {
            where.dateOfBirth = new Date(searchCriteria.dateOfBirth);
        }
        const patients = await this.db.user.findMany({
            where,
            include: {
                patientProfile: {
                    include: {
                        allergies: true,
                        currentMedications: true,
                    },
                },
            },
            take: searchCriteria.limit || 50,
            orderBy: { firstName: 'asc' },
        });
        return {
            success: true,
            data: patients.map(patient => ({
                id: patient.id,
                name: `${patient.firstName} ${patient.lastName}`,
                email: patient.email,
                phoneNumber: patient.phoneNumber,
                dateOfBirth: patient.dateOfBirth,
                gender: patient.gender,
                profile: patient.patientProfile,
            })),
            message: 'Patients retrieved successfully',
        };
    }
    async getPatientTimeline(patientId, startDate, endDate) {
        const where = { patientId };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [visits, labResults, imagingResults, prescriptions] = await Promise.all([
            this.db.patientVisit.findMany({
                where: { patientId },
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
                },
                orderBy: { visitDate: 'desc' },
            }),
            this.db.labResult.findMany({
                where: { patientId },
                orderBy: { reportedAt: 'desc' },
            }),
            this.db.imagingResult.findMany({
                where: { patientId },
                orderBy: { reportedAt: 'desc' },
            }),
            this.db.prescription.findMany({
                where: { patientId },
                include: {
                    doctor: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                orderBy: { prescribedAt: 'desc' },
            }),
        ]);
        const timeline = [
            ...visits.map(visit => ({
                type: 'VISIT',
                date: visit.visitDate,
                data: visit,
            })),
            ...labResults.map(result => ({
                type: 'LAB_RESULT',
                date: result.reportedAt,
                data: result,
            })),
            ...imagingResults.map(result => ({
                type: 'IMAGING_RESULT',
                date: result.reportedAt,
                data: result,
            })),
            ...prescriptions.map(prescription => ({
                type: 'PRESCRIPTION',
                date: prescription.prescribedAt,
                data: prescription,
            })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return {
            success: true,
            data: timeline,
            message: 'Patient timeline retrieved successfully',
        };
    }
    async calculateHealthMetrics(patientId) {
        const profile = await this.db.patientProfile.findUnique({
            where: { patientId },
            include: {
                allergies: true,
                currentMedications: true,
                visits: {
                    include: { diagnoses: true },
                    orderBy: { visitDate: 'desc' },
                },
                labResults: {
                    orderBy: { reportedAt: 'desc' },
                },
            },
        });
        if (!profile) {
            return {
                riskFactors: [],
                activeConditions: [],
                medicationCount: 0,
                allergyCount: 0,
                lastVisitDate: null,
                criticalLabResults: 0,
            };
        }
        const activeConditions = profile.visits
            .flatMap(visit => visit.diagnoses)
            .map(diagnosis => diagnosis.diagnosisName)
            .filter((value, index, self) => self.indexOf(value) === index);
        const criticalLabResults = profile.labResults.filter(result => result.criticalValue || result.isAbnormal).length;
        const riskFactors = [];
        if (profile.allergies.length > 0) {
            riskFactors.push('Known allergies');
        }
        if (profile.currentMedications.length > 5) {
            riskFactors.push('Multiple medications');
        }
        if (criticalLabResults > 0) {
            riskFactors.push('Abnormal lab values');
        }
        return {
            riskFactors,
            activeConditions,
            medicationCount: profile.currentMedications.length,
            allergyCount: profile.allergies.length,
            lastVisitDate: profile.visits[0]?.visitDate || null,
            criticalLabResults,
        };
    }
    async getVitalSignsHistory(patientId, limit = 50) {
        return {
            success: true,
            data: {
                bloodPressure: [],
                heartRate: [],
                temperature: [],
                weight: [],
                height: [],
            },
            message: 'Vital signs history retrieved successfully',
        };
    }
    async generatePatientSummary(patientId) {
        const overview = await this.getPatientOverview(patientId);
        const timeline = await this.getPatientTimeline(patientId);
        return {
            success: true,
            data: {
                ...overview.data,
                timeline: timeline.data,
                generatedAt: new Date(),
            },
            message: 'Patient summary generated successfully',
        };
    }
};
exports.EmrService = EmrService;
exports.EmrService = EmrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], EmrService);
//# sourceMappingURL=emr.service.js.map