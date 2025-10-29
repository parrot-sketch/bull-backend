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
exports.PatientBookingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const patient_booking_service_1 = require("../services/patient-booking.service");
let PatientBookingController = class PatientBookingController {
    constructor(patientBookingService) {
        this.patientBookingService = patientBookingService;
    }
    async findDoctors(specialty, location, city, acceptingNewPatients) {
        return this.patientBookingService.findDoctors({
            specialty,
            location,
            city,
            isAcceptingNewPatients: acceptingNewPatients,
        });
    }
    async getDoctorDetails(doctorId) {
        return this.patientBookingService.getDoctorDetails(doctorId);
    }
    async getDoctorAvailability(doctorId, date) {
        return this.patientBookingService.getDoctorAvailability(doctorId, date);
    }
    async bookAppointment(req, bookingData) {
        return this.patientBookingService.bookAppointment(req.user.userId, bookingData);
    }
    async getPatientAppointments(req, status, startDate, endDate) {
        return this.patientBookingService.getPatientAppointments(req.user.userId, {
            status,
            startDate,
            endDate,
        });
    }
    async cancelAppointment(req, appointmentId, body) {
        return this.patientBookingService.cancelAppointment(req.user.userId, appointmentId, body?.reason);
    }
};
exports.PatientBookingController = PatientBookingController;
__decorate([
    (0, common_1.Get)('doctors'),
    (0, swagger_1.ApiOperation)({ summary: 'Find available doctors' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Doctors retrieved successfully' }),
    __param(0, (0, common_1.Query)('specialty')),
    __param(1, (0, common_1.Query)('location')),
    __param(2, (0, common_1.Query)('city')),
    __param(3, (0, common_1.Query)('acceptingNewPatients')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], PatientBookingController.prototype, "findDoctors", null);
__decorate([
    (0, common_1.Get)('doctors/:doctorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor details for booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Doctor details retrieved successfully' }),
    __param(0, (0, common_1.Param)('doctorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientBookingController.prototype, "getDoctorDetails", null);
__decorate([
    (0, common_1.Get)('doctors/:doctorId/availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor availability for a specific date' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Availability retrieved successfully' }),
    __param(0, (0, common_1.Param)('doctorId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PatientBookingController.prototype, "getDoctorAvailability", null);
__decorate([
    (0, common_1.Post)('book'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Book an appointment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Appointment booking requested successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientBookingController.prototype, "bookAppointment", null);
__decorate([
    (0, common_1.Get)('appointments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient appointments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointments retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], PatientBookingController.prototype, "getPatientAppointments", null);
__decorate([
    (0, common_1.Post)('appointments/:appointmentId/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel an appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment cancelled successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('appointmentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PatientBookingController.prototype, "cancelAppointment", null);
exports.PatientBookingController = PatientBookingController = __decorate([
    (0, swagger_1.ApiTags)('Patient Booking'),
    (0, common_1.Controller)('patient'),
    __metadata("design:paramtypes", [patient_booking_service_1.PatientBookingService])
], PatientBookingController);
//# sourceMappingURL=patient-booking.controller.js.map