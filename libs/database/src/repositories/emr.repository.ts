import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EMRRepository {
  constructor(private prisma: PrismaService) {}

  get patientVisit() { return this.prisma.patientVisit; }
  get prescription() { return this.prisma.prescription; }
  get labOrder() { return this.prisma.labOrder; }
  get imagingOrder() { return this.prisma.imagingOrder; }
  get clinicalTemplate() { return this.prisma.clinicalTemplate; }
  get labResult() { return this.prisma.labResult; }
  get imagingResult() { return this.prisma.imagingResult; }

  async findVisitById(id: string) {
    return this.patientVisit.findUnique({
      where: { id },
      include: {
        prescriptions: true,
        labOrders: true,
        imagingOrders: true
      }
    });
  }

  async findVisitsByPatientId(patientId: string) {
    return this.patientVisit.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
      include: {
        prescriptions: true,
        labOrders: true,
        imagingOrders: true
      }
    });
  }
}