import type { Prisma } from '.prisma/client';
export { Prisma };
export interface CreateDoctorProfileDto {
    specialization?: string;
    specialties?: string[];
    bio?: string;
    experience?: string;
    education?: string;
    consultationFee: number;
}
export interface UpdateDoctorProfileDto extends Partial<CreateDoctorProfileDto> {
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
export type NotificationType = 'APPOINTMENT_REMINDER' | 'APPOINTMENT_CONFIRMATION' | 'APPOINTMENT_CANCELLATION' | 'PRESCRIPTION_READY' | 'LAB_RESULTS' | 'SYSTEM_ALERT';
export interface CreateNotificationDto {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    metadata?: Record<string, unknown>;
}
