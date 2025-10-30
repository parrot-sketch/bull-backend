import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDoctorProfileDto, CreateDoctorServiceDto, CreateDoctorInsuranceDto } from '../types';

@Injectable()
export class DoctorProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get doctorProfile() { return this.prisma.doctorProfile; }
  private get doctorService() { return this.prisma.doctorService; }
  private get doctorInsurance() { return this.prisma.doctorInsurance; }
  private get consultationFee() { return this.prisma.consultationFee; }

  async createProfile(doctorId: string, data: CreateDoctorProfileDto) {
    return this.doctorProfile.create({
      data: {
        ...data,
        doctorId
      },
      include: {
        services: true,
        insurances: true,
        consultationFees: true
      }
    });
  }

  async findProfileById(doctorId: string) {
    const profile = await this.doctorProfile.findUnique({
      where: { doctorId },
      include: {
        services: true,
        insurances: true,
        consultationFees: true,
        schedules: true
      }
    });

    if (!profile) {
      throw new NotFoundException(`Doctor profile not found for ID: ${doctorId}`);
    }

    return profile;
  }

  async updateProfile(doctorId: string, data: Partial<CreateDoctorProfileDto>) {
    return this.doctorProfile.update({
      where: { doctorId },
      data,
      include: {
        services: true,
        insurances: true,
        schedules: true
      }
    });
  }

  async updateServices(doctorId: string, services: CreateDoctorServiceDto[]) {
    await this.doctorService.deleteMany({
      where: { doctorId }
    });

    return this.prisma.$transaction(
      services.map(service =>
        this.doctorService.create({
          data: ({
            ...service,
            doctorId,
          } as any)
        })
      )
    );
  }

  async removeService(serviceId: string) {
    const service = await this.doctorService.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      throw new NotFoundException(`Service not found: ${serviceId}`);
    }

    return this.doctorService.delete({
      where: { id: serviceId }
    });
  }

  async updateInsurance(doctorId: string, providers: CreateDoctorInsuranceDto[]) {
    await this.doctorInsurance.deleteMany({
      where: { doctorId }
    });

    return this.prisma.$transaction(
      providers.map(provider =>
        this.doctorInsurance.create({
          data: ({
            ...provider,
            doctorId,
          } as any)
        })
      )
    );
  }

  async removeInsurance(id: string) {
    const insurance = await this.doctorInsurance.findUnique({
      where: { id }
    });

    if (!insurance) {
      throw new NotFoundException(`Insurance provider not found: ${id}`);
    }

    return this.doctorInsurance.delete({
      where: { id }
    });
  }
}