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
exports.PrescriptionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const prescription_service_1 = require("../services/prescription.service");
let PrescriptionController = class PrescriptionController {
    constructor(prescriptionService) {
        this.prescriptionService = prescriptionService;
    }
    async createPrescription(req, prescriptionData) {
        return this.prescriptionService.createPrescription(prescriptionData);
    }
    async updatePrescription(prescriptionId, updateData) {
        return this.prescriptionService.updatePrescription(prescriptionId, updateData);
    }
    async getPrescription(prescriptionId) {
        return this.prescriptionService.getPrescription(prescriptionId);
    }
    async getPatientPrescriptions(patientId, status, startDate, endDate, doctorId, limit) {
        return this.prescriptionService.getPatientPrescriptions(patientId, {
            status,
            startDate,
            endDate,
            doctorId,
            limit,
        });
    }
    async updatePrescriptionStatus(prescriptionId, statusData) {
        return this.prescriptionService.updatePrescriptionStatus(prescriptionId, statusData.status, statusData.notes);
    }
    async cancelPrescription(prescriptionId, cancelData) {
        return this.prescriptionService.cancelPrescription(prescriptionId, cancelData.reason);
    }
    async getPrescriptionStatistics(doctorId, startDate, endDate) {
        return this.prescriptionService.getPrescriptionStatistics(doctorId, startDate, endDate);
    }
    async searchMedications(query) {
        return this.prescriptionService.searchMedications(query);
    }
    async checkDrugInteractions(interactionData) {
        const newMedication = interactionData.medications?.[0] || '';
        return this.prescriptionService.checkDrugInteractions(interactionData.patientId, newMedication);
    }
    async checkNewMedicationInteractions(interactionData) {
        return this.prescriptionService.checkDrugInteractions(interactionData.patientId, interactionData.newMedication);
    }
};
exports.PrescriptionController = PrescriptionController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new prescription with drug interaction checking' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Prescription created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "createPrescription", null);
__decorate([
    (0, common_1.Put)(':prescriptionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update prescription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription updated successfully' }),
    __param(0, (0, common_1.Param)('prescriptionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "updatePrescription", null);
__decorate([
    (0, common_1.Get)(':prescriptionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescription details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription retrieved successfully' }),
    __param(0, (0, common_1.Param)('prescriptionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "getPrescription", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient prescriptions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient prescriptions retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('doctorId')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "getPatientPrescriptions", null);
__decorate([
    (0, common_1.Put)(':prescriptionId/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update prescription status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription status updated successfully' }),
    __param(0, (0, common_1.Param)('prescriptionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "updatePrescriptionStatus", null);
__decorate([
    (0, common_1.Put)(':prescriptionId/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel prescription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription cancelled successfully' }),
    __param(0, (0, common_1.Param)('prescriptionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "cancelPrescription", null);
__decorate([
    (0, common_1.Get)('doctor/:doctorId/statistics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescription statistics for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription statistics retrieved successfully' }),
    __param(0, (0, common_1.Param)('doctorId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "getPrescriptionStatistics", null);
__decorate([
    (0, common_1.Get)('medications/search'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search for medications in drug database' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medications retrieved successfully' }),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "searchMedications", null);
__decorate([
    (0, common_1.Post)('interactions/check'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check drug interactions for medication list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Drug interaction check completed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "checkDrugInteractions", null);
__decorate([
    (0, common_1.Post)('interactions/check-new'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check interactions for new medication with existing medications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Drug interaction check completed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "checkNewMedicationInteractions", null);
exports.PrescriptionController = PrescriptionController = __decorate([
    (0, swagger_1.ApiTags)('Prescriptions'),
    (0, common_1.Controller)('prescriptions'),
    __metadata("design:paramtypes", [prescription_service_1.PrescriptionService])
], PrescriptionController);
//# sourceMappingURL=prescription.controller.js.map