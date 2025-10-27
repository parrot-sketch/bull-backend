import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../auth/services/database.service';
import { SlotEngineService } from './slot-engine.service';

@Injectable()
export class AppointmentManagementService {
  constructor(
    private db: DatabaseService,
    private slotEngine: SlotEngineService,
  ) {}

  // ===========================================
  // APPOINTMENT LIFECYCLE MANAGEMENT
  // ===========================================

  /**
   * Create a new appointment
   */
  async createAppointment(appointmentData: {
    patientId: string;
    doctorId: string;
    date: string;
    startTime: string;
    endTime: string;
    type: string;
    notes?: string;
    patientName?: string;
    patientPhone?: string;
    patientEmail?: string;
  }) {
    // Validate slot availability
    const availabilityCheck = await this.slotEngine.checkSlotAvailability(
      appointmentData.doctorId,
      appointmentData.date,
      appointmentData.startTime,
      appointmentData.endTime,
    );

    if (!availabilityCheck.success) {
      throw new BadRequestException(availabilityCheck.message);
    }

    // Check for conflicts
    const conflictCheck = await this.slotEngine.checkConflicts(
      appointmentData.doctorId,
      appointmentData.date,
      appointmentData.startTime,
      appointmentData.endTime,
    );

    if (conflictCheck.hasConflicts) {
      throw new BadRequestException('Time slot conflicts with existing appointment');
    }

    // Create appointment
    const appointment = await this.db.appointment.create({
      data: {
        patientId: appointmentData.patientId,
        doctorId: appointmentData.doctorId,
        scheduleId: availabilityCheck.data.scheduleId,
        appointmentDate: new Date(appointmentData.date),
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        duration: this.slotEngine.calculateSlotDuration(
          appointmentData.startTime, 
          appointmentData.endTime
        ),
        type: appointmentData.type as any,
        status: 'PENDING',
        notes: appointmentData.notes,
        patientName: appointmentData.patientName,
        patientPhone: appointmentData.patientPhone,
        patientEmail: appointmentData.patientEmail,
      } as any,
      include: {
        patient: true,
      },
    });

    // Lock the slot
    await this.slotEngine.lockSlot(
      appointmentData.doctorId,
      availabilityCheck.data.scheduleId,
      appointmentData.startTime,
      appointmentData.endTime,
    );

    return {
      success: true,
      data: appointment,
      message: 'Appointment created successfully',
    };
  }

  /**
   * Confirm an appointment
   */
  async confirmAppointment(appointmentId: string, doctorId: string) {
    const appointment = await this.db.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.doctorId !== doctorId) {
      throw new BadRequestException('Unauthorized to confirm this appointment');
    }

    if (appointment.status !== 'PENDING') {
      throw new BadRequestException('Appointment is not in pending status');
    }

