import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DoctorProfileRepository {
	constructor(private prisma: PrismaService) {}

	get doctorProfile() { return this.prisma.doctorProfile; }
	get doctorService() { return this.prisma.doctorService; }
	get doctorInsurance() { return this.prisma.doctorInsurance; }
	get consultationFee() { return this.prisma.consultationFee; }
	get doctorSchedule() { return this.prisma.doctorSchedule; }
	get doctorAvailability() { return this.prisma.doctorAvailability; }

	async findByDoctorId(doctorId: string) {
		return this.doctorProfile.findUnique({ where: { doctorId } });
	}

	async createProfile(data: any) {
		return this.doctorProfile.create({ data: data as any });
	}

	async updateProfile(id: string, data: any) {
		return this.doctorProfile.update({ where: { id }, data: data as any });
	}

	async findServicesByDoctor(doctorId: string) {
		return this.doctorService.findMany({ where: { doctorId } });
	}

	async findAvailability(doctorId: string, date: Date) {
		return this.doctorAvailability.findMany({ where: { doctorId, date } });
	}
}
