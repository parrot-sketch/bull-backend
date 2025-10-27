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
