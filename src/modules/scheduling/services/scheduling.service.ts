import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../auth/services/database.service';
import {
    BookAppointmentDto,
    CreateExceptionDto,
    CreateScheduleTemplateDto,
    CreateTimeSlotDto,
    UpdateAppointmentDto,
    UpdateScheduleTemplateDto,
    UpdateTimeSlotDto
} from '../dto/scheduling.dto';
import { AppointmentManagementService } from './appointment-management.service';
import { DoctorAvailabilityService } from './doctor-availability.service';
import { SlotEngineService } from './slot-engine.service';

@Injectable()
export class SchedulingService {
  constructor(
    private db: DatabaseService,
    public doctorAvailability: DoctorAvailabilityService,
    public slotEngine: SlotEngineService,
    public appointmentManagement: AppointmentManagementService,
  ) {}

  // ===========================================
  // SCHEDULE TEMPLATES
  // ===========================================

  async createScheduleTemplate(doctorId: string, templateData: CreateScheduleTemplateDto) {
    const doctor = await this.db.user.findUnique({ where: { id: doctorId } });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const template = await this.db.doctorScheduleTemplate.create({
      data: {
        doctorId,
        ...templateData,
      } as any,
      include: {
        timeSlots: true,
      },
    });

    return {
      success: true,
      data: template,
      message: 'Schedule template created successfully',
    };
  }

