import { DatabaseService } from '../../auth/services/database.service';
import { CreateNotificationDto } from '../dto/notification.dto';
export declare class NotificationService {
    private db;
    private readonly logger;
    constructor(db: DatabaseService);
    createAndDispatch(dto: CreateNotificationDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        message: string;
        id: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        body: string | null;
        priority: import(".prisma/client").$Enums.NotificationPriority;
        actionUrl: string | null;
        actionLabel: string | null;
        channels: import(".prisma/client").$Enums.NotificationChannel[];
        relatedEntityType: string | null;
        relatedEntityId: string | null;
        isRead: boolean;
        isArchived: boolean;
        readAt: Date | null;
        archivedAt: Date | null;
    }>;
    getUserNotifications(userId: string, filters?: {
        type?: string;
        unreadOnly?: boolean;
        includeArchived?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        notifications: {
            type: import(".prisma/client").$Enums.NotificationType;
            message: string;
            id: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            body: string | null;
            priority: import(".prisma/client").$Enums.NotificationPriority;
            actionUrl: string | null;
            actionLabel: string | null;
            channels: import(".prisma/client").$Enums.NotificationChannel[];
            relatedEntityType: string | null;
            relatedEntityId: string | null;
            isRead: boolean;
            isArchived: boolean;
            readAt: Date | null;
            archivedAt: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    archiveNotification(notificationId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteNotification(notificationId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    notifyAppointmentRequested(appointment: any): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        message: string;
        id: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        body: string | null;
        priority: import(".prisma/client").$Enums.NotificationPriority;
        actionUrl: string | null;
        actionLabel: string | null;
        channels: import(".prisma/client").$Enums.NotificationChannel[];
        relatedEntityType: string | null;
        relatedEntityId: string | null;
        isRead: boolean;
        isArchived: boolean;
        readAt: Date | null;
        archivedAt: Date | null;
    }>;
    notifyAppointmentScheduled(appointment: any): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        type: import(".prisma/client").$Enums.NotificationType;
        message: string;
        id: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        body: string | null;
        priority: import(".prisma/client").$Enums.NotificationPriority;
        actionUrl: string | null;
        actionLabel: string | null;
        channels: import(".prisma/client").$Enums.NotificationChannel[];
        relatedEntityType: string | null;
        relatedEntityId: string | null;
        isRead: boolean;
        isArchived: boolean;
        readAt: Date | null;
        archivedAt: Date | null;
    }>;
}
