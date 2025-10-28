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
                specialties: profileData.specialization ? [profileData.specialization] : [],
                professionalBio: profileData.bio ?? null,
                education: profileData.education ?? null,
                yearsExperience: profileData.experience ? Number(profileData.experience) : 0,
            },
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
        const prismaData = {};
        if (updateData.specialization)
            prismaData.specialties = { set: [updateData.specialization] };
        if (updateData.bio !== undefined)
            prismaData.professionalBio = updateData.bio;
        if (updateData.education !== undefined)
            prismaData.education = updateData.education;
        if (updateData.yearsOfExperience !== undefined)
            prismaData.yearsExperience = Number(updateData.yearsOfExperience);
        const updatedProfile = await this.db.doctorProfile.update({
            where: { doctorId },
            data: prismaData,
        });
        return {
            success: true,
            data: updatedProfile,
            message: 'Doctor profile updated successfully'
        };
    }
    async getServices(doctorId) {
        const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
        if (!profile)
            throw new common_1.NotFoundException('Doctor profile not found');
        const services = await this.db.doctorService.findMany({ where: { doctorId } });
        return { success: true, data: services };
    }
    async upsertServices(doctorId, services) {
        const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
        if (!profile)
            throw new common_1.NotFoundException('Doctor profile not found');
        const ops = services.map((s) => {
            const lower = (s.name || '').toLowerCase();
            const category = lower.match(/x-?ray|ultra\s?sound|ct|mri|lab|test|scan/)
                ? 'DIAGNOSTIC'
                : 'CONSULTATION';
            return this.db.doctorService.upsert({
                where: { id: s.id ?? '___nonexistent___' },
                update: {
                    name: s.name,
                    description: s.description,
                    duration: s.duration ?? 30,
                    price: s.price ?? null,
                    category,
                },
                create: {
                    doctorId,
                    profileId: profile.id,
                    name: s.name,
                    description: s.description,
                    duration: s.duration ?? 30,
                    price: s.price ?? null,
                    category,
                },
            });
        });
        const result = await this.db.$transaction(ops);
        return { success: true, data: result };
    }
    async deleteService(doctorId, serviceId) {
        const service = await this.db.doctorService.findUnique({ where: { id: serviceId } });
        if (!service || service.doctorId !== doctorId)
            throw new common_1.NotFoundException('Service not found');
        await this.db.doctorService.delete({ where: { id: serviceId } });
        return { success: true };
    }
    async getInsurance(doctorId) {
        const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
        if (!profile)
            throw new common_1.NotFoundException('Doctor profile not found');
        const providers = await this.db.doctorInsurance.findMany({ where: { doctorId } });
        return { success: true, data: providers };
    }
    async upsertInsurance(doctorId, providers) {
        const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
        if (!profile)
            throw new common_1.NotFoundException('Doctor profile not found');
        const ops = providers.map((p) => this.db.doctorInsurance.upsert({
            where: { id: p.id ?? '___nonexistent___' },
            update: {
                insuranceName: p.insuranceName,
                insuranceType: p.insuranceType ?? 'PRIVATE',
                planName: p.planName ?? null,
            },
            create: {
                doctorId,
                profileId: profile.id,
                insuranceName: p.insuranceName,
                insuranceType: p.insuranceType ?? 'PRIVATE',
                planName: p.planName ?? null,
            },
        }));
        const result = await this.db.$transaction(ops);
        return { success: true, data: result };
    }
    async deleteInsurance(doctorId, id) {
        const rec = await this.db.doctorInsurance.findUnique({ where: { id } });
        if (!rec || rec.doctorId !== doctorId)
            throw new common_1.NotFoundException('Insurance not found');
        await this.db.doctorInsurance.delete({ where: { id } });
        return { success: true };
    }
    async getBilling(doctorId) {
        const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
        if (!profile)
            throw new common_1.NotFoundException('Doctor profile not found');
        const fee = await this.db.consultationFee.findFirst({
            where: { profileId: profile.id },
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, data: fee ? { consultationFee: fee.baseFee, currency: profile.currency ?? 'USD' } : { consultationFee: 0, currency: 'USD' } };
    }
    async updateBilling(doctorId, billing) {
        const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
        if (!profile)
            throw new common_1.NotFoundException('Doctor profile not found');
        const fee = await this.db.consultationFee.create({
            data: {
                doctorId,
                profileId: profile.id,
                consultationType: 'IN_PERSON',
                baseFee: billing.consultationFee,
            },
        });
        if (billing.currency) {
            await this.db.doctorProfile.update({ where: { doctorId }, data: { currency: billing.currency } });
        }
        return { success: true, data: { consultationFee: fee.baseFee, currency: billing.currency ?? profile.currency ?? 'USD' } };
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
//# sourceMappingURL=doctor-profile.service.js.map