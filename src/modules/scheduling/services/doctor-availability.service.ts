import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from '../../auth/services/database.service';

@Injectable()
export class DoctorAvailabilityService {
  constructor(private db: DatabaseService) {}

  // ===========================================
  // DOCTOR AVAILABILITY MANAGEMENT
  // ===========================================

  /**
   * Set up recurring weekly availability for a doctor
   */
  async setRecurringAvailability(doctorId: string, availabilityData: {
    workingDays: string[]; // ['MONDAY', 'TUESDAY', etc.]
    startTime: string; // '08:00'
    endTime: string; // '18:00'
    slotDuration: number; // 30 minutes
    bufferTime: number; // 5 minutes
    breaks?: Array<{ startTime: string; endTime: string; }>;
  }) {
    const doctor = await this.db.user.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Create or update availability template
    let template = await this.db.doctorScheduleTemplate.findFirst({
      where: {
        doctorId,
        name: 'Default Weekly Schedule',
      },
    });

    if (template) {
      template = await this.db.doctorScheduleTemplate.update({
        where: { id: template.id },
        data: {
          description: 'Recurring weekly availability',
          isDefault: true,
          isActive: true,
        } as any,
      });
    } else {
      template = await this.db.doctorScheduleTemplate.create({
        data: {
          doctorId,
          name: 'Default Weekly Schedule',
          description: 'Recurring weekly availability',
          isDefault: true,
          isActive: true,
        } as any,
      });
    }

    // Create time slots for each working day
    for (const dayOfWeek of availabilityData.workingDays) {
      await this.createTimeSlotForDay(template.id, dayOfWeek, availabilityData);
    }

    return {
      success: true,
      data: template,
      message: 'Recurring availability set successfully',
    };
  }

  /**
   * Create time slot for a specific day
   */
  private async createTimeSlotForDay(templateId: string, dayOfWeek: string, availabilityData: any) {
    // Check if slot already exists
    const existingSlot = await this.db.doctorTimeSlot.findFirst({
      where: {
        templateId,
        dayOfWeek: dayOfWeek as any,
      },
    });

    if (existingSlot) {
      // Update existing slot
      await this.db.doctorTimeSlot.update({
        where: { id: existingSlot.id },
        data: {
          startTime: availabilityData.startTime,
          endTime: availabilityData.endTime,
          slotDuration: availabilityData.slotDuration,
          bufferTime: availabilityData.bufferTime,
          isAvailable: true,
        } as any,
      });
    } else {
      // Create new slot
      await this.db.doctorTimeSlot.create({
        data: {
          templateId,
          dayOfWeek: dayOfWeek as any,
          startTime: availabilityData.startTime,
          endTime: availabilityData.endTime,
          slotDuration: availabilityData.slotDuration,
          bufferTime: availabilityData.bufferTime,
          isAvailable: true,
          maxBookings: 1,
        } as any,
      });
    }
  }

  /**
   * Mark specific dates as unavailable
   */
  async markDateUnavailable(doctorId: string, date: string, reason?: string) {
    const exception = await this.db.doctorScheduleException.create({
      data: {
        doctorId,
        date: new Date(date),
        type: 'PERSONAL',
        reason: reason || 'Doctor unavailable',
        isAllDay: true,
      } as any,
    });

    return {
      success: true,
      data: exception,
      message: 'Date marked as unavailable',
    };
  }

  /**
   * Add custom working hours for specific dates
   */
  async addCustomHours(doctorId: string, date: string, startTime: string, endTime: string, reason?: string) {
    const exception = await this.db.doctorScheduleException.create({
      data: {
        doctorId,
        date: new Date(date),
        startTime,
        endTime,
        type: 'CUSTOM_HOURS',
        reason: reason || 'Custom working hours',
        isAllDay: false,
      } as any,
    });

    return {
      success: true,
      data: exception,
      message: 'Custom hours added successfully',
    };
  }

