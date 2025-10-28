import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../auth/services/database.service';

@Injectable()
export class PatientBookingService {
  constructor(private db: DatabaseService) {}

  /**
   * Find doctors available for booking
   */
  async findDoctors(filters?: {
    specialty?: string;
    location?: string;
    city?: string;
    isAcceptingNewPatients?: boolean;
  }) {
    const where: any = {
      role: 'DOCTOR',
      isActive: true,
      doctorProfile: filters?.isAcceptingNewPatients 
        ? { isAcceptingNewPatients: filters.isAcceptingNewPatients }
        : undefined,
    };

    if (filters?.specialty) {
      where.department = filters.specialty;
    }

    if (filters?.location) {
      where.city = filters.location;
    }

    const doctors = await this.db.user.findMany({
      where,
      include: {
        doctorProfile: {
          include: {
            services: true,
            insurances: true,
            consultationFees: true,
          },
        },
      },
      take: 50,
    });

    return {
      success: true,
      data: doctors.map(doc => this.mapDoctorForBooking(doc)),
      message: 'Doctors retrieved successfully',
    };
  }

  /**
   * Get doctor details for booking
   */
  async getDoctorDetails(doctorId: string) {
    const doctor = await this.db.user.findUnique({
      where: { id: doctorId, role: 'DOCTOR' },
      include: {
        doctorProfile: {
          include: {
            services: true,
            insurances: true,
            consultationFees: true,
            schedules: {
              where: {
                isAvailable: true,
                date: {
                  gte: new Date(), // Only future schedules
                },
              },
              take: 30,
            },
          },
        },
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return {
      success: true,
      data: this.mapDoctorForBooking(doctor),
      message: 'Doctor details retrieved successfully',
    };
  }

  /**
   * Get doctor availability for a specific date
   */
  async getDoctorAvailability(doctorId: string, date: string) {
    const targetDate = new Date(date);
    
    // Get doctor's schedule for the specific date
    const schedule = await this.db.doctorSchedule.findFirst({
      where: {
        doctorId,
        date: targetDate,
        isAvailable: true,
      },
    });

    if (!schedule) {
      return {
        success: true,
        data: {
          isAvailable: false,
          date,
          slots: [],
          message: 'No availability for this date',
        },
        message: 'No schedule found for this date',
      };
    }

    // Get existing appointments for this date
    const appointments = await this.db.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: targetDate,
        status: {
          notIn: ['CANCELLED', 'NO_SHOW'],
        },
      },
    });

    // Generate available time slots
    const slots = this.generateAvailableSlots(schedule, appointments);

    return {
      success: true,
      data: {
        isAvailable: true,
        date,
        schedule,
        slots,
      },
      message: 'Availability retrieved successfully',
    };
  }

