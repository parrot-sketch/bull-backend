"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../auth/services/database.service");
const notification_dto_1 = require("../dto/notification.dto");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(db) {
        this.db = db;
        this.logger = new common_1.Logger(NotificationService_1.name);
    }
    async createAndDispatch(dto) {
        try {
            const channels = dto.channels || [notification_dto_1.NotificationChannel.IN_APP];
            const notification = await this.db.notification.create({
                data: {
                    userId: dto.userId,
                    type: dto.type,
                    title: dto.title,
                    message: dto.message,
                    body: dto.body,
                    priority: dto.priority || notification_dto_1.NotificationPriority.NORMAL,
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
            return notification;
        }
        catch (error) {
            this.logger.error(`Error creating notification: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getUserNotifications(userId, filters) {
        const where = { userId };
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
    async getUnreadCount(userId) {
        return this.db.notification.count({
            where: {
                userId,
                isRead: false,
                isArchived: false,
            },
        });
    }
    async markAsRead(notificationId, userId) {
        return this.db.notification.updateMany({
            where: {
                id: notificationId,
                userId,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    async markAllAsRead(userId) {
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
    async archiveNotification(notificationId, userId) {
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
    async deleteNotification(notificationId, userId) {
        return this.db.notification.deleteMany({
            where: {
                id: notificationId,
                userId,
            },
        });
    }
    async notifyAppointmentRequested(appointment) {
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
            type: notification_dto_1.NotificationType.APPOINTMENT_REQUESTED,
            title: 'New Appointment Request',
            message: `${patientName} requested an appointment on ${dateStr} at ${timeStr}`,
            body: appointment.reasonForVisit || 'No reason provided',
            priority: notification_dto_1.NotificationPriority.NORMAL,
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
            channels: [notification_dto_1.NotificationChannel.IN_APP, notification_dto_1.NotificationChannel.PUSH],
        });
    }
    async notifyAppointmentScheduled(appointment) {
        const doctor = await this.db.user.findUnique({
            where: { id: appointment.doctorId },
            select: { firstName: true, lastName: true },
        });
        const doctorName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Doctor';
        const dateStr = new Date(appointment.appointmentDate).toLocaleDateString();
        const timeStr = appointment.startTime || '';
        return this.createAndDispatch({
            userId: appointment.patientId,
            type: notification_dto_1.NotificationType.APPOINTMENT_SCHEDULED,
            title: 'Appointment Scheduled',
            message: `Your appointment with ${doctorName} is scheduled for ${dateStr} at ${timeStr}`,
            body: `Appointment confirmed. Please arrive 10 minutes early.`,
            priority: notification_dto_1.NotificationPriority.NORMAL,
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
            channels: [notification_dto_1.NotificationChannel.IN_APP, notification_dto_1.NotificationChannel.PUSH, notification_dto_1.NotificationChannel.EMAIL],
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map