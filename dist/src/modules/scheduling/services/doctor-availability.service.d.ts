import { DatabaseService } from '../../auth/services/database.service';
export declare class DoctorAvailabilityService {
    private db;
    constructor(db: DatabaseService);
    setRecurringAvailability(doctorId: string, availabilityData: {
        workingDays: string[];
        startTime: string;
        endTime: string;
        slotDuration: number;
        bufferTime: number;
        breaks?: Array<{
            startTime: string;
            endTime: string;
        }>;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            doctorId: string;
            description: string | null;
            isDefault: boolean;
        };
        message: string;
    }>;
    private createTimeSlotForDay;
    markDateUnavailable(doctorId: string, date: string, reason?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            date: Date;
            startTime: string | null;
            endTime: string | null;
            isRecurring: boolean;
            type: import(".prisma/client").$Enums.ExceptionType;
            reason: string | null;
            isAllDay: boolean;
            recurringPattern: string | null;
        };
        message: string;
    }>;
    addCustomHours(doctorId: string, date: string, startTime: string, endTime: string, reason?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            date: Date;
            startTime: string | null;
            endTime: string | null;
            isRecurring: boolean;
            type: import(".prisma/client").$Enums.ExceptionType;
            reason: string | null;
            isAllDay: boolean;
            recurringPattern: string | null;
        };
        message: string;
    }>;
    getAvailability(doctorId: string, startDate: string, endDate: string): Promise<{
        success: boolean;
        data: any[];
        message: string;
    }>;
    getAvailableSlots(doctorId: string, date: string): Promise<{
        success: boolean;
        data: any[];
        message: string;
    }>;
    private generateTimeSlots;
    private getDayOfWeek;
    generateDailySlots(): Promise<void>;
    generateSlotsForDoctor(doctorId: string, date: string): Promise<void>;
    getWorkingHours(doctorId: string, date: string): Promise<{
        startTime: string;
        endTime: string;
        isAvailable: boolean;
        reason: string;
        type: string;
    }>;
}
