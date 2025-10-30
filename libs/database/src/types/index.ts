// Export domain-specific types
export * from './auth.types';
export * from './booking.types';
export * from './doctor-profile.types';
export * from './emr.types';
export * from './notification.types';
export * from './scheduling.types';

// Export common types
export * from './common.types';

// Re-export Prisma types
export type { 
  User,
  DoctorProfile,
  PatientProfile,
  Prescription,
  Notification,
  PatientBooking,
  Prisma,
  PrismaClient
} from '@prisma/client';
export type PrismaTransaction = Omit<import('@prisma/client').PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>;

// Repository DTOs
export interface CreateDoctorProfileDto {
  specialization?: string;
  specialties?: string[];
  bio?: string;
  experience?: string;
  education?: string;
  consultationFee: number;
}

export interface CreateDoctorServiceDto {
  name: string;
  category: string;
  description?: string;
  duration: number;
  price: number;
}

export interface CreateDoctorInsuranceDto {
  insuranceName: string;
  insuranceType: string;
  coverageDetails?: string;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

// Auth Types
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Notification Types
export type NotificationType = 
  | 'APPOINTMENT_REMINDER'
  | 'APPOINTMENT_CONFIRMATION'
  | 'APPOINTMENT_CANCELLATION'
  | 'PRESCRIPTION_READY'
  | 'LAB_RESULTS'
  | 'SYSTEM_ALERT';

export interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
}

// EMR Types
export interface CreateVisitDto {
  patientId: string;
  doctorId: string;
  visitDate: Date;
  chiefComplaint: string;
  diagnosis?: string;
  treatmentPlan?: string;
  followUpDate?: Date;
}

export interface CreatePrescriptionDto {
  visitId: string;
  patientId: string;
  doctorId: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
}

// Booking Types
export interface CreateBookingDto {
  patientId: string;
  doctorId: string;
  appointmentDate: Date;
  appointmentType: string;
  notes?: string;
}

// Scheduling Types
export interface CreateScheduleDto {
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
}

// Repository Types (from Prisma)
// Removed unstable Prisma type re-export