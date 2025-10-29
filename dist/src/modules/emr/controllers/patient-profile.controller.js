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
exports.PatientProfileController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const patient_profile_service_1 = require("../services/patient-profile.service");
let PatientProfileController = class PatientProfileController {
    constructor(patientProfileService) {
        this.patientProfileService = patientProfileService;
    }
    async upsertPatientProfile(req, profileData) {
        return this.patientProfileService.upsertPatientProfile(req.user.userId, profileData);
    }
    async getPatientProfile(req) {
        return this.patientProfileService.getPatientProfile(req.user.userId);
    }
    async addAllergy(req, allergyData) {
        return this.patientProfileService.addAllergy(req.user.userId, allergyData);
    }
    async updateAllergy(allergyId, allergyData) {
        return this.patientProfileService.updateAllergy(allergyId, allergyData);
    }
    async removeAllergy(allergyId) {
        return this.patientProfileService.removeAllergy(allergyId);
    }
    async getPatientAllergies(req) {
        return this.patientProfileService.getPatientAllergies(req.user.userId);
    }
    async addCurrentMedication(req, medicationData) {
        return this.patientProfileService.addCurrentMedication(req.user.userId, medicationData);
    }
    async updateCurrentMedication(medicationId, medicationData) {
        return this.patientProfileService.updateCurrentMedication(medicationId, medicationData);
    }
    async removeCurrentMedication(medicationId) {
        return this.patientProfileService.removeCurrentMedication(medicationId);
    }
    async getPatientMedications(req) {
        return this.patientProfileService.getPatientMedications(req.user.userId);
    }
};
exports.PatientProfileController = PatientProfileController;
__decorate([
    (0, common_1.Post)('upsert'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update patient profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient profile updated successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "upsertPatientProfile", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current patient profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient profile retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "getPatientProfile", null);
__decorate([
    (0, common_1.Post)('allergies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add allergy to patient profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Allergy added successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "addAllergy", null);
__decorate([
    (0, common_1.Put)('allergies/:allergyId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update allergy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Allergy updated successfully' }),
    __param(0, (0, common_1.Param)('allergyId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "updateAllergy", null);
__decorate([
    (0, common_1.Delete)('allergies/:allergyId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove allergy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Allergy removed successfully' }),
    __param(0, (0, common_1.Param)('allergyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "removeAllergy", null);
__decorate([
    (0, common_1.Get)('allergies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient allergies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Allergies retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "getPatientAllergies", null);
__decorate([
    (0, common_1.Post)('medications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add current medication' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication added successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "addCurrentMedication", null);
__decorate([
    (0, common_1.Put)('medications/:medicationId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update current medication' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication updated successfully' }),
    __param(0, (0, common_1.Param)('medicationId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "updateCurrentMedication", null);
__decorate([
    (0, common_1.Delete)('medications/:medicationId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove current medication' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication removed successfully' }),
    __param(0, (0, common_1.Param)('medicationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "removeCurrentMedication", null);
__decorate([
    (0, common_1.Get)('medications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient current medications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current medications retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "getPatientMedications", null);
exports.PatientProfileController = PatientProfileController = __decorate([
    (0, swagger_1.ApiTags)('Patient Profile'),
    (0, common_1.Controller)('patient-profile'),
    __metadata("design:paramtypes", [patient_profile_service_1.PatientProfileService])
], PatientProfileController);
//# sourceMappingURL=patient-profile.controller.js.map