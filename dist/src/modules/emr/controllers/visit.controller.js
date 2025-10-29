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
exports.VisitController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const visit_service_1 = require("../services/visit.service");
let VisitController = class VisitController {
    constructor(visitService) {
        this.visitService = visitService;
    }
    async createVisit(req, visitData) {
        return this.visitService.createVisit(visitData);
    }
    async updateVisit(visitId, updateData) {
        return this.visitService.updateVisit(visitId, updateData);
    }
    async getVisit(visitId) {
        return this.visitService.getVisit(visitId);
    }
    async getPatientVisits(patientId, startDate, endDate, visitType, doctorId, limit) {
        return this.visitService.getPatientVisits(patientId, {
            startDate,
            endDate,
            visitType,
            doctorId,
            limit,
        });
    }
    async addDiagnosis(visitId, diagnosisData) {
        return this.visitService.addDiagnosis(visitId, diagnosisData);
    }
    async updateDiagnosis(diagnosisId, diagnosisData) {
        return this.visitService.updateDiagnosis(diagnosisId, diagnosisData);
    }
    async removeDiagnosis(diagnosisId) {
        return this.visitService.removeDiagnosis(diagnosisId);
    }
    async processVoiceTranscription(visitId, transcriptionData) {
        return this.visitService.processVoiceTranscription(visitId, transcriptionData.voiceFileUrl, transcriptionData.transcribedText);
    }
    async getIcd10Suggestions(symptoms) {
        return this.visitService.getIcd10Suggestions(symptoms);
    }
    async getVisitStatistics(doctorId, startDate, endDate) {
        return this.visitService.getVisitStatistics(doctorId, startDate, endDate);
    }
};
exports.VisitController = VisitController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new patient visit (SOAP note)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Visit created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "createVisit", null);
__decorate([
    (0, common_1.Put)(':visitId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update visit (SOAP note)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Visit updated successfully' }),
    __param(0, (0, common_1.Param)('visitId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "updateVisit", null);
__decorate([
    (0, common_1.Get)(':visitId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get visit details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Visit retrieved successfully' }),
    __param(0, (0, common_1.Param)('visitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "getVisit", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient visit history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient visits retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('visitType')),
    __param(4, (0, common_1.Query)('doctorId')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "getPatientVisits", null);
__decorate([
    (0, common_1.Post)(':visitId/diagnoses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add diagnosis to visit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis added successfully' }),
    __param(0, (0, common_1.Param)('visitId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "addDiagnosis", null);
__decorate([
    (0, common_1.Put)('diagnoses/:diagnosisId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update diagnosis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis updated successfully' }),
    __param(0, (0, common_1.Param)('diagnosisId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "updateDiagnosis", null);
__decorate([
    (0, common_1.Delete)('diagnoses/:diagnosisId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove diagnosis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis removed successfully' }),
    __param(0, (0, common_1.Param)('diagnosisId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "removeDiagnosis", null);
__decorate([
    (0, common_1.Post)(':visitId/voice-transcription'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Process voice-to-text transcription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voice transcription processed successfully' }),
    __param(0, (0, common_1.Param)('visitId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "processVoiceTranscription", null);
__decorate([
    (0, common_1.Get)('icd10/suggestions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get ICD-10 code suggestions based on symptoms' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ICD-10 suggestions retrieved successfully' }),
    __param(0, (0, common_1.Query)('symptoms')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "getIcd10Suggestions", null);
__decorate([
    (0, common_1.Get)('doctor/:doctorId/statistics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get visit statistics for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Visit statistics retrieved successfully' }),
    __param(0, (0, common_1.Param)('doctorId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "getVisitStatistics", null);
exports.VisitController = VisitController = __decorate([
    (0, swagger_1.ApiTags)('Patient Visits'),
    (0, common_1.Controller)('visits'),
    __metadata("design:paramtypes", [visit_service_1.VisitService])
], VisitController);
//# sourceMappingURL=visit.controller.js.map