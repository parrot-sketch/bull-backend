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
exports.EmrController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const emr_service_1 = require("../services/emr.service");
let EmrController = class EmrController {
    constructor(emrService) {
        this.emrService = emrService;
    }
    async getPatientOverview(patientId) {
        return this.emrService.getPatientOverview(patientId);
    }
    async searchPatients(name, email, phoneNumber, dateOfBirth, medicalRecordNumber, limit) {
        return this.emrService.searchPatients({
            name,
            email,
            phoneNumber,
            dateOfBirth,
            medicalRecordNumber,
            limit,
        });
    }
    async getPatientTimeline(patientId, startDate, endDate) {
        return this.emrService.getPatientTimeline(patientId, startDate, endDate);
    }
    async getVitalSignsHistory(patientId, limit) {
        return this.emrService.getVitalSignsHistory(patientId, limit);
    }
    async generatePatientSummary(patientId) {
        return this.emrService.generatePatientSummary(patientId);
    }
};
exports.EmrController = EmrController;
__decorate([
    (0, common_1.Get)('patient/:patientId/overview'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive patient overview' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient overview retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmrController.prototype, "getPatientOverview", null);
__decorate([
    (0, common_1.Get)('patients/search'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search patients by various criteria' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patients retrieved successfully' }),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, common_1.Query)('email')),
    __param(2, (0, common_1.Query)('phoneNumber')),
    __param(3, (0, common_1.Query)('dateOfBirth')),
    __param(4, (0, common_1.Query)('medicalRecordNumber')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], EmrController.prototype, "searchPatients", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/timeline'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient medical history timeline' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient timeline retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EmrController.prototype, "getPatientTimeline", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/vital-signs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient vital signs history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vital signs history retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], EmrController.prototype, "getVitalSignsHistory", null);
__decorate([
    (0, common_1.Post)('patient/:patientId/summary'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate comprehensive patient summary report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient summary generated successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmrController.prototype, "generatePatientSummary", null);
exports.EmrController = EmrController = __decorate([
    (0, swagger_1.ApiTags)('EMR'),
    (0, common_1.Controller)('emr'),
    __metadata("design:paramtypes", [emr_service_1.EmrService])
], EmrController);
//# sourceMappingURL=emr.controller.js.map