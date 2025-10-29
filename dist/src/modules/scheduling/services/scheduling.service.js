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
exports.SchedulingService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../auth/services/database.service");
const notification_service_1 = require("../../notifications/services/notification.service");
const appointment_management_service_1 = require("./appointment-management.service");
const doctor_availability_service_1 = require("./doctor-availability.service");
const slot_engine_service_1 = require("./slot-engine.service");
let SchedulingService = class SchedulingService {
    constructor(db, doctorAvailability, slotEngine, appointmentManagement, notificationService) {
        this.db = db;
        this.doctorAvailability = doctorAvailability;
        this.slotEngine = slotEngine;
        this.appointmentManagement = appointmentManagement;
        this.notificationService = notificationService;
    }
    async createScheduleTemplate(doctorId, templateData) {
        const doctor = await this.db.user.findUnique({ where: { id: doctorId } });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const template = await this.db.doctorScheduleTemplate.create({
            data: {
                doctorId,
                ...templateData,
            },
            include: {
                timeSlots: true,
            },
        });
        return {
            success: true,
            data: template,
            message: 'Schedule template created successfully',
        };
    }
    async getScheduleTemplates(doctorId) {
        const templates = await this.db.doctorScheduleTemplate.findMany({
            where: { doctorId },
            include: {
                timeSlots: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return {
            success: true,
            data: templates,
            message: 'Schedule templates retrieved successfully',
        };
    }
    async updateScheduleTemplate(templateId, updateData) {
        const template = await this.db.doctorScheduleTemplate.findUnique({ where: { id: templateId } });
        if (!template) {
            throw new common_1.NotFoundException('Schedule template not found');
        }
        const updatedTemplate = await this.db.doctorScheduleTemplate.update({
            where: { id: templateId },
            data: updateData,
            include: {
                timeSlots: true,
            },
        });
        return {
            success: true,
            data: updatedTemplate,
            message: 'Schedule template updated successfully',
        };
    }
    async deleteScheduleTemplate(templateId) {
        const template = await this.db.doctorScheduleTemplate.findUnique({ where: { id: templateId } });
        if (!template) {
            throw new common_1.NotFoundException('Schedule template not found');
        }
        await this.db.doctorScheduleTemplate.delete({ where: { id: templateId } });
        return {
            success: true,
            message: 'Schedule template deleted successfully',
        };
    }
    async createTimeSlot(templateId, slotData) {
        const template = await this.db.doctorScheduleTemplate.findUnique({ where: { id: templateId } });
        if (!template) {
            throw new common_1.NotFoundException('Schedule template not found');
        }
        const timeSlot = await this.db.doctorTimeSlot.create({
            data: {
                templateId,
                ...slotData,
            },
        });
        return {
            success: true,
            data: timeSlot,
            message: 'Time slot created successfully',
        };
    }
    async updateTimeSlot(slotId, updateData) {
        const timeSlot = await this.db.doctorTimeSlot.findUnique({ where: { id: slotId } });
        if (!timeSlot) {
            throw new common_1.NotFoundException('Time slot not found');
        }
        const updatedSlot = await this.db.doctorTimeSlot.update({
            where: { id: slotId },
            data: updateData,
        });
        return {
            success: true,
            data: updatedSlot,
            message: 'Time slot updated successfully',
        };
    }
    async deleteTimeSlot(slotId) {
        const timeSlot = await this.db.doctorTimeSlot.findUnique({ where: { id: slotId } });
        if (!timeSlot) {
            throw new common_1.NotFoundException('Time slot not found');
        }
        await this.db.doctorTimeSlot.delete({ where: { id: slotId } });
        return {
            success: true,
            message: 'Time slot deleted successfully',
        };
    }
    async generateSchedule(doctorId, templateId, date) {
        const template = await this.db.doctorScheduleTemplate.findUnique({
            where: { id: templateId },
        });
        if (!template) {
            throw new common_1.NotFoundException('Schedule template not found');
        }
        const existingSchedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId,
                date: new Date(date),
            },
        });
        if (existingSchedule) {
            throw new common_1.BadRequestException('Schedule already exists for this date');
        }
        const profile = await this.db.doctorProfile.findFirst({
            where: { doctorId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        const schedule = await this.db.doctorSchedule.create({
            data: {
                doctorId,
                profileId: profile.id,
                templateId,
                dayOfWeek: this.getDayOfWeek(new Date(date)),
                startTime: '09:00',
                endTime: '17:00',
                date: new Date(date),
                slotDuration: 30,
                bufferTime: 10,
                maxBookings: 1,
                location: 'Main Clinic',
                serviceType: 'CONSULTATION',
                isAvailable: true,
            },
        });
        return {
            success: true,
            data: schedule,
            message: 'Schedule generated successfully',
        };
    }
    getDayOfWeek(date) {
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return days[date.getDay()];
    }
    generateTimeSlotsFromTemplate(template, date) {
        const slots = [];
        const startTime = new Date(`${date}T${template.startTime}`);
        const endTime = new Date(`${date}T${template.endTime}`);
        let currentTime = new Date(startTime);
        while (currentTime < endTime) {
            const slotEnd = new Date(currentTime.getTime() + template.slotDuration * 60000);
            slots.push({
                startTime: currentTime.toTimeString().split(' ')[0].substring(0, 5),
                endTime: slotEnd.toTimeString().split(' ')[0].substring(0, 5),
                isAvailable: true,
            });
            currentTime = new Date(currentTime.getTime() + (template.slotDuration + template.bufferTime) * 60000);
        }
        return slots;
    }
    async getAvailability(doctorId, date) {
        const schedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId,
                date: new Date(date),
                isAvailable: true,
            },
            include: {
                template: true,
            },
        });
        if (!schedule) {
            return {
                success: true,
                data: {
                    isAvailable: false,
                    date,
                },
                message: 'No schedule found for this date',
            };
        }
        const timeSlots = this.generateTimeSlotsForSchedule(schedule);
        return {
            success: true,
            data: {
                isAvailable: true,
                template: schedule.template,
                timeSlots,
                schedule,
            },
            message: 'Availability retrieved successfully',
        };
    }
    generateTimeSlotsForSchedule(schedule) {
        const slots = [];
        const startTime = new Date(`${schedule.date.toISOString().split('T')[0]}T${schedule.startTime}`);
        const endTime = new Date(`${schedule.date.toISOString().split('T')[0]}T${schedule.endTime}`);
        let currentTime = new Date(startTime);
        while (currentTime < endTime) {
            const slotEnd = new Date(currentTime.getTime() + schedule.slotDuration * 60000);
            slots.push({
                id: `${schedule.id}-${currentTime.toTimeString().split(' ')[0]}`,
                startTime: currentTime.toTimeString().split(' ')[0].substring(0, 5),
                endTime: slotEnd.toTimeString().split(' ')[0].substring(0, 5),
                isAvailable: true,
                isBooked: false,
            });
            currentTime = new Date(currentTime.getTime() + (schedule.slotDuration + schedule.bufferTime) * 60000);
        }
        return slots;
    }
    async updateAvailability(doctorId, date, timeSlots) {
        const scheduleDate = new Date(date);
        let schedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId,
                date: scheduleDate,
            },
        });
        if (!schedule) {
            let profile = await this.db.doctorProfile.findUnique({
                where: { doctorId },
            });
            if (!profile) {
                profile = await this.db.doctorProfile.create({
                    data: {
                        doctorId,
                        specialties: ['General Practice'],
                        isAcceptingNewPatients: true,
                    },
                });
            }
            let template = await this.db.doctorScheduleTemplate.findFirst({
                where: { doctorId, isDefault: true },
            });
            if (!template) {
                template = await this.db.doctorScheduleTemplate.create({
                    data: {
                        doctorId,
                        name: 'Default Availability',
                        isDefault: true,
                        isActive: true,
                    },
                });
            }
            const dayOfWeekMap = {
                0: 'SUNDAY',
                1: 'MONDAY',
                2: 'TUESDAY',
                3: 'WEDNESDAY',
                4: 'THURSDAY',
                5: 'FRIDAY',
                6: 'SATURDAY',
            };
            const dayOfWeek = dayOfWeekMap[scheduleDate.getDay()];
            const sortedSlots = timeSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
            const startTime = sortedSlots[0]?.startTime || '09:00';
            const endTime = sortedSlots[sortedSlots.length - 1]?.endTime || '17:00';
            const slotDuration = 30;
            const bufferTime = 5;
            schedule = await this.db.doctorSchedule.create({
                data: {
                    doctorId,
                    profileId: profile.id,
                    templateId: template.id,
                    dayOfWeek,
                    date: scheduleDate,
                    startTime,
                    endTime,
                    slotDuration,
                    bufferTime,
                    isAvailable: timeSlots.some(slot => slot.isAvailable),
                    notes: `Availability created for ${date}`,
                },
            });
        }
        else {
            const availableSlots = timeSlots.filter(slot => slot.isAvailable).length;
            const totalSlots = timeSlots.length;
            await this.db.doctorSchedule.update({
                where: { id: schedule.id },
                data: {
                    isAvailable: availableSlots > 0,
                    notes: `Updated availability: ${availableSlots}/${totalSlots} slots available`,
                },
            });
        }
        return {
            success: true,
            data: {
                schedule,
                timeSlots,
            },
            message: 'Availability updated successfully',
        };
    }
    async createException(doctorId, exceptionData) {
        const exception = await this.db.doctorScheduleException.create({
            data: {
                doctorId,
                ...exceptionData,
            },
        });
        return {
            success: true,
            data: exception,
            message: 'Schedule exception created successfully',
        };
    }
    async getExceptions(doctorId, startDate, endDate) {
        const where = { doctorId };
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        const exceptions = await this.db.doctorScheduleException.findMany({
            where,
            orderBy: { date: 'desc' },
        });
        return {
            success: true,
            data: exceptions,
            message: 'Schedule exceptions retrieved successfully',
        };
    }
    async deleteException(exceptionId) {
        const exception = await this.db.doctorScheduleException.findUnique({ where: { id: exceptionId } });
        if (!exception) {
            throw new common_1.NotFoundException('Schedule exception not found');
        }
        await this.db.doctorScheduleException.delete({ where: { id: exceptionId } });
        return {
            success: true,
            message: 'Schedule exception deleted successfully',
        };
    }
    async bookAppointment(appointmentData) {
        const schedule = await this.db.doctorSchedule.findFirst({
            where: {
                id: appointmentData.scheduleId,
                isAvailable: true,
            },
        });
        if (!schedule) {
            throw new common_1.BadRequestException('Schedule is not available');
        }
        const existingAppointment = await this.db.appointment.findFirst({
            where: {
                doctorId: appointmentData.doctorId,
                appointmentDate: new Date(appointmentData.date),
                startTime: appointmentData.startTime,
                status: { not: 'CANCELLED' },
            },
        });
        if (existingAppointment) {
            throw new common_1.BadRequestException('Time slot is already booked');
        }
        const appointment = await this.db.appointment.create({
            data: {
                patientId: appointmentData.patientId,
                doctorId: appointmentData.doctorId,
                scheduleId: appointmentData.scheduleId,
                appointmentDate: new Date(appointmentData.date),
                startTime: appointmentData.startTime,
                endTime: appointmentData.endTime,
                duration: 30,
                type: appointmentData.type,
                status: 'SCHEDULED',
                notes: appointmentData.notes,
            },
            include: {
                patient: true,
            },
        });
        return {
            success: true,
            data: appointment,
            message: 'Appointment booked successfully',
        };
    }
    async getAppointments(doctorId, startDate, endDate, status, limit) {
        const where = { doctorId };
        if (startDate && endDate) {
            where.appointmentDate = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        if (status) {
            const statusArray = status.includes(',') ? status.split(',') : [status];
            where.status = { in: statusArray };
        }
        const appointments = await this.db.appointment.findMany({
            where,
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                    },
                },
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: { appointmentDate: 'desc' },
            ...(limit && { take: limit }),
        });
        return {
            success: true,
            data: appointments,
            message: 'Appointments retrieved successfully',
        };
    }
    async updateAppointment(appointmentId, updateData) {
        const appointment = await this.db.appointment.findUnique({
            where: { id: appointmentId },
            include: { patient: true, doctor: true },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (updateData.status === 'CONFIRMED' && appointment.status === 'PENDING') {
            const appointmentDate = updateData.date
                ? new Date(updateData.date)
                : appointment.appointmentDate;
            const startTime = updateData.startTime || appointment.startTime;
            const endTime = updateData.endTime || appointment.endTime;
            const availabilityCheck = await this.slotEngine.checkSlotAvailability(appointment.doctorId, appointmentDate.toISOString().split('T')[0], startTime, endTime);
            if (!availabilityCheck.success) {
                throw new common_1.BadRequestException('Time slot is no longer available. Please choose another time.');
            }
            const conflicts = await this.db.appointment.findFirst({
                where: {
                    doctorId: appointment.doctorId,
                    appointmentDate,
                    startTime,
                    id: { not: appointmentId },
                    status: { notIn: ['CANCELLED', 'NO_SHOW'] },
                },
            });
            if (conflicts) {
                throw new common_1.BadRequestException('This time slot conflicts with another appointment');
            }
            const updatedAppointment = await this.db.appointment.update({
                where: { id: appointmentId },
                data: {
                    status: 'CONFIRMED',
                    confirmedAt: new Date(),
                    requiresConfirmation: false,
                    ...(updateData.date && { appointmentDate: new Date(updateData.date) }),
                    ...(updateData.startTime && { startTime: updateData.startTime }),
                    ...(updateData.endTime && { endTime: updateData.endTime }),
                    ...(updateData.notes && { notes: updateData.notes }),
                },
                include: {
                    patient: true,
                    doctor: true,
                },
            });
            try {
                await this.notificationService.notifyAppointmentScheduled(updatedAppointment);
            }
            catch (error) {
                console.error('Failed to send notification:', error);
            }
            return {
                success: true,
                data: updatedAppointment,
                message: 'Appointment scheduled successfully. Patient has been notified.',
            };
        }
        const updatedAppointment = await this.db.appointment.update({
            where: { id: appointmentId },
            data: updateData,
            include: {
                patient: true,
                doctor: true,
            },
        });
        return {
            success: true,
            data: updatedAppointment,
            message: 'Appointment updated successfully',
        };
    }
    async cancelAppointment(appointmentId) {
        const appointment = await this.db.appointment.findUnique({ where: { id: appointmentId } });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        const updatedAppointment = await this.db.appointment.update({
            where: { id: appointmentId },
            data: { status: 'CANCELLED' },
        });
        return {
            success: true,
            data: updatedAppointment,
            message: 'Appointment cancelled successfully',
        };
    }
};
exports.SchedulingService = SchedulingService;
exports.SchedulingService = SchedulingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        doctor_availability_service_1.DoctorAvailabilityService,
        slot_engine_service_1.SlotEngineService,
        appointment_management_service_1.AppointmentManagementService,
        notification_service_1.NotificationService])
], SchedulingService);
//# sourceMappingURL=scheduling.service.js.map