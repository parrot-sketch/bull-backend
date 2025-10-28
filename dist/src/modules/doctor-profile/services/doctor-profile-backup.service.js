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
exports.DoctorProfileService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../auth/services/database.service");
let DoctorProfileService = class DoctorProfileService {
    constructor(db) {
        this.db = db;
    }
    async createProfile(doctorId, profileData) {
        const existingProfile = await this.db.doctorProfile.findUnique({
            where: { doctorId }
        });
        if (existingProfile) {
            throw new common_1.ConflictException('Doctor profile already exists');
        }
        const doctor = await this.db.user.findUnique({
            where: { id: doctorId, role: 'DOCTOR' }
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const profile = await this.db.doctorProfile.create({
            data: {
                doctorId,
                ...profileData,
            },
            include: {
                services: true,
                insurances: true,
                schedules: true,
                consultationFees: true,
            }
        });
        return {
            success: true,
            data: profile,
            message: 'Doctor profile created successfully'
        };
    }
    async getProfile(doctorId) {
        const profile = await this.db.doctorProfile.findUnique({
            where: { doctorId },
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                        phoneNumber: true,
                    }
                },
                services: true,
                insurances: true,
                schedules: true,
                consultationFees: true,
            }
        });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        return {
            success: true,
            data: profile
        };
    }
    async updateProfile(doctorId, updateData) {
        const profile = await this.db.doctorProfile.findUnique({
            where: { doctorId }
        });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        const updatedProfile = await this.db.doctorProfile.update({
            where: { doctorId },
            data: updateData,
            include: {
                services: true,
                insurances: true,
                schedules: true,
                consultationFees: true,
            }
        });
        return {
            success: true,
            data: updatedProfile,
            message: 'Doctor profile updated successfully'
        };
    }
    async addService(doctorId, serviceData) {
        const profile = await this.db.doctorProfile.findUnique({
            where: { doctorId }
        });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        const service = await this.db.doctorService.create({
            data: {
                doctorId,
                profileId: profile.id,
                ...serviceData,
            },
        });
        return {
            success: true,
            data: service,
            message: 'Service added successfully'
        };
    }
    async updateService(serviceId, doctorId, updateData) {
        const service = await this.db.doctorService.findFirst({
            where: { id: serviceId, doctorId }
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        const updatedService = await this.db.doctorService.update({
            where: { id: serviceId },
            data: updateData
        });
        return {
            success: true,
            data: updatedService,
            message: 'Service updated successfully'
        };
    }
    async deleteService(serviceId, doctorId) {
        const service = await this.db.doctorService.findFirst({
            where: { id: serviceId, doctorId }
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        await this.db.doctorService.delete({
            where: { id: serviceId }
        });
        return {
            success: true,
            message: 'Service deleted successfully'
        };
    }
    async addInsurance(doctorId, insuranceData) {
        const profile = await this.db.doctorProfile.findUnique({
            where: { doctorId }
        });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        const insurance = await this.db.doctorInsurance.create({
            data: {
                doctorId,
                profileId: profile.id,
                ...insuranceData,
            },
        });
        return {
            success: true,
            data: insurance,
            message: 'Insurance added successfully'
        };
    }
    async updateInsurance(insuranceId, doctorId, updateData) {
        const insurance = await this.db.doctorInsurance.findFirst({
            where: { id: insuranceId, doctorId }
        });
        if (!insurance) {
            throw new common_1.NotFoundException('Insurance not found');
        }
        const updatedInsurance = await this.db.doctorInsurance.update({
            where: { id: insuranceId },
            data: updateData
        });
        return {
            success: true,
            data: updatedInsurance,
            message: 'Insurance updated successfully'
        };
    }
    async deleteInsurance(insuranceId, doctorId) {
        const insurance = await this.db.doctorInsurance.findFirst({
            where: { id: insuranceId, doctorId }
        });
        if (!insurance) {
            throw new common_1.NotFoundException('Insurance not found');
        }
        await this.db.doctorInsurance.delete({
            where: { id: insuranceId }
        });
        return {
            success: true,
            message: 'Insurance deleted successfully'
        };
    }
    async addConsultationFee(doctorId, feeData) {
        const profile = await this.db.doctorProfile.findUnique({
            where: { doctorId }
        });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        const fee = await this.db.consultationFee.create({
            data: {
                doctorId,
                profileId: profile.id,
                ...feeData,
            },
        });
        return {
            success: true,
            data: fee,
            message: 'Consultation fee added successfully'
        };
    }
    async updateConsultationFee(feeId, doctorId, updateData) {
        const fee = await this.db.consultationFee.findFirst({
            where: { id: feeId, doctorId }
        });
        if (!fee) {
            throw new common_1.NotFoundException('Consultation fee not found');
        }
        const updatedFee = await this.db.consultationFee.update({
            where: { id: feeId },
            data: updateData
        });
        return {
            success: true,
            data: updatedFee,
            message: 'Consultation fee updated successfully'
        };
    }
    async addSchedule(doctorId, scheduleData) {
        const profile = await this.db.doctorProfile.findUnique({
            where: { doctorId }
        });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        const schedule = await this.db.doctorSchedule.create({
            data: {
                doctorId,
                profileId: profile.id,
                ...scheduleData,
            },
        });
        return {
            success: true,
            data: schedule,
            message: 'Schedule added successfully'
        };
    }
    async updateSchedule(scheduleId, doctorId, updateData) {
        const schedule = await this.db.doctorSchedule.findFirst({
            where: { id: scheduleId, doctorId }
        });
        if (!schedule) {
            throw new common_1.NotFoundException('Schedule not found');
        }
        const updatedSchedule = await this.db.doctorSchedule.update({
            where: { id: scheduleId },
            data: updateData
        });
        return {
            success: true,
            data: updatedSchedule,
            message: 'Schedule updated successfully'
        };
    }
    async deleteSchedule(scheduleId, doctorId) {
        const schedule = await this.db.doctorSchedule.findFirst({
            where: { id: scheduleId, doctorId }
        });
        if (!schedule) {
            throw new common_1.NotFoundException('Schedule not found');
        }
        await this.db.doctorSchedule.delete({
            where: { id: scheduleId }
        });
        return {
            success: true,
            message: 'Schedule deleted successfully'
        };
    }
    async addAvailabilityOverride(doctorId, availabilityData) {
        const availability = await this.db.doctorAvailability.create({
            data: {
                doctorId,
                ...availabilityData,
            }
        });
        return {
            success: true,
            data: availability,
            message: 'Availability override added successfully'
        };
    }
    async getPublicProfile(doctorId) {
        const profile = await this.db.doctorProfile.findUnique({
            where: { doctorId },
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    }
                },
                services: {
                    where: { isActive: true }
                },
                insurances: {
                    where: { isActive: true }
                },
                schedules: {
                    where: { isAvailable: true }
                },
                consultationFees: {
                    where: { isActive: true }
                },
            }
        });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        return {
            success: true,
            data: profile
        };
    }
};
exports.DoctorProfileService = DoctorProfileService;
exports.DoctorProfileService = DoctorProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DoctorProfileService);
//# sourceMappingURL=doctor-profile-backup.service.js.map