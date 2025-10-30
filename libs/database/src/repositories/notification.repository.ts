import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class NotificationRepository {
  constructor(private prisma: PrismaService) {}

  get notification() { return this.prisma.notification; }

  async createNotification(userId: string, type: string, title: string, body: string) {
    return this.notification.create({
      data: {
        userId,
        type: type as any,
        title,
        body,
        isRead: false
      }
    } as any);
  }

  async markAsRead(id: string) {
    return this.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  async findUnreadByUserId(userId: string) {
    return this.notification.findMany({
      where: {
        userId,
        isRead: false
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}