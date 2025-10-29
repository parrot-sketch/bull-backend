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
exports.ImagingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const imaging_service_1 = require("../services/imaging.service");
let ImagingController = class ImagingController {
    constructor(imagingService) {
        this.imagingService = imagingService;
    }
    async createImagingOrder(req, orderData) {
        return this.imagingService.createImagingOrder(orderData);
    }
    async uploadImagingResult(req, resultData) {
        return this.imagingService.uploadImagingResult(resultData);
    }
    async getPatientImagingResults(patientId, studyType, bodyPart, startDate, endDate, status, limit) {
        return this.imagingService.getPatientImagingResults(patientId, {
            studyType,
            bodyPart,
            startDate,
            endDate,
            status,
            limit,
        });
    }
    async getImagingResult(resultId) {
        return this.imagingService.getImagingResult(resultId);
    }
    async reviewImagingResult(resultId, req, reviewData) {
        return this.imagingService.reviewImagingResult(resultId, req.user.userId, reviewData.reviewNotes);
    }
    async flagImagingResult(resultId, req, flagData) {
        return this.imagingService.flagImagingResult(resultId, req.user.userId, flagData.flagReason);
    }
    async getCriticalImagingResults(doctorId) {
        return this.imagingService.getCriticalImagingResults(doctorId);
    }
    async getImagingStatistics(doctorId, startDate, endDate) {
        return this.imagingService.getImagingStatistics(doctorId, startDate, endDate);
    }
    async getPatientImagingOrders(patientId, status, studyType, startDate, endDate, doctorId, limit) {
        return this.imagingService.getPatientImagingOrders(patientId, {
            status,
            studyType,
            startDate,
            endDate,
            doctorId,
            limit,
        });
    }
    async updateImagingOrderStatus(orderId, statusData) {
        return this.imagingService.updateImagingOrderStatus(orderId, statusData.status, statusData.notes);
    }
};
exports.ImagingController = ImagingController;
__decorate([
    (0, common_1.Post)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create imaging order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Imaging order created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "createImagingOrder", null);
__decorate([
    (0, common_1.Post)('results'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Upload imaging result with OCR processing' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Imaging result uploaded successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "uploadImagingResult", null);
__decorate([
    (0, common_1.Get)('results/patient/:patientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get imaging results for patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging results retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('studyType')),
    __param(2, (0, common_1.Query)('bodyPart')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('status')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "getPatientImagingResults", null);
__decorate([
    (0, common_1.Get)('results/:resultId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get imaging result details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging result retrieved successfully' }),
    __param(0, (0, common_1.Param)('resultId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "getImagingResult", null);
__decorate([
    (0, common_1.Put)('results/:resultId/review'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Review imaging result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging result reviewed successfully' }),
    __param(0, (0, common_1.Param)('resultId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "reviewImagingResult", null);
__decorate([
    (0, common_1.Put)('results/:resultId/flag'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Flag imaging result for follow-up' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging result flagged for follow-up' }),
    __param(0, (0, common_1.Param)('resultId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "flagImagingResult", null);
__decorate([
    (0, common_1.Get)('results/critical'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get critical imaging results requiring immediate attention' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Critical imaging results retrieved successfully' }),
    __param(0, (0, common_1.Query)('doctorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "getCriticalImagingResults", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get imaging statistics for dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging statistics retrieved successfully' }),
    __param(0, (0, common_1.Query)('doctorId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "getImagingStatistics", null);
__decorate([
    (0, common_1.Get)('orders/patient/:patientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get imaging orders for patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging orders retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('studyType')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('doctorId')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "getPatientImagingOrders", null);
__decorate([
    (0, common_1.Put)('orders/:orderId/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update imaging order status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging order status updated successfully' }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "updateImagingOrderStatus", null);
exports.ImagingController = ImagingController = __decorate([
    (0, swagger_1.ApiTags)('Imaging Results'),
    (0, common_1.Controller)('imaging'),
    __metadata("design:paramtypes", [imaging_service_1.ImagingService])
], ImagingController);
//# sourceMappingURL=imaging.controller.js.map