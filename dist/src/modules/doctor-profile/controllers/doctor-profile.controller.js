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
exports.DoctorProfileController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const doctor_profile_service_1 = require("../services/doctor-profile.service");
let DoctorProfileController = class DoctorProfileController {
    constructor(doctorProfileService) {
        this.doctorProfileService = doctorProfileService;
    }
    async createProfile(req, profileData) {
        const doctorId = req.user.userId || req.user.id;
        console.log('🔍 DEBUG: Creating profile for doctorId =', doctorId);
        return this.doctorProfileService.createProfile(doctorId, profileData);
    }
    async getProfile(req) {
        const doctorId = req.user.userId || req.user.id;
        console.log('🔍 DEBUG: Getting profile for doctorId =', doctorId);
        return this.doctorProfileService.getProfile(doctorId);
    }
    async updateProfile(req, updateData) {
        const doctorId = req.user.userId || req.user.id;
        console.log('🔍 DEBUG: Updating profile for doctorId =', doctorId);
        console.log('🔍 DEBUG: Update data =', updateData);
        return this.doctorProfileService.updateProfile(doctorId, updateData);
    }
    async getServices(req) {
        const doctorId = req.user.userId || req.user.id;
        return this.doctorProfileService.getServices(doctorId);
    }
    async upsertServices(req, body) {
        const doctorId = req.user.userId || req.user.id;
        return this.doctorProfileService.upsertServices(doctorId, body.services || []);
    }
    async deleteService(req, serviceId) {
        const doctorId = req.user.userId || req.user.id;
        return this.doctorProfileService.deleteService(doctorId, serviceId);
    }
    async getInsurance(req) {
        const doctorId = req.user.userId || req.user.id;
        return this.doctorProfileService.getInsurance(doctorId);
    }
    async upsertInsurance(req, body) {
        const doctorId = req.user.userId || req.user.id;
        return this.doctorProfileService.upsertInsurance(doctorId, body.providers || []);
    }
    async deleteInsurance(req, id) {
        const doctorId = req.user.userId || req.user.id;
        return this.doctorProfileService.deleteInsurance(doctorId, id);
    }
    async getBilling(req) {
        const doctorId = req.user.userId || req.user.id;
        return this.doctorProfileService.getBilling(doctorId);
    }
    async updateBilling(req, body) {
        const doctorId = req.user.userId || req.user.id;
        return this.doctorProfileService.updateBilling(doctorId, body);
    }
    async getPublicProfile(doctorId) {
        return this.doctorProfileService.getPublicProfile(doctorId);
    }
};
exports.DoctorProfileController = DoctorProfileController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create doctor profile' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Profile created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Profile already exists' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "createProfile", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Profile not found' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update doctor profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Profile not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('services'),
    (0, swagger_1.ApiOperation)({ summary: 'List doctor services' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "getServices", null);
__decorate([
    (0, common_1.Post)('services'),
    (0, swagger_1.ApiOperation)({ summary: 'Upsert doctor services (bulk)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "upsertServices", null);
__decorate([
    (0, common_1.Post)('services/:serviceId/delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a doctor service' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "deleteService", null);
__decorate([
    (0, common_1.Get)('insurance'),
    (0, swagger_1.ApiOperation)({ summary: 'List supported insurance providers' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "getInsurance", null);
__decorate([
    (0, common_1.Post)('insurance'),
    (0, swagger_1.ApiOperation)({ summary: 'Upsert insurance providers (bulk)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "upsertInsurance", null);
__decorate([
    (0, common_1.Post)('insurance/:id/delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an insurance provider' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "deleteInsurance", null);
__decorate([
    (0, common_1.Get)('billing'),
    (0, swagger_1.ApiOperation)({ summary: 'Get billing settings' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "getBilling", null);
__decorate([
    (0, common_1.Put)('billing'),
    (0, swagger_1.ApiOperation)({ summary: 'Update billing settings' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "updateBilling", null);
__decorate([
    (0, common_1.Get)('public/:doctorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get public doctor profile (for patients)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Public profile retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Profile not found' }),
    __param(0, (0, common_1.Param)('doctorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "getPublicProfile", null);
exports.DoctorProfileController = DoctorProfileController = __decorate([
    (0, swagger_1.ApiTags)('Doctor Profile'),
    (0, common_1.Controller)('doctor-profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [doctor_profile_service_1.DoctorProfileService])
], DoctorProfileController);
//# sourceMappingURL=doctor-profile.controller.js.map