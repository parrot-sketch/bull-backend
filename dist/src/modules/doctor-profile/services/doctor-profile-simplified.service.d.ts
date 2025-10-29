import { DatabaseService } from '../../auth/services/database.service';
export declare class DoctorProfileService {
    private readonly db;
    constructor(db: DatabaseService);
    createProfile(doctorId: string, profileData: {
        specialization: string;
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
            doctorId: string;
            specialization: string;
            bio: string;
            experience: string;
            education: string;
            consultationFee: number;
            services: string;
            availability: string;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }>;
    getProfile(doctorId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            doctorId: string;
            specialization: string;
            bio: string;
            experience: string;
            education: string;
            consultationFee: number;
            services: string;
            availability: string;
            createdAt: string;
            updatedAt: string;
        };
    }>;
    updateProfile(doctorId: string, updateData: {
        specialization?: string;
        bio?: string;
        experience?: string;
        education?: string;
        consultationFee?: number;
        services?: string;
        availability?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            doctorId: string;
            specialization: string;
            bio: string;
            experience: string;
            education: string;
            consultationFee: number;
            services: string;
            availability: string;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }>;
    getPublicProfile(doctorId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            doctorId: string;
            specialization: string;
            bio: string;
            experience: string;
            consultationFee: number;
            services: string;
            availability: string;
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
            createdAt: string;
            updatedAt: string;
        };
    }>;
}
