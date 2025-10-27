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

    // Create profile with proper data structure matching the schema
    const profile = await this.db.doctorProfile.create({
      data: {
        doctorId,
        // Map to actual schema fields
        specialties: [profileData.specialization], // Convert to array
        yearsExperience: profileData.experience ? parseInt(profileData.experience) : undefined,
        education: profileData.education,
        // Store consultation fee in the professionalBio as a note
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

    // Extract consultation fee from professionalBio if it exists
    let consultationFee = 50; // Default
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
        bio: bioText.replace(/\n\nConsultation Fee: \$\d+/, ''), // Remove fee from bio
        experience: profile.yearsExperience?.toString(),
        education: profile.education,
        consultationFee: consultationFee,
        services: 'General Consultation, Follow-up visits, Health checkups', // Default services
        availability: 'Monday-Friday 9AM-5PM', // Default availability
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString(),
      }
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

    // Prepare update data with proper types matching the schema
    const updatePayload: any = {};
    
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

    // Extract consultation fee from updated bio
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

    // Extract consultation fee from professionalBio
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
}
