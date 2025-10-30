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
var PatientBookingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientBookingService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../auth/services/database.service");
const notification_service_1 = require("../../notifications/services/notification.service");
let PatientBookingService = PatientBookingService_1 = class PatientBookingService {
    constructor(db, notificationService) {
        this.db = db;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(PatientBookingService_1.name);
    }
    async findDoctors(filters) {
        const where = {
            role: 'DOCTOR',
            isActive: true,
            doctorProfile: filters?.isAcceptingNewPatients
                ? { isAcceptingNewPatients: filters.isAcceptingNewPatients }
                : undefined,
        };
        if (filters?.specialty) {
            where.department = filters.specialty;
        }
        if (filters?.location) {
            where.city = filters.location;
        }
        const doctors = await this.db.user.findMany({
            where,
            include: {
                doctorProfile: {
                    include: {
                        services: true,
                        insurances: true,
                        consultationFees: true,
                    },
                },
            },
            take: 50,
        });
        return {
            success: true,
            data: doctors.map(doc => this.mapDoctorForBooking(doc)),
            message: 'Doctors retrieved successfully',
        };
    }
    async getDoctorDetails(doctorId) {
        const doctor = await this.db.user.findUnique({
            where: { id: doctorId, role: 'DOCTOR' },
            include: {
                doctorProfile: {
                    include: {
                        services: true,
                        insurances: true,
                        consultationFees: true,
                        schedules: {
                            where: {
                                isAvailable: true,
                                date: {
                                    gte: new Date(),
                                },
                            },
                            take: 30,
                        },
                    },
                },
            },
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        return {
            success: true,
            data: this.mapDoctorForBooking(doctor),
            message: 'Doctor details retrieved successfully',
        };
    }
    async getDoctorAvailability(doctorId, date) {
        const targetDate = new Date(date);
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
                data: {
                    isAvailable: false,
                    date,
                    slots: [],
                    message: 'No availability for this date',
                },
                message: 'No schedule found for this date',
            };
        }
        const appointments = await this.db.appointment.findMany({
            where: {
                doctorId,
                appointmentDate: targetDate,
                status: {
                    notIn: ['CANCELLED', 'NO_SHOW'],
                },
            },
        });
        const slots = this.generateAvailableSlots(schedule, appointments);
        return {
            success: true,
            data: {
                isAvailable: true,
                date,
                schedule,
                slots,
            },
            message: 'Availability retrieved successfully',
        };
    }
    async bookAppointment(patientId, bookingData) {
        const doctor = await this.db.user.findUnique({
            where: { id: bookingData.doctorId, role: 'DOCTOR' },
        });
        if (!doctor || !doctor.isActive) {
            throw new common_1.NotFoundException('Doctor not found or inactive');
        }
        const appointmentDate = new Date(bookingData.date);
        const availability = await this.getDoctorAvailability(bookingData.doctorId, bookingData.date);
        if (!availability.data.isAvailable) {
            throw new common_1.BadRequestException('No availability for this date');
        }
        const slotAvailable = availability.data.slots.find(slot => slot.time === bookingData.startTime && slot.isAvailable);
        if (!slotAvailable) {
            throw new common_1.BadRequestException('Time slot is no longer available');
        }
        const slotStart = new Date(`${bookingData.date}T${bookingData.startTime}:00`);
        if (slotStart.getTime() < Date.now()) {
            throw new common_1.BadRequestException('Cannot book a past time slot');
        }
        const existingAppointment = await this.db.appointment.findFirst({
            where: {
                doctorId: bookingData.doctorId,
                appointmentDate,
                startTime: bookingData.startTime,
                status: {
                    notIn: ['CANCELLED', 'NO_SHOW'],
                },
            },
        });
        if (existingAppointment) {
            throw new common_1.BadRequestException('Time slot is already booked');
        }
        const schedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId: bookingData.doctorId,
                date: appointmentDate,
            },
        });
        const appointment = await this.db.appointment.create({
            data: {
                doctorId: bookingData.doctorId,
                patientId,
                scheduleId: schedule?.id,
                appointmentDate,
                startTime: bookingData.startTime,
                endTime: bookingData.endTime,
                duration: this.calculateDuration(bookingData.startTime, bookingData.endTime),
                type: bookingData.type || 'CONSULTATION',
                status: 'PENDING',
                reasonForVisit: bookingData.reasonForVisit,
                symptoms: bookingData.symptoms,
                requiresConfirmation: true,
                bookingRequestedAt: new Date(),
            },
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        doctorProfile: true,
                    },
                },
            },
        });
        try {
            await this.notificationService.notifyAppointmentRequested(appointment);
            this.logger.log(`Notification sent to doctor ${bookingData.doctorId} for appointment ${appointment.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to send notification: ${error.message}`, error.stack);
        }
        return {
            success: true,
            data: appointment,
            message: 'Appointment booking requested successfully. Awaiting doctor confirmation.',
        };
    }
    async getPatientAppointments(patientId, filters) {
        const where = { patientId };
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.startDate || filters?.endDate) {
            where.appointmentDate = {};
            if (filters?.startDate) {
                where.appointmentDate.gte = new Date(filters.startDate);
            }
            if (filters?.endDate) {
                where.appointmentDate.lte = new Date(filters.endDate);
            }
        }
        const appointments = await this.db.appointment.findMany({
            where,
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        specialization: true,
                        doctorProfile: {
                            select: {
                                specialties: true,
                                practiceName: true,
                                practiceAddress: true,
                                practiceCity: true,
                                practicePhone: true,
                            },
                        },
                    },
                },
            },
            orderBy: { appointmentDate: 'desc' },
        });
        return {
            success: true,
            data: appointments,
            message: 'Appointments retrieved successfully',
        };
    }
    async cancelAppointment(patientId, appointmentId, reason) {
        const appointment = await this.db.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.patientId !== patientId) {
            throw new common_1.BadRequestException('Unauthorized to cancel this appointment');
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
                cancelledAt: new Date(),
                cancelledBy: 'PATIENT',
                cancellationReason: reason,
            },
        });
        return {
            success: true,
            data: updatedAppointment,
            message: 'Appointment cancelled successfully',
        };
    }
    mapDoctorForBooking(doctor) {
        const fees = Array.isArray(doctor?.doctorProfile?.consultationFees)
            ? doctor.doctorProfile.consultationFees
            : [];
        const activeFees = fees.filter((f) => f?.isActive !== false);
        const mostRecent = activeFees.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())[0];
        const normalizedAmount = mostRecent?.amount ?? mostRecent?.fee ?? mostRecent?.baseFee ?? null;
        return {
            id: doctor.id,
            name: `${doctor.firstName} ${doctor.lastName}`,
            email: doctor.email,
            phoneNumber: doctor.phoneNumber,
            avatar: doctor.avatar,
            department: doctor.department,
            specialization: doctor.specialization,
            profile: doctor.doctorProfile ? {
                specialties: doctor.doctorProfile.specialties,
                practiceName: doctor.doctorProfile.practiceName,
                practiceAddress: doctor.doctorProfile.practiceAddress,
                practiceCity: doctor.doctorProfile.practiceCity,
                practiceState: doctor.doctorProfile.practiceState,
                practicePhone: doctor.doctorProfile.practicePhone,
                isAcceptingNewPatients: doctor.doctorProfile.isAcceptingNewPatients,
                services: doctor.doctorProfile.services || [],
                insurances: doctor.doctorProfile.insurances || [],
                consultationFees: doctor.doctorProfile.consultationFees || [],
            } : null,
            doctorProfile: doctor.doctorProfile ? {
                specialization: doctor.specialization,
                bio: doctor.doctorProfile.professionalBio,
                experience: doctor.doctorProfile.yearsExperience,
                education: doctor.doctorProfile.education,
                services: doctor.doctorProfile.services || [],
                insurances: doctor.doctorProfile.insurances || [],
                consultationFee: normalizedAmount,
                currency: mostRecent?.currency ?? 'KES',
                location: doctor.doctorProfile.practiceAddress,
                city: doctor.doctorProfile.practiceCity,
            } : null,
        };
    }
    generateAvailableSlots(schedule, existingAppointments) {
        const slots = [];
        const startTime = new Date(`${schedule.date.toISOString().split('T')[0]}T${schedule.startTime}`);
        const endTime = new Date(`${schedule.date.toISOString().split('T')[0]}T${schedule.endTime}`);
        let currentTime = new Date(startTime);
        while (currentTime < endTime) {
            const slotEnd = new Date(currentTime.getTime() + schedule.slotDuration * 60000);
            const timeStr = currentTime.toTimeString().split(' ')[0].substring(0, 5);
            const isBooked = existingAppointments.some(apt => apt.startTime === timeStr);
            slots.push({
                time: timeStr,
                endTime: slotEnd.toTimeString().split(' ')[0].substring(0, 5),
                duration: schedule.slotDuration,
                isAvailable: !isBooked,
                isBooked,
            });
            currentTime = new Date(currentTime.getTime() + (schedule.slotDuration + schedule.bufferTime) * 60000);
        }
        return slots;
    }
    calculateDuration(startTime, endTime) {
        const start = this.parseTime(startTime);
        const end = this.parseTime(endTime);
        return (end.getTime() - start.getTime()) / (1000 * 60);
    }
    parseTime(time) {
        const [hours, minutes] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
};
exports.PatientBookingService = PatientBookingService;
exports.PatientBookingService = PatientBookingService = PatientBookingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        notification_service_1.NotificationService])
], PatientBookingService);
//# sourceMappingURL=patient-booking.service.js.map