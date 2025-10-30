import { PrismaService } from '../prisma.service';
export declare class SchedulingRepository {
    private prisma;
    constructor(prisma: PrismaService);
    get doctorSchedule(): import(".prisma/client").Prisma.DoctorScheduleDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get doctorAvailability(): import(".prisma/client").Prisma.DoctorAvailabilityDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get doctorScheduleException(): import(".prisma/client").Prisma.DoctorScheduleExceptionDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    get doctorScheduleTemplate(): import(".prisma/client").Prisma.DoctorScheduleTemplateDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    findAvailableSlots(doctorId: string, fromDate: Date, toDate: Date): Promise<{
        schedule: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            date: Date | null;
            serviceType: string | null;
            notes: string | null;
            profileId: string;
            templateId: string | null;
            dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
            startTime: string;
            endTime: string;
            isAvailable: boolean;
            slotDuration: number;
            bufferTime: number;
            maxBookings: number;
            location: string | null;
            breakStartTime: string | null;
            breakEndTime: string | null;
            isRecurring: boolean;
            effectiveFrom: Date;
            effectiveUntil: Date | null;
        }[];
        exceptions: {
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
        }[];
    }>;
    createException(doctorId: string, date: Date, reason: string): Promise<{
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
    }>;
    getTemplate(doctorId: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        doctorId: string;
        description: string | null;
        isDefault: boolean;
    }>;
}