  /**
   * Get doctor's availability for a date range
   */
  async getAvailability(doctorId: string, startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Get recurring schedule
    const recurringSchedule = await this.db.doctorScheduleTemplate.findFirst({
      where: {
        doctorId,
        isActive: true,
        isDefault: true,
      },
      include: {
        timeSlots: true,
      },
    });

    // Get exceptions for the date range
    const exceptions = await this.db.doctorScheduleException.findMany({
      where: {
        doctorId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    // Generate availability for each date
    const availability = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const dayOfWeek = this.getDayOfWeek(currentDate);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Check for exceptions
      const exception = exceptions.find(ex => 
        ex.date.toISOString().split('T')[0] === dateStr
      );
      
      if (exception) {
        const isAvailable = exception.type !== 'PERSONAL';
        availability.push({
          date: dateStr,
          isAvailable,
          startTime: exception.startTime,
          endTime: exception.endTime,
          reason: exception.reason,
          type: 'exception',
        });
      } else if (recurringSchedule) {
        // Use recurring schedule
        const daySlot = recurringSchedule.timeSlots.find(slot => slot.dayOfWeek === dayOfWeek);
        if (daySlot) {
          availability.push({
            date: dateStr,
            isAvailable: daySlot.isAvailable,
            startTime: daySlot.startTime,
            endTime: daySlot.endTime,
            slotDuration: daySlot.slotDuration,
            bufferTime: daySlot.bufferTime,
            type: 'recurring',
          });
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      success: true,
      data: availability,
      message: 'Availability retrieved successfully',
    };
  }

  /**
   * Get available time slots for a specific date
   */
  async getAvailableSlots(doctorId: string, date: string) {
    const targetDate = new Date(date);
    const dayOfWeek = this.getDayOfWeek(targetDate);
    
    // Check for exceptions first
    const exception = await this.db.doctorScheduleException.findFirst({
      where: {
        doctorId,
        date: targetDate,
      },
    });

    let baseSchedule;
    if (exception) {
      if (exception.type === 'PERSONAL') {
        return {
          success: true,
          data: [],
          message: 'Doctor is unavailable on this date',
        };
      }
      baseSchedule = {
        startTime: exception.startTime || '09:00',
        endTime: exception.endTime || '17:00',
        slotDuration: 30,
        bufferTime: 10,
      };
    } else {
      // Get recurring schedule
      const recurringSchedule = await this.db.doctorScheduleTemplate.findFirst({
        where: {
          doctorId,
          isActive: true,
          isDefault: true,
        },
        include: {
          timeSlots: {
            where: {
              dayOfWeek: dayOfWeek as any,
            },
          },
        },
      });

      if (!recurringSchedule || recurringSchedule.timeSlots.length === 0) {
        return {
          success: true,
          data: [],
          message: 'No schedule found for this day',
        };
      }

      const daySlot = recurringSchedule.timeSlots[0];
      baseSchedule = {
        startTime: daySlot.startTime,
        endTime: daySlot.endTime,
        slotDuration: daySlot.slotDuration,
        bufferTime: daySlot.bufferTime,
      };
    }

    // Generate time slots
    const slots = this.generateTimeSlots(baseSchedule, date);
    
    // Check for existing appointments
    const existingAppointments = await this.db.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: targetDate,
        status: {
          not: 'CANCELLED',
        },
      },
    });

    // Mark slots as booked if they have appointments
    const availableSlots = slots.map(slot => {
      const isBooked = existingAppointments.some(apt => 
        apt.startTime === slot.startTime
      );
      
      return {
        ...slot,
        isAvailable: !isBooked,
        isBooked,
      };
    });

    return {
      success: true,
      data: availableSlots,
      message: 'Available slots retrieved successfully',
    };
  }

  /**
   * Generate time slots based on schedule
   */
  private generateTimeSlots(schedule: any, date: string) {
    const slots = [];
    const startTime = new Date(`${date}T${schedule.startTime}`);
    const endTime = new Date(`${date}T${schedule.endTime}`);
    
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + schedule.slotDuration * 60000);
      
      if (slotEnd <= endTime) {
        slots.push({
          id: `${date}-${currentTime.toTimeString().split(' ')[0]}`,
          startTime: currentTime.toTimeString().split(' ')[0].substring(0, 5),
          endTime: slotEnd.toTimeString().split(' ')[0].substring(0, 5),
          isAvailable: true,
          isBooked: false,
        });
      }
      
      currentTime = new Date(currentTime.getTime() + (schedule.slotDuration + schedule.bufferTime) * 60000);
    }
    
