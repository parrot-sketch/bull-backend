import { DatabaseService } from '../../auth/services/database.service';
import { BookAppointmentDto, CreateExceptionDto, CreateScheduleTemplateDto, CreateTimeSlotDto, UpdateAppointmentDto, UpdateScheduleTemplateDto, UpdateTimeSlotDto } from '../dto/scheduling.dto';
import { AppointmentManagementService } from './appointment-management.service';
import { DoctorAvailabilityService } from './doctor-availability.service';
import { SlotEngineService } from './slot-engine.service';
export declare class SchedulingService {
    private db;
    doctorAvailability: DoctorAvailabilityService;
    slotEngine: SlotEngineService;
    appointmentManagement: AppointmentManagementService;
    constructor(db: DatabaseService, doctorAvailability: DoctorAvailabilityService, slotEngine: SlotEngineService, appointmentManagement: AppointmentManagementService);
    createScheduleTemplate(doctorId: string, templateData: CreateScheduleTemplateDto): Promise<{
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
    getScheduleTemplates(doctorId: string): Promise<{
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
    updateScheduleTemplate(templateId: string, updateData: UpdateScheduleTemplateDto): Promise<{
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
    createTimeSlot(templateId: string, slotData: CreateTimeSlotDto): Promise<{
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
    updateTimeSlot(slotId: string, updateData: UpdateTimeSlotDto): Promise<{
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
    generateSchedule(doctorId: string, templateId: string, date: string): Promise<{
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
    private getDayOfWeek;
    private generateTimeSlotsFromTemplate;
    getAvailability(doctorId: string, date: string): Promise<{
        success: boolean;
        data: any[];
        message: string;
    }>;
    private generateTimeSlotsForSchedule;
    updateAvailability(doctorId: string, date: string, timeSlots: any[]): Promise<{
        success: boolean;
        message: string;
    }>;
    createException(doctorId: string, exceptionData: CreateExceptionDto): Promise<{
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
    getExceptions(doctorId: string, startDate?: string, endDate?: string): Promise<{
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
    bookAppointment(appointmentData: BookAppointmentDto): Promise<{
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
    getAppointments(doctorId: string, startDate?: string, endDate?: string): Promise<{
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
    updateAppointment(appointmentId: string, updateData: UpdateAppointmentDto): Promise<{
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
    cancelAppointment(appointmentId: string): Promise<{
        success: boolean;
        data: {
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
}
