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
exports.LabService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../auth/services/database.service");
let LabService = class LabService {
    constructor(db) {
        this.db = db;
    }
    async createLabOrder(orderData) {
        const [patient, doctor] = await Promise.all([
            this.db.user.findUnique({ where: { id: orderData.patientId, role: 'PATIENT' } }),
            this.db.user.findUnique({ where: { id: orderData.doctorId, role: 'DOCTOR' } }),
        ]);
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const labOrder = await this.db.labOrder.create({
            data: {
                patientId: orderData.patientId,
                doctorId: orderData.doctorId,
                visitId: orderData.visitId,
                testsRequested: orderData.testsRequested,
                clinicalNotes: orderData.clinicalNotes,
                urgency: orderData.urgency || 'ROUTINE',
                labName: orderData.labName,
                labAddress: orderData.labAddress,
                status: 'PENDING',
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
                visit: {
                    select: {
                        id: true,
                        visitDate: true,
                        chiefComplaint: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: labOrder,
            message: 'Lab order created successfully',
        };
    }
    async uploadLabResult(resultData) {
        const patient = await this.db.user.findUnique({
            where: { id: resultData.patientId, role: 'PATIENT' },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        let ocrText = resultData.ocrText;
        if (!ocrText && resultData.reportFileUrl) {
            ocrText = await this.processOCR(resultData.reportFileUrl);
        }
        const analysisResult = await this.analyzeLabResult(resultData.testName, resultData.resultValue, resultData.referenceRange);
        const labResult = await this.db.labResult.create({
            data: {
                patientId: resultData.patientId,
                orderId: resultData.orderId,
                doctorId: resultData.doctorId,
                testName: resultData.testName,
                testCategory: resultData.testCategory,
                resultValue: resultData.resultValue,
                resultUnit: resultData.resultUnit,
                referenceRange: resultData.referenceRange,
                isAbnormal: resultData.isAbnormal || analysisResult.isAbnormal,
                criticalValue: resultData.criticalValue || analysisResult.isCritical,
                reportFileUrl: resultData.reportFileUrl,
                ocrText,
                labName: resultData.labName,
                labAddress: resultData.labAddress,
                labPhone: resultData.labPhone,
                technicianName: resultData.technicianName,
                collectedAt: new Date(resultData.collectedAt),
                processedAt: resultData.processedAt ? new Date(resultData.processedAt) : null,
                reportedAt: new Date(),
                status: analysisResult.isCritical ? 'CRITICAL_ALERT_SENT' : 'PENDING_REVIEW',
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
                order: {
                    select: {
                        id: true,
                        testsRequested: true,
                        clinicalNotes: true,
                    },
                },
            },
        });
        if (analysisResult.isCritical) {
            await this.sendCriticalAlert(labResult);
        }
        return {
            success: true,
            data: labResult,
            analysis: analysisResult,
            message: 'Lab result uploaded successfully',
        };
    }
    async getPatientLabResults(patientId, filters) {
        const where = { patientId };
        if (filters?.testCategory) {
            where.testCategory = filters.testCategory;
        }
        if (filters?.startDate || filters?.endDate) {
            where.reportedAt = {};
            if (filters?.startDate)
                where.reportedAt.gte = new Date(filters.startDate);
            if (filters?.endDate)
                where.reportedAt.lte = new Date(filters.endDate);
        }
        if (filters?.isAbnormal !== undefined) {
            where.isAbnormal = filters.isAbnormal;
        }
        if (filters?.criticalValue !== undefined) {
            where.criticalValue = filters.criticalValue;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        const labResults = await this.db.labResult.findMany({
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
                order: {
                    select: {
                        id: true,
                        testsRequested: true,
                        clinicalNotes: true,
                    },
                },
            },
            orderBy: { reportedAt: 'desc' },
            take: filters?.limit || 50,
        });
        return {
            success: true,
            data: labResults,
            message: 'Lab results retrieved successfully',
        };
    }
    async getLabResult(resultId) {
        const labResult = await this.db.labResult.findUnique({
            where: { id: resultId },
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
                order: {
                    select: {
                        id: true,
                        testsRequested: true,
                        clinicalNotes: true,
                        urgency: true,
                    },
                },
            },
        });
        if (!labResult) {
            throw new common_1.NotFoundException('Lab result not found');
        }
        return {
            success: true,
            data: labResult,
            message: 'Lab result retrieved successfully',
        };
    }
    async reviewLabResult(resultId, doctorId, reviewNotes) {
        const labResult = await this.db.labResult.findUnique({
            where: { id: resultId },
        });
        if (!labResult) {
            throw new common_1.NotFoundException('Lab result not found');
        }
        const updatedResult = await this.db.labResult.update({
            where: { id: resultId },
            data: {
                status: 'REVIEWED',
                reviewedAt: new Date(),
                reviewedBy: doctorId,
            },
        });
        return {
            success: true,
            data: updatedResult,
            message: 'Lab result reviewed successfully',
        };
    }
    async flagLabResult(resultId, doctorId, flagReason) {
        const labResult = await this.db.labResult.findUnique({
            where: { id: resultId },
        });
        if (!labResult) {
            throw new common_1.NotFoundException('Lab result not found');
        }
        const updatedResult = await this.db.labResult.update({
            where: { id: resultId },
            data: {
                status: 'FLAGGED_FOR_FOLLOWUP',
                reviewedAt: new Date(),
                reviewedBy: doctorId,
            },
        });
        return {
            success: true,
            data: updatedResult,
            message: 'Lab result flagged for follow-up',
        };
    }
    async getCriticalLabResults(doctorId) {
        const where = {
            criticalValue: true,
            status: 'PENDING_REVIEW',
        };
        if (doctorId) {
            where.doctorId = doctorId;
        }
        const criticalResults = await this.db.labResult.findMany({
            where,
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
            },
            orderBy: { reportedAt: 'asc' },
        });
        return {
            success: true,
            data: criticalResults,
            message: 'Critical lab results retrieved successfully',
        };
    }
    async getLabStatistics(doctorId, startDate, endDate) {
        const where = {};
        if (doctorId) {
            where.doctorId = doctorId;
        }
        if (startDate || endDate) {
            where.reportedAt = {};
            if (startDate)
                where.reportedAt.gte = new Date(startDate);
            if (endDate)
                where.reportedAt.lte = new Date(endDate);
        }
        const [totalResults, abnormalResults, criticalResults, resultsByCategory] = await Promise.all([
            this.db.labResult.count({ where }),
            this.db.labResult.count({ where: { ...where, isAbnormal: true } }),
            this.db.labResult.count({ where: { ...where, criticalValue: true } }),
            this.db.labResult.groupBy({
                by: ['testCategory'],
                where,
                _count: { testCategory: true },
            }),
        ]);
        return {
            success: true,
            data: {
                totalResults,
                abnormalResults,
                criticalResults,
                resultsByCategory,
                abnormalRate: totalResults > 0 ? (abnormalResults / totalResults) * 100 : 0,
                criticalRate: totalResults > 0 ? (criticalResults / totalResults) * 100 : 0,
            },
            message: 'Lab statistics retrieved successfully',
        };
    }
    async processOCR(fileUrl) {
        return `Mock OCR text extracted from ${fileUrl}`;
    }
    async analyzeLabResult(testName, resultValue, referenceRange) {
        const isAbnormal = Math.random() > 0.7;
        const isCritical = Math.random() > 0.9;
        return {
            isAbnormal,
            isCritical,
            interpretation: isAbnormal ? 'Result outside normal range' : 'Result within normal range',
            recommendations: isCritical ? 'Immediate medical attention required' : 'Follow up as needed',
        };
    }
    async sendCriticalAlert(labResult) {
        console.log(`CRITICAL ALERT: Lab result ${labResult.id} requires immediate attention for patient ${labResult.patient.firstName} ${labResult.patient.lastName}`);
        return true;
    }
    async getPatientLabOrders(patientId, filters) {
        const where = { patientId };
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.startDate || filters?.endDate) {
            where.orderedAt = {};
            if (filters?.startDate)
                where.orderedAt.gte = new Date(filters.startDate);
            if (filters?.endDate)
                where.orderedAt.lte = new Date(filters.endDate);
        }
        if (filters?.doctorId) {
            where.doctorId = filters.doctorId;
        }
        const labOrders = await this.db.labOrder.findMany({
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
                visit: {
                    select: {
                        id: true,
                        visitDate: true,
                        chiefComplaint: true,
                    },
                },
                results: {
                    select: {
                        id: true,
                        testName: true,
                        resultValue: true,
                        isAbnormal: true,
                        criticalValue: true,
                        status: true,
                    },
                },
            },
            orderBy: { orderedAt: 'desc' },
            take: filters?.limit || 50,
        });
        return {
            success: true,
            data: labOrders,
            message: 'Lab orders retrieved successfully',
        };
    }
};
exports.LabService = LabService;
exports.LabService = LabService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], LabService);
//# sourceMappingURL=lab.service.js.map