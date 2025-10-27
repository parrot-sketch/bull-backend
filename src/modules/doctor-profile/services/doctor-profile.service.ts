import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../auth/services/database.service';

@Injectable()
export class DoctorProfileService {
  constructor(private readonly db: DatabaseService) {}

  // ===========================================
  // SIMPLIFIED DOCTOR PROFILE CRUD
  // ===========================================

  async createProfile(doctorId: string, profileData: {
    specialization: string;
    bio?: string;
    experience?: string;
    education?: string;
    consultationFee: number;
    services?: string;
    availability?: string;
  }) {
    // Check if profile already exists
    const existingProfile = await this.db.doctorProfile.findUnique({
      where: { doctorId }
    });

    if (existingProfile) {
      throw new ConflictException('Doctor profile already exists');
    }

    // Verify doctor exists and has DOCTOR role
    const doctor = await this.db.user.findUnique({
      where: { id: doctorId, role: 'DOCTOR' }
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const profile = await this.db.doctorProfile.create({
      data: {
        doctorId,
        specialization: profileData.specialization,
        bio: profileData.bio,
        experience: profileData.experience,
        education: profileData.education,
        consultationFee: profileData.consultationFee,
        services: profileData.services,
        availability: profileData.availability,
      } as any, // Temporary type assertion to bypass Prisma type issues
    });

    return {
      success: true,
      data: profile,
      message: 'Doctor profile created successfully'
    };
  }

  async getProfile(doctorId: string) {
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
      throw new NotFoundException('Doctor profile not found');
    }

    return {
      success: true,
      data: profile
    };
  }

  async updateProfile(doctorId: string, updateData: {
    specialization?: string;
    bio?: string;
    experience?: string;
    education?: string;
    consultationFee?: number;
    services?: string;
    availability?: string;
  }) {
    const profile = await this.db.doctorProfile.findUnique({
      where: { doctorId }
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    const updatedProfile = await this.db.doctorProfile.update({
      where: { doctorId },
      data: updateData as any, // Temporary type assertion to bypass Prisma type issues
    });

    return {
      success: true,
      data: updatedProfile,
      message: 'Doctor profile updated successfully'
    };
  }

  // ===========================================
  // PUBLIC PROFILE (FOR PATIENTS)
  // ===========================================

  async getPublicProfile(doctorId: string) {
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
      throw new NotFoundException('Doctor profile not found');
    }

    return {
      success: true,
      data: profile
    };
  }
}
