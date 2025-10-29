import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../auth/services/database.service';
import {
    CreateNotificationDto,
    NotificationChannel,
    NotificationPriority,
    NotificationType,
} from '../dto/notification.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private db: DatabaseService) {}

  /**
   * Create and dispatch a notification
   * This is the main entry point for creating notifications
   */
  async createAndDispatch(dto: CreateNotificationDto) {
    try {
      // Default channels if not provided
      const channels = dto.channels || [NotificationChannel.IN_APP];

      // Create notification in database
      const notification = await this.db.notification.create({
        data: {
          userId: dto.userId,
          type: dto.type,
          title: dto.title,
          message: dto.message,
          body: dto.body,
          priority: dto.priority || NotificationPriority.NORMAL,
          actionUrl: dto.actionUrl,
          actionLabel: dto.actionLabel,
          metadata: dto.metadata || {},
          channels: channels,
          relatedEntityType: dto.relatedEntityType,
          relatedEntityId: dto.relatedEntityId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      this.logger.log(`Notification created: ${notification.id} for user ${dto.userId}`);

      // TODO: Dispatch via WebSocket for real-time delivery
      // This will be implemented when WebSocket gateway is set up
      // await this.dispatchRealtimeNotification(notification);

      return notification;
    } catch (error) {
      this.logger.error(`Error creating notification: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get notifications for a user
   */
  async getUserNotifications(
    userId: string,
    filters?: {
      type?: string;
      unreadOnly?: boolean;
      includeArchived?: boolean;
      page?: number;
      limit?: number;
    },
  ) {
    const where: any = { userId };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.unreadOnly) {
      where.isRead = false;
    }

    if (!filters?.includeArchived) {
      where.isArchived = false;
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.db.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: skip,
        take: limit,
      }),
      this.db.notification.count({ where }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string) {
    return this.db.notification.count({
      where: {
        userId,
        isRead: false,
        isArchived: false,
      },
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    return this.db.notification.updateMany({
      where: {
        id: notificationId,
        userId, // Ensure user owns the notification
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    return this.db.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Archive notification
   */
  async archiveNotification(notificationId: string, userId: string) {
    return this.db.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string, userId: string) {
    return this.db.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });
  }

  /**
   * Create appointment requested notification (doctor)
   */
  async notifyAppointmentRequested(appointment: any) {
    const doctor = await this.db.user.findUnique({
      where: { id: appointment.doctorId },
      select: { firstName: true, lastName: true },
    });

    const patient = await this.db.user.findUnique({
      where: { id: appointment.patientId },
      select: { firstName: true, lastName: true },
    });

    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Patient';
    const dateStr = new Date(appointment.appointmentDate).toLocaleDateString();
    const timeStr = appointment.startTime || '';

    return this.createAndDispatch({
      userId: appointment.doctorId,
      type: NotificationType.APPOINTMENT_REQUESTED,
      title: 'New Appointment Request',
      message: `${patientName} requested an appointment on ${dateStr} at ${timeStr}`,
      body: appointment.reasonForVisit || 'No reason provided',
      priority: NotificationPriority.NORMAL,
      actionUrl: `/appointments/${appointment.id}`,
      actionLabel: 'View Request',
      metadata: {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        patientName,
        date: appointment.appointmentDate,
        time: appointment.startTime,
        reasonForVisit: appointment.reasonForVisit,
      },
      relatedEntityType: 'APPOINTMENT',
      relatedEntityId: appointment.id,
      channels: [NotificationChannel.IN_APP, NotificationChannel.PUSH],
    });
  }

  /**
   * Create appointment scheduled notification (patient)
   */
  async notifyAppointmentScheduled(appointment: any) {
    const doctor = await this.db.user.findUnique({
      where: { id: appointment.doctorId },
      select: { firstName: true, lastName: true },
    });

    const doctorName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Doctor';
    const dateStr = new Date(appointment.appointmentDate).toLocaleDateString();
    const timeStr = appointment.startTime || '';

    return this.createAndDispatch({
      userId: appointment.patientId,
      type: NotificationType.APPOINTMENT_SCHEDULED,
      title: 'Appointment Scheduled',
      message: `Your appointment with ${doctorName} is scheduled for ${dateStr} at ${timeStr}`,
      body: `Appointment confirmed. Please arrive 10 minutes early.`,
      priority: NotificationPriority.NORMAL,
      actionUrl: `/appointments/${appointment.id}`,
      actionLabel: 'View Appointment',
      metadata: {
        appointmentId: appointment.id,
        doctorId: appointment.doctorId,
        doctorName,
        date: appointment.appointmentDate,
        time: appointment.startTime,
      },
      relatedEntityType: 'APPOINTMENT',
      relatedEntityId: appointment.id,
      channels: [NotificationChannel.IN_APP, NotificationChannel.PUSH, NotificationChannel.EMAIL],
    });
  }
}