  /**
   * Book appointment (patient-initiated)
   */
  async bookAppointment(patientId: string, bookingData: {
    doctorId: string;
    date: string;
    startTime: string;
    endTime: string;
    reasonForVisit?: string;
    symptoms?: string;
    type?: string;
  }) {
    // Verify doctor exists and is active
    const doctor = await this.db.user.findUnique({
      where: { id: bookingData.doctorId, role: 'DOCTOR' },
    });

    if (!doctor || !doctor.isActive) {
      throw new NotFoundException('Doctor not found or inactive');
    }

    const appointmentDate = new Date(bookingData.date);

    // Check availability
    const availability = await this.getDoctorAvailability(
      bookingData.doctorId,
      bookingData.date
    );

    if (!availability.data.isAvailable) {
      throw new BadRequestException('No availability for this date');
    }

    // Check if time slot is available
    const slotAvailable = availability.data.slots.find(
      slot => slot.time === bookingData.startTime && slot.isAvailable
    );

    if (!slotAvailable) {
      throw new BadRequestException('Time slot is no longer available');
    }

    // Check for existing appointment at this time
    const existingAppointment = await this.db.appointment.findFirst({
      where: {
        doctorId: bookingData.doctorId,
        appointmentDate,
        startTime: bookingData.startTime,
        status: {
          notIn: ['CANCELLED', 'NO_SHOW'],
        },
      },
    });

    if (existingAppointment) {
      throw new BadRequestException('Time slot is already booked');
    }

    // Get schedule ID
    const schedule = await this.db.doctorSchedule.findFirst({
      where: {
        doctorId: bookingData.doctorId,
        date: appointmentDate,
      },
    });

    // Create appointment
    const appointment = await this.db.appointment.create({
      data: {
        doctorId: bookingData.doctorId,
        patientId,
        scheduleId: schedule?.id,
        appointmentDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        duration: this.calculateDuration(bookingData.startTime, bookingData.endTime),
        type: (bookingData.type as any) || 'CONSULTATION',
        status: 'PENDING', // Requires doctor confirmation
        reasonForVisit: bookingData.reasonForVisit,
        symptoms: bookingData.symptoms,
        requiresConfirmation: true,
        bookingRequestedAt: new Date(),
      } as any,
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            doctorProfile: true,
          },
        },
      },
    });

    return {
      success: true,
      data: appointment,
      message: 'Appointment booking requested successfully. Awaiting doctor confirmation.',
    };
  }

  /**
   * Get patient appointments
   */
  async getPatientAppointments(patientId: string, filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const where: any = { patientId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
      where.appointmentDate = {};
      if (filters?.startDate) {
        where.appointmentDate.gte = new Date(filters.startDate);
      }
      if (filters?.endDate) {
        where.appointmentDate.lte = new Date(filters.endDate);
      }
    }

    const appointments = await this.db.appointment.findMany({
      where,
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            specialization: true,
            doctorProfile: {
              select: {
                specialties: true,
                practiceName: true,
                practiceAddress: true,
                practiceCity: true,
                practicePhone: true,
              },
            },
          },
        },
      },
      orderBy: { appointmentDate: 'desc' },
    });

    return {
      success: true,
      data: appointments,
      message: 'Appointments retrieved successfully',
    };
  }

  /**
   * Cancel patient appointment
   */
  async cancelAppointment(patientId: string, appointmentId: string, reason?: string) {
    const appointment = await this.db.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.patientId !== patientId) {
      throw new BadRequestException('Unauthorized to cancel this appointment');
    }

    if (appointment.status === 'CANCELLED') {
      throw new BadRequestException('Appointment is already cancelled');
    }

    if (appointment.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel a completed appointment');
    }

    const updatedAppointment = await this.db.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelledBy: 'PATIENT',
        cancellationReason: reason,
      } as any,
    });

    return {
      success: true,
      data: updatedAppointment,
      message: 'Appointment cancelled successfully',
    };
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  private mapDoctorForBooking(doctor: any) {
    return {
      id: doctor.id,
      name: `${doctor.firstName} ${doctor.lastName}`,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber,
      avatar: doctor.avatar,
      department: doctor.department,
      specialization: doctor.specialization,
      profile: doctor.doctorProfile ? {
        specialties: doctor.doctorProfile.specialties,
        practiceName: doctor.doctorProfile.practiceName,
        practiceAddress: doctor.doctorProfile.practiceAddress,
        practiceCity: doctor.doctorProfile.practiceCity,
        practiceState: doctor.doctorProfile.practiceState,
        practicePhone: doctor.doctorProfile.practicePhone,
        isAcceptingNewPatients: doctor.doctorProfile.isAcceptingNewPatients,
        services: doctor.doctorProfile.services || [],
        insurances: doctor.doctorProfile.insurances || [],
        consultationFees: doctor.doctorProfile.consultationFees || [],
      } : null,
    };
  }

  private generateAvailableSlots(schedule: any, existingAppointments: any[]) {
    const slots = [];
    const startTime = new Date(`${schedule.date.toISOString().split('T')[0]}T${schedule.startTime}`);
    const endTime = new Date(`${schedule.date.toISOString().split('T')[0]}T${schedule.endTime}`);
    
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + schedule.slotDuration * 60000);
      const timeStr = currentTime.toTimeString().split(' ')[0].substring(0, 5);
      
      // Check if this time slot is already booked
      const isBooked = existingAppointments.some(apt => apt.startTime === timeStr);
      
      slots.push({
        time: timeStr,
        endTime: slotEnd.toTimeString().split(' ')[0].substring(0, 5),
        duration: schedule.slotDuration,
        isAvailable: !isBooked,
        isBooked,
      });
      
      currentTime = new Date(currentTime.getTime() + (schedule.slotDuration + schedule.bufferTime) * 60000);
    }
    
    return slots;
  }

  private calculateDuration(startTime: string, endTime: string): number {
    const start = this.parseTime(startTime);
    const end = this.parseTime(endTime);
    return (end.getTime() - start.getTime()) / (1000 * 60); // Convert to minutes
  }

  private parseTime(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
}

