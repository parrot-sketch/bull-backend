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
exports.ImagingService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../auth/services/database.service");
let ImagingService = class ImagingService {
    constructor(db) {
        this.db = db;
    }
    async createImagingOrder(orderData) {
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
        const imagingOrder = await this.db.imagingOrder.create({
            data: {
                patientId: orderData.patientId,
                doctorId: orderData.doctorId,
                visitId: orderData.visitId,
                studyType: orderData.studyType,
                bodyPart: orderData.bodyPart,
                clinicalHistory: orderData.clinicalHistory,
                urgency: orderData.urgency || 'ROUTINE',
                imagingCenter: orderData.imagingCenter,
                centerAddress: orderData.centerAddress,
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
            data: imagingOrder,
            message: 'Imaging order created successfully',
        };
    }
    async uploadImagingResult(resultData) {
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
        const analysisResult = await this.analyzeImagingFindings(resultData.findings, resultData.impression);
        const imagingResult = await this.db.imagingResult.create({
            data: {
                patientId: resultData.patientId,
                orderId: resultData.orderId,
                doctorId: resultData.doctorId,
                studyType: resultData.studyType,
                bodyPart: resultData.bodyPart,
                technique: resultData.technique,
                contrastUsed: resultData.contrastUsed || false,
                findings: resultData.findings,
                impression: resultData.impression,
                recommendations: resultData.recommendations,
                imageUrls: resultData.imageUrls,
                reportFileUrl: resultData.reportFileUrl,
                ocrText,
                radiologistName: resultData.radiologistName,
                radiologistId: resultData.radiologistId,
                performedAt: new Date(resultData.performedAt),
                reportedAt: new Date(),
                status: analysisResult.isCritical ? 'CRITICAL_FINDING_ALERT' : 'PENDING_REVIEW',
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
                        studyType: true,
                        bodyPart: true,
                        clinicalHistory: true,
                    },
                },
            },
        });
        if (analysisResult.isCritical) {
            await this.sendCriticalImagingAlert(imagingResult);
        }
        return {
            success: true,
            data: imagingResult,
            analysis: analysisResult,
            message: 'Imaging result uploaded successfully',
        };
    }
    async getPatientImagingResults(patientId, filters) {
        const where = { patientId };
        if (filters?.studyType) {
            where.studyType = filters.studyType;
        }
        if (filters?.bodyPart) {
            where.bodyPart = { contains: filters.bodyPart, mode: 'insensitive' };
        }
        if (filters?.startDate || filters?.endDate) {
            where.reportedAt = {};
            if (filters?.startDate)
                where.reportedAt.gte = new Date(filters.startDate);
            if (filters?.endDate)
                where.reportedAt.lte = new Date(filters.endDate);
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        const imagingResults = await this.db.imagingResult.findMany({
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
                        studyType: true,
                        bodyPart: true,
                        clinicalHistory: true,
                    },
                },
            },
            orderBy: { reportedAt: 'desc' },
            take: filters?.limit || 50,
        });
        return {
            success: true,
            data: imagingResults,
            message: 'Imaging results retrieved successfully',
        };
    }
    async getImagingResult(resultId) {
        const imagingResult = await this.db.imagingResult.findUnique({
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
                        studyType: true,
                        bodyPart: true,
                        clinicalHistory: true,
                        urgency: true,
                    },
                },
            },
        });
        if (!imagingResult) {
            throw new common_1.NotFoundException('Imaging result not found');
        }
        return {
            success: true,
            data: imagingResult,
            message: 'Imaging result retrieved successfully',
        };
    }
    async reviewImagingResult(resultId, doctorId, reviewNotes) {
        const imagingResult = await this.db.imagingResult.findUnique({
            where: { id: resultId },
        });
        if (!imagingResult) {
            throw new common_1.NotFoundException('Imaging result not found');
        }
        const updatedResult = await this.db.imagingResult.update({
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
            message: 'Imaging result reviewed successfully',
        };
    }
    async flagImagingResult(resultId, doctorId, flagReason) {
        const imagingResult = await this.db.imagingResult.findUnique({
            where: { id: resultId },
        });
        if (!imagingResult) {
            throw new common_1.NotFoundException('Imaging result not found');
        }
        const updatedResult = await this.db.imagingResult.update({
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
            message: 'Imaging result flagged for follow-up',
        };
    }
    async getCriticalImagingResults(doctorId) {
        const where = {
            status: 'CRITICAL_FINDING_ALERT',
        };
        if (doctorId) {
            where.doctorId = doctorId;
        }
        const criticalResults = await this.db.imagingResult.findMany({
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
            message: 'Critical imaging results retrieved successfully',
        };
    }
    async getImagingStatistics(doctorId, startDate, endDate) {
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
        const [totalResults, criticalResults, resultsByType] = await Promise.all([
            this.db.imagingResult.count({ where }),
            this.db.imagingResult.count({ where: { ...where, status: 'CRITICAL_FINDING_ALERT' } }),
            this.db.imagingResult.groupBy({
                by: ['studyType'],
                where,
                _count: { studyType: true },
            }),
        ]);
        return {
            success: true,
            data: {
                totalResults,
                criticalResults,
                resultsByType,
                criticalRate: totalResults > 0 ? (criticalResults / totalResults) * 100 : 0,
            },
            message: 'Imaging statistics retrieved successfully',
        };
    }
    async getPatientImagingOrders(patientId, filters) {
        const where = { patientId };
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.studyType) {
            where.studyType = filters.studyType;
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
        const imagingOrders = await this.db.imagingOrder.findMany({
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
                        studyType: true,
                        bodyPart: true,
                        findings: true,
                        impression: true,
                        status: true,
                    },
                },
            },
            orderBy: { orderedAt: 'desc' },
            take: filters?.limit || 50,
        });
        return {
            success: true,
            data: imagingOrders,
            message: 'Imaging orders retrieved successfully',
        };
    }
    async processOCR(fileUrl) {
        return `Mock OCR text extracted from imaging report ${fileUrl}`;
    }
    async analyzeImagingFindings(findings, impression) {
        const criticalKeywords = ['mass', 'tumor', 'fracture', 'hemorrhage', 'pneumonia', 'stroke'];
        const text = `${findings || ''} ${impression || ''}`.toLowerCase();
        const isCritical = criticalKeywords.some(keyword => text.includes(keyword));
        const isAbnormal = Math.random() > 0.6;
        return {
            isCritical,
            isAbnormal,
            interpretation: isCritical ? 'Critical finding detected' : 'Routine imaging study',
            recommendations: isCritical ? 'Immediate medical attention required' : 'Follow up as needed',
        };
    }
    async sendCriticalImagingAlert(imagingResult) {
        console.log(`CRITICAL IMAGING ALERT: Result ${imagingResult.id} requires immediate attention for patient ${imagingResult.patient.firstName} ${imagingResult.patient.lastName}`);
        return true;
    }
    async updateImagingOrderStatus(orderId, status, notes) {
        const order = await this.db.imagingOrder.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Imaging order not found');
        }
        const updateData = { status: status };
        if (status === 'SCHEDULED') {
            updateData.scheduledAt = new Date();
        }
        else if (status === 'IN_PROGRESS') {
            updateData.performedAt = new Date();
        }
        else if (status === 'COMPLETED') {
            updateData.completedAt = new Date();
        }
        const updatedOrder = await this.db.imagingOrder.update({
            where: { id: orderId },
            data: updateData,
        });
        return {
            success: true,
            data: updatedOrder,
            message: `Imaging order status updated to ${status}`,
        };
    }
};
exports.ImagingService = ImagingService;
exports.ImagingService = ImagingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ImagingService);
//# sourceMappingURL=imaging.service.js.map