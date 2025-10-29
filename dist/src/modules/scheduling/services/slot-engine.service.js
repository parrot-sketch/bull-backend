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
exports.SlotEngineService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const database_service_1 = require("../../auth/services/database.service");
let SlotEngineService = class SlotEngineService {
    constructor(db) {
        this.db = db;
    }
    async generateSlotsForDate(doctorId, date) {
        const targetDate = new Date(date);
        const dayOfWeek = this.getDayOfWeek(targetDate);
        const schedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId,
                date: targetDate,
                isAvailable: true,
            },
        });
        if (!schedule) {
            return {
                success: true,
                data: [],
                message: 'No schedule found for this date',
            };
        }
        const slots = this.generateTimeSlotsFromSchedule(schedule, date);
        const appointments = await this.db.appointment.findMany({
            where: {
                doctorId,
                appointmentDate: targetDate,
                status: {
                    not: 'CANCELLED',
                },
            },
        });
        const processedSlots = slots.map(slot => {
            const isBooked = appointments.some(apt => apt.startTime === slot.startTime);
            return {
                ...slot,
                isAvailable: !isBooked,
                isBooked,
                status: isBooked ? 'BOOKED' : 'AVAILABLE',
            };
        });
        return {
            success: true,
            data: processedSlots,
            message: 'Slots generated successfully',
        };
    }
    generateTimeSlotsFromSchedule(schedule, date) {
        const slots = [];
        const startTime = new Date(`${date}T${schedule.startTime}`);
        const endTime = new Date(`${date}T${schedule.endTime}`);
        let currentTime = new Date(startTime);
        while (currentTime < endTime) {
            const slotEnd = new Date(currentTime.getTime() + schedule.slotDuration * 60000);
            if (slotEnd <= endTime) {
                slots.push({
                    id: `${schedule.id}-${currentTime.toTimeString().split(' ')[0]}`,
                    scheduleId: schedule.id,
                    startTime: currentTime.toTimeString().split(' ')[0].substring(0, 5),
                    endTime: slotEnd.toTimeString().split(' ')[0].substring(0, 5),
                    duration: schedule.slotDuration,
                    bufferTime: schedule.bufferTime,
                    location: schedule.location,
                    serviceType: schedule.serviceType,
                    isAvailable: true,
                    isBooked: false,
                    status: 'AVAILABLE',
                });
            }
            currentTime = new Date(currentTime.getTime() + (schedule.slotDuration + schedule.bufferTime) * 60000);
        }
        return slots;
    }
    async checkSlotAvailability(doctorId, date, startTime, endTime) {
        const targetDate = new Date(date);
        const conflictingAppointment = await this.db.appointment.findFirst({
            where: {
                doctorId,
                appointmentDate: targetDate,
                startTime,
                status: {
                    not: 'CANCELLED',
                },
            },
        });
        if (conflictingAppointment) {
            throw new common_1.BadRequestException('Time slot is already booked');
        }
        const schedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId,
                date: targetDate,
                isAvailable: true,
                startTime: { lte: startTime },
                endTime: { gte: endTime },
            },
        });
        if (!schedule) {
            throw new common_1.BadRequestException('Doctor is not available at this time');
        }
        return {
            success: true,
            data: {
                isAvailable: true,
                scheduleId: schedule.id,
            },
            message: 'Slot is available',
        };
    }
    async lockSlot(doctorId, scheduleId, startTime, endTime) {
        return {
            success: true,
            message: 'Slot locked successfully',
        };
    }
    async releaseSlot(doctorId, scheduleId, startTime) {
        return {
            success: true,
            message: 'Slot released successfully',
        };
    }
    async generateSlotsForDateRange(doctorId, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const allSlots = [];
        const currentDate = new Date(start);
        while (currentDate <= end) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const slots = await this.generateSlotsForDate(doctorId, dateStr);
            if (slots.success && slots.data.length > 0) {
                allSlots.push({
                    date: dateStr,
                    slots: slots.data,
                });
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return {
            success: true,
            data: allSlots,
            message: 'Slots generated for date range',
        };
    }
    async getAvailableSlotsInRange(doctorId, date, startTime, endTime) {
        const slots = await this.generateSlotsForDate(doctorId, date);
        if (!slots.success) {
            return slots;
        }
        let filteredSlots = slots.data.filter(slot => slot.isAvailable);
        if (startTime) {
            filteredSlots = filteredSlots.filter(slot => slot.startTime >= startTime);
        }
        if (endTime) {
            filteredSlots = filteredSlots.filter(slot => slot.endTime <= endTime);
        }
        return {
            success: true,
            data: filteredSlots,
            message: 'Available slots retrieved successfully',
        };
    }
    async updateSlotStatus(slotId, status) {
        return {
            success: true,
            message: `Slot status updated to ${status}`,
        };
    }
    async markExpiredSlots() {
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
        const expiredSchedules = await this.db.doctorSchedule.findMany({
            where: {
                date: {
                    gte: new Date(now.toISOString().split('T')[0]),
                    lt: new Date(now.toISOString().split('T')[0] + 'T23:59:59'),
                },
                endTime: { lt: currentTime },
                isAvailable: true,
            },
        });
        for (const schedule of expiredSchedules) {
            await this.db.doctorSchedule.update({
                where: { id: schedule.id },
                data: { isAvailable: false },
            });
        }
        console.log(`Marked ${expiredSchedules.length} expired schedules as unavailable`);
    }
    async checkConflicts(doctorId, date, startTime, endTime, excludeAppointmentId) {
        const targetDate = new Date(date);
        const whereClause = {
            doctorId,
            appointmentDate: targetDate,
            status: { not: 'CANCELLED' },
        };
        if (excludeAppointmentId) {
            whereClause.id = { not: excludeAppointmentId };
        }
        const conflicts = await this.db.appointment.findMany({
            where: whereClause,
        });
        const overlappingAppointments = conflicts.filter(apt => {
            return ((startTime >= apt.startTime && startTime < apt.endTime) ||
                (endTime > apt.startTime && endTime <= apt.endTime) ||
                (startTime <= apt.startTime && endTime >= apt.endTime));
        });
        return {
            hasConflicts: overlappingAppointments.length > 0,
            conflicts: overlappingAppointments,
            message: overlappingAppointments.length > 0
                ? 'Scheduling conflicts detected'
                : 'No conflicts found',
        };
    }
    async validateSlotDuration(doctorId, duration) {
        const schedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId,
                isAvailable: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!schedule) {
            return {
                isValid: true,
                message: 'No existing schedule to validate against',
            };
        }
        const isValid = duration >= schedule.slotDuration;
        return {
            isValid,
            message: isValid
                ? 'Slot duration is valid'
                : `Slot duration must be at least ${schedule.slotDuration} minutes`,
        };
    }
    getDayOfWeek(date) {
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return days[date.getDay()];
    }
    calculateSlotDuration(startTime, endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        return (end.getTime() - start.getTime()) / (1000 * 60);
    }
    async getNextAvailableSlot(doctorId, fromDate) {
        const startDate = fromDate || new Date().toISOString().split('T')[0];
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        const slots = await this.generateSlotsForDateRange(doctorId, startDate, endDate.toISOString().split('T')[0]);
        if (!slots.success) {
            return slots;
        }
        for (const daySlots of slots.data) {
            const availableSlot = daySlots.slots.find(slot => slot.isAvailable);
            if (availableSlot) {
                return {
                    success: true,
                    data: {
                        date: daySlots.date,
                        slot: availableSlot,
                    },
                    message: 'Next available slot found',
                };
            }
        }
        return {
            success: false,
            data: null,
            message: 'No available slots found in the next 30 days',
        };
    }
};
exports.SlotEngineService = SlotEngineService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SlotEngineService.prototype, "markExpiredSlots", null);
exports.SlotEngineService = SlotEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], SlotEngineService);
//# sourceMappingURL=slot-engine.service.js.map