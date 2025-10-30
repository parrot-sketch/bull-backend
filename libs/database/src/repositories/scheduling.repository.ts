import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SchedulingRepository {
  constructor(private prisma: PrismaService) {}

  get doctorSchedule() { return this.prisma.doctorSchedule; }
  get doctorAvailability() { return this.prisma.doctorAvailability; }
  get doctorScheduleException() { return this.prisma.doctorScheduleException; }
  get doctorScheduleTemplate() { return this.prisma.doctorScheduleTemplate; }

  async findAvailableSlots(doctorId: string, fromDate: Date, toDate: Date) {
    const [schedule, exceptions] = await Promise.all([
      this.doctorSchedule.findMany({
        where: { doctorId }
      }),
      this.doctorScheduleException.findMany({
        where: {
          doctorId,
          date: {
            gte: fromDate,
            lte: toDate
          }
        }
      })
    ]);

    return {
      schedule,
      exceptions
    };
  }

  async createException(doctorId: string, date: Date, reason: string) {
    return this.doctorScheduleException.create({
      data: ({
        doctorId,
        date,
        reason
      } as any)
    });
  }

  async getTemplate(doctorId: string) {
    return this.doctorScheduleTemplate.findFirst({
      where: { doctorId }
    });
  }
}