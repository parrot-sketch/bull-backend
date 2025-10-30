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
                specialties: [profileData.specialization],
                yearsExperience: profileData.experience ? parseInt(profileData.experience) : undefined,
                education: profileData.education,
                professionalBio: `${profileData.bio || ''}\n\nConsultation Fee: $${profileData.consultationFee}`,
            }
        });
        return {
            success: true,
            data: {
                id: profile.id,
                doctorId: profile.doctorId,
                specialization: profile.specialties?.[0] || profileData.specialization,
                bio: profile.professionalBio,
                experience: profile.yearsExperience?.toString(),
                education: profile.education,
                consultationFee: profileData.consultationFee,
                services: profileData.services,
                availability: profileData.availability,
                createdAt: profile.createdAt.toISOString(),
                updatedAt: profile.updatedAt.toISOString(),
            },
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
            }
        });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        let consultationFee = 50;
        const bioText = profile.professionalBio || '';
        const feeMatch = bioText.match(/Consultation Fee: \$(\d+)/);
        if (feeMatch) {
            consultationFee = parseInt(feeMatch[1]);
        }
        return {
            success: true,
            data: {
                id: profile.id,
                doctorId: profile.doctorId,
                specialization: profile.specialties?.[0] || 'General Medicine',
                bio: bioText.replace(/\n\nConsultation Fee: \$\d+/, ''),
                experience: profile.yearsExperience?.toString(),
                education: profile.education,
                consultationFee: consultationFee,
                services: 'General Consultation, Follow-up visits, Health checkups',
                availability: 'Monday-Friday 9AM-5PM',
                createdAt: profile.createdAt.toISOString(),
                updatedAt: profile.updatedAt.toISOString(),
            }
        };
    }
    async updateProfile(doctorId, updateData) {
        const profile = await this.db.doctorProfile.findUnique({
            where: { doctorId }
        });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        const updatePayload = {};
        if (updateData.specialization !== undefined) {
            updatePayload.specialties = [updateData.specialization];
        }
        if (updateData.bio !== undefined || updateData.consultationFee !== undefined) {
            const currentBio = profile.professionalBio || '';
            const cleanBio = currentBio.replace(/\n\nConsultation Fee: \$\d+/, '');
            const fee = updateData.consultationFee || 50;
            updatePayload.professionalBio = `${cleanBio}\n\nConsultation Fee: $${fee}`;
        }
        if (updateData.experience !== undefined) {
            updatePayload.yearsExperience = parseInt(updateData.experience);
        }
        if (updateData.education !== undefined) {
            updatePayload.education = updateData.education;
        }
        const updatedProfile = await this.db.doctorProfile.update({
            where: { doctorId },
            data: updatePayload
        });
        let consultationFee = 50;
        const bioText = updatedProfile.professionalBio || '';
        const feeMatch = bioText.match(/Consultation Fee: \$(\d+)/);
        if (feeMatch) {
            consultationFee = parseInt(feeMatch[1]);
        }
        return {
            success: true,
            data: {
                id: updatedProfile.id,
                doctorId: updatedProfile.doctorId,
                specialization: updatedProfile.specialties?.[0] || updateData.specialization || 'General Medicine',
                bio: bioText.replace(/\n\nConsultation Fee: \$\d+/, ''),
                experience: updatedProfile.yearsExperience?.toString(),
                education: updatedProfile.education,
                consultationFee: consultationFee,
                services: updateData.services || 'General Consultation, Follow-up visits, Health checkups',
                availability: updateData.availability || 'Monday-Friday 9AM-5PM',
                createdAt: updatedProfile.createdAt.toISOString(),
                updatedAt: updatedProfile.updatedAt.toISOString(),
            },
            message: 'Doctor profile updated successfully'
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
            }
        });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        let consultationFee = 50;
        const bioText = profile.professionalBio || '';
        const feeMatch = bioText.match(/Consultation Fee: \$(\d+)/);
        if (feeMatch) {
            consultationFee = parseInt(feeMatch[1]);
        }
        return {
            success: true,
            data: {
                id: profile.id,
                doctorId: profile.doctorId,
                specialization: profile.specialties?.[0] || 'General Medicine',
                bio: bioText.replace(/\n\nConsultation Fee: \$\d+/, ''),
                experience: profile.yearsExperience?.toString(),
                consultationFee: consultationFee,
                services: 'General Consultation, Follow-up visits, Health checkups',
                availability: 'Monday-Friday 9AM-5PM',
                doctor: profile.doctor,
                createdAt: profile.createdAt.toISOString(),
                updatedAt: profile.updatedAt.toISOString(),
            }
        };
    }
};
exports.DoctorProfileService = DoctorProfileService;
exports.DoctorProfileService = DoctorProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DoctorProfileService);
//# sourceMappingURL=doctor-profile-simplified.service.js.map