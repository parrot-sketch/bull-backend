import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsDecimal, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

// ===========================================
// DOCTOR PROFILE DTOs
// ===========================================

export class CreateDoctorProfileDto {
  @ApiProperty({ description: 'Professional title (Dr., Prof., etc.)' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Professional credentials (MD, PhD, etc.)', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  credentials?: string[];

  @ApiProperty({ description: 'Medical specialties', type: [String] })
  @IsArray()
  @IsString({ each: true })
  specialties: string[];

  @ApiPropertyOptional({ description: 'Sub-specialties', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subSpecialties?: string[];

  @ApiPropertyOptional({ description: 'Years of experience' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  yearsExperience?: number;

  @ApiPropertyOptional({ description: 'Practice name' })
  @IsOptional()
  @IsString()
  practiceName?: string;

  @ApiProperty({ description: 'Type of practice', enum: ['PRIVATE', 'GROUP', 'HOSPITAL', 'CLINIC', 'ACADEMIC', 'TELEMEDICINE'] })
  @IsEnum(['PRIVATE', 'GROUP', 'HOSPITAL', 'CLINIC', 'ACADEMIC', 'TELEMEDICINE'])
  practiceType: string;

  @ApiPropertyOptional({ description: 'Practice address' })
  @IsOptional()
  @IsString()
  practiceAddress?: string;

  @ApiPropertyOptional({ description: 'Practice city' })
  @IsOptional()
  @IsString()
  practiceCity?: string;

  @ApiPropertyOptional({ description: 'Practice state' })
  @IsOptional()
  @IsString()
  practiceState?: string;

  @ApiPropertyOptional({ description: 'Practice ZIP code' })
  @IsOptional()
  @IsString()
  practiceZipCode?: string;

  @ApiPropertyOptional({ description: 'Practice phone number' })
  @IsOptional()
  @IsString()
  practicePhone?: string;

  @ApiPropertyOptional({ description: 'Practice email' })
  @IsOptional()
  @IsString()
  practiceEmail?: string;

  @ApiPropertyOptional({ description: 'Practice website' })
  @IsOptional()
  @IsString()
  practiceWebsite?: string;

  @ApiPropertyOptional({ description: 'Medical license number' })
  @IsOptional()
  @IsString()
  medicalLicenseNumber?: string;

  @ApiPropertyOptional({ description: 'Medical license state' })
  @IsOptional()
  @IsString()
  medicalLicenseState?: string;

  @ApiPropertyOptional({ description: 'Medical license expiry date' })
  @IsOptional()
  @IsDateString()
  medicalLicenseExpiry?: string;

  @ApiPropertyOptional({ description: 'DEA number' })
  @IsOptional()
  @IsString()
  deaNumber?: string;

  @ApiPropertyOptional({ description: 'NPI number' })
  @IsOptional()
  @IsString()
  npiNumber?: string;

  @ApiPropertyOptional({ description: 'Board certifications', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  boardCertifications?: string[];

  @ApiPropertyOptional({ description: 'Professional biography' })
  @IsOptional()
  @IsString()
  professionalBio?: string;

  @ApiPropertyOptional({ description: 'Education background' })
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional({ description: 'Professional awards', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  awards?: string[];

  @ApiPropertyOptional({ description: 'Publications', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  publications?: string[];

  @ApiPropertyOptional({ description: 'Languages spoken', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional({ description: 'Whether accepting new patients' })
  @IsOptional()
  @IsBoolean()
  isAcceptingNewPatients?: boolean;

  @ApiPropertyOptional({ description: 'Available consultation types', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  consultationTypes?: string[];
}

export class UpdateDoctorProfileDto {
  @ApiPropertyOptional({ description: 'Professional title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Professional credentials', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  credentials?: string[];

  @ApiPropertyOptional({ description: 'Medical specialties', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[];

  @ApiPropertyOptional({ description: 'Sub-specialties', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subSpecialties?: string[];

  @ApiPropertyOptional({ description: 'Years of experience' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  yearsExperience?: number;

  @ApiPropertyOptional({ description: 'Practice name' })
  @IsOptional()
  @IsString()
  practiceName?: string;

  @ApiPropertyOptional({ description: 'Type of practice' })
  @IsOptional()
  @IsEnum(['PRIVATE', 'GROUP', 'HOSPITAL', 'CLINIC', 'ACADEMIC', 'TELEMEDICINE'])
  practiceType?: string;

  @ApiPropertyOptional({ description: 'Practice address' })
  @IsOptional()
  @IsString()
  practiceAddress?: string;

  @ApiPropertyOptional({ description: 'Practice city' })
  @IsOptional()
  @IsString()
  practiceCity?: string;

  @ApiPropertyOptional({ description: 'Practice state' })
  @IsOptional()
  @IsString()
  practiceState?: string;

  @ApiPropertyOptional({ description: 'Practice ZIP code' })
  @IsOptional()
  @IsString()
  practiceZipCode?: string;

  @ApiPropertyOptional({ description: 'Practice phone number' })
  @IsOptional()
  @IsString()
  practicePhone?: string;

  @ApiPropertyOptional({ description: 'Practice email' })
  @IsOptional()
  @IsString()
  practiceEmail?: string;

  @ApiPropertyOptional({ description: 'Practice website' })
  @IsOptional()
  @IsString()
  practiceWebsite?: string;

  @ApiPropertyOptional({ description: 'Medical license number' })
  @IsOptional()
  @IsString()
  medicalLicenseNumber?: string;

  @ApiPropertyOptional({ description: 'Medical license state' })
  @IsOptional()
  @IsString()
  medicalLicenseState?: string;

  @ApiPropertyOptional({ description: 'Medical license expiry date' })
  @IsOptional()
  @IsDateString()
  medicalLicenseExpiry?: string;

  @ApiPropertyOptional({ description: 'DEA number' })
  @IsOptional()
  @IsString()
  deaNumber?: string;

  @ApiPropertyOptional({ description: 'NPI number' })
  @IsOptional()
  @IsString()
  npiNumber?: string;

  @ApiPropertyOptional({ description: 'Board certifications', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  boardCertifications?: string[];

  @ApiPropertyOptional({ description: 'Professional biography' })
  @IsOptional()
  @IsString()
  professionalBio?: string;

  @ApiPropertyOptional({ description: 'Education background' })
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional({ description: 'Professional awards', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  awards?: string[];

  @ApiPropertyOptional({ description: 'Publications', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  publications?: string[];

  @ApiPropertyOptional({ description: 'Languages spoken', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional({ description: 'Whether accepting new patients' })
  @IsOptional()
  @IsBoolean()
  isAcceptingNewPatients?: boolean;

  @ApiPropertyOptional({ description: 'Available consultation types', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  consultationTypes?: string[];
}

// ===========================================
// SERVICES DTOs
// ===========================================

export class CreateDoctorServiceDto {
  @ApiProperty({ description: 'Service name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Service description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Service category', enum: ['CONSULTATION', 'FOLLOW_UP', 'PROCEDURE', 'DIAGNOSTIC', 'THERAPEUTIC', 'PREVENTIVE', 'EMERGENCY', 'SPECIALIST_REFERRAL'] })
  @IsEnum(['CONSULTATION', 'FOLLOW_UP', 'PROCEDURE', 'DIAGNOSTIC', 'THERAPEUTIC', 'PREVENTIVE', 'EMERGENCY', 'SPECIALIST_REFERRAL'])
  category: string;

  @ApiProperty({ description: 'Service duration in minutes' })
  @IsNumber()
  @Min(15)
  @Max(480)
  duration: number;

  @ApiPropertyOptional({ description: 'Service price override' })
  @IsOptional()
  @IsDecimal()
  price?: number;

  @ApiPropertyOptional({ description: 'Whether service is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Whether service is virtual' })
  @IsOptional()
  @IsBoolean()
  isVirtual?: boolean;

  @ApiPropertyOptional({ description: 'Whether service is in-person' })
  @IsOptional()
  @IsBoolean()
  isInPerson?: boolean;
}

export class UpdateDoctorServiceDto {
  @ApiPropertyOptional({ description: 'Service name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Service description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Service category' })
  @IsOptional()
  @IsEnum(['CONSULTATION', 'FOLLOW_UP', 'PROCEDURE', 'DIAGNOSTIC', 'THERAPEUTIC', 'PREVENTIVE', 'EMERGENCY', 'SPECIALIST_REFERRAL'])
  category?: string;

  @ApiPropertyOptional({ description: 'Service duration in minutes' })
  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(480)
  duration?: number;

  @ApiPropertyOptional({ description: 'Service price override' })
  @IsOptional()
  @IsDecimal()
  price?: number;

  @ApiPropertyOptional({ description: 'Whether service is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Whether service is virtual' })
  @IsOptional()
  @IsBoolean()
  isVirtual?: boolean;

  @ApiPropertyOptional({ description: 'Whether service is in-person' })
  @IsOptional()
  @IsBoolean()
  isInPerson?: boolean;
}

// ===========================================
// INSURANCE DTOs
// ===========================================

export class CreateDoctorInsuranceDto {
  @ApiProperty({ description: 'Insurance company name' })
  @IsString()
  insuranceName: string;

  @ApiProperty({ description: 'Insurance type', enum: ['PRIVATE', 'MEDICARE', 'MEDICAID', 'WORKERS_COMPENSATION', 'SELF_PAY', 'OTHER'] })
  @IsEnum(['PRIVATE', 'MEDICARE', 'MEDICAID', 'WORKERS_COMPENSATION', 'SELF_PAY', 'OTHER'])
  insuranceType: string;

  @ApiPropertyOptional({ description: 'Insurance plan name' })
  @IsOptional()
  @IsString()
  planName?: string;

  @ApiPropertyOptional({ description: 'Whether insurance is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Copay amount' })
  @IsOptional()
  @IsDecimal()
  copayAmount?: number;

  @ApiPropertyOptional({ description: 'Deductible amount' })
  @IsOptional()
  @IsDecimal()
  deductibleAmount?: number;
}

export class UpdateDoctorInsuranceDto {
  @ApiPropertyOptional({ description: 'Insurance company name' })
  @IsOptional()
  @IsString()
  insuranceName?: string;

  @ApiPropertyOptional({ description: 'Insurance type' })
  @IsOptional()
  @IsEnum(['PRIVATE', 'MEDICARE', 'MEDICAID', 'WORKERS_COMPENSATION', 'SELF_PAY', 'OTHER'])
  insuranceType?: string;

  @ApiPropertyOptional({ description: 'Insurance plan name' })
  @IsOptional()
  @IsString()
  planName?: string;

  @ApiPropertyOptional({ description: 'Whether insurance is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Copay amount' })
  @IsOptional()
  @IsDecimal()
  copayAmount?: number;

  @ApiPropertyOptional({ description: 'Deductible amount' })
  @IsOptional()
  @IsDecimal()
  deductibleAmount?: number;
}

// ===========================================
// CONSULTATION FEES DTOs
// ===========================================

export class CreateConsultationFeeDto {
  @ApiProperty({ description: 'Consultation type', enum: ['INITIAL_CONSULTATION', 'FOLLOW_UP', 'TELEMEDICINE', 'IN_PERSON', 'URGENT', 'ROUTINE'] })
  @IsEnum(['INITIAL_CONSULTATION', 'FOLLOW_UP', 'TELEMEDICINE', 'IN_PERSON', 'URGENT', 'ROUTINE'])
  consultationType: string;

  @ApiProperty({ description: 'Base consultation fee' })
  @IsDecimal()
  baseFee: number;

  @ApiPropertyOptional({ description: 'Follow-up fee' })
  @IsOptional()
  @IsDecimal()
  followUpFee?: number;

  @ApiPropertyOptional({ description: 'Cancellation fee' })
  @IsOptional()
  @IsDecimal()
  cancellationFee?: number;

  @ApiPropertyOptional({ description: 'No-show fee' })
  @IsOptional()
  @IsDecimal()
  noShowFee?: number;

  @ApiPropertyOptional({ description: 'Whether fee is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateConsultationFeeDto {
  @ApiPropertyOptional({ description: 'Consultation type' })
  @IsOptional()
  @IsEnum(['INITIAL_CONSULTATION', 'FOLLOW_UP', 'TELEMEDICINE', 'IN_PERSON', 'URGENT', 'ROUTINE'])
  consultationType?: string;

  @ApiPropertyOptional({ description: 'Base consultation fee' })
  @IsOptional()
  @IsDecimal()
  baseFee?: number;

  @ApiPropertyOptional({ description: 'Follow-up fee' })
  @IsOptional()
  @IsDecimal()
  followUpFee?: number;

  @ApiPropertyOptional({ description: 'Cancellation fee' })
  @IsOptional()
  @IsDecimal()
  cancellationFee?: number;

  @ApiPropertyOptional({ description: 'No-show fee' })
  @IsOptional()
  @IsDecimal()
  noShowFee?: number;

  @ApiPropertyOptional({ description: 'Whether fee is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ===========================================
// SCHEDULE DTOs
// ===========================================

export class CreateDoctorScheduleDto {
  @ApiProperty({ description: 'Day of the week', enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] })
  @IsEnum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])
  dayOfWeek: string;

  @ApiProperty({ description: 'Start time in HH:MM format' })
  @IsString()
  startTime: string;

  @ApiProperty({ description: 'End time in HH:MM format' })
  @IsString()
  endTime: string;

  @ApiPropertyOptional({ description: 'Whether schedule is available' })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ description: 'Break start time in HH:MM format' })
  @IsOptional()
  @IsString()
  breakStartTime?: string;

  @ApiPropertyOptional({ description: 'Break end time in HH:MM format' })
  @IsOptional()
  @IsString()
  breakEndTime?: string;

  @ApiPropertyOptional({ description: 'Whether schedule is recurring' })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiPropertyOptional({ description: 'Schedule effective from date' })
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @ApiPropertyOptional({ description: 'Schedule effective until date' })
  @IsOptional()
  @IsDateString()
  effectiveUntil?: string;
}

export class UpdateDoctorScheduleDto {
  @ApiPropertyOptional({ description: 'Day of the week' })
  @IsOptional()
  @IsEnum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])
  dayOfWeek?: string;

  @ApiPropertyOptional({ description: 'Start time in HH:MM format' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ description: 'End time in HH:MM format' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Whether schedule is available' })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ description: 'Break start time in HH:MM format' })
  @IsOptional()
  @IsString()
  breakStartTime?: string;

  @ApiPropertyOptional({ description: 'Break end time in HH:MM format' })
  @IsOptional()
  @IsString()
  breakEndTime?: string;

  @ApiPropertyOptional({ description: 'Whether schedule is recurring' })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiPropertyOptional({ description: 'Schedule effective from date' })
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @ApiPropertyOptional({ description: 'Schedule effective until date' })
  @IsOptional()
  @IsDateString()
  effectiveUntil?: string;
}



