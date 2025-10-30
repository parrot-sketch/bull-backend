import { QueryNotificationsDto } from '../dto/notification.dto';
import { NotificationService } from '../services/notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(req: any, query: QueryNotificationsDto): Promise<{
        success: boolean;
        data: {
            notifications: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                title: string;
                type: import(".prisma/client").$Enums.NotificationType;
                message: string;
                body: string | null;
                isRead: boolean;
                readAt: Date | null;
                isArchived: boolean;
                archivedAt: Date | null;
                priority: import(".prisma/client").$Enums.NotificationPriority;
                actionUrl: string | null;
                actionLabel: string | null;
                channels: import(".prisma/client").$Enums.NotificationChannel[];
                relatedEntityType: string | null;
                relatedEntityId: string | null;
            }[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    getUnreadCount(req: any): Promise<{
        success: boolean;
        count: number;
    }>;
    markAsRead(req: any, notificationId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markAllAsRead(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    archiveNotification(req: any, notificationId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteNotification(req: any, notificationId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