  async getScheduleTemplates(doctorId: string) {
    const templates = await this.db.doctorScheduleTemplate.findMany({
      where: { doctorId },
      include: {
        timeSlots: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: templates,
      message: 'Schedule templates retrieved successfully',
    };
  }

  async updateScheduleTemplate(templateId: string, updateData: UpdateScheduleTemplateDto) {
    const template = await this.db.doctorScheduleTemplate.findUnique({ where: { id: templateId } });

    if (!template) {
      throw new NotFoundException('Schedule template not found');
    }

    const updatedTemplate = await this.db.doctorScheduleTemplate.update({
      where: { id: templateId },
      data: updateData as any,
      include: {
        timeSlots: true,
      },
    });

    return {
      success: true,
      data: updatedTemplate,
      message: 'Schedule template updated successfully',
    };
  }

  async deleteScheduleTemplate(templateId: string) {
    const template = await this.db.doctorScheduleTemplate.findUnique({ where: { id: templateId } });

    if (!template) {
      throw new NotFoundException('Schedule template not found');
    }

    await this.db.doctorScheduleTemplate.delete({ where: { id: templateId } });

    return {
      success: true,
      message: 'Schedule template deleted successfully',
    };
  }

  // ===========================================
  // TIME SLOTS
  // ===========================================

  async createTimeSlot(templateId: string, slotData: CreateTimeSlotDto) {
    const template = await this.db.doctorScheduleTemplate.findUnique({ where: { id: templateId } });

    if (!template) {
      throw new NotFoundException('Schedule template not found');
    }

    const timeSlot = await this.db.doctorTimeSlot.create({
      data: {
        templateId,
        ...slotData,
      } as any,
    });

    return {
      success: true,
      data: timeSlot,
      message: 'Time slot created successfully',
    };
  }

  async updateTimeSlot(slotId: string, updateData: UpdateTimeSlotDto) {
    const timeSlot = await this.db.doctorTimeSlot.findUnique({ where: { id: slotId } });

    if (!timeSlot) {
      throw new NotFoundException('Time slot not found');
    }

    const updatedSlot = await this.db.doctorTimeSlot.update({
      where: { id: slotId },
      data: updateData as any,
    });

    return {
      success: true,
      data: updatedSlot,
      message: 'Time slot updated successfully',
    };
  }

  async deleteTimeSlot(slotId: string) {
    const timeSlot = await this.db.doctorTimeSlot.findUnique({ where: { id: slotId } });

    if (!timeSlot) {
      throw new NotFoundException('Time slot not found');
    }

    await this.db.doctorTimeSlot.delete({ where: { id: slotId } });

    return {
      success: true,
      message: 'Time slot deleted successfully',
    };
  }

  // ===========================================
  // SCHEDULE GENERATION
  // ===========================================

  async generateSchedule(doctorId: string, templateId: string, date: string) {
    const template = await this.db.doctorScheduleTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException('Schedule template not found');
    }

    // Check if schedule already exists for this date
    const existingSchedule = await this.db.doctorSchedule.findFirst({
      where: {
        doctorId,
        date: new Date(date),
      },
    });

    if (existingSchedule) {
      throw new BadRequestException('Schedule already exists for this date');
    }

    // Get doctor profile
    const profile = await this.db.doctorProfile.findFirst({
      where: { doctorId },
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    // Create the schedule
    const schedule = await this.db.doctorSchedule.create({
      data: {
        doctorId,
        profileId: profile.id,
        templateId,
        dayOfWeek: this.getDayOfWeek(new Date(date)),
        startTime: '09:00', // Default start time
        endTime: '17:00',   // Default end time
        date: new Date(date),
        slotDuration: 30,
        bufferTime: 10,
        maxBookings: 1,
        location: 'Main Clinic',
        serviceType: 'CONSULTATION',
        isAvailable: true,
      } as any,
    });

    return {
      success: true,
      data: schedule,
      message: 'Schedule generated successfully',
    };
  }

  private getDayOfWeek(date: Date): string {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[date.getDay()];
  }

  private generateTimeSlotsFromTemplate(template: any, date: string) {
    const slots = [];
    const startTime = new Date(`${date}T${template.startTime}`);
    const endTime = new Date(`${date}T${template.endTime}`);
    
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + template.slotDuration * 60000);
      
      slots.push({
        startTime: currentTime.toTimeString().split(' ')[0].substring(0, 5),
        endTime: slotEnd.toTimeString().split(' ')[0].substring(0, 5),
        isAvailable: true,
      });
      
      currentTime = new Date(currentTime.getTime() + (template.slotDuration + template.bufferTime) * 60000);
    }
    
    return slots;
  }

  // ===========================================
  // AVAILABILITY
  // ===========================================

  async getAvailability(doctorId: string, date: string) {
    const schedule = await this.db.doctorSchedule.findFirst({
      where: {
        doctorId,
        date: new Date(date),
        isAvailable: true,
      },
    });

    if (!schedule) {
      return {
        success: true,
        data: [],
        message: 'No schedule found for this date',
      };
    }

    // Generate time slots for the schedule
    const timeSlots = this.generateTimeSlotsForSchedule(schedule);

    return {
      success: true,
      data: timeSlots,
      message: 'Availability retrieved successfully',
    };
  }

  private generateTimeSlotsForSchedule(schedule: any) {
    const slots = [];
    const startTime = new Date(`${schedule.date.toISOString().split('T')[0]}T${schedule.startTime}`);
    const endTime = new Date(`${schedule.date.toISOString().split('T')[0]}T${schedule.endTime}`);
    
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + schedule.slotDuration * 60000);
      
      slots.push({
        id: `${schedule.id}-${currentTime.toTimeString().split(' ')[0]}`,
        startTime: currentTime.toTimeString().split(' ')[0].substring(0, 5),
        endTime: slotEnd.toTimeString().split(' ')[0].substring(0, 5),
        isAvailable: true,
        isBooked: false,
      });
      
      currentTime = new Date(currentTime.getTime() + (schedule.slotDuration + schedule.bufferTime) * 60000);
    }
    