    const updatedAppointment = await this.db.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CONFIRMED' },
      include: { patient: true },
    });

    return {
      success: true,
      data: updatedAppointment,
      message: 'Appointment confirmed successfully',
    };
  }

  /**
   * Reschedule an appointment
   */
  async rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newStartTime: string,
    newEndTime: string,
    reason?: string,
  ) {
    const appointment = await this.db.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status === 'CANCELLED') {
      throw new BadRequestException('Cannot reschedule a cancelled appointment');
    }

    // Check new slot availability
    const availabilityCheck = await this.slotEngine.checkSlotAvailability(
      appointment.doctorId,
      newDate,
      newStartTime,
      newEndTime,
    );

    if (!availabilityCheck.success) {
      throw new BadRequestException(availabilityCheck.message);
    }

    // Check for conflicts (excluding current appointment)
    const conflictCheck = await this.slotEngine.checkConflicts(
      appointment.doctorId,
      newDate,
      newStartTime,
      newEndTime,
      appointmentId,
    );

    if (conflictCheck.hasConflicts) {
      throw new BadRequestException('New time slot conflicts with existing appointment');
    }

    // Release old slot
    await this.slotEngine.releaseSlot(
      appointment.doctorId,
      appointment.scheduleId,
      appointment.startTime,
    );

    // Update appointment
    const updatedAppointment = await this.db.appointment.update({
      where: { id: appointmentId },
      data: {
        appointmentDate: new Date(newDate),
        startTime: newStartTime,
        endTime: newEndTime,
        duration: this.slotEngine.calculateSlotDuration(newStartTime, newEndTime),
        scheduleId: availabilityCheck.data.scheduleId,
        status: 'PENDING', // Reset to pending for doctor confirmation
        notes: reason ? `${appointment.notes || ''}\nRescheduled: ${reason}` : appointment.notes,
      } as any,
      include: { patient: true },
    });

    // Lock new slot
    await this.slotEngine.lockSlot(
      appointment.doctorId,
      availabilityCheck.data.scheduleId,
      newStartTime,
      newEndTime,
    );

    return {
      success: true,
      data: updatedAppointment,
      message: 'Appointment rescheduled successfully',
    };
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(appointmentId: string, reason?: string, cancelledBy?: 'DOCTOR' | 'PATIENT') {
    const appointment = await this.db.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status === 'CANCELLED') {
      throw new BadRequestException('Appointment is already cancelled');
    }

    if (appointment.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel a completed appointment');
    }

    // Update appointment
    const updatedAppointment = await this.db.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CANCELLED',
        notes: reason 
          ? `${appointment.notes || ''}\nCancelled by ${cancelledBy}: ${reason}` 
          : appointment.notes,
      } as any,
      include: { patient: true },
    });

    // Release the slot
    await this.slotEngine.releaseSlot(
      appointment.doctorId,
      appointment.scheduleId,
      appointment.startTime,
    );

    return {
      success: true,
      data: updatedAppointment,
      message: 'Appointment cancelled successfully',
    };
  }

  /**
   * Mark appointment as completed
   */
  async completeAppointment(appointmentId: string, doctorId: string, notes?: string) {
    const appointment = await this.db.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.doctorId !== doctorId) {
      throw new BadRequestException('Unauthorized to complete this appointment');
    }

    if (appointment.status !== 'CONFIRMED') {
      throw new BadRequestException('Only confirmed appointments can be marked as completed');
    }

    const updatedAppointment = await this.db.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'COMPLETED',
        notes: notes ? `${appointment.notes || ''}\nCompleted: ${notes}` : appointment.notes,
      } as any,
      include: { patient: true },
    });

    return {
      success: true,
      data: updatedAppointment,
      message: 'Appointment marked as completed',
    };
  }

  // ===========================================
  // APPOINTMENT QUERIES
  // ===========================================

  /**
   * Get appointments for a doctor
   */
  async getDoctorAppointments(
    doctorId: string,
    startDate?: string,
    endDate?: string,
    status?: string,
  ) {
    const where: any = { doctorId };
    
    if (startDate && endDate) {
      where.appointmentDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (status) {
      where.status = status;
    }

    const appointments = await this.db.appointment.findMany({
      where,
      include: {
        patient: true,
      },
      orderBy: { appointmentDate: 'asc' },
    });

    return {
      success: true,
      data: appointments,
      message: 'Doctor appointments retrieved successfully',
    };
  }

  /**
   * Get appointments for a patient
   */
  async getPatientAppointments(
    patientId: string,
    startDate?: string,
    endDate?: string,
    status?: string,
  ) {
    const where: any = { patientId };
    
    if (startDate && endDate) {
      where.appointmentDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (status) {
      where.status = status;
    }

    const appointments = await this.db.appointment.findMany({
      where,
      include: {
        patient: true,
      },
      orderBy: { appointmentDate: 'asc' },
    });

    return {
      success: true,
      data: appointments,
      message: 'Patient appointments retrieved successfully',
    };
  }

  /**
   * Get appointment by ID
   */
  async getAppointmentById(appointmentId: string) {
    const appointment = await this.db.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return {
      success: true,
      data: appointment,
      message: 'Appointment retrieved successfully',
    };
  }

  /**
   * Get upcoming appointments for a doctor
   */
  async getUpcomingAppointments(doctorId: string, limit: number = 10) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await this.db.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: { gte: today },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      include: {
        patient: true,
      },
      orderBy: { appointmentDate: 'asc' },
      take: limit,
    });

    return {
      success: true,
      data: appointments,
      message: 'Upcoming appointments retrieved successfully',
    };
  }

  /**
   * Get today's appointments for a doctor
   */
  async getTodaysAppointments(doctorId: string) {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await this.db.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { not: 'CANCELLED' },
      },
      include: {
        patient: true,
      },
      orderBy: { startTime: 'asc' },
    });

    return {
      success: true,
      data: appointments,
      message: 'Today\'s appointments retrieved successfully',
    };
  }

  // ===========================================
  // APPOINTMENT STATISTICS
  // ===========================================

  /**
   * Get appointment statistics for a doctor
   */
  async getAppointmentStats(doctorId: string, startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();
    
    if (!startDate) {
      start.setDate(start.getDate() - 30); // Last 30 days
    }

    const appointments = await this.db.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: {
          gte: start,
          lte: end,
        },
      },
    });

    const stats = {
      total: appointments.length,
      pending: appointments.filter(apt => apt.status === 'PENDING').length,
      confirmed: appointments.filter(apt => apt.status === 'CONFIRMED').length,
      completed: appointments.filter(apt => apt.status === 'COMPLETED').length,
      cancelled: appointments.filter(apt => apt.status === 'CANCELLED').length,
      noShow: appointments.filter(apt => apt.status === 'NO_SHOW').length,
    };

    return {
      success: true,
      data: stats,
      message: 'Appointment statistics retrieved successfully',
    };
  }

  /**
   * Get appointment history for a patient
   */
  async getPatientAppointmentHistory(patientId: string, limit: number = 20) {
    const appointments = await this.db.appointment.findMany({
      where: { patientId },
      include: {
        patient: true,
      },
      orderBy: { appointmentDate: 'desc' },
      take: limit,
    });

    return {
      success: true,
      data: appointments,
      message: 'Patient appointment history retrieved successfully',
    };
  }
}



