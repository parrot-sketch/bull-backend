export declare class CreateScheduleTemplateDto {
    name: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    slotDuration: number;
    bufferTime: number;
    maxBookings: number;
    location?: string;
    serviceType?: string;
    notes?: string;
    isActive: boolean;
}
export declare class UpdateScheduleTemplateDto {
    name?: string;
    dayOfWeek?: string;
    startTime?: string;
    endTime?: string;
    slotDuration?: number;
    bufferTime?: number;
    maxBookings?: number;
    location?: string;
    serviceType?: string;
    notes?: string;
    isActive?: boolean;
}
export declare class CreateTimeSlotDto {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    notes?: string;
}
export declare class UpdateTimeSlotDto {
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
    notes?: string;
}
export declare enum ExceptionType {
    BLOCKED = "BLOCKED",
    UNAVAILABLE = "UNAVAILABLE",
    CUSTOM_HOURS = "CUSTOM_HOURS"
}
export declare class CreateExceptionDto {
    date: string;
    startTime?: string;
    endTime?: string;
    isAvailable: boolean;
    reason: string;
    type: ExceptionType;
}
export declare enum AppointmentType {
    CONSULTATION = "CONSULTATION",
    FOLLOW_UP = "FOLLOW_UP",
    EMERGENCY = "EMERGENCY",
    ROUTINE = "ROUTINE"
}
export declare enum AppointmentStatus {
    SCHEDULED = "SCHEDULED",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
    NO_SHOW = "NO_SHOW"
}
export declare class BookAppointmentDto {
    patientId: string;
    doctorId: string;
    scheduleId: string;
    date: string;
    startTime: string;
    endTime: string;
    type: AppointmentType;
    notes?: string;
}
export declare class UpdateAppointmentDto {
    date?: string;
    startTime?: string;
    endTime?: string;
    type?: AppointmentType;
    status?: AppointmentStatus;
    notes?: string;
}
export declare class GetAvailabilityDto {
    date: string;
    doctorId?: string;
}
export declare class UpdateAvailabilityDto {
    date: string;
    timeSlots: TimeSlotAvailabilityDto[];
}
export declare class TimeSlotAvailabilityDto {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}
export declare class ScheduleAnalyticsDto {
    startDate: string;
    endDate: string;
    doctorId?: string;
}
