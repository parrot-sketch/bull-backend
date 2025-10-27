import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// ===========================================
// SCHEDULE TEMPLATE DTOs
// ===========================================

export class CreateScheduleTemplateDto {
  @IsString()
  name: string;

  @IsString()
  dayOfWeek: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsNumber()
  slotDuration: number;

  @IsNumber()
  bufferTime: number;

  @IsNumber()
  maxBookings: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  serviceType?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsBoolean()
  isActive: boolean;
}

export class UpdateScheduleTemplateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  dayOfWeek?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsNumber()
  slotDuration?: number;

  @IsOptional()
  @IsNumber()
  bufferTime?: number;

  @IsOptional()
  @IsNumber()
  maxBookings?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  serviceType?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ===========================================
// TIME SLOT DTOs
// ===========================================

export class CreateTimeSlotDto {
  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsBoolean()
  isAvailable: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTimeSlotDto {
  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

// ===========================================
// EXCEPTION DTOs
// ===========================================

export enum ExceptionType {
  BLOCKED = 'BLOCKED',
  UNAVAILABLE = 'UNAVAILABLE',
  CUSTOM_HOURS = 'CUSTOM_HOURS',
}

export class CreateExceptionDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsBoolean()
  isAvailable: boolean;

  @IsString()
  reason: string;

  @IsEnum(ExceptionType)
  type: ExceptionType;
}

// ===========================================
// APPOINTMENT DTOs
// ===========================================

export enum AppointmentType {
  CONSULTATION = 'CONSULTATION',
  FOLLOW_UP = 'FOLLOW_UP',
  EMERGENCY = 'EMERGENCY',
  ROUTINE = 'ROUTINE',
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export class BookAppointmentDto {
  @IsString()
  patientId: string;

  @IsString()
  doctorId: string;

  @IsString()
  scheduleId: string;

  @IsDateString()
  date: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsEnum(AppointmentType)
  type: AppointmentType;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsEnum(AppointmentType)
  type?: AppointmentType;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

// ===========================================
// AVAILABILITY DTOs
// ===========================================

export class GetAvailabilityDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  doctorId?: string;
}

export class UpdateAvailabilityDto {
  @IsDateString()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotAvailabilityDto)
  timeSlots: TimeSlotAvailabilityDto[];
}

export class TimeSlotAvailabilityDto {
  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsBoolean()
  isAvailable: boolean;
}

// ===========================================
// ANALYTICS DTOs
// ===========================================

export class ScheduleAnalyticsDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  doctorId?: string;
}