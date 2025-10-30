export type NotificationType = 'APPOINTMENT_REMINDER' | 'APPOINTMENT_CONFIRMATION' | 'APPOINTMENT_CANCELLATION' | 'PRESCRIPTION_READY' | 'LAB_RESULTS' | 'SYSTEM_ALERT';
export interface CreateNotificationDto {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    metadata?: Record<string, unknown>;
}
export interface NotificationFilters {
    userId?: string;
    type?: NotificationType;
    isRead?: boolean;
    from?: Date;
    to?: Date;
}
