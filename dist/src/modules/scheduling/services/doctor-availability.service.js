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
exports.DoctorAvailabilityService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const database_service_1 = require("../../auth/services/database.service");
let DoctorAvailabilityService = class DoctorAvailabilityService {
    constructor(db) {
        this.db = db;
    }
    async setRecurringAvailability(doctorId, availabilityData) {
        const doctor = await this.db.user.findUnique({ where: { id: doctorId } });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        let template = await this.db.doctorScheduleTemplate.findFirst({
            where: {
                doctorId,
                name: 'Default Weekly Schedule',
            },
        });
        if (template) {
            template = await this.db.doctorScheduleTemplate.update({
                where: { id: template.id },
                data: {
                    description: 'Recurring weekly availability',
                    isDefault: true,
                    isActive: true,
                },
            });
        }
        else {
            template = await this.db.doctorScheduleTemplate.create({
                data: {
                    doctorId,
                    name: 'Default Weekly Schedule',
                    description: 'Recurring weekly availability',
                    isDefault: true,
                    isActive: true,
                },
            });
        }
        for (const dayOfWeek of availabilityData.workingDays) {
            await this.createTimeSlotForDay(template.id, dayOfWeek, availabilityData);
        }
        return {
            success: true,
            data: template,
            message: 'Recurring availability set successfully',
        };
    }
    async createTimeSlotForDay(templateId, dayOfWeek, availabilityData) {
        const existingSlot = await this.db.doctorTimeSlot.findFirst({
            where: {
                templateId,
                dayOfWeek: dayOfWeek,
            },
        });
        if (existingSlot) {
            await this.db.doctorTimeSlot.update({
                where: { id: existingSlot.id },
                data: {
                    startTime: availabilityData.startTime,
                    endTime: availabilityData.endTime,
                    slotDuration: availabilityData.slotDuration,
                    bufferTime: availabilityData.bufferTime,
                    isAvailable: true,
                },
            });
        }
        else {
            await this.db.doctorTimeSlot.create({
                data: {
                    templateId,
                    dayOfWeek: dayOfWeek,
                    startTime: availabilityData.startTime,
                    endTime: availabilityData.endTime,
                    slotDuration: availabilityData.slotDuration,
                    bufferTime: availabilityData.bufferTime,
                    isAvailable: true,
                    maxBookings: 1,
                },
            });
        }
    }
    async markDateUnavailable(doctorId, date, reason) {
        const exception = await this.db.doctorScheduleException.create({
            data: {
                doctorId,
                date: new Date(date),
                type: 'PERSONAL',
                reason: reason || 'Doctor unavailable',
                isAllDay: true,
            },
        });
        return {
            success: true,
            data: exception,
            message: 'Date marked as unavailable',
        };
    }
    async addCustomHours(doctorId, date, startTime, endTime, reason) {
        const exception = await this.db.doctorScheduleException.create({
            data: {
                doctorId,
                date: new Date(date),
                startTime,
                endTime,
                type: 'CUSTOM_HOURS',
                reason: reason || 'Custom working hours',
                isAllDay: false,
            },
        });
        return {
            success: true,
            data: exception,
            message: 'Custom hours added successfully',
        };
    }
    async getAvailability(doctorId, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const recurringSchedule = await this.db.doctorScheduleTemplate.findFirst({
            where: {
                doctorId,
                isActive: true,
                isDefault: true,
            },
            include: {
                timeSlots: true,
            },
        });
        const exceptions = await this.db.doctorScheduleException.findMany({
            where: {
                doctorId,
                date: {
                    gte: start,
                    lte: end,
                },
            },
        });
        const availability = [];
        const currentDate = new Date(start);
        while (currentDate <= end) {
            const dayOfWeek = this.getDayOfWeek(currentDate);
            const dateStr = currentDate.toISOString().split('T')[0];
            const exception = exceptions.find(ex => ex.date.toISOString().split('T')[0] === dateStr);
            if (exception) {
                const isAvailable = exception.type !== 'PERSONAL';
                availability.push({
                    date: dateStr,
                    isAvailable,
                    startTime: exception.startTime,
                    endTime: exception.endTime,
                    reason: exception.reason,
                    type: 'exception',
                });
            }
            else if (recurringSchedule) {
                const daySlot = recurringSchedule.timeSlots.find(slot => slot.dayOfWeek === dayOfWeek);
                if (daySlot) {
                    availability.push({
                        date: dateStr,
                        isAvailable: daySlot.isAvailable,
                        startTime: daySlot.startTime,
                        endTime: daySlot.endTime,
                        slotDuration: daySlot.slotDuration,
                        bufferTime: daySlot.bufferTime,
                        type: 'recurring',
                    });
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return {
            success: true,
            data: availability,
            message: 'Availability retrieved successfully',
        };
    }
    async getAvailableSlots(doctorId, date) {
        const dateStr = date.split('T')[0];
        const targetDate = new Date(dateStr + 'T00:00:00.000Z');
        console.log(`[BACKEND] getAvailableSlots called:`, { doctorId, date, dateStr, targetDate });
        const persistedSlots = await this.db.doctorDaySlot.findMany({
            where: {
                doctorId,
                date: targetDate,
            },
            orderBy: {
                startTime: 'asc',
            },
        });
        console.log(`[BACKEND] Found ${persistedSlots.length} persisted slots for date ${dateStr}`);
        if (persistedSlots.length > 0) {
            const existingAppointments = await this.db.appointment.findMany({
                where: {
                    doctorId,
                    appointmentDate: targetDate,
                    status: { not: 'CANCELLED' },
                },
            });
            const availableSlots = persistedSlots.map(slot => {
                const isBooked = existingAppointments.some(apt => apt.startTime === slot.startTime ||
                    (apt.appointmentDate && new Date(apt.appointmentDate).toDateString() === targetDate.toDateString()));
                return {
                    id: slot.id,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    date: slot.date.toISOString().split('T')[0],
                    isAvailable: slot.isAvailable && !isBooked,
                    isBooked: isBooked || slot.isBooked,
                    status: (isBooked || slot.isBooked) ? 'booked' : 'available',
                    maxBookings: slot.slotCapacity ?? 1,
                    currentBookings: slot.currentBookings ?? 0,
                };
            });
            return { success: true, data: availableSlots, message: 'Available slots retrieved successfully' };
        }
        const dayOfWeek = this.getDayOfWeek(targetDate);
        const savedSchedule = await this.db.doctorSchedule.findFirst({
            where: { doctorId, date: targetDate, isAvailable: true },
        });
        if (savedSchedule) {
            const slots = this.generateTimeSlots({
                startTime: savedSchedule.startTime,
                endTime: savedSchedule.endTime,
                slotDuration: savedSchedule.slotDuration,
                bufferTime: savedSchedule.bufferTime,
            }, date);
            const existingAppointments = await this.db.appointment.findMany({
                where: {
                    doctorId,
                    appointmentDate: targetDate,
                    status: { not: 'CANCELLED' },
                },
            });
            const availableSlots = slots.map(slot => ({
                ...slot,
                isAvailable: !existingAppointments.some(apt => apt.startTime === slot.startTime),
                isBooked: existingAppointments.some(apt => apt.startTime === slot.startTime),
            }));
            return { success: true, data: availableSlots, message: 'Available slots retrieved successfully' };
        }
        const exception = await this.db.doctorScheduleException.findFirst({
            where: {
                doctorId,
                date: targetDate,
            },
        });
        let baseSchedule;
        if (exception) {
            if (exception.type === 'PERSONAL') {
                return {
                    success: true,
                    data: [],
                    message: 'Doctor is unavailable on this date',
                };
            }
            baseSchedule = {
                startTime: exception.startTime || '09:00',
                endTime: exception.endTime || '17:00',
                slotDuration: 30,
                bufferTime: 10,
            };
        }
        else {
            const recurringSchedule = await this.db.doctorScheduleTemplate.findFirst({
                where: {
                    doctorId,
                    isActive: true,
                    isDefault: true,
                },
                include: {
                    timeSlots: {
                        where: {
                            dayOfWeek: dayOfWeek,
                        },
                    },
                },
            });
            if (!recurringSchedule || recurringSchedule.timeSlots.length === 0) {
                return {
                    success: true,
                    data: [],
                    message: 'No schedule found for this day',
                };
            }
            const daySlot = recurringSchedule.timeSlots[0];
            baseSchedule = {
                startTime: daySlot.startTime,
                endTime: daySlot.endTime,
                slotDuration: daySlot.slotDuration,
                bufferTime: daySlot.bufferTime,
            };
        }
        const slots = this.generateTimeSlots(baseSchedule, date);
        const existingAppointments = await this.db.appointment.findMany({
            where: {
                doctorId,
                appointmentDate: targetDate,
                status: {
                    not: 'CANCELLED',
                },
            },
        });
        const availableSlots = slots.map(slot => {
            const isBooked = existingAppointments.some(apt => apt.startTime === slot.startTime);
            return {
                ...slot,
                isAvailable: !isBooked,
                isBooked,
            };
        });
        return {
            success: true,
            data: availableSlots,
            message: 'Available slots retrieved successfully',
        };
    }
    generateTimeSlots(schedule, date) {
        const slots = [];
        const startTime = new Date(`${date}T${schedule.startTime}`);
        const endTime = new Date(`${date}T${schedule.endTime}`);
        let currentTime = new Date(startTime);
        while (currentTime < endTime) {
            const slotEnd = new Date(currentTime.getTime() + schedule.slotDuration * 60000);
            if (slotEnd <= endTime) {
                slots.push({
                    id: `${date}-${currentTime.toTimeString().split(' ')[0]}`,
                    startTime: currentTime.toTimeString().split(' ')[0].substring(0, 5),
                    endTime: slotEnd.toTimeString().split(' ')[0].substring(0, 5),
                    isAvailable: true,
                    isBooked: false,
                });
            }
            currentTime = new Date(currentTime.getTime() + (schedule.slotDuration + schedule.bufferTime) * 60000);
        }
        return slots;
    }
    getDayOfWeek(date) {
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return days[date.getDay()];
    }
    async generateDailySlots() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const doctors = await this.db.user.findMany({
            where: {
                role: 'DOCTOR',
            },
        });
        for (const doctor of doctors) {
            await this.generateSlotsForDoctor(doctor.id, tomorrow.toISOString().split('T')[0]);
        }
        console.log('Daily slot generation completed');
    }
    async generateSlotsForDoctor(doctorId, date) {
        const targetDate = new Date(date);
        const dayOfWeek = this.getDayOfWeek(targetDate);
        const existingSchedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId,
                date: targetDate,
            },
        });
        if (existingSchedule) {
            return;
        }
        const recurringSchedule = await this.db.doctorScheduleTemplate.findFirst({
            where: {
                doctorId,
                isActive: true,
                isDefault: true,
            },
            include: {
                timeSlots: {
                    where: {
                        dayOfWeek: dayOfWeek,
                    },
                },
            },
        });
        if (!recurringSchedule || recurringSchedule.timeSlots.length === 0) {
            return;
        }
        const exception = await this.db.doctorScheduleException.findFirst({
            where: {
                doctorId,
                date: targetDate,
            },
        });
        if (exception && exception.type === 'PERSONAL') {
            return;
        }
        const profile = await this.db.doctorProfile.findFirst({
            where: { doctorId },
        });
        if (!profile) {
            return;
        }
        const daySlot = recurringSchedule.timeSlots[0];
        const scheduleData = exception ? {
            startTime: exception.startTime || daySlot.startTime,
            endTime: exception.endTime || daySlot.endTime,
            slotDuration: daySlot.slotDuration,
            bufferTime: daySlot.bufferTime,
        } : {
            startTime: daySlot.startTime,
            endTime: daySlot.endTime,
            slotDuration: daySlot.slotDuration,
            bufferTime: daySlot.bufferTime,
        };
        await this.db.doctorSchedule.create({
            data: {
                doctorId,
                profileId: profile.id,
                templateId: recurringSchedule.id,
                dayOfWeek: dayOfWeek,
                startTime: scheduleData.startTime,
                endTime: scheduleData.endTime,
                date: targetDate,
                slotDuration: scheduleData.slotDuration,
                bufferTime: scheduleData.bufferTime,
                maxBookings: 1,
                location: 'Main Clinic',
                serviceType: 'CONSULTATION',
                isAvailable: true,
            },
        });
    }
    async getWorkingHours(doctorId, date) {
        const targetDate = new Date(date);
        const dayOfWeek = this.getDayOfWeek(targetDate);
        const exception = await this.db.doctorScheduleException.findFirst({
            where: {
                doctorId,
                date: targetDate,
            },
        });
        if (exception) {
            const isAvailable = exception.type !== 'PERSONAL';
            return {
                startTime: exception.startTime || '09:00',
                endTime: exception.endTime || '17:00',
                isAvailable,
                reason: exception.reason,
                type: 'exception',
            };
        }
        const recurringSchedule = await this.db.doctorScheduleTemplate.findFirst({
            where: {
                doctorId,
                isActive: true,
                isDefault: true,
            },
            include: {
                timeSlots: {
                    where: {
                        dayOfWeek: dayOfWeek,
                    },
                },
            },
        });
        if (!recurringSchedule || recurringSchedule.timeSlots.length === 0) {
            return {
                startTime: null,
                endTime: null,
                isAvailable: false,
                reason: 'No schedule for this day',
                type: 'no_schedule',
            };
        }
        const daySlot = recurringSchedule.timeSlots[0];
        return {
            startTime: daySlot.startTime,
            endTime: daySlot.endTime,
            isAvailable: daySlot.isAvailable,
            reason: null,
            type: 'recurring',
        };
    }
};
exports.DoctorAvailabilityService = DoctorAvailabilityService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DoctorAvailabilityService.prototype, "generateDailySlots", null);
exports.DoctorAvailabilityService = DoctorAvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DoctorAvailabilityService);
//# sourceMappingURL=doctor-availability.service.js.map