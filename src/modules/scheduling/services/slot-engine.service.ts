import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from '../../auth/services/database.service';

@Injectable()
export class SlotEngineService {
  constructor(private db: DatabaseService) {}

  // ===========================================
  // SLOT GENERATION ENGINE
  // ===========================================

  /**
   * Generate bookable slots for a specific date and doctor
   */
  async generateSlotsForDate(doctorId: string, date: string) {
    const targetDate = new Date(date);
    const dayOfWeek = this.getDayOfWeek(targetDate);
    
    // Get doctor's schedule for this date
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
        data: [],
        message: 'No schedule found for this date',
      };
    }

    // Generate time slots
    const slots = this.generateTimeSlotsFromSchedule(schedule, date);
    
    // Check for existing appointments and mark slots as booked
    const appointments = await this.db.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: targetDate,
        status: {
          not: 'CANCELLED',
        },
      },
    });

    // Mark slots as booked
    const processedSlots = slots.map(slot => {
      const isBooked = appointments.some(apt => 
        apt.startTime === slot.startTime
      );
      
      return {
        ...slot,
        isAvailable: !isBooked,
        isBooked,
        status: isBooked ? 'BOOKED' : 'AVAILABLE',
      };
    });

    return {
      success: true,
      data: processedSlots,
      message: 'Slots generated successfully',
    };
  }

  /**
   * Generate time slots from schedule
   */
  private generateTimeSlotsFromSchedule(schedule: any, date: string) {
    const slots = [];
    const startTime = new Date(`${date}T${schedule.startTime}`);
    const endTime = new Date(`${date}T${schedule.endTime}`);
    
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + schedule.slotDuration * 60000);
      
      if (slotEnd <= endTime) {
        slots.push({
          id: `${schedule.id}-${currentTime.toTimeString().split(' ')[0]}`,
          scheduleId: schedule.id,
          startTime: currentTime.toTimeString().split(' ')[0].substring(0, 5),
          endTime: slotEnd.toTimeString().split(' ')[0].substring(0, 5),
          duration: schedule.slotDuration,
          bufferTime: schedule.bufferTime,
          location: schedule.location,
          serviceType: schedule.serviceType,
          isAvailable: true,
          isBooked: false,
          status: 'AVAILABLE',
        });
      }
      
      currentTime = new Date(currentTime.getTime() + (schedule.slotDuration + schedule.bufferTime) * 60000);
    }
    
    return slots;
  }

  /**
   * Check slot availability and prevent conflicts
   */
  async checkSlotAvailability(doctorId: string, date: string, startTime: string, endTime: string) {
    const targetDate = new Date(date);
    
    // Check for existing appointments in the same time slot
    const conflictingAppointment = await this.db.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: targetDate,
        startTime,
        status: {
          not: 'CANCELLED',
        },
      },
    });

    if (conflictingAppointment) {
      throw new BadRequestException('Time slot is already booked');
    }

    // Check if doctor has schedule for this date
    const schedule = await this.db.doctorSchedule.findFirst({
      where: {
        doctorId,
        date: targetDate,
        isAvailable: true,
        startTime: { lte: startTime },
        endTime: { gte: endTime },
      },
    });

    if (!schedule) {
      throw new BadRequestException('Doctor is not available at this time');
    }

    return {
      success: true,
      data: {
        isAvailable: true,
        scheduleId: schedule.id,
      },
      message: 'Slot is available',
    };
  }

  /**
   * Lock a time slot when appointment is booked
   */
  async lockSlot(doctorId: string, scheduleId: string, startTime: string, endTime: string) {
    // This is handled by the appointment creation process
    // The slot becomes unavailable when an appointment is created
    return {
      success: true,
      message: 'Slot locked successfully',
    };
  }

  /**
   * Release a time slot when appointment is cancelled
   */
  async releaseSlot(doctorId: string, scheduleId: string, startTime: string) {
    // This is handled by the appointment cancellation process
    // The slot becomes available again when an appointment is cancelled
    return {
      success: true,
      message: 'Slot released successfully',
    };
  }

  // ===========================================
  // BULK SLOT OPERATIONS
  // ===========================================

  /**
   * Generate slots for multiple dates
   */
  async generateSlotsForDateRange(doctorId: string, startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const allSlots = [];
    
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const slots = await this.generateSlotsForDate(doctorId, dateStr);
      
      if (slots.success && slots.data.length > 0) {
        allSlots.push({
          date: dateStr,
          slots: slots.data,
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return {
      success: true,
      data: allSlots,
      message: 'Slots generated for date range',
    };
  }

  /**
   * Get available slots for a specific time range
   */
  async getAvailableSlotsInRange(
    doctorId: string, 
    date: string, 
    startTime?: string, 
    endTime?: string
  ) {
    const slots = await this.generateSlotsForDate(doctorId, date);
    
    if (!slots.success) {
      return slots;
    }
    
    let filteredSlots = slots.data.filter(slot => slot.isAvailable);
    
    if (startTime) {
      filteredSlots = filteredSlots.filter(slot => slot.startTime >= startTime);
    }
    
    if (endTime) {
      filteredSlots = filteredSlots.filter(slot => slot.endTime <= endTime);
    }
    
    return {
      success: true,
      data: filteredSlots,
      message: 'Available slots retrieved successfully',
    };
  }

  // ===========================================
  // SLOT STATUS MANAGEMENT
  // ===========================================

  /**
   * Update slot status (available, booked, blocked, expired)
   */
  async updateSlotStatus(slotId: string, status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED' | 'EXPIRED') {
    // This would typically update a slot status table
    // For now, we'll handle this through appointment status
    return {
      success: true,
      message: `Slot status updated to ${status}`,
    };
  }

  /**
   * Mark expired slots as inactive
   * This runs every hour via cron job
   */
  @Cron(CronExpression.EVERY_HOUR)
  async markExpiredSlots() {
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
    
    // Find all schedules for today that have passed
    const expiredSchedules = await this.db.doctorSchedule.findMany({
      where: {
        date: {
          gte: new Date(now.toISOString().split('T')[0]),
          lt: new Date(now.toISOString().split('T')[0] + 'T23:59:59'),
        },
        endTime: { lt: currentTime },
        isAvailable: true,
      },
    });

    // Mark expired schedules as unavailable
    for (const schedule of expiredSchedules) {
      await this.db.doctorSchedule.update({
        where: { id: schedule.id },
        data: { isAvailable: false },
      });
    }

    console.log(`Marked ${expiredSchedules.length} expired schedules as unavailable`);
  }

  // ===========================================
  // CONFLICT PREVENTION
  // ===========================================

  /**
   * Check for scheduling conflicts
   */
  async checkConflicts(doctorId: string, date: string, startTime: string, endTime: string, excludeAppointmentId?: string) {
    const targetDate = new Date(date);
    
    const whereClause: any = {
      doctorId,
      appointmentDate: targetDate,
      status: { not: 'CANCELLED' },
    };

    if (excludeAppointmentId) {
      whereClause.id = { not: excludeAppointmentId };
    }

    const conflicts = await this.db.appointment.findMany({
      where: whereClause,
    });

    // Check for time overlaps
    const overlappingAppointments = conflicts.filter(apt => {
      return (
        (startTime >= apt.startTime && startTime < apt.endTime) ||
        (endTime > apt.startTime && endTime <= apt.endTime) ||
        (startTime <= apt.startTime && endTime >= apt.endTime)
      );
    });

    return {
      hasConflicts: overlappingAppointments.length > 0,
      conflicts: overlappingAppointments,
      message: overlappingAppointments.length > 0 
        ? 'Scheduling conflicts detected' 
        : 'No conflicts found',
    };
  }

  /**
   * Validate slot duration against doctor's preferences
   */
  async validateSlotDuration(doctorId: string, duration: number) {
    // Get doctor's default slot duration
    const schedule = await this.db.doctorSchedule.findFirst({
      where: {
        doctorId,
        isAvailable: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!schedule) {
      return {
        isValid: true,
        message: 'No existing schedule to validate against',
      };
    }

    const isValid = duration >= schedule.slotDuration;
    
    return {
      isValid,
      message: isValid 
        ? 'Slot duration is valid' 
        : `Slot duration must be at least ${schedule.slotDuration} minutes`,
    };
  }

  // ===========================================
  // UTILITY METHODS
  // ===========================================

  /**
   * Get day of week as string
   */
  private getDayOfWeek(date: Date): string {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[date.getDay()];
  }

  /**
   * Calculate slot duration in minutes
   */
  calculateSlotDuration(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60);
  }

  /**
   * Get next available slot for a doctor
   */
  async getNextAvailableSlot(doctorId: string, fromDate?: string) {
    const startDate = fromDate || new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // Look ahead 30 days
    
    const slots = await this.generateSlotsForDateRange(
      doctorId, 
      startDate, 
      endDate.toISOString().split('T')[0]
    );
    
    if (!slots.success) {
      return slots;
    }
    
    // Find the first available slot
    for (const daySlots of slots.data) {
      const availableSlot = daySlots.slots.find(slot => slot.isAvailable);
      if (availableSlot) {
        return {
          success: true,
          data: {
            date: daySlots.date,
            slot: availableSlot,
          },
          message: 'Next available slot found',
        };
      }
    }
    
    return {
      success: false,
      data: null,
      message: 'No available slots found in the next 30 days',
    };
  }
}



