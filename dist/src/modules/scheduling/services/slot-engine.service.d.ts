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
            prescription: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            serviceType: string | null;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            reasonForVisit: string | null;
            notes: string | null;
            patientId: string;
            appointmentDate: Date;
            duration: number;
            startTime: string;
            endTime: string;
            location: string | null;
            isRecurring: boolean;
            followUpDate: Date | null;
            type: import(".prisma/client").$Enums.AppointmentType;
            recurringPattern: string | null;
            serviceId: string | null;
            symptoms: string | null;
            scheduleId: string | null;
            diagnosis: string | null;
            insuranceId: string | null;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            bookingRequestedAt: Date;
            confirmedAt: Date | null;
            cancelledAt: Date | null;
            cancelledBy: string | null;
            cancellationReason: string | null;
            requiresConfirmation: boolean;
            confirmationSent: boolean;
            parentAppointmentId: string | null;
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
