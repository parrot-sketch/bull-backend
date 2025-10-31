import { DatabaseService } from '../../auth/services/database.service';
export declare class DoctorProfileService {
    private readonly db;
    constructor(db: DatabaseService);
    createProfile(doctorId: string, profileData: {
        specialization?: string;
        specialties?: string[];
        bio?: string;
        experience?: string;
        education?: string;
        consultationFee: number;
        services?: string;
        availability?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            npiNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            title: string | null;
            credentials: string[];
            specialties: string[];
            subSpecialties: string[];
            yearsExperience: number | null;
            practiceName: string | null;
            practiceType: import(".prisma/client").$Enums.PracticeType;
            practiceAddress: string | null;
            practiceCity: string | null;
            practiceState: string | null;
            practiceZipCode: string | null;
            practicePhone: string | null;
            practiceEmail: string | null;
            practiceWebsite: string | null;
            medicalLicenseNumber: string | null;
            medicalLicenseState: string | null;
            medicalLicenseExpiry: Date | null;
            deaNumber: string | null;
            boardCertifications: string[];
            professionalBio: string | null;
            education: string | null;
            awards: string[];
            publications: string[];
            languages: string[];
            isAcceptingNewPatients: boolean;
            consultationTypes: import(".prisma/client").$Enums.ConsultationType[];
            currency: string;
        };
        message: string;
    }>;
    getProfile(doctorId: string): Promise<{
        success: boolean;
        data: {
            doctor: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                avatar: string;
                phoneNumber: string;
            };
            services: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                doctorId: string;
                profileId: string;
                description: string | null;
                category: import(".prisma/client").$Enums.ServiceCategory;
                duration: number;
                price: import("@prisma/client/runtime/library").Decimal | null;
                isVirtual: boolean;
                isInPerson: boolean;
            }[];
            insurances: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                profileId: string;
                insuranceName: string;
                insuranceType: import(".prisma/client").$Enums.InsuranceType;
                planName: string | null;
                copayAmount: import("@prisma/client/runtime/library").Decimal | null;
                deductibleAmount: import("@prisma/client/runtime/library").Decimal | null;
            }[];
        } & {
            id: string;
            npiNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            title: string | null;
            credentials: string[];
            specialties: string[];
            subSpecialties: string[];
            yearsExperience: number | null;
            practiceName: string | null;
            practiceType: import(".prisma/client").$Enums.PracticeType;
            practiceAddress: string | null;
            practiceCity: string | null;
            practiceState: string | null;
            practiceZipCode: string | null;
            practicePhone: string | null;
            practiceEmail: string | null;
            practiceWebsite: string | null;
            medicalLicenseNumber: string | null;
            medicalLicenseState: string | null;
            medicalLicenseExpiry: Date | null;
            deaNumber: string | null;
            boardCertifications: string[];
            professionalBio: string | null;
            education: string | null;
            awards: string[];
            publications: string[];
            languages: string[];
            isAcceptingNewPatients: boolean;
            consultationTypes: import(".prisma/client").$Enums.ConsultationType[];
            currency: string;
        };
    }>;
    updateProfile(doctorId: string, updateData: {
        specialization?: string;
        specialties?: string[];
        bio?: string;
        experience?: string;
        education?: string;
        consultationFee?: number;
        services?: string;
        availability?: string;
        yearsOfExperience?: number;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            npiNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            title: string | null;
            credentials: string[];
            specialties: string[];
            subSpecialties: string[];
            yearsExperience: number | null;
            practiceName: string | null;
            practiceType: import(".prisma/client").$Enums.PracticeType;
            practiceAddress: string | null;
            practiceCity: string | null;
            practiceState: string | null;
            practiceZipCode: string | null;
            practicePhone: string | null;
            practiceEmail: string | null;
            practiceWebsite: string | null;
            medicalLicenseNumber: string | null;
            medicalLicenseState: string | null;
            medicalLicenseExpiry: Date | null;
            deaNumber: string | null;
            boardCertifications: string[];
            professionalBio: string | null;
            education: string | null;
            awards: string[];
            publications: string[];
            languages: string[];
            isAcceptingNewPatients: boolean;
            consultationTypes: import(".prisma/client").$Enums.ConsultationType[];
            currency: string;
        };
        message: string;
    }>;
    getServices(doctorId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            doctorId: string;
            profileId: string;
            description: string | null;
            category: import(".prisma/client").$Enums.ServiceCategory;
            duration: number;
            price: import("@prisma/client/runtime/library").Decimal | null;
            isVirtual: boolean;
            isInPerson: boolean;
        }[];
    }>;
    upsertServices(doctorId: string, services: Array<{
        id?: string;
        name: string;
        description?: string;
        duration?: number;
        price?: any;
    }>): Promise<{
        success: boolean;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            doctorId: string;
            profileId: string;
            description: string | null;
            category: import(".prisma/client").$Enums.ServiceCategory;
            duration: number;
            price: import("@prisma/client/runtime/library").Decimal | null;
            isVirtual: boolean;
            isInPerson: boolean;
        }[];
    }>;
    deleteService(doctorId: string, serviceId: string): Promise<{
        success: boolean;
    }>;
    getInsurance(doctorId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            profileId: string;
            insuranceName: string;
            insuranceType: import(".prisma/client").$Enums.InsuranceType;
            planName: string | null;
            copayAmount: import("@prisma/client/runtime/library").Decimal | null;
            deductibleAmount: import("@prisma/client/runtime/library").Decimal | null;
        }[];
    }>;
    upsertInsurance(doctorId: string, providers: Array<{
        id?: string;
        insuranceName: string;
        insuranceType?: any;
        planName?: string;
    }>): Promise<{
        success: boolean;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            profileId: string;
            insuranceName: string;
            insuranceType: import(".prisma/client").$Enums.InsuranceType;
            planName: string | null;
            copayAmount: import("@prisma/client/runtime/library").Decimal | null;
            deductibleAmount: import("@prisma/client/runtime/library").Decimal | null;
        }[];
    }>;
    deleteInsurance(doctorId: string, id: string): Promise<{
        success: boolean;
    }>;
    getBilling(doctorId: string): Promise<{
        success: boolean;
        data: {
            consultationFee: any;
            currency: any;
        };
    }>;
    updateBilling(doctorId: string, billing: {
        consultationFee: number;
        currency?: string;
    }): Promise<{
        success: boolean;
        data: {
            consultationFee: any;
            currency: any;
        };
    }>;
    getPublicProfile(doctorId: string): Promise<{
        success: boolean;
        data: {
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
        } & {
            id: string;
            npiNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            title: string | null;
            credentials: string[];
            specialties: string[];
            subSpecialties: string[];
            yearsExperience: number | null;
            practiceName: string | null;
            practiceType: import(".prisma/client").$Enums.PracticeType;
            practiceAddress: string | null;
            practiceCity: string | null;
            practiceState: string | null;
            practiceZipCode: string | null;
            practicePhone: string | null;
            practiceEmail: string | null;
            practiceWebsite: string | null;
            medicalLicenseNumber: string | null;
            medicalLicenseState: string | null;
            medicalLicenseExpiry: Date | null;
            deaNumber: string | null;
            boardCertifications: string[];
            professionalBio: string | null;
            education: string | null;
            awards: string[];
            publications: string[];
            languages: string[];
            isAcceptingNewPatients: boolean;
            consultationTypes: import(".prisma/client").$Enums.ConsultationType[];
            currency: string;
        };
    }>;
}
