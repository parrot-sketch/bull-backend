import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Request,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DoctorProfileService } from '../services/doctor-profile.service';

@ApiTags('Doctor Profile')
@Controller('doctor-profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DoctorProfileController {
  constructor(private readonly doctorProfileService: DoctorProfileService) {}

  // ===========================================
  // SIMPLIFIED PROFILE MANAGEMENT
  // ===========================================

  @Post()
  @ApiOperation({ summary: 'Create doctor profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  async createProfile(@Request() req: any, @Body() profileData: {
    specialization: string;
    bio?: string;
    experience?: string;
    education?: string;
    consultationFee: number;
    services?: string;
    availability?: string;
  }) {
    const doctorId = req.user.userId || req.user.id;
    console.log('🔍 DEBUG: Creating profile for doctorId =', doctorId);
    return this.doctorProfileService.createProfile(doctorId, profileData);
  }

  @Get()
  @ApiOperation({ summary: 'Get doctor profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfile(@Request() req: any) {
    const doctorId = req.user.userId || req.user.id;
    console.log('🔍 DEBUG: Getting profile for doctorId =', doctorId);
    return this.doctorProfileService.getProfile(doctorId);
  }

  @Put()
  @ApiOperation({ summary: 'Update doctor profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async updateProfile(@Request() req: any, @Body() updateData: {
    specialization?: string;
    bio?: string;
    experience?: string;
    education?: string;
    consultationFee?: number;
    services?: string;
    availability?: string;
    yearsOfExperience?: number;
  }) {
    const doctorId = req.user.userId || req.user.id;
    console.log('🔍 DEBUG: Updating profile for doctorId =', doctorId);
    console.log('🔍 DEBUG: Update data =', updateData);
    return this.doctorProfileService.updateProfile(doctorId, updateData);
  }

  // ===========================================
  // SERVICES
  // ===========================================
  @Get('services')
  @ApiOperation({ summary: 'List doctor services' })
  async getServices(@Request() req: any) {
    const doctorId = req.user.userId || req.user.id;
    return this.doctorProfileService.getServices(doctorId);
  }

  @Post('services')
  @ApiOperation({ summary: 'Upsert doctor services (bulk)' })
  async upsertServices(@Request() req: any, @Body() body: { services: Array<{ id?: string; name: string; description?: string; duration?: number; price?: any }>}) {
    const doctorId = req.user.userId || req.user.id;
    return this.doctorProfileService.upsertServices(doctorId, body.services || []);
  }

  @Post('services/:serviceId/delete')
  @ApiOperation({ summary: 'Delete a doctor service' })
  async deleteService(@Request() req: any, @Param('serviceId') serviceId: string) {
    const doctorId = req.user.userId || req.user.id;
    return this.doctorProfileService.deleteService(doctorId, serviceId);
  }

  // ===========================================
  // INSURANCE
  // ===========================================
  @Get('insurance')
  @ApiOperation({ summary: 'List supported insurance providers' })
  async getInsurance(@Request() req: any) {
    const doctorId = req.user.userId || req.user.id;
    return this.doctorProfileService.getInsurance(doctorId);
  }

  @Post('insurance')
  @ApiOperation({ summary: 'Upsert insurance providers (bulk)' })
  async upsertInsurance(@Request() req: any, @Body() body: { providers: Array<{ id?: string; insuranceName: string; insuranceType?: string; planName?: string }>}) {
    const doctorId = req.user.userId || req.user.id;
    return this.doctorProfileService.upsertInsurance(doctorId, body.providers || []);
  }

  @Post('insurance/:id/delete')
  @ApiOperation({ summary: 'Delete an insurance provider' })
  async deleteInsurance(@Request() req: any, @Param('id') id: string) {
    const doctorId = req.user.userId || req.user.id;
    return this.doctorProfileService.deleteInsurance(doctorId, id);
  }

  // ===========================================
  // BILLING
  // ===========================================
  @Get('billing')
  @ApiOperation({ summary: 'Get billing settings' })
  async getBilling(@Request() req: any) {
    const doctorId = req.user.userId || req.user.id;
    return this.doctorProfileService.getBilling(doctorId);
  }

  @Put('billing')
  @ApiOperation({ summary: 'Update billing settings' })
  async updateBilling(@Request() req: any, @Body() body: { consultationFee: number; currency?: string }) {
    const doctorId = req.user.userId || req.user.id;
    return this.doctorProfileService.updateBilling(doctorId, body);
  }

  // ===========================================
  // PUBLIC PROFILE (FOR PATIENTS)
  // ===========================================

  @Get('public/:doctorId')
  @ApiOperation({ summary: 'Get public doctor profile (for patients)' })
  @ApiResponse({ status: 200, description: 'Public profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getPublicProfile(@Param('doctorId') doctorId: string) {
    return this.doctorProfileService.getPublicProfile(doctorId);
  }
}
