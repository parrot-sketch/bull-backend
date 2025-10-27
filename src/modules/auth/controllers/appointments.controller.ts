import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  
  @Get()
  @ApiOperation({ summary: 'Get appointments for a doctor' })
  @ApiResponse({ status: 200, description: 'Appointments retrieved successfully' })
  async getAppointments(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
  ) {
    try {
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
    } catch (error) {
      console.error('Error in getAppointments:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }
}
