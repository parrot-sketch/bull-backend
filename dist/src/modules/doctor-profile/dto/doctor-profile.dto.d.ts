export declare class CreateDoctorProfileDto {
    title?: string;
    credentials?: string[];
    specialties: string[];
    subSpecialties?: string[];
    yearsExperience?: number;
    practiceName?: string;
    practiceType: string;
    practiceAddress?: string;
    practiceCity?: string;
    practiceState?: string;
    practiceZipCode?: string;
    practicePhone?: string;
    practiceEmail?: string;
    practiceWebsite?: string;
    medicalLicenseNumber?: string;
    medicalLicenseState?: string;
    medicalLicenseExpiry?: string;
    deaNumber?: string;
    npiNumber?: string;
    boardCertifications?: string[];
    professionalBio?: string;
    education?: string;
    awards?: string[];
    publications?: string[];
    languages?: string[];
    isAcceptingNewPatients?: boolean;
    consultationTypes?: string[];
}
export declare class UpdateDoctorProfileDto {
    title?: string;
    credentials?: string[];
    specialties?: string[];
    subSpecialties?: string[];
    yearsExperience?: number;
    practiceName?: string;
    practiceType?: string;
    practiceAddress?: string;
    practiceCity?: string;
    practiceState?: string;
    practiceZipCode?: string;
    practicePhone?: string;
    practiceEmail?: string;
    practiceWebsite?: string;
    medicalLicenseNumber?: string;
    medicalLicenseState?: string;
    medicalLicenseExpiry?: string;
    deaNumber?: string;
    npiNumber?: string;
    boardCertifications?: string[];
    professionalBio?: string;
    education?: string;
    awards?: string[];
    publications?: string[];
    languages?: string[];
    isAcceptingNewPatients?: boolean;
    consultationTypes?: string[];
}
export declare class CreateDoctorServiceDto {
    name: string;
    description?: string;
    category: string;
    duration: number;
    price?: number;
    isActive?: boolean;
    isVirtual?: boolean;
    isInPerson?: boolean;
}
export declare class UpdateDoctorServiceDto {
    name?: string;
    description?: string;
    category?: string;
    duration?: number;
    price?: number;
    isActive?: boolean;
    isVirtual?: boolean;
    isInPerson?: boolean;
}
export declare class CreateDoctorInsuranceDto {
    insuranceName: string;
    insuranceType: string;
    planName?: string;
    isActive?: boolean;
    copayAmount?: number;
    deductibleAmount?: number;
}
export declare class UpdateDoctorInsuranceDto {
    insuranceName?: string;
    insuranceType?: string;
    planName?: string;
    isActive?: boolean;
    copayAmount?: number;
    deductibleAmount?: number;
}
export declare class CreateConsultationFeeDto {
    consultationType: string;
    baseFee: number;
    followUpFee?: number;
    cancellationFee?: number;
    noShowFee?: number;
    isActive?: boolean;
}
export declare class UpdateConsultationFeeDto {
    consultationType?: string;
    baseFee?: number;
    followUpFee?: number;
    cancellationFee?: number;
    noShowFee?: number;
    isActive?: boolean;
}
export declare class CreateDoctorScheduleDto {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    isAvailable?: boolean;
    breakStartTime?: string;
    breakEndTime?: string;
    isRecurring?: boolean;
    effectiveFrom?: string;
    effectiveUntil?: string;
}
export declare class UpdateDoctorScheduleDto {
    dayOfWeek?: string;
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
    breakStartTime?: string;
    breakEndTime?: string;
    isRecurring?: boolean;
    effectiveFrom?: string;
    effectiveUntil?: string;
}
