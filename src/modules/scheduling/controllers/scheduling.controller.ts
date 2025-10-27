import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
    BookAppointmentDto,
    CreateExceptionDto,
    CreateScheduleTemplateDto,
    CreateTimeSlotDto,
    GetAvailabilityDto,
    ScheduleAnalyticsDto,
    UpdateAppointmentDto,
    UpdateAvailabilityDto,
    UpdateScheduleTemplateDto,
    UpdateTimeSlotDto,
} from '../dto/scheduling.dto';
import { SchedulingService } from '../services/scheduling.service';

@ApiTags('Scheduling')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  // ===========================================
  // SCHEDULE TEMPLATES
  // ===========================================

  @Post('templates')
  @ApiOperation({ summary: 'Create a new schedule template' })
  @ApiResponse({ status: 201, description: 'Schedule template created successfully' })
  async createScheduleTemplate(
    @Request() req: any,
    @Body() createTemplateDto: CreateScheduleTemplateDto,
  ) {
    const doctorId = req.user.userId || req.user.id;
    return this.schedulingService.createScheduleTemplate(doctorId, createTemplateDto);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get all schedule templates for a doctor' })
  @ApiResponse({ status: 200, description: 'Schedule templates retrieved successfully' })
  async getScheduleTemplates(@Request() req: any) {
    const doctorId = req.user.userId || req.user.id;
    return this.schedulingService.getScheduleTemplates(doctorId);
  }

  @Put('templates/:templateId')
  @ApiOperation({ summary: 'Update a schedule template' })
  @ApiResponse({ status: 200, description: 'Schedule template updated successfully' })
  async updateScheduleTemplate(
    @Param('templateId') templateId: string,
    @Body() updateTemplateDto: UpdateScheduleTemplateDto,
  ) {
    return this.schedulingService.updateScheduleTemplate(templateId, updateTemplateDto);
  }

  @Delete('templates/:templateId')
  @ApiOperation({ summary: 'Delete a schedule template' })
  @ApiResponse({ status: 200, description: 'Schedule template deleted successfully' })
  async deleteScheduleTemplate(@Param('templateId') templateId: string) {
    return this.schedulingService.deleteScheduleTemplate(templateId);
  }

  // ===========================================
  // TIME SLOTS
  // ===========================================

  @Post('templates/:templateId/time-slots')
  @ApiOperation({ summary: 'Create a time slot for a template' })
  @ApiResponse({ status: 201, description: 'Time slot created successfully' })
  async createTimeSlot(
    @Param('templateId') templateId: string,
    @Body() createSlotDto: CreateTimeSlotDto,
  ) {
    return this.schedulingService.createTimeSlot(templateId, createSlotDto);
  }

  @Put('time-slots/:slotId')
  @ApiOperation({ summary: 'Update a time slot' })
  @ApiResponse({ status: 200, description: 'Time slot updated successfully' })
  async updateTimeSlot(
    @Param('slotId') slotId: string,
    @Body() updateSlotDto: UpdateTimeSlotDto,
  ) {
    return this.schedulingService.updateTimeSlot(slotId, updateSlotDto);
  }

  @Delete('time-slots/:slotId')
  @ApiOperation({ summary: 'Delete a time slot' })
  @ApiResponse({ status: 200, description: 'Time slot deleted successfully' })
  async deleteTimeSlot(@Param('slotId') slotId: string) {
    return this.schedulingService.deleteTimeSlot(slotId);
  }

  // ===========================================
  // SCHEDULE GENERATION
  // ===========================================

  @Post('generate')
  @ApiOperation({ summary: 'Generate schedule from template' })
  @ApiResponse({ status: 201, description: 'Schedule generated successfully' })
  async generateSchedule(
    @Request() req: any,
    @Body() body: { templateId: string; date: string },
  ) {
    const doctorId = req.user.userId || req.user.id;
    return this.schedulingService.generateSchedule(doctorId, body.templateId, body.date);
  }

  // ===========================================
  // AVAILABILITY
  // ===========================================

  @Get('availability')
  @ApiOperation({ summary: 'Get doctor availability for a date' })
  @ApiResponse({ status: 200, description: 'Availability retrieved successfully' })
  async getAvailability(
    @Request() req: any,
    @Query() query: GetAvailabilityDto,
  ) {
    const doctorId = req.user.userId || req.user.id;
    return this.schedulingService.getAvailability(doctorId, query.date);
  }

  @Get('availability/range')
  @ApiOperation({ summary: 'Get doctor availability for a date range' })
  @ApiResponse({ status: 200, description: 'Availability range retrieved successfully' })
  async getAvailabilityRange(
    @Request() req: any,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const doctorId = req.user.userId || req.user.id;
    return this.schedulingService.doctorAvailability.getAvailability(doctorId, startDate, endDate);
  }

  @Get('availability/slots')
  @ApiOperation({ summary: 'Get available time slots for a specific date' })
  @ApiResponse({ status: 200, description: 'Available slots retrieved successfully' })
  async getAvailableSlots(
    @Request() req: any,
    @Query('date') date: string,
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
  ) {
    const doctorId = req.user.userId || req.user.id;
    return this.schedulingService.doctorAvailability.getAvailableSlots(doctorId, date);
  }

  @Put('availability')
  @ApiOperation({ summary: 'Update doctor availability' })
  @ApiResponse({ status: 200, description: 'Availability updated successfully' })
  async updateAvailability(
    @Request() req: any,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    const doctorId = req.user.userId || req.user.id;
    return this.schedulingService.updateAvailability(
      doctorId,
      updateAvailabilityDto.date,
      updateAvailabilityDto.timeSlots,
    );
  }

  @Post('availability/setup')
  @ApiOperation({ summary: 'Set up recurring availability for a doctor' })
  @ApiResponse({ status: 201, description: 'Recurring availability set up successfully' })
  async setupRecurringAvailability(
    @Request() req: any,
    @Body() availabilityData: {
      workingDays: string[];
      startTime: string;
      endTime: string;
      slotDuration: number;
      bufferTime: number;
      breaks?: Array<{ startTime: string; endTime: string; }>;
    },
  ) {
    const doctorId = req.user.userId || req.user.id;
    return this.schedulingService.doctorAvailability.setRecurringAvailability(doctorId, availabilityData);
  }

  // ===========================================
  // EXCEPTIONS
  // ===========================================

  @Post('exceptions')
  @ApiOperation({ summary: 'Create a schedule exception' })
  @ApiResponse({ status: 201, description: 'Schedule exception created successfully' })
  async createException(
    @Request() req: any,
    @Body() createExceptionDto: CreateExceptionDto,
  ) {
    const doctorId = req.user.userId || req.user.id;
    return this.schedulingService.createException(doctorId, createExceptionDto);
  }

  @Get('exceptions')
  @ApiOperation({ summary: 'Get schedule exceptions' })
  @ApiResponse({ status: 200, description: 'Schedule exceptions retrieved successfully' })
  async getExceptions(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const doctorId = req.user.userId || req.user.id;
    return this.schedulingService.getExceptions(doctorId, startDate, endDate);
  }

  @Delete('exceptions/:exceptionId')
  @ApiOperation({ summary: 'Delete a schedule exception' })
  @ApiResponse({ status: 200, description: 'Schedule exception deleted successfully' })
  async deleteException(@Param('exceptionId') exceptionId: string) {
    return this.schedulingService.deleteException(exceptionId);
  }

  // ===========================================
  // APPOINTMENTS
  // ===========================================

  @Post('appointments')
  @ApiOperation({ summary: 'Book a new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment booked successfully' })
  async bookAppointment(@Body() bookAppointmentDto: BookAppointmentDto) {
    return this.schedulingService.bookAppointment(bookAppointmentDto);
  }

  @Get('appointments')
  @ApiOperation({ summary: 'Get appointments for a doctor' })
  @ApiResponse({ status: 200, description: 'Appointments retrieved successfully' })
  async getAppointments(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
  ) {
    // Return mock data for development
    const mockAppointments = [
      {
        id: '1',
        patientName: 'John Doe',
        patientEmail: 'john@example.com',
        appointmentDate: new Date().toISOString(),
        startTime: '09:00',
        endTime: '09:30',
        status: 'SCHEDULED',
        type: 'CONSULTATION',
        notes: 'Regular checkup'
      },
      {
        id: '2',
        patientName: 'Jane Smith',
        patientEmail: 'jane@example.com',
        appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        startTime: '10:00',
        endTime: '10:30',
        status: 'PENDING',
        type: 'FOLLOW_UP',
        notes: 'Follow-up appointment'
      }
    ];

    return {
      success: true,
      data: mockAppointments,
      message: 'Mock appointments data'
    };
  }

  @Get('appointments/upcoming')
  @ApiOperation({ summary: 'Get upcoming appointments for a doctor' })
  @ApiResponse({ status: 200, description: 'Upcoming appointments retrieved successfully' })
  async getUpcomingAppointments(
    @Request() req: any,
    @Query('limit') limit?: number,
  ) {
    const doctorId = req.user.userId || req.user.id;
    return this.schedulingService.appointmentManagement.getUpcomingAppointments(
      doctorId, 
      limit || 10
    );
  }

  @Get('appointments/today')
  @ApiOperation({ summary: 'Get today\'s appointments for a doctor' })
  @ApiResponse({ status: 200, description: 'Today\'s appointments retrieved successfully' })
  async getTodaysAppointments(@Request() req: any) {
    const doctorId = req.user.userId || req.user.id;
    return this.schedulingService.appointmentManagement.getTodaysAppointments(doctorId);
  }

  @Get('appointments/stats')
  @ApiOperation({ summary: 'Get appointment statistics for a doctor' })
  @ApiResponse({ status: 200, description: 'Appointment statistics retrieved successfully' })
  async getAppointmentStats(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const doctorId = req.user.userId || req.user.id;
    return this.schedulingService.appointmentManagement.getAppointmentStats(
      doctorId, 
      startDate, 
      endDate
    );
  }

  @Put('appointments/:appointmentId')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully' })
  async updateAppointment(
    @Param('appointmentId') appointmentId: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.schedulingService.updateAppointment(appointmentId, updateAppointmentDto);
  }

  @Put('appointments/:appointmentId/confirm')
  @ApiOperation({ summary: 'Confirm an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment confirmed successfully' })
  async confirmAppointment(
    @Request() req: any,
    @Param('appointmentId') appointmentId: string,
  ) {
    const doctorId = req.user.userId || req.user.id;
    return this.schedulingService.appointmentManagement.confirmAppointment(appointmentId, doctorId);
  }

  @Put('appointments/:appointmentId/reschedule')
  @ApiOperation({ summary: 'Reschedule an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment rescheduled successfully' })
  async rescheduleAppointment(
    @Param('appointmentId') appointmentId: string,
    @Body() body: { newDate: string; newStartTime: string; newEndTime: string; reason?: string },
  ) {
    return this.schedulingService.appointmentManagement.rescheduleAppointment(
      appointmentId,
      body.newDate,
      body.newStartTime,
      body.newEndTime,
      body.reason,
    );
  }

  @Put('appointments/:appointmentId/cancel')
  @ApiOperation({ summary: 'Cancel an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment cancelled successfully' })
  async cancelAppointment(
    @Param('appointmentId') appointmentId: string,
    @Body() body: { reason?: string; cancelledBy?: 'DOCTOR' | 'PATIENT' },
  ) {
    return this.schedulingService.appointmentManagement.cancelAppointment(
      appointmentId,
      body.reason,
      body.cancelledBy,
    );
  }

  @Put('appointments/:appointmentId/complete')
  @ApiOperation({ summary: 'Mark appointment as completed' })
  @ApiResponse({ status: 200, description: 'Appointment marked as completed' })
  async completeAppointment(
    @Request() req: any,
    @Param('appointmentId') appointmentId: string,
    @Body() body: { notes?: string },
  ) {
    const doctorId = req.user.userId || req.user.id;
    return this.schedulingService.appointmentManagement.completeAppointment(
      appointmentId,
      doctorId,
      body.notes,
    );
  }

  // ===========================================
  // ANALYTICS
  // ===========================================

  @Get('analytics')
  @ApiOperation({ summary: 'Get scheduling analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getAnalytics(
    @Request() req: any,
    @Query() query: ScheduleAnalyticsDto,
  ) {
    // This would be implemented to provide analytics
    const doctorId = req.user.userId || req.user.id;
    return {
      success: true,
      data: {
        totalAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
        noShowAppointments: 0,
        averageAppointmentDuration: 0,
        mostPopularTimeSlots: [],
        revenue: 0,
      },
      message: 'Analytics retrieved successfully',
    };
  }
}