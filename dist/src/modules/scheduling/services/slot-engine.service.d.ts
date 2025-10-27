import { DatabaseService } from '../../auth/services/database.service';
export declare class SlotEngineService {
    private db;
    constructor(db: DatabaseService);
    generateSlotsForDate(doctorId: string, date: string): Promise<{
        success: boolean;
        data: any[];
        message: string;
    }>;
    private generateTimeSlotsFromSchedule;
    checkSlotAvailability(doctorId: string, date: string, startTime: string, endTime: string): Promise<{
        success: boolean;
        data: {
            isAvailable: boolean;
            scheduleId: string;
        };
        message: string;
    }>;
    lockSlot(doctorId: string, scheduleId: string, startTime: string, endTime: string): Promise<{
        success: boolean;
        message: string;
    }>;
    releaseSlot(doctorId: string, scheduleId: string, startTime: string): Promise<{
        success: boolean;
        message: string;
    }>;
    generateSlotsForDateRange(doctorId: string, startDate: string, endDate: string): Promise<{
        success: boolean;
        data: any[];
        message: string;
    }>;
    getAvailableSlotsInRange(doctorId: string, date: string, startTime?: string, endTime?: string): Promise<{
        success: boolean;
        data: any[];
        message: string;
    }>;
    updateSlotStatus(slotId: string, status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED' | 'EXPIRED'): Promise<{
        success: boolean;
        message: string;
    }>;
    markExpiredSlots(): Promise<void>;
    checkConflicts(doctorId: string, date: string, startTime: string, endTime: string, excludeAppointmentId?: string): Promise<{
        hasConflicts: boolean;
        conflicts: {
            type: import(".prisma/client").$Enums.AppointmentType;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            doctorId: string;
            startTime: string;
            endTime: string;
            serviceType: string | null;
            notes: string | null;
            patientId: string;
            scheduleId: string | null;
            isRecurring: boolean;
            appointmentDate: Date;
            duration: number;
            symptoms: string | null;
            diagnosis: string | null;
            prescription: string | null;
            followUpDate: Date | null;
            recurringPattern: string | null;
        }[];
        message: string;
    }>;
    validateSlotDuration(doctorId: string, duration: number): Promise<{
        isValid: boolean;
        message: string;
    }>;
    private getDayOfWeek;
    calculateSlotDuration(startTime: string, endTime: string): number;
    getNextAvailableSlot(doctorId: string, fromDate?: string): Promise<{
        success: boolean;
        data: any[];
        message: string;
    } | {
        success: boolean;
        data: {
            date: any;
            slot: any;
        };
        message: string;
    }>;
}
