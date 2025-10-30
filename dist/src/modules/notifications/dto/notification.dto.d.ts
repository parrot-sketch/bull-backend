export declare enum NotificationType {
    APPOINTMENT_REQUESTED = "APPOINTMENT_REQUESTED",
    APPOINTMENT_SCHEDULED = "APPOINTMENT_SCHEDULED",
    APPOINTMENT_CONFIRMED = "APPOINTMENT_CONFIRMED",
    APPOINTMENT_CANCELLED = "APPOINTMENT_CANCELLED",
    APPOINTMENT_REMINDER = "APPOINTMENT_REMINDER",
    APPOINTMENT_RESCHEDULED = "APPOINTMENT_RESCHEDULED",
    SYSTEM_ALERT = "SYSTEM_ALERT",
    SYSTEM_MAINTENANCE = "SYSTEM_MAINTENANCE",
    WELCOME = "WELCOME",
    PROFILE_UPDATE = "PROFILE_UPDATE",
    PRESCRIPTION_READY = "PRESCRIPTION_READY",
    LAB_RESULT_AVAILABLE = "LAB_RESULT_AVAILABLE",
    IMAGING_RESULT_AVAILABLE = "IMAGING_RESULT_AVAILABLE",
    MESSAGE_RECEIVED = "MESSAGE_RECEIVED",
    FILE_SHARED = "FILE_SHARED"
}
export declare enum NotificationPriority {
    LOW = "LOW",
    NORMAL = "NORMAL",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare enum NotificationChannel {
    IN_APP = "IN_APP",
    PUSH = "PUSH",
    EMAIL = "EMAIL",
    SMS = "SMS"
}
export declare class CreateNotificationDto {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    body?: string;
    priority?: NotificationPriority;
    actionUrl?: string;
    actionLabel?: string;
    metadata?: Record<string, any>;
    channels?: NotificationChannel[];
    relatedEntityType?: string;
    relatedEntityId?: string;
}
export declare class UpdateNotificationDto {
    isRead?: boolean;
    isArchived?: boolean;
}
export declare class QueryNotificationsDto {
    type?: string;
    unreadOnly?: boolean;
    includeArchived?: boolean;
    page?: string;
    limit?: string;
}