    return slots;
  }

  async updateAvailability(doctorId: string, date: string, timeSlots: any[]) {
    const schedule = await this.db.doctorSchedule.findFirst({
      where: {
        doctorId,
        date: new Date(date),
      },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found for this date');
    }

    // For now, just update the schedule's availability
    // In a more complex system, you'd store individual time slot availability
    const availableSlots = timeSlots.filter(slot => slot.isAvailable).length;
    const totalSlots = timeSlots.length;
    
    await this.db.doctorSchedule.update({
      where: { id: schedule.id },
      data: {
        isAvailable: availableSlots > 0,
        notes: `Updated availability: ${availableSlots}/${totalSlots} slots available`,
      },
    });

    return {
      success: true,
      message: 'Availability updated successfully',
    };
  }

  // ===========================================
  // EXCEPTIONS
  // ===========================================

  async createException(doctorId: string, exceptionData: CreateExceptionDto) {
    const exception = await this.db.doctorScheduleException.create({
      data: {
        doctorId,
        ...exceptionData,
      } as any,
    });

    return {
      success: true,
      data: exception,
      message: 'Schedule exception created successfully',
    };
  }

  async getExceptions(doctorId: string, startDate?: string, endDate?: string) {
    const where: any = { doctorId };
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const exceptions = await this.db.doctorScheduleException.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return {
      success: true,
      data: exceptions,
      message: 'Schedule exceptions retrieved successfully',
    };
  }

  async deleteException(exceptionId: string) {
    const exception = await this.db.doctorScheduleException.findUnique({ where: { id: exceptionId } });

    if (!exception) {
      throw new NotFoundException('Schedule exception not found');
    }

    await this.db.doctorScheduleException.delete({ where: { id: exceptionId } });

    return {
      success: true,
      message: 'Schedule exception deleted successfully',
    };
  }

  // ===========================================
  // APPOINTMENTS
  // ===========================================

  async bookAppointment(appointmentData: BookAppointmentDto) {
    // Check if schedule exists and is available
    const schedule = await this.db.doctorSchedule.findFirst({
      where: {
        id: appointmentData.scheduleId,
        isAvailable: true,
      },
    });

    if (!schedule) {
      throw new BadRequestException('Schedule is not available');
    }

    // Check for existing appointment at the same time
    const existingAppointment = await this.db.appointment.findFirst({
      where: {
        doctorId: appointmentData.doctorId,
        appointmentDate: new Date(appointmentData.date),
        startTime: appointmentData.startTime,
        status: { not: 'CANCELLED' },
      },
    });

    if (existingAppointment) {
      throw new BadRequestException('Time slot is already booked');
    }

    const appointment = await this.db.appointment.create({
      data: {
        patientId: appointmentData.patientId,
        doctorId: appointmentData.doctorId,
        scheduleId: appointmentData.scheduleId,
        appointmentDate: new Date(appointmentData.date),
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        duration: 30, // Default duration
        type: appointmentData.type,
        status: 'SCHEDULED',
        notes: appointmentData.notes,
      } as any,
      include: {
        patient: true,
      },
    });

    return {
      success: true,
      data: appointment,
      message: 'Appointment booked successfully',
    };
  }

  async getAppointments(doctorId: string, startDate?: string, endDate?: string) {
    const where: any = { doctorId };
    
    if (startDate && endDate) {
      where.appointmentDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const appointments = await this.db.appointment.findMany({
      where,
      include: {
        patient: true,
      },
      orderBy: { appointmentDate: 'desc' },
    });

    return {
      success: true,
      data: appointments,
      message: 'Appointments retrieved successfully',
    };
  }

  async updateAppointment(appointmentId: string, updateData: UpdateAppointmentDto) {
    const appointment = await this.db.appointment.findUnique({ where: { id: appointmentId } });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const updatedAppointment = await this.db.appointment.update({
      where: { id: appointmentId },
      data: updateData as any,
      include: {
        patient: true,
      },
    });

    return {
      success: true,
      data: updatedAppointment,
      message: 'Appointment updated successfully',
    };
  }

  async cancelAppointment(appointmentId: string) {
    const appointment = await this.db.appointment.findUnique({ where: { id: appointmentId } });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const updatedAppointment = await this.db.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CANCELLED' },
    });

    return {
      success: true,
      data: updatedAppointment,
      message: 'Appointment cancelled successfully',
    };
  }
}