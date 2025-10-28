import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../auth/services/database.service';

@Injectable()
export class DoctorProfileService {
  constructor(private readonly db: DatabaseService) {}

  // ===========================================
  // SIMPLIFIED DOCTOR PROFILE CRUD
  // ===========================================

  async createProfile(doctorId: string, profileData: {
    specialization?: string;
    specialties?: string[];
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
        specialties: profileData.specialties ?? (profileData.specialization ? [profileData.specialization] : []),
        professionalBio: profileData.bio ?? null,
        education: profileData.education ?? null,
        yearsExperience: profileData.experience ? Number(profileData.experience) : 0,
      } as any,
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
        services: true,
        insurances: true,
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
    specialties?: string[];
    bio?: string;
    experience?: string;
    education?: string;
    consultationFee?: number;
    services?: string;
    availability?: string;
    yearsOfExperience?: number;
  }) {
    const profile = await this.db.doctorProfile.findUnique({
      where: { doctorId }
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    const prismaData: any = {};
    if (updateData.specialization) prismaData.specialties = { set: [updateData.specialization] };
    if (updateData.specialties) prismaData.specialties = { set: updateData.specialties };
    if (updateData.bio !== undefined) prismaData.professionalBio = updateData.bio;
    if (updateData.education !== undefined) prismaData.education = updateData.education;
    if (updateData.yearsOfExperience !== undefined) prismaData.yearsExperience = Number(updateData.yearsOfExperience);

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

  // ===========================================
  // SERVICES MANAGEMENT
  // ===========================================
  async getServices(doctorId: string) {
    const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
    if (!profile) throw new NotFoundException('Doctor profile not found');
    const services = await this.db.doctorService.findMany({ where: { doctorId } });
    return { success: true, data: services };
  }

  async upsertServices(doctorId: string, services: Array<{ id?: string; name: string; description?: string; duration?: number; price?: any }>) {
    const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
    if (!profile) throw new NotFoundException('Doctor profile not found');
    const ops = services.map((s) =>
      // Heuristic mapping of category from name; default to CONSULTATION
      {
        const lower = (s.name || '').toLowerCase();
        const category: any = lower.match(/x-?ray|ultra\s?sound|ct|mri|lab|test|scan/)
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
      }
    );
    const result = await this.db.$transaction(ops);
    return { success: true, data: result };
  }

  async deleteService(doctorId: string, serviceId: string) {
    const service = await this.db.doctorService.findUnique({ where: { id: serviceId } });
    if (!service || service.doctorId !== doctorId) throw new NotFoundException('Service not found');
    await this.db.doctorService.delete({ where: { id: serviceId } });
    return { success: true };
  }

  // ===========================================
  // INSURANCE MANAGEMENT
  // ===========================================
  async getInsurance(doctorId: string) {
    const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
    if (!profile) throw new NotFoundException('Doctor profile not found');
    const providers = await this.db.doctorInsurance.findMany({ where: { doctorId } });
    return { success: true, data: providers };
  }

  async upsertInsurance(doctorId: string, providers: Array<{ id?: string; insuranceName: string; insuranceType?: any; planName?: string }>) {
    const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
    if (!profile) throw new NotFoundException('Doctor profile not found');
    const ops = providers.map((p) =>
      this.db.doctorInsurance.upsert({
        where: { id: p.id ?? '___nonexistent___' },
        update: {
          insuranceName: p.insuranceName,
          insuranceType: (p.insuranceType as any) ?? 'PRIVATE',
          planName: p.planName ?? null,
        },
        create: {
          doctorId,
          profileId: profile.id,
          insuranceName: p.insuranceName,
          insuranceType: (p.insuranceType as any) ?? 'PRIVATE',
          planName: p.planName ?? null,
        },
      })
    );
    const result = await this.db.$transaction(ops);
    return { success: true, data: result };
  }

  async deleteInsurance(doctorId: string, id: string) {
    const rec = await this.db.doctorInsurance.findUnique({ where: { id } });
    if (!rec || rec.doctorId !== doctorId) throw new NotFoundException('Insurance not found');
    await this.db.doctorInsurance.delete({ where: { id } });
    return { success: true };
  }

  // ===========================================
  // BILLING
  // ===========================================
  async getBilling(doctorId: string) {
    const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
    if (!profile) throw new NotFoundException('Doctor profile not found');
    const fee = await this.db.consultationFee.findFirst({
      where: { profileId: profile.id },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: fee ? { consultationFee: (fee as any).baseFee, currency: (profile as any).currency ?? 'USD' } : { consultationFee: 0, currency: 'USD' } };
  }

  async updateBilling(doctorId: string, billing: { consultationFee: number; currency?: string }) {
    const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
    if (!profile) throw new NotFoundException('Doctor profile not found');
    // Create a new fee record (simple history approach)
    const fee = await this.db.consultationFee.create({
      data: {
        doctorId,
        profileId: profile.id,
        consultationType: 'IN_PERSON' as any,
        baseFee: billing.consultationFee as any,
      },
    });
    // Optionally store currency on profile if present
    if (billing.currency) {
      await this.db.doctorProfile.update({ where: { doctorId }, data: { currency: billing.currency as any } as any });
    }
    return { success: true, data: { consultationFee: (fee as any).baseFee, currency: billing.currency ?? (profile as any).currency ?? 'USD' } };
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
