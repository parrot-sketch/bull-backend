import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../auth/services/database.service';
import {
    CreateConsultationFeeDto,
    CreateDoctorInsuranceDto,
    CreateDoctorProfileDto,
    CreateDoctorScheduleDto,
    CreateDoctorServiceDto,
    UpdateConsultationFeeDto,
    UpdateDoctorInsuranceDto,
    UpdateDoctorProfileDto,
    UpdateDoctorScheduleDto,
    UpdateDoctorServiceDto
} from '../dto/doctor-profile.dto';

@Injectable()
export class DoctorProfileService {
  constructor(private readonly db: DatabaseService) {}

  // ===========================================
  // DOCTOR PROFILE CRUD
  // ===========================================

  async createProfile(doctorId: string, profileData: CreateDoctorProfileDto) {
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
        ...profileData,
      } as any, // Temporary type assertion to bypass Prisma type issues
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
        schedules: true,
        consultationFees: true,
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

  async updateProfile(doctorId: string, updateData: UpdateDoctorProfileDto) {
    const profile = await this.db.doctorProfile.findUnique({
      where: { doctorId }
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    const updatedProfile = await this.db.doctorProfile.update({
      where: { doctorId },
      data: updateData as any, // Temporary type assertion to bypass Prisma type issues
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

  // ===========================================
  // SERVICES MANAGEMENT
  // ===========================================

  async addService(doctorId: string, serviceData: CreateDoctorServiceDto) {
    const profile = await this.db.doctorProfile.findUnique({
      where: { doctorId }
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    const service = await this.db.doctorService.create({
      data: {
        doctorId,
        profileId: profile.id,
        ...serviceData,
      } as any, // Temporary type assertion to bypass Prisma type issues
    });

    return {
      success: true,
      data: service,
      message: 'Service added successfully'
    };
  }

  async updateService(serviceId: string, doctorId: string, updateData: UpdateDoctorServiceDto) {
    const service = await this.db.doctorService.findFirst({
      where: { id: serviceId, doctorId }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const updatedService = await this.db.doctorService.update({
      where: { id: serviceId },
      data: updateData as any // Temporary type assertion to bypass Prisma type issues
    });

    return {
      success: true,
      data: updatedService,
      message: 'Service updated successfully'
    };
  }

  async deleteService(serviceId: string, doctorId: string) {
    const service = await this.db.doctorService.findFirst({
      where: { id: serviceId, doctorId }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.db.doctorService.delete({
      where: { id: serviceId }
    });

    return {
      success: true,
      message: 'Service deleted successfully'
    };
  }

  // ===========================================
  // INSURANCE MANAGEMENT
  // ===========================================

  async addInsurance(doctorId: string, insuranceData: CreateDoctorInsuranceDto) {
    const profile = await this.db.doctorProfile.findUnique({
      where: { doctorId }
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    const insurance = await this.db.doctorInsurance.create({
      data: {
        doctorId,
        profileId: profile.id,
        ...insuranceData,
      } as any, // Temporary type assertion to bypass Prisma type issues
    });

    return {
      success: true,
      data: insurance,
      message: 'Insurance added successfully'
    };
  }

  async updateInsurance(insuranceId: string, doctorId: string, updateData: UpdateDoctorInsuranceDto) {
    const insurance = await this.db.doctorInsurance.findFirst({
      where: { id: insuranceId, doctorId }
    });

    if (!insurance) {
      throw new NotFoundException('Insurance not found');
    }

    const updatedInsurance = await this.db.doctorInsurance.update({
      where: { id: insuranceId },
      data: updateData as any // Temporary type assertion to bypass Prisma type issues
    });

    return {
      success: true,
      data: updatedInsurance,
      message: 'Insurance updated successfully'
    };
  }

  async deleteInsurance(insuranceId: string, doctorId: string) {
    const insurance = await this.db.doctorInsurance.findFirst({
      where: { id: insuranceId, doctorId }
    });

    if (!insurance) {
      throw new NotFoundException('Insurance not found');
    }

    await this.db.doctorInsurance.delete({
      where: { id: insuranceId }
    });

    return {
      success: true,
      message: 'Insurance deleted successfully'
    };
  }

  // ===========================================
  // CONSULTATION FEES MANAGEMENT
  // ===========================================

  async addConsultationFee(doctorId: string, feeData: CreateConsultationFeeDto) {
    const profile = await this.db.doctorProfile.findUnique({
      where: { doctorId }
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    const fee = await this.db.consultationFee.create({
      data: {
        doctorId,
        profileId: profile.id,
        ...feeData,
      } as any, // Temporary type assertion to bypass Prisma type issues
    });

    return {
      success: true,
      data: fee,
      message: 'Consultation fee added successfully'
    };
  }

  async updateConsultationFee(feeId: string, doctorId: string, updateData: UpdateConsultationFeeDto) {
    const fee = await this.db.consultationFee.findFirst({
      where: { id: feeId, doctorId }
    });

    if (!fee) {
      throw new NotFoundException('Consultation fee not found');
    }

    const updatedFee = await this.db.consultationFee.update({
      where: { id: feeId },
      data: updateData as any // Temporary type assertion to bypass Prisma type issues
    });

    return {
      success: true,
      data: updatedFee,
      message: 'Consultation fee updated successfully'
    };
  }

  // ===========================================
  // SCHEDULE MANAGEMENT
  // ===========================================

  async addSchedule(doctorId: string, scheduleData: CreateDoctorScheduleDto) {
    const profile = await this.db.doctorProfile.findUnique({
      where: { doctorId }
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    const schedule = await this.db.doctorSchedule.create({
      data: {
        doctorId,
        profileId: profile.id,
        ...scheduleData,
      } as any, // Temporary type assertion to bypass Prisma type issues
    });

    return {
      success: true,
      data: schedule,
      message: 'Schedule added successfully'
    };
  }

  async updateSchedule(scheduleId: string, doctorId: string, updateData: UpdateDoctorScheduleDto) {
    const schedule = await this.db.doctorSchedule.findFirst({
      where: { id: scheduleId, doctorId }
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    const updatedSchedule = await this.db.doctorSchedule.update({
      where: { id: scheduleId },
      data: updateData as any // Temporary type assertion to bypass Prisma type issues
    });

    return {
      success: true,
      data: updatedSchedule,
      message: 'Schedule updated successfully'
    };
  }

  async deleteSchedule(scheduleId: string, doctorId: string) {
    const schedule = await this.db.doctorSchedule.findFirst({
      where: { id: scheduleId, doctorId }
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    await this.db.doctorSchedule.delete({
      where: { id: scheduleId }
    });

    return {
      success: true,
      message: 'Schedule deleted successfully'
    };
  }

  // ===========================================
  // AVAILABILITY OVERRIDES
  // ===========================================

  async addAvailabilityOverride(doctorId: string, availabilityData: {
    date: Date;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    reason?: string;
  }) {
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
      throw new NotFoundException('Doctor profile not found');
    }

    return {
      success: true,
      data: profile
    };
  }
}
