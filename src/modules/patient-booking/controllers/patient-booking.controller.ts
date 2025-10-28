import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PatientBookingService } from '../services/patient-booking.service';

@ApiTags('Patient Booking')
@Controller('patient')
export class PatientBookingController {
  constructor(private readonly patientBookingService: PatientBookingService) {}

  @Get('doctors')
  @ApiOperation({ summary: 'Find available doctors' })
  @ApiResponse({ status: 200, description: 'Doctors retrieved successfully' })
  async findDoctors(
    @Query('specialty') specialty?: string,
    @Query('location') location?: string,
    @Query('city') city?: string,
    @Query('acceptingNewPatients') acceptingNewPatients?: boolean,
  ) {
    return this.patientBookingService.findDoctors({
      specialty,
      location,
      city,
      isAcceptingNewPatients: acceptingNewPatients,
    });
  }

  @Get('doctors/:doctorId')
  @ApiOperation({ summary: 'Get doctor details for booking' })
  @ApiResponse({ status: 200, description: 'Doctor details retrieved successfully' })
  async getDoctorDetails(@Param('doctorId') doctorId: string) {
    return this.patientBookingService.getDoctorDetails(doctorId);
  }

  @Get('doctors/:doctorId/availability')
  @ApiOperation({ summary: 'Get doctor availability for a specific date' })
  @ApiResponse({ status: 200, description: 'Availability retrieved successfully' })
  async getDoctorAvailability(
    @Param('doctorId') doctorId: string,
    @Query('date') date: string,
  ) {
    return this.patientBookingService.getDoctorAvailability(doctorId, date);
  }

  @Post('book')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Book an appointment' })
  @ApiResponse({ status: 201, description: 'Appointment booking requested successfully' })
  async bookAppointment(
    @Request() req: any,
    @Body() bookingData: {
      doctorId: string;
      date: string;
      startTime: string;
      endTime: string;
      reasonForVisit?: string;
      symptoms?: string;
      type?: string;
    },
  ) {
    return this.patientBookingService.bookAppointment(req.user.userId, bookingData);
  }

  @Get('appointments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get patient appointments' })
  @ApiResponse({ status: 200, description: 'Appointments retrieved successfully' })
  async getPatientAppointments(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.patientBookingService.getPatientAppointments(req.user.userId, {
      status,
      startDate,
      endDate,
    });
  }

  @Post('appointments/:appointmentId/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment cancelled successfully' })
  async cancelAppointment(
    @Request() req: any,
    @Param('appointmentId') appointmentId: string,
    @Body() body?: { reason?: string },
  ) {
    return this.patientBookingService.cancelAppointment(
      req.user.userId,
      appointmentId,
      body?.reason,
    );
  }
}

