import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BookingRepository {
  constructor(private prisma: PrismaService) {}

  get patientBooking() { return this.prisma.patientBooking; }

  async createBooking(patientId: string, doctorId: string, appointmentDate: Date, data: any) {
    return this.patientBooking.create({
      data: {
        patientId,
        doctorId,
        appointmentDate,
        ...data
      }
    });
  }

  async findBookingsByPatientId(patientId: string) {
    return this.patientBooking.findMany({
      where: { patientId },
      include: {
        patient: true
      } as any,
      orderBy: { createdAt: 'desc' } as any
    });
  }

  async findBookingsByDoctorId(doctorId: string, fromDate: Date) {
    return this.patientBooking.findMany({
      where: {
        doctorId,
        createdAt: {
          gte: fromDate
        } as any
      } as any,
      include: {
        patient: true
      } as any,
      orderBy: { createdAt: 'asc' } as any
    });
  }
}