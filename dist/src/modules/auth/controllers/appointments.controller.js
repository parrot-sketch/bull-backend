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
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
let AppointmentsController = class AppointmentsController {
    async getAppointments(req, startDate, endDate, status, limit) {
        try {
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
        catch (error) {
            console.error('Error in getAppointments:', error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Get)(),
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
], AppointmentsController.prototype, "getAppointments", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, swagger_1.ApiTags)('Appointments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('appointments')
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map