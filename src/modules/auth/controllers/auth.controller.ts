import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches, MinLength } from 'class-validator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsString()
  mfaCode?: string;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number and special character'
  })
  password!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50, { message: 'First name must be between 1 and 50 characters' })
  @Matches(/^[a-zA-ZÀ-ÿ\s\-']+$/, {
    message: 'First name can only contain letters, spaces, hyphens, and apostrophes'
  })
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50, { message: 'Last name must be between 1 and 50 characters' })
  @Matches(/^[a-zA-ZÀ-ÿ\s\-']+$/, {
    message: 'Last name can only contain letters, spaces, hyphens, and apostrophes'
  })
  lastName!: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be one of: PATIENT, DOCTOR, NURSE, ADMIN, TECHNICIAN, RECEPTIONIST' })
  role?: UserRole;
}

export class RefreshDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() credentials: LoginDto, @Request() req: any) {
    const auditContext = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    };
    return this.authService.login(credentials, auditContext);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async register(@Body() userData: RegisterDto, @Request() req: any) {
    const auditContext = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    };
    return this.authService.register(userData, auditContext);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @ApiOperation({ summary: 'Refresh authentication token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  async refreshToken(@Body() body: RefreshDto) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Request() req: any) {
    const auditContext = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    };
    return this.authService.logout(req.user.userId, auditContext);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  async getCurrentUser(@Request() req: any) {
    return this.authService.getCurrentUser(req.user.userId);
  }

  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate MFA TOTP setup' })
  async mfaSetup(@Request() req: any) {
    return this.authService.setupMfa(req.user.userId);
  }

  @Post('mfa/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify MFA TOTP code and enable MFA' })
  async mfaVerify(@Request() req: any, @Body() body: { code: string }) {
    return this.authService.verifyMfa(req.user.userId, body.code);
  }

  @Post('test/register-patient')
  @ApiOperation({ summary: 'Register test patient (development only)' })
  @ApiResponse({ status: 201, description: 'Test patient registered successfully' })
  async registerTestPatient(@Request() req: any) {
    const auditContext = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    };
    
    const testPatientData = {
      email: 'patient@test.com',
      password: 'patient123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'PATIENT',
    };
    
    return this.authService.register(testPatientData, auditContext);
  }

  @Post('test/register-doctor')
  @ApiOperation({ summary: 'Register test doctor (development only)' })
  @ApiResponse({ status: 201, description: 'Test doctor registered successfully' })
  async registerTestDoctor(@Request() req: any) {
    const auditContext = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    };
    
    const testDoctorData = {
      email: 'doctor@test.com',
      password: 'doctor123',
      firstName: 'Dr. Sarah',
      lastName: 'Smith',
      role: 'DOCTOR',
    };
    
    return this.authService.register(testDoctorData, auditContext);
  }
}
