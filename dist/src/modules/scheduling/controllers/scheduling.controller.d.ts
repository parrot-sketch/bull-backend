import { BookAppointmentDto, CreateExceptionDto, CreateScheduleTemplateDto, CreateTimeSlotDto, GetAvailabilityDto, ScheduleAnalyticsDto, UpdateAppointmentDto, UpdateAvailabilityDto, UpdateScheduleTemplateDto, UpdateTimeSlotDto } from '../dto/scheduling.dto';
import { SchedulingService } from '../services/scheduling.service';
export declare class SchedulingController {
    private readonly schedulingService;
    constructor(schedulingService: SchedulingService);
    createScheduleTemplate(req: any, createTemplateDto: CreateScheduleTemplateDto): Promise<{
        success: boolean;
        data: {
            timeSlots: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                location: string | null;
                dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
                startTime: string;
                endTime: string;
                slotDuration: number;
                bufferTime: number;
                maxBookings: number;
                serviceType: string | null;
                isAvailable: boolean;
                templateId: string;
            }[];
        } & {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            doctorId: string;
            isDefault: boolean;
        };
        message: string;
    }>;
    getScheduleTemplates(req: any): Promise<{
        success: boolean;
        data: ({
            timeSlots: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                location: string | null;
                dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
                startTime: string;
                endTime: string;
                slotDuration: number;
                bufferTime: number;
                maxBookings: number;
                serviceType: string | null;
                isAvailable: boolean;
                templateId: string;
            }[];
        } & {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            doctorId: string;
            isDefault: boolean;
        })[];
        message: string;
    }>;
    updateScheduleTemplate(templateId: string, updateTemplateDto: UpdateScheduleTemplateDto): Promise<{
        success: boolean;
        data: {
            timeSlots: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                location: string | null;
                dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
                startTime: string;
                endTime: string;
                slotDuration: number;
                bufferTime: number;
                maxBookings: number;
                serviceType: string | null;
                isAvailable: boolean;
                templateId: string;
            }[];
        } & {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            doctorId: string;
            isDefault: boolean;
        };
        message: string;
    }>;
    deleteScheduleTemplate(templateId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createTimeSlot(templateId: string, createSlotDto: CreateTimeSlotDto): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
            startTime: string;
            endTime: string;
            slotDuration: number;
            bufferTime: number;
            maxBookings: number;
            serviceType: string | null;
            isAvailable: boolean;
            templateId: string;
        };
        message: string;
    }>;
    updateTimeSlot(slotId: string, updateSlotDto: UpdateTimeSlotDto): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
            startTime: string;
            endTime: string;
            slotDuration: number;
            bufferTime: number;
            maxBookings: number;
            serviceType: string | null;
            isAvailable: boolean;
            templateId: string;
        };
        message: string;
    }>;
    deleteTimeSlot(slotId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    generateSchedule(req: any, body: {
        templateId: string;
        date: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            doctorId: string;
            dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
            startTime: string;
            endTime: string;
            slotDuration: number;
            bufferTime: number;
            maxBookings: number;
            serviceType: string | null;
            notes: string | null;
            isAvailable: boolean;
            date: Date | null;
            profileId: string;
            templateId: string | null;
            breakStartTime: string | null;
            breakEndTime: string | null;
            isRecurring: boolean;
            effectiveFrom: Date;
            effectiveUntil: Date | null;
        };
        message: string;
    }>;
    getAvailability(req: any, query: GetAvailabilityDto): Promise<{
        success: boolean;
        data: any[];
        message: string;
    }>;
    getAvailabilityRange(req: any, startDate: string, endDate: string): Promise<{
        success: boolean;
        data: any[];
        message: string;
    }>;
    getAvailableSlots(req: any, date: string, startTime?: string, endTime?: string): Promise<{
        success: boolean;
        data: any[];
        message: string;
    }>;
    updateAvailability(req: any, updateAvailabilityDto: UpdateAvailabilityDto): Promise<{
        success: boolean;
        message: string;
    }>;
    setupRecurringAvailability(req: any, availabilityData: {
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
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            doctorId: string;
            isDefault: boolean;
        };
        message: string;
    }>;
    createException(req: any, createExceptionDto: CreateExceptionDto): Promise<{
        success: boolean;
        data: {
            type: import(".prisma/client").$Enums.ExceptionType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            startTime: string | null;
            endTime: string | null;
            date: Date;
            reason: string | null;
            isRecurring: boolean;
            recurringPattern: string | null;
            isAllDay: boolean;
        };
        message: string;
    }>;
    getExceptions(req: any, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: {
            type: import(".prisma/client").$Enums.ExceptionType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            startTime: string | null;
            endTime: string | null;
            date: Date;
            reason: string | null;
            isRecurring: boolean;
            recurringPattern: string | null;
            isAllDay: boolean;
        }[];
        message: string;
    }>;
    deleteException(exceptionId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    bookAppointment(bookAppointmentDto: BookAppointmentDto): Promise<{
        success: boolean;
        data: {
            patient: {
                id: string;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.UserRole;
                isActive: boolean;
                isVerified: boolean;
                isLocked: boolean;
                lockedUntil: Date | null;
                avatar: string | null;
                phoneNumber: string | null;
                dateOfBirth: Date | null;
                gender: import(".prisma/client").$Enums.Gender | null;
                address: string | null;
                city: string | null;
                state: string | null;
                zipCode: string | null;
                country: string;
                department: string | null;
                specialization: string | null;
                licenseNumber: string | null;
                npiNumber: string | null;
                lastLoginAt: Date | null;
                lastPasswordChange: Date;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
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
        };
        message: string;
    }>;
    getAppointments(req: any, startDate?: string, endDate?: string, status?: string, limit?: number): Promise<{
        success: boolean;
        data: {
            id: string;
            patientName: string;
            patientEmail: string;
            appointmentDate: string;
            startTime: string;
            endTime: string;
            status: string;
            type: string;
            notes: string;
        }[];
        message: string;
    }>;
    getUpcomingAppointments(req: any, limit?: number): Promise<{
        success: boolean;
        data: ({
            patient: {
                id: string;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.UserRole;
                isActive: boolean;
                isVerified: boolean;
                isLocked: boolean;
                lockedUntil: Date | null;
                avatar: string | null;
                phoneNumber: string | null;
                dateOfBirth: Date | null;
                gender: import(".prisma/client").$Enums.Gender | null;
                address: string | null;
                city: string | null;
                state: string | null;
                zipCode: string | null;
                country: string;
                department: string | null;
                specialization: string | null;
                licenseNumber: string | null;
                npiNumber: string | null;
                lastLoginAt: Date | null;
                lastPasswordChange: Date;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
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
        })[];
        message: string;
    }>;
    getTodaysAppointments(req: any): Promise<{
        success: boolean;
        data: ({
            patient: {
                id: string;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.UserRole;
                isActive: boolean;
                isVerified: boolean;
                isLocked: boolean;
                lockedUntil: Date | null;
                avatar: string | null;
                phoneNumber: string | null;
                dateOfBirth: Date | null;
                gender: import(".prisma/client").$Enums.Gender | null;
                address: string | null;
                city: string | null;
                state: string | null;
                zipCode: string | null;
                country: string;
                department: string | null;
                specialization: string | null;
                licenseNumber: string | null;
                npiNumber: string | null;
                lastLoginAt: Date | null;
                lastPasswordChange: Date;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
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
        })[];
        message: string;
    }>;
    getAppointmentStats(req: any, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: {
            total: number;
            pending: number;
            confirmed: number;
            completed: number;
            cancelled: number;
            noShow: number;
        };
        message: string;
    }>;
    updateAppointment(appointmentId: string, updateAppointmentDto: UpdateAppointmentDto): Promise<{
        success: boolean;
        data: {
            patient: {
                id: string;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.UserRole;
                isActive: boolean;
                isVerified: boolean;
                isLocked: boolean;
                lockedUntil: Date | null;
                avatar: string | null;
                phoneNumber: string | null;
                dateOfBirth: Date | null;
                gender: import(".prisma/client").$Enums.Gender | null;
                address: string | null;
                city: string | null;
                state: string | null;
                zipCode: string | null;
                country: string;
                department: string | null;
                specialization: string | null;
                licenseNumber: string | null;
                npiNumber: string | null;
                lastLoginAt: Date | null;
                lastPasswordChange: Date;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
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
        };
        message: string;
    }>;
    confirmAppointment(req: any, appointmentId: string): Promise<{
        success: boolean;
        data: {
            patient: {
                id: string;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.UserRole;
                isActive: boolean;
                isVerified: boolean;
                isLocked: boolean;
                lockedUntil: Date | null;
                avatar: string | null;
                phoneNumber: string | null;
                dateOfBirth: Date | null;
                gender: import(".prisma/client").$Enums.Gender | null;
                address: string | null;
                city: string | null;
                state: string | null;
                zipCode: string | null;
                country: string;
                department: string | null;
                specialization: string | null;
                licenseNumber: string | null;
                npiNumber: string | null;
                lastLoginAt: Date | null;
                lastPasswordChange: Date;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
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
        };
        message: string;
    }>;
    rescheduleAppointment(appointmentId: string, body: {
        newDate: string;
        newStartTime: string;
        newEndTime: string;
        reason?: string;
    }): Promise<{
        success: boolean;
        data: {
            patient: {
                id: string;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.UserRole;
                isActive: boolean;
                isVerified: boolean;
                isLocked: boolean;
                lockedUntil: Date | null;
                avatar: string | null;
                phoneNumber: string | null;
                dateOfBirth: Date | null;
                gender: import(".prisma/client").$Enums.Gender | null;
                address: string | null;
                city: string | null;
                state: string | null;
                zipCode: string | null;
                country: string;
                department: string | null;
                specialization: string | null;
                licenseNumber: string | null;
                npiNumber: string | null;
                lastLoginAt: Date | null;
                lastPasswordChange: Date;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
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
        };
        message: string;
    }>;
    cancelAppointment(appointmentId: string, body: {
        reason?: string;
        cancelledBy?: 'DOCTOR' | 'PATIENT';
    }): Promise<{
        success: boolean;
        data: {
            patient: {
                id: string;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.UserRole;
                isActive: boolean;
                isVerified: boolean;
                isLocked: boolean;
                lockedUntil: Date | null;
                avatar: string | null;
                phoneNumber: string | null;
                dateOfBirth: Date | null;
                gender: import(".prisma/client").$Enums.Gender | null;
                address: string | null;
                city: string | null;
                state: string | null;
                zipCode: string | null;
                country: string;
                department: string | null;
                specialization: string | null;
                licenseNumber: string | null;
                npiNumber: string | null;
                lastLoginAt: Date | null;
                lastPasswordChange: Date;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
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
        };
        message: string;
    }>;
    completeAppointment(req: any, appointmentId: string, body: {
        notes?: string;
    }): Promise<{
        success: boolean;
        data: {
            patient: {
                id: string;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.UserRole;
                isActive: boolean;
                isVerified: boolean;
                isLocked: boolean;
                lockedUntil: Date | null;
                avatar: string | null;
                phoneNumber: string | null;
                dateOfBirth: Date | null;
                gender: import(".prisma/client").$Enums.Gender | null;
                address: string | null;
                city: string | null;
                state: string | null;
                zipCode: string | null;
                country: string;
                department: string | null;
                specialization: string | null;
                licenseNumber: string | null;
                npiNumber: string | null;
                lastLoginAt: Date | null;
                lastPasswordChange: Date;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
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
        };
        message: string;
    }>;
    getAnalytics(req: any, query: ScheduleAnalyticsDto): Promise<{
        success: boolean;
        data: {
            totalAppointments: number;
            completedAppointments: number;
            cancelledAppointments: number;
            noShowAppointments: number;
            averageAppointmentDuration: number;
            mostPopularTimeSlots: any[];
            revenue: number;
        };
        message: string;
    }>;
}