    return slots;
  }

  /**
   * Get day of week as string
   */
  private getDayOfWeek(date: Date): string {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[date.getDay()];
  }

  // ===========================================
  // AUTOMATED SCHEDULE GENERATION
  // ===========================================

  /**
   * Auto-generate slots for the next 30 days
   * This runs daily via cron job
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async generateDailySlots() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const doctors = await this.db.user.findMany({
      where: {
        role: 'DOCTOR',
      },
    });

    for (const doctor of doctors) {
      await this.generateSlotsForDoctor(doctor.id, tomorrow.toISOString().split('T')[0]);
    }

    console.log('Daily slot generation completed');
  }

  /**
   * Generate slots for a specific doctor and date
   */
  async generateSlotsForDoctor(doctorId: string, date: string) {
    const targetDate = new Date(date);
    const dayOfWeek = this.getDayOfWeek(targetDate);
    
    // Check if schedule already exists
    const existingSchedule = await this.db.doctorSchedule.findFirst({
      where: {
        doctorId,
        date: targetDate,
      },
    });

    if (existingSchedule) {
      return; // Already generated
    }

    // Get doctor's recurring schedule
    const recurringSchedule = await this.db.doctorScheduleTemplate.findFirst({
      where: {
        doctorId,
        isActive: true,
        isDefault: true,
      },
      include: {
        timeSlots: {
          where: {
            dayOfWeek: dayOfWeek as any,
          },
        },
      },
    });

    if (!recurringSchedule || recurringSchedule.timeSlots.length === 0) {
      return; // No schedule for this day
    }

    // Check for exceptions
    const exception = await this.db.doctorScheduleException.findFirst({
      where: {
        doctorId,
        date: targetDate,
      },
    });

    if (exception && exception.type === 'PERSONAL') {
      return; // Doctor is unavailable
    }

    // Get doctor profile
    const profile = await this.db.doctorProfile.findFirst({
      where: { doctorId },
    });

    if (!profile) {
      return; // No profile found
    }

    const daySlot = recurringSchedule.timeSlots[0];
    const scheduleData = exception ? {
      startTime: exception.startTime || daySlot.startTime,
      endTime: exception.endTime || daySlot.endTime,
      slotDuration: daySlot.slotDuration,
      bufferTime: daySlot.bufferTime,
    } : {
      startTime: daySlot.startTime,
      endTime: daySlot.endTime,
      slotDuration: daySlot.slotDuration,
      bufferTime: daySlot.bufferTime,
    };

    // Create the schedule
    await this.db.doctorSchedule.create({
      data: {
        doctorId,
        profileId: profile.id,
        templateId: recurringSchedule.id,
        dayOfWeek: dayOfWeek as any,
        startTime: scheduleData.startTime,
        endTime: scheduleData.endTime,
        date: targetDate,
        slotDuration: scheduleData.slotDuration,
        bufferTime: scheduleData.bufferTime,
        maxBookings: 1,
        location: 'Main Clinic',
        serviceType: 'CONSULTATION',
        isAvailable: true,
      } as any,
    });
  }

  // ===========================================
  // UTILITY METHODS
  // ===========================================

  /**
   * Get doctor's working hours for a specific date
   */
  async getWorkingHours(doctorId: string, date: string) {
    const targetDate = new Date(date);
    const dayOfWeek = this.getDayOfWeek(targetDate);
    
    // Check for exceptions first
    const exception = await this.db.doctorScheduleException.findFirst({
      where: {
        doctorId,
        date: targetDate,
      },
    });

    if (exception) {
      const isAvailable = exception.type !== 'PERSONAL';
      return {
        startTime: exception.startTime || '09:00',
        endTime: exception.endTime || '17:00',
        isAvailable,
        reason: exception.reason,
        type: 'exception',
      };
    }

    // Get recurring schedule
    const recurringSchedule = await this.db.doctorScheduleTemplate.findFirst({
      where: {
        doctorId,
        isActive: true,
        isDefault: true,
      },
      include: {
        timeSlots: {
          where: {
            dayOfWeek: dayOfWeek as any,
          },
        },
      },
    });

    if (!recurringSchedule || recurringSchedule.timeSlots.length === 0) {
      return {
        startTime: null,
        endTime: null,
        isAvailable: false,
        reason: 'No schedule for this day',
        type: 'no_schedule',
      };
    }

    const daySlot = recurringSchedule.timeSlots[0];
    return {
      startTime: daySlot.startTime,
      endTime: daySlot.endTime,
      isAvailable: daySlot.isAvailable,
      reason: null,
      type: 'recurring',
    };
  }
}
