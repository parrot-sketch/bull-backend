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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const lab_service_1 = require("../services/lab.service");
let LabController = class LabController {
    constructor(labService) {
        this.labService = labService;
    }
    async createLabOrder(req, orderData) {
        return this.labService.createLabOrder(orderData);
    }
    async uploadLabResult(req, resultData) {
        return this.labService.uploadLabResult(resultData);
    }
    async getPatientLabResults(patientId, testCategory, startDate, endDate, isAbnormal, criticalValue, status, limit) {
        return this.labService.getPatientLabResults(patientId, {
            testCategory,
            startDate,
            endDate,
            isAbnormal,
            criticalValue,
            status,
            limit,
        });
    }
    async getLabResult(resultId) {
        return this.labService.getLabResult(resultId);
    }
    async reviewLabResult(resultId, req, reviewData) {
        return this.labService.reviewLabResult(resultId, req.user.userId, reviewData.reviewNotes);
    }
    async flagLabResult(resultId, req, flagData) {
        return this.labService.flagLabResult(resultId, req.user.userId, flagData.flagReason);
    }
    async getCriticalLabResults(doctorId) {
        return this.labService.getCriticalLabResults(doctorId);
    }
    async getLabStatistics(doctorId, startDate, endDate) {
        return this.labService.getLabStatistics(doctorId, startDate, endDate);
    }
    async getPatientLabOrders(patientId, status, startDate, endDate, doctorId, limit) {
        return this.labService.getPatientLabOrders(patientId, {
            status,
            startDate,
            endDate,
            doctorId,
            limit,
        });
    }
};
exports.LabController = LabController;
__decorate([
    (0, common_1.Post)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create lab order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Lab order created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "createLabOrder", null);
__decorate([
    (0, common_1.Post)('results'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Upload lab result with OCR processing' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Lab result uploaded successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "uploadLabResult", null);
__decorate([
    (0, common_1.Get)('results/patient/:patientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get lab results for patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lab results retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('testCategory')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('isAbnormal')),
    __param(5, (0, common_1.Query)('criticalValue')),
    __param(6, (0, common_1.Query)('status')),
    __param(7, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Boolean, Boolean, String, Number]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "getPatientLabResults", null);
__decorate([
    (0, common_1.Get)('results/:resultId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get lab result details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lab result retrieved successfully' }),
    __param(0, (0, common_1.Param)('resultId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "getLabResult", null);
__decorate([
    (0, common_1.Put)('results/:resultId/review'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Review lab result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lab result reviewed successfully' }),
    __param(0, (0, common_1.Param)('resultId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "reviewLabResult", null);
__decorate([
    (0, common_1.Put)('results/:resultId/flag'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Flag lab result for follow-up' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lab result flagged for follow-up' }),
    __param(0, (0, common_1.Param)('resultId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "flagLabResult", null);
__decorate([
    (0, common_1.Get)('results/critical'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get critical lab results requiring immediate attention' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Critical lab results retrieved successfully' }),
    __param(0, (0, common_1.Query)('doctorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "getCriticalLabResults", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get lab statistics for dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lab statistics retrieved successfully' }),
    __param(0, (0, common_1.Query)('doctorId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "getLabStatistics", null);
__decorate([
    (0, common_1.Get)('orders/patient/:patientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get lab orders for patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lab orders retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('doctorId')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "getPatientLabOrders", null);
exports.LabController = LabController = __decorate([
    (0, swagger_1.ApiTags)('Lab Results'),
    (0, common_1.Controller)('lab'),
    __metadata("design:paramtypes", [lab_service_1.LabService])
], LabController);
//# sourceMappingURL=lab.controller.js.map