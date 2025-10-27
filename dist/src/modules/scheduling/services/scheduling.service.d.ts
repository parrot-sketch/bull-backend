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
                templateId: string;
                dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
                startTime: string;
                endTime: string;
                slotDuration: number;
                bufferTime: number;
                isAvailable: boolean;
                maxBookings: number;
                location: string | null;
                serviceType: string | null;
            }[];
        } & {
            id: string;
            name: string;
            description: string | null;
            isDefault: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
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
                templateId: string;
                dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
                startTime: string;
                endTime: string;
                slotDuration: number;
                bufferTime: number;
                isAvailable: boolean;
                maxBookings: number;
                location: string | null;
                serviceType: string | null;
            }[];
        } & {
            id: string;
            name: string;
            description: string | null;
            isDefault: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
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
                templateId: string;
                dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
                startTime: string;
                endTime: string;
                slotDuration: number;
                bufferTime: number;
                isAvailable: boolean;
                maxBookings: number;
                location: string | null;
                serviceType: string | null;
            }[];
        } & {
            id: string;
            name: string;
            description: string | null;
            isDefault: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
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
            templateId: string;
            dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
            startTime: string;
            endTime: string;
            slotDuration: number;
            bufferTime: number;
            isAvailable: boolean;
            maxBookings: number;
            location: string | null;
            serviceType: string | null;
        };
        message: string;
    }>;
    updateTimeSlot(slotId: string, updateData: UpdateTimeSlotDto): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            templateId: string;
            dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
            startTime: string;
            endTime: string;
            slotDuration: number;
            bufferTime: number;
            isAvailable: boolean;
            maxBookings: number;
            location: string | null;
            serviceType: string | null;
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
            doctorId: string;
            templateId: string | null;
            dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
            startTime: string;
            endTime: string;
            slotDuration: number;
            bufferTime: number;
            isAvailable: boolean;
            maxBookings: number;
            location: string | null;
            serviceType: string | null;
            date: Date | null;
            notes: string | null;
            breakStartTime: string | null;
            breakEndTime: string | null;
            isRecurring: boolean;
            effectiveFrom: Date;
            effectiveUntil: Date | null;
            profileId: string;
        };
        message: string;
    }>;
    private getDayOfWeek;
    private generateTimeSlotsFromTemplate;
    getAvailability(doctorId: string, date: string): Promise<{
        success: boolean;
        data: {
            isAvailable: boolean;
            date: string;
            template?: undefined;
            timeSlots?: undefined;
            schedule?: undefined;
        };
        message: string;
    } | {
        success: boolean;
        data: {
            isAvailable: boolean;
            template: {
                id: string;
                name: string;
                description: string | null;
                isDefault: boolean;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
            };
            timeSlots: any[];
            schedule: {
                template: {
                    id: string;
                    name: string;
                    description: string | null;
                    isDefault: boolean;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    doctorId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                templateId: string | null;
                dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
                startTime: string;
                endTime: string;
                slotDuration: number;
                bufferTime: number;
                isAvailable: boolean;
                maxBookings: number;
                location: string | null;
                serviceType: string | null;
                date: Date | null;
                notes: string | null;
                breakStartTime: string | null;
                breakEndTime: string | null;
                isRecurring: boolean;
                effectiveFrom: Date;
                effectiveUntil: Date | null;
                profileId: string;
            };
            date?: undefined;
        };
        message: string;
    }>;
    private generateTimeSlotsForSchedule;
    updateAvailability(doctorId: string, date: string, timeSlots: any[]): Promise<{
        success: boolean;
        data: {
            schedule: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                templateId: string | null;
                dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
                startTime: string;
                endTime: string;
                slotDuration: number;
                bufferTime: number;
                isAvailable: boolean;
                maxBookings: number;
                location: string | null;
                serviceType: string | null;
                date: Date | null;
                notes: string | null;
                breakStartTime: string | null;
                breakEndTime: string | null;
                isRecurring: boolean;
                effectiveFrom: Date;
                effectiveUntil: Date | null;
                profileId: string;
            };
            timeSlots: any[];
        };
        message: string;
    }>;
    createException(doctorId: string, exceptionData: CreateExceptionDto): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            startTime: string | null;
            endTime: string | null;
            date: Date;
            isRecurring: boolean;
            type: import(".prisma/client").$Enums.ExceptionType;
            reason: string | null;
            isAllDay: boolean;
            recurringPattern: string | null;
        };
        message: string;
    }>;
    getExceptions(doctorId: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            startTime: string | null;
            endTime: string | null;
            date: Date;
            isRecurring: boolean;
            type: import(".prisma/client").$Enums.ExceptionType;
            reason: string | null;
            isAllDay: boolean;
            recurringPattern: string | null;
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
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                npiNumber: string | null;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.UserRole;
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
                lastLoginAt: Date | null;
                lastPasswordChange: Date;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            startTime: string;
            endTime: string;
            location: string | null;
            serviceType: string | null;
            notes: string | null;
            isRecurring: boolean;
            type: import(".prisma/client").$Enums.AppointmentType;
            recurringPattern: string | null;
            appointmentDate: Date;
            duration: number;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            symptoms: string | null;
            diagnosis: string | null;
            prescription: string | null;
            followUpDate: Date | null;
            patientId: string;
            scheduleId: string | null;
        };
        message: string;
    }>;
    getAppointments(doctorId: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: ({
            patient: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                npiNumber: string | null;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.UserRole;
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
                lastLoginAt: Date | null;
                lastPasswordChange: Date;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            startTime: string;
            endTime: string;
            location: string | null;
            serviceType: string | null;
            notes: string | null;
            isRecurring: boolean;
            type: import(".prisma/client").$Enums.AppointmentType;
            recurringPattern: string | null;
            appointmentDate: Date;
            duration: number;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            symptoms: string | null;
            diagnosis: string | null;
            prescription: string | null;
            followUpDate: Date | null;
            patientId: string;
            scheduleId: string | null;
        })[];
        message: string;
    }>;
    updateAppointment(appointmentId: string, updateData: UpdateAppointmentDto): Promise<{
        success: boolean;
        data: {
            patient: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                npiNumber: string | null;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.UserRole;
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
                lastLoginAt: Date | null;
                lastPasswordChange: Date;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            startTime: string;
            endTime: string;
            location: string | null;
            serviceType: string | null;
            notes: string | null;
            isRecurring: boolean;
            type: import(".prisma/client").$Enums.AppointmentType;
            recurringPattern: string | null;
            appointmentDate: Date;
            duration: number;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            symptoms: string | null;
            diagnosis: string | null;
            prescription: string | null;
            followUpDate: Date | null;
            patientId: string;
            scheduleId: string | null;
        };
        message: string;
    }>;
    cancelAppointment(appointmentId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            startTime: string;
            endTime: string;
            location: string | null;
            serviceType: string | null;
            notes: string | null;
            isRecurring: boolean;
            type: import(".prisma/client").$Enums.AppointmentType;
            recurringPattern: string | null;
            appointmentDate: Date;
            duration: number;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            symptoms: string | null;
            diagnosis: string | null;
            prescription: string | null;
            followUpDate: Date | null;
            patientId: string;
            scheduleId: string | null;
        };
        message: string;
    }>;
}
