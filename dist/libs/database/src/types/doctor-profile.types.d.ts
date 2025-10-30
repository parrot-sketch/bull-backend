import type { Prisma } from '.prisma/client';
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
export type CreateProfileParams = Prisma.DoctorProfileCreateInput;
export type UpdateProfileParams = Prisma.DoctorProfileUpdateInput;
export type CreateServiceParams = Prisma.DoctorServiceCreateInput;
export type CreateInsuranceParams = Prisma.DoctorInsuranceCreateInput;
