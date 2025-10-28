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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentManagementService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../auth/services/database.service");
const slot_engine_service_1 = require("./slot-engine.service");
let AppointmentManagementService = class AppointmentManagementService {
    constructor(db, slotEngine) {
        this.db = db;
        this.slotEngine = slotEngine;
    }
    async createAppointment(appointmentData) {
        const availabilityCheck = await this.slotEngine.checkSlotAvailability(appointmentData.doctorId, appointmentData.date, appointmentData.startTime, appointmentData.endTime);
        if (!availabilityCheck.success) {
            throw new common_1.BadRequestException(availabilityCheck.message);
        }
        const conflictCheck = await this.slotEngine.checkConflicts(appointmentData.doctorId, appointmentData.date, appointmentData.startTime, appointmentData.endTime);
        if (conflictCheck.hasConflicts) {
            throw new common_1.BadRequestException('Time slot conflicts with existing appointment');
        }
        const appointment = await this.db.appointment.create({
            data: {
                patientId: appointmentData.patientId,
                doctorId: appointmentData.doctorId,
                scheduleId: availabilityCheck.data.scheduleId,
                appointmentDate: new Date(appointmentData.date),
                startTime: appointmentData.startTime,
                endTime: appointmentData.endTime,
                duration: this.slotEngine.calculateSlotDuration(appointmentData.startTime, appointmentData.endTime),
                type: appointmentData.type,
                status: 'PENDING',
                notes: appointmentData.notes,
                patientName: appointmentData.patientName,
                patientPhone: appointmentData.patientPhone,
                patientEmail: appointmentData.patientEmail,
            },
            include: {
                patient: true,
            },
        });
        await this.slotEngine.lockSlot(appointmentData.doctorId, availabilityCheck.data.scheduleId, appointmentData.startTime, appointmentData.endTime);
        return {
            success: true,
            data: appointment,
            message: 'Appointment created successfully',
        };
    }
    async confirmAppointment(appointmentId, doctorId) {
        const appointment = await this.db.appointment.findUnique({
            where: { id: appointmentId },
            include: { patient: true },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.doctorId !== doctorId) {
            throw new common_1.BadRequestException('Unauthorized to confirm this appointment');
        }
        if (appointment.status !== 'PENDING') {
            throw new common_1.BadRequestException('Appointment is not in pending status');
        }
        const updatedAppointment = await this.db.appointment.update({
            where: { id: appointmentId },
            data: { status: 'CONFIRMED' },
            include: { patient: true },
        });
        return {
            success: true,
            data: updatedAppointment,
            message: 'Appointment confirmed successfully',
        };
    }
    async rescheduleAppointment(appointmentId, newDate, newStartTime, newEndTime, reason) {
        const appointment = await this.db.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Cannot reschedule a cancelled appointment');
        }
        const availabilityCheck = await this.slotEngine.checkSlotAvailability(appointment.doctorId, newDate, newStartTime, newEndTime);
        if (!availabilityCheck.success) {
            throw new common_1.BadRequestException(availabilityCheck.message);
        }
        const conflictCheck = await this.slotEngine.checkConflicts(appointment.doctorId, newDate, newStartTime, newEndTime, appointmentId);
        if (conflictCheck.hasConflicts) {
            throw new common_1.BadRequestException('New time slot conflicts with existing appointment');
        }
        await this.slotEngine.releaseSlot(appointment.doctorId, appointment.scheduleId, appointment.startTime);
        const updatedAppointment = await this.db.appointment.update({
            where: { id: appointmentId },
            data: {
                appointmentDate: new Date(newDate),
                startTime: newStartTime,
                endTime: newEndTime,
                duration: this.slotEngine.calculateSlotDuration(newStartTime, newEndTime),
                scheduleId: availabilityCheck.data.scheduleId,
                status: 'PENDING',
                notes: reason ? `${appointment.notes || ''}\nRescheduled: ${reason}` : appointment.notes,
            },
            include: { patient: true },
        });
        await this.slotEngine.lockSlot(appointment.doctorId, availabilityCheck.data.scheduleId, newStartTime, newEndTime);
        return {
            success: true,
            data: updatedAppointment,
            message: 'Appointment rescheduled successfully',
        };
    }
    async cancelAppointment(appointmentId, reason, cancelledBy) {
        const appointment = await this.db.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Appointment is already cancelled');
        }
        if (appointment.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Cannot cancel a completed appointment');
        }
        const updatedAppointment = await this.db.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'CANCELLED',
                notes: reason
                    ? `${appointment.notes || ''}\nCancelled by ${cancelledBy}: ${reason}`
                    : appointment.notes,
            },
            include: { patient: true },
        });
        await this.slotEngine.releaseSlot(appointment.doctorId, appointment.scheduleId, appointment.startTime);
        return {
            success: true,
            data: updatedAppointment,
            message: 'Appointment cancelled successfully',
        };
    }
    async completeAppointment(appointmentId, doctorId, notes) {
        const appointment = await this.db.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.doctorId !== doctorId) {
            throw new common_1.BadRequestException('Unauthorized to complete this appointment');
        }
        if (appointment.status !== 'CONFIRMED') {
            throw new common_1.BadRequestException('Only confirmed appointments can be marked as completed');
        }
        const updatedAppointment = await this.db.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'COMPLETED',
                notes: notes ? `${appointment.notes || ''}\nCompleted: ${notes}` : appointment.notes,
            },
            include: { patient: true },
        });
        return {
            success: true,
            data: updatedAppointment,
            message: 'Appointment marked as completed',
        };
    }
    async getDoctorAppointments(doctorId, startDate, endDate, status) {
        const where = { doctorId };
        if (startDate && endDate) {
            where.appointmentDate = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        if (status) {
            where.status = status;
        }
        const appointments = await this.db.appointment.findMany({
            where,
            include: {
                patient: true,
            },
            orderBy: { appointmentDate: 'asc' },
        });
        return {
            success: true,
            data: appointments,
            message: 'Doctor appointments retrieved successfully',
        };
    }
    async getPatientAppointments(patientId, startDate, endDate, status) {
        const where = { patientId };
        if (startDate && endDate) {
            where.appointmentDate = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        if (status) {
            where.status = status;
        }
        const appointments = await this.db.appointment.findMany({
            where,
            include: {
                patient: true,
            },
            orderBy: { appointmentDate: 'asc' },
        });
        return {
            success: true,
            data: appointments,
            message: 'Patient appointments retrieved successfully',
        };
    }
    async getAppointmentById(appointmentId) {
        const appointment = await this.db.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                patient: true,
            },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        return {
            success: true,
            data: appointment,
            message: 'Appointment retrieved successfully',
        };
    }
    async getUpcomingAppointments(doctorId, limit = 10) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointments = await this.db.appointment.findMany({
            where: {
                doctorId,
                appointmentDate: { gte: today },
                status: { in: ['PENDING', 'CONFIRMED'] },
            },
            include: {
                patient: true,
            },
            orderBy: { appointmentDate: 'asc' },
            take: limit,
        });
        return {
            success: true,
            data: appointments,
            message: 'Upcoming appointments retrieved successfully',
        };
    }
    async getTodaysAppointments(doctorId) {
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        const appointments = await this.db.appointment.findMany({
            where: {
                doctorId,
                appointmentDate: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                status: { not: 'CANCELLED' },
            },
            include: {
                patient: true,
            },
            orderBy: { startTime: 'asc' },
        });
        return {
            success: true,
            data: appointments,
            message: 'Today\'s appointments retrieved successfully',
        };
    }
    async getAppointmentStats(doctorId, startDate, endDate) {
        const start = startDate ? new Date(startDate) : new Date();
        const end = endDate ? new Date(endDate) : new Date();
        if (!startDate) {
            start.setDate(start.getDate() - 30);
        }
        const appointments = await this.db.appointment.findMany({
            where: {
                doctorId,
                appointmentDate: {
                    gte: start,
                    lte: end,
                },
            },
        });
        const stats = {
            total: appointments.length,
            pending: appointments.filter(apt => apt.status === 'PENDING').length,
            confirmed: appointments.filter(apt => apt.status === 'CONFIRMED').length,
            completed: appointments.filter(apt => apt.status === 'COMPLETED').length,
            cancelled: appointments.filter(apt => apt.status === 'CANCELLED').length,
            noShow: appointments.filter(apt => apt.status === 'NO_SHOW').length,
        };
        return {
            success: true,
            data: stats,
            message: 'Appointment statistics retrieved successfully',
        };
    }
    async getPatientAppointmentHistory(patientId, limit = 20) {
        const appointments = await this.db.appointment.findMany({
            where: { patientId },
            include: {
                patient: true,
            },
            orderBy: { appointmentDate: 'desc' },
            take: limit,
        });
        return {
            success: true,
            data: appointments,
            message: 'Patient appointment history retrieved successfully',
        };
    }
};
exports.AppointmentManagementService = AppointmentManagementService;
exports.AppointmentManagementService = AppointmentManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        slot_engine_service_1.SlotEngineService])
], AppointmentManagementService);
//# sourceMappingURL=appointment-management.service.js.map