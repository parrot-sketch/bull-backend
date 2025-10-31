import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../../auth/services/database.service';
import { NotificationService } from '../../notifications/services/notification.service';
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
    private notificationService: NotificationService,
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
    } as unknown as Prisma.DoctorScheduleTemplateCreateInput,
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
  data: updateData as unknown as Prisma.DoctorScheduleTemplateUpdateInput,
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
      } as unknown as Prisma.DoctorTimeSlotCreateInput,
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
  data: updateData as Prisma.DoctorTimeSlotUpdateInput,
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
    // Load template and its time slots
    const template: any = await this.db.doctorScheduleTemplate.findUnique({
      where: { id: templateId },
      include: { timeSlots: true },
    });

    if (!template) {
      throw new NotFoundException('Schedule template not found');
    }

    const targetDate = new Date(date);

    // Check for exceptions (blocked day)
    const exception = await this.db.doctorScheduleException.findFirst({
      where: { doctorId, date: targetDate, type: 'BLOCKED' },
    });

    if (exception) {
      throw new BadRequestException('Cannot apply template on a blocked date');
    }

    // Check if schedule already exists for this date
    const existingSchedule = await this.db.doctorSchedule.findFirst({
      where: {
        doctorId,
        date: targetDate,
      },
    });

    if (existingSchedule) {
      throw new BadRequestException('Schedule already exists for this date');
    }

    // Determine day of week and derive default working window from template or timeSlots
    const dayOfWeek = this.getDayOfWeek(targetDate);
    const slotsForDay = (template.timeSlots || []).filter((s: any) => s.dayOfWeek === dayOfWeek);

    if (!slotsForDay || slotsForDay.length === 0) {
      throw new BadRequestException('Template has no time slots for the selected day');
    }

    // Determine aggregated start/end time for the schedule
    const sortedSlots = slotsForDay.sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));
    const scheduleStart = sortedSlots[0].startTime;
    const scheduleEnd = sortedSlots.reduce((acc: string, s: any) => (s.endTime > acc ? s.endTime : acc), sortedSlots[0].endTime);

    // Create a DoctorSchedule row for the date
    const schedule = await this.db.doctorSchedule.create({
      data: {
        doctorId,
        templateId,
        date: targetDate,
        dayOfWeek,
        startTime: scheduleStart,
        endTime: scheduleEnd,
        slotDuration: sortedSlots[0].slotDuration || 30,
        bufferTime: sortedSlots[0].bufferTime || 0,
        isAvailable: true,
  location: template.location ? JSON.stringify(template.location) : undefined,
        serviceType: sortedSlots[0].serviceType || undefined,
        notes: `Generated from template ${template.name}`,
      } as unknown as Prisma.DoctorScheduleCreateInput,
    });

    // Generate DoctorDaySlot rows based on each timeSlot in the template for that day
    const daySlotsToCreate: Prisma.DoctorDaySlotCreateManyInput[] = [];
    for (const ts of slotsForDay) {
      const slotStart = ts.startTime; // HH:MM
      const slotEnd = ts.endTime; // HH:MM
  const duration = ts.slotDuration || template.applicationRules?.defaultSlotDuration || 30;
  const bufferBefore = ts.bufferBefore ?? ts.bufferTime ?? 0;
  const bufferAfter = ts.bufferAfter ?? 0;

      // compute start cursor as time after bufferBefore
      let cursor = this.shiftTime(slotStart, bufferBefore);
      const absoluteEnd = this.shiftTime(slotEnd, -bufferAfter);

      while (this.timeLessThanOrEqual(this.addMinutes(cursor, duration), absoluteEnd)) {
        const slotStartStr = cursor;
        const slotEndStr = this.addMinutes(cursor, duration);

        daySlotsToCreate.push({
          doctorId,
          scheduleId: schedule.id,
          timeSlotId: ts.id,
          date: targetDate,
          startTime: slotStartStr,
          endTime: slotEndStr,
          isAvailable: true,
          isBooked: false,
          slotCapacity: ts.maxBookings ?? 1,
          currentBookings: 0,
          slotMetadata: ts.meta ?? undefined,
          timezone: template.timezone ?? undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

  // advance cursor by slot duration + bufferAfter (per-slot buffer)
  cursor = this.addMinutes(cursor, duration + ((ts.bufferAfter ?? ts.bufferTime) ?? 0));
      }
    }

    // Persist day slots using createMany with skipDuplicates to avoid unique constraint errors
    if (daySlotsToCreate.length > 0) {
      await this.db.$transaction([
        this.db.doctorDaySlot.createMany({ data: daySlotsToCreate, skipDuplicates: true }),
      ]);
    }

    // Return created day slots for the schedule date
    const createdSlots = await this.db.doctorDaySlot.findMany({ where: { doctorId, date: targetDate }, orderBy: { startTime: 'asc' } });

    return {
      success: true,
      data: {
        schedule,
        slots: createdSlots,
      },
      message: 'Schedule generated and day slots created successfully',
    };
  }

  // Helper: add minutes to HH:MM string and return HH:MM
  private addMinutes(timeStr: string, minutes: number) {
    const [hh, mm] = timeStr.split(':').map((n: string) => parseInt(n, 10));
    const d = new Date(2000, 0, 1, hh, mm);
    d.setMinutes(d.getMinutes() + minutes);
    return d.toTimeString().split(' ')[0].substring(0,5);
  }

  // Helper: shift time by minutes (can be negative)
  private shiftTime(timeStr: string, minutes: number) {
    return this.addMinutes(timeStr, minutes);
  }

  // Helper: compare HH:MM strings
  private timeLessThanOrEqual(t1: string, t2: string) {
    return t1 <= t2;
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
      include: {
        template: true,
      },
    });

    if (!schedule) {
      return {
        success: true,
        data: {
          isAvailable: false,
          date,
        },
        message: 'No schedule found for this date',
      };
    }

    // Generate time slots for the schedule
    const timeSlots = this.generateTimeSlotsForSchedule(schedule);

    return {
      success: true,
      data: {
        isAvailable: true,
        template: schedule.template,
        timeSlots,
        schedule,
      },
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
    // Normalize date string to YYYY-MM-DD format
    const dateStr = date.split('T')[0]; // Extract just the date part if ISO string
    const scheduleDate = new Date(dateStr + 'T00:00:00.000Z'); // Ensure UTC midnight
    
    console.log(`[BACKEND] updateAvailability called:`, { doctorId, date, dateStr, scheduleDate, slotCount: timeSlots.length });
    
    return await this.db.$transaction(async (tx) => {
      let schedule = await tx.doctorSchedule.findFirst({
        where: {
          doctorId,
          date: scheduleDate,
        },
      });

      // If schedule doesn't exist, create it
      if (!schedule) {
        // Get or create a DoctorProfile for this doctor
        let profile = await tx.doctorProfile.findUnique({
          where: { doctorId },
        });

        if (!profile) {
          profile = await tx.doctorProfile.create({
            data: {
              doctorId,
              specialties: ['General Practice'],
              isAcceptingNewPatients: true,
            } as any,
          });
        }

        // Get or create a default template for this doctor
        let template: any = await tx.doctorScheduleTemplate.findFirst({
          where: { doctorId, isDefault: true },
        });

        if (!template) {
          template = await tx.doctorScheduleTemplate.create({
            data: {
              doctorId,
              name: 'Default Availability',
              isDefault: true,
              isActive: true,
            } as any,
          });
        }

        // Extract day of week from date
        const dayOfWeekMap: any = {
          0: 'SUNDAY',
          1: 'MONDAY',
          2: 'TUESDAY',
          3: 'WEDNESDAY',
          4: 'THURSDAY',
          5: 'FRIDAY',
          6: 'SATURDAY',
        };
        const dayOfWeek = dayOfWeekMap[scheduleDate.getDay()];

        // Get the first and last time slots to determine working hours
        const sortedSlots = timeSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
        const startTime = sortedSlots[0]?.startTime || '09:00';
        const endTime = sortedSlots[sortedSlots.length - 1]?.endTime || '17:00';
        const slotDuration = 30; // Default slot duration in minutes
        const bufferTime = 5; // Default buffer time in minutes

        // Create the schedule
        schedule = await tx.doctorSchedule.create({
          data: {
            doctor: { connect: { id: doctorId } },
            profile: profile ? { connect: { id: profile.id } } : undefined,
            template: template ? { connect: { id: template.id } } : undefined,
            dayOfWeek,
            date: scheduleDate,
            startTime,
            endTime,
            slotDuration,
            bufferTime,
            isAvailable: timeSlots.some(slot => slot.isAvailable),
            notes: `Availability created for ${date}`,
          } as unknown as Prisma.DoctorScheduleCreateInput,
        });
      } else {
        // Update existing schedule
        const availableSlots = timeSlots.filter(slot => slot.isAvailable).length;
        const totalSlots = timeSlots.length;
        
        await tx.doctorSchedule.update({
          where: { id: schedule.id },
          data: {
            isAvailable: availableSlots > 0,
            notes: `Updated availability: ${availableSlots}/${totalSlots} slots available`,
          },
        });
      }

      // Delete all existing DoctorDaySlot entries for this date
      await tx.doctorDaySlot.deleteMany({
        where: {
          doctorId,
          date: scheduleDate,
        },
      });

      // Bulk insert the new time slots into DoctorDaySlot
      const daySlotsToCreate = timeSlots.map((slot) => ({
        doctorId,
        scheduleId: schedule.id,
        date: scheduleDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.isAvailable ?? true,
        isBooked: false,
        slotCapacity: 1,
        currentBookings: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      if (daySlotsToCreate.length > 0) {
        await tx.doctorDaySlot.createMany({
          data: daySlotsToCreate,
          skipDuplicates: true,
        });
      }

      // Fetch the created slots
      const createdSlots = await tx.doctorDaySlot.findMany({
        where: {
          doctorId,
          date: scheduleDate,
        },
        orderBy: {
          startTime: 'asc',
        },
      });

      return {
        success: true,
        data: {
          schedule,
          timeSlots: createdSlots.map(slot => ({
            id: slot.id,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: slot.isAvailable,
            isBooked: slot.isBooked,
          })),
        },
        message: 'Availability updated successfully',
      };
    });
  }

  // ===========================================
  // EXCEPTIONS
  // ===========================================

  async createException(doctorId: string, exceptionData: CreateExceptionDto) {
    const exception = await this.db.doctorScheduleException.create({
      data: {
        doctorId,
        ...exceptionData,
      } as unknown as Prisma.DoctorScheduleExceptionCreateInput,
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
        patient: { connect: { id: appointmentData.patientId } },
        doctor: { connect: { id: appointmentData.doctorId } },
        schedule: appointmentData.scheduleId ? { connect: { id: appointmentData.scheduleId } } : undefined,
        appointmentDate: new Date(appointmentData.date),
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        duration: 30, // Default duration
        type: appointmentData.type,
        status: 'SCHEDULED',
        notes: appointmentData.notes,
      } as unknown as Prisma.AppointmentCreateInput,
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

  async getAppointments(doctorId: string, startDate?: string, endDate?: string, status?: string, limit?: number) {
    const where: any = { doctorId };
    
    if (startDate && endDate) {
      where.appointmentDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Handle status filter - can be comma-separated or single value
    if (status) {
      const statusArray = status.includes(',') ? status.split(',') : [status];
      
      // Map frontend status values to Prisma enum values
      // Frontend uses "SCHEDULED" but Prisma uses "CONFIRMED"
      const validStatuses = statusArray.map((s: string) => {
        const trimmed = s.trim().toUpperCase();
        // Map SCHEDULED to CONFIRMED for Prisma compatibility
        if (trimmed === 'SCHEDULED') {
          return 'CONFIRMED';
        }
        return trimmed;
      });
      
      // Validate status values match Prisma enum
      const validEnumValues = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW', 'RESCHEDULED', 'REJECTED'];
      const filteredStatuses = validStatuses.filter((s: string) => validEnumValues.includes(s));
      
      if (filteredStatuses.length > 0) {
        where.status = { in: filteredStatuses as any };
      }
    }

    const appointments = await this.db.appointment.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { appointmentDate: 'desc' },
      ...(limit && { take: limit }),
    });

    return {
      success: true,
      data: appointments,
      message: 'Appointments retrieved successfully',
    };
  }

  async updateAppointment(appointmentId: string, updateData: UpdateAppointmentDto) {
    const appointment = await this.db.appointment.findUnique({ 
      where: { id: appointmentId },
      include: { patient: true, doctor: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // If confirming a PENDING appointment, only check for conflicts with OTHER appointments
    // Don't revalidate availability since the patient already booked this slot
    if (updateData.status === 'CONFIRMED' && appointment.status === 'PENDING') {
      const appointmentDate = updateData.date 
        ? new Date(updateData.date) 
        : appointment.appointmentDate;
      const startTime = updateData.startTime || appointment.startTime;
      const endTime = updateData.endTime || appointment.endTime;

      // Check for conflicts with OTHER CONFIRMED appointments only (excluding current appointment)
      // We allow confirming PENDING appointments even if there are other PENDING ones (doctor can manage)
      // But we prevent confirming if there's already a CONFIRMED appointment at the same time
      const conflicts = await this.db.appointment.findFirst({
        where: {
          doctorId: appointment.doctorId,
          appointmentDate,
          startTime,
          id: { not: appointmentId },
          status: 'CONFIRMED', // Only check against CONFIRMED appointments
        },
      });

      if (conflicts) {
        // If there's a conflict with a confirmed appointment, prevent it
        throw new BadRequestException(
          `This time slot conflicts with another confirmed appointment. ` +
          `Please resolve the conflict or reschedule one of the appointments.`
        );
      }

      // Note: We don't check schedule availability here because:
      // 1. The appointment already exists (PENDING status)
      // 2. The patient already booked this slot
      // 3. The doctor is confirming an existing booking, not creating a new one
      // The schedule should be updated separately if needed

      // Update appointment with confirmed status
      const updatedAppointment = await this.db.appointment.update({
        where: { id: appointmentId },
        data: {
        status: 'CONFIRMED',
        confirmedAt: new Date(),
        requiresConfirmation: false,
        ...(updateData.date && { appointmentDate: new Date(updateData.date) }),
        ...(updateData.startTime && { startTime: updateData.startTime }),
        ...(updateData.endTime && { endTime: updateData.endTime }),
        ...(updateData.notes && { notes: updateData.notes }),
      } as unknown as Prisma.AppointmentUpdateInput,
        include: {
          patient: true,
          doctor: true,
        },
      });

      // Send notification to patient
      try {
        await this.notificationService.notifyAppointmentScheduled(updatedAppointment);
      } catch (error) {
        // If notification fails, log but don't fail the update
        console.error('Failed to send notification:', error);
      }

      return {
        success: true,
        data: updatedAppointment,
        message: 'Appointment scheduled successfully. Patient has been notified.',
      };
    }

    // For other updates, proceed normally
    const updatedAppointment = await this.db.appointment.update({
      where: { id: appointmentId },
      data: updateData as any,
      include: {
        patient: true,
        doctor: true,
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