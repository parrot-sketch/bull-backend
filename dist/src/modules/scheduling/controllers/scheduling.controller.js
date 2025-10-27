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
exports.SchedulingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const scheduling_dto_1 = require("../dto/scheduling.dto");
const scheduling_service_1 = require("../services/scheduling.service");
let SchedulingController = class SchedulingController {
    constructor(schedulingService) {
        this.schedulingService = schedulingService;
    }
    async createScheduleTemplate(req, createTemplateDto) {
        return this.schedulingService.createScheduleTemplate(req.user.id, createTemplateDto);
    }
    async getScheduleTemplates(req) {
        return this.schedulingService.getScheduleTemplates(req.user.id);
    }
    async updateScheduleTemplate(templateId, updateTemplateDto) {
        return this.schedulingService.updateScheduleTemplate(templateId, updateTemplateDto);
    }
    async deleteScheduleTemplate(templateId) {
        return this.schedulingService.deleteScheduleTemplate(templateId);
    }
    async createTimeSlot(templateId, createSlotDto) {
        return this.schedulingService.createTimeSlot(templateId, createSlotDto);
    }
    async updateTimeSlot(slotId, updateSlotDto) {
        return this.schedulingService.updateTimeSlot(slotId, updateSlotDto);
    }
    async deleteTimeSlot(slotId) {
        return this.schedulingService.deleteTimeSlot(slotId);
    }
    async generateSchedule(req, body) {
        return this.schedulingService.generateSchedule(req.user.id, body.templateId, body.date);
    }
    async getAvailability(req, query) {
        return this.schedulingService.getAvailability(req.user.id, query.date);
    }
    async getAvailabilityRange(req, startDate, endDate) {
        return this.schedulingService.doctorAvailability.getAvailability(req.user.id, startDate, endDate);
    }
    async getAvailableSlots(req, date, startTime, endTime) {
        return this.schedulingService.doctorAvailability.getAvailableSlots(req.user.id, date);
    }
    async updateAvailability(req, updateAvailabilityDto) {
        return this.schedulingService.updateAvailability(req.user.id, updateAvailabilityDto.date, updateAvailabilityDto.timeSlots);
    }
    async setupRecurringAvailability(req, availabilityData) {
        return this.schedulingService.doctorAvailability.setRecurringAvailability(req.user.id, availabilityData);
    }
    async createException(req, createExceptionDto) {
        return this.schedulingService.createException(req.user.id, createExceptionDto);
    }
    async getExceptions(req, startDate, endDate) {
        return this.schedulingService.getExceptions(req.user.id, startDate, endDate);
    }
    async deleteException(exceptionId) {
        return this.schedulingService.deleteException(exceptionId);
    }
    async bookAppointment(bookAppointmentDto) {
        return this.schedulingService.bookAppointment(bookAppointmentDto);
    }
    async getAppointments(req, startDate, endDate, status, limit) {
        const mockAppointments = [
            {
                id: '1',
                patientName: 'John Doe',
                patientEmail: 'john@example.com',
                appointmentDate: new Date().toISOString(),
                startTime: '09:00',
                endTime: '09:30',
                status: 'SCHEDULED',
                type: 'CONSULTATION',
                notes: 'Regular checkup'
            },
            {
                id: '2',
                patientName: 'Jane Smith',
                patientEmail: 'jane@example.com',
                appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                startTime: '10:00',
                endTime: '10:30',
                status: 'PENDING',
                type: 'FOLLOW_UP',
                notes: 'Follow-up appointment'
            }
        ];
        return {
            success: true,
            data: mockAppointments,
            message: 'Mock appointments data'
        };
    }
    async getUpcomingAppointments(req, limit) {
        return this.schedulingService.appointmentManagement.getUpcomingAppointments(req.user.id, limit || 10);
    }
    async getTodaysAppointments(req) {
        return this.schedulingService.appointmentManagement.getTodaysAppointments(req.user.id);
    }
    async getAppointmentStats(req, startDate, endDate) {
        return this.schedulingService.appointmentManagement.getAppointmentStats(req.user.id, startDate, endDate);
    }
    async updateAppointment(appointmentId, updateAppointmentDto) {
        return this.schedulingService.updateAppointment(appointmentId, updateAppointmentDto);
    }
    async confirmAppointment(req, appointmentId) {
        return this.schedulingService.appointmentManagement.confirmAppointment(appointmentId, req.user.id);
    }
    async rescheduleAppointment(appointmentId, body) {
        return this.schedulingService.appointmentManagement.rescheduleAppointment(appointmentId, body.newDate, body.newStartTime, body.newEndTime, body.reason);
    }
    async cancelAppointment(appointmentId, body) {
        return this.schedulingService.appointmentManagement.cancelAppointment(appointmentId, body.reason, body.cancelledBy);
    }
    async completeAppointment(req, appointmentId, body) {
        return this.schedulingService.appointmentManagement.completeAppointment(appointmentId, req.user.id, body.notes);
    }
    async getAnalytics(req, query) {
        return {
            success: true,
            data: {
                totalAppointments: 0,
                completedAppointments: 0,
                cancelledAppointments: 0,
                noShowAppointments: 0,
                averageAppointmentDuration: 0,
                mostPopularTimeSlots: [],
                revenue: 0,
            },
            message: 'Analytics retrieved successfully',
        };
    }
};
exports.SchedulingController = SchedulingController;
__decorate([
    (0, common_1.Post)('templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new schedule template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Schedule template created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, scheduling_dto_1.CreateScheduleTemplateDto]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "createScheduleTemplate", null);
__decorate([
    (0, common_1.Get)('templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all schedule templates for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule templates retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getScheduleTemplates", null);
__decorate([
    (0, common_1.Put)('templates/:templateId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a schedule template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule template updated successfully' }),
    __param(0, (0, common_1.Param)('templateId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, scheduling_dto_1.UpdateScheduleTemplateDto]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "updateScheduleTemplate", null);
__decorate([
    (0, common_1.Delete)('templates/:templateId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a schedule template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule template deleted successfully' }),
    __param(0, (0, common_1.Param)('templateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "deleteScheduleTemplate", null);
__decorate([
    (0, common_1.Post)('templates/:templateId/time-slots'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a time slot for a template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Time slot created successfully' }),
    __param(0, (0, common_1.Param)('templateId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, scheduling_dto_1.CreateTimeSlotDto]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "createTimeSlot", null);
__decorate([
    (0, common_1.Put)('time-slots/:slotId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a time slot' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Time slot updated successfully' }),
    __param(0, (0, common_1.Param)('slotId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, scheduling_dto_1.UpdateTimeSlotDto]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "updateTimeSlot", null);
__decorate([
    (0, common_1.Delete)('time-slots/:slotId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a time slot' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Time slot deleted successfully' }),
    __param(0, (0, common_1.Param)('slotId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "deleteTimeSlot", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate schedule from template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Schedule generated successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "generateSchedule", null);
__decorate([
    (0, common_1.Get)('availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor availability for a date' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Availability retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, scheduling_dto_1.GetAvailabilityDto]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getAvailability", null);
__decorate([
    (0, common_1.Get)('availability/range'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor availability for a date range' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Availability range retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getAvailabilityRange", null);
__decorate([
    (0, common_1.Get)('availability/slots'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available time slots for a specific date' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Available slots retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('date')),
    __param(2, (0, common_1.Query)('startTime')),
    __param(3, (0, common_1.Query)('endTime')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getAvailableSlots", null);
__decorate([
    (0, common_1.Put)('availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Update doctor availability' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Availability updated successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, scheduling_dto_1.UpdateAvailabilityDto]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "updateAvailability", null);
__decorate([
    (0, common_1.Post)('availability/setup'),
    (0, swagger_1.ApiOperation)({ summary: 'Set up recurring availability for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Recurring availability set up successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "setupRecurringAvailability", null);
__decorate([
    (0, common_1.Post)('exceptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a schedule exception' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Schedule exception created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, scheduling_dto_1.CreateExceptionDto]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "createException", null);
__decorate([
    (0, common_1.Get)('exceptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get schedule exceptions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule exceptions retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getExceptions", null);
__decorate([
    (0, common_1.Delete)('exceptions/:exceptionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a schedule exception' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule exception deleted successfully' }),
    __param(0, (0, common_1.Param)('exceptionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "deleteException", null);
__decorate([
    (0, common_1.Post)('appointments'),
    (0, swagger_1.ApiOperation)({ summary: 'Book a new appointment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Appointment booked successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [scheduling_dto_1.BookAppointmentDto]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "bookAppointment", null);
__decorate([
    (0, common_1.Get)('appointments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get appointments for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointments retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getAppointments", null);
__decorate([
    (0, common_1.Get)('appointments/upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upcoming appointments for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Upcoming appointments retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getUpcomingAppointments", null);
__decorate([
    (0, common_1.Get)('appointments/today'),
    (0, swagger_1.ApiOperation)({ summary: 'Get today\'s appointments for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Today\'s appointments retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getTodaysAppointments", null);
__decorate([
    (0, common_1.Get)('appointments/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get appointment statistics for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment statistics retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getAppointmentStats", null);
__decorate([
    (0, common_1.Put)('appointments/:appointmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment updated successfully' }),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, scheduling_dto_1.UpdateAppointmentDto]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "updateAppointment", null);
__decorate([
    (0, common_1.Put)('appointments/:appointmentId/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm an appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment confirmed successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('appointmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "confirmAppointment", null);
__decorate([
    (0, common_1.Put)('appointments/:appointmentId/reschedule'),
    (0, swagger_1.ApiOperation)({ summary: 'Reschedule an appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment rescheduled successfully' }),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "rescheduleAppointment", null);
__decorate([
    (0, common_1.Put)('appointments/:appointmentId/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel an appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment cancelled successfully' }),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "cancelAppointment", null);
__decorate([
    (0, common_1.Put)('appointments/:appointmentId/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark appointment as completed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment marked as completed' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('appointmentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "completeAppointment", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scheduling analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, scheduling_dto_1.ScheduleAnalyticsDto]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getAnalytics", null);
exports.SchedulingController = SchedulingController = __decorate([
    (0, swagger_1.ApiTags)('Scheduling'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('scheduling'),
    __metadata("design:paramtypes", [scheduling_service_1.SchedulingService])
], SchedulingController);
//# sourceMappingURL=scheduling.controller.js.map