import {
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Request,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { QueryNotificationsDto } from '../dto/notification.dto';
import { NotificationService } from '../services/notification.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Get all notifications for the authenticated user
   */
  @Get()
  async getNotifications(@Request() req, @Query() query: QueryNotificationsDto) {
    const userId = req.user.userId || req.user.id;
    const filters = {
      type: query.type,
      unreadOnly: query.unreadOnly || false,
      includeArchived: query.includeArchived || false,
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 20,
    };

    const result = await this.notificationService.getUserNotifications(userId, filters);
    return {
      success: true,
      data: result,
    };
  }

  /**
   * Get unread notification count
   */
  @Get('unread/count')
  async getUnreadCount(@Request() req) {
    const userId = req.user.userId || req.user.id;
    const count = await this.notificationService.getUnreadCount(userId);
    return { success: true, count };
  }

  /**
   * Mark notification as read
   */
  @Patch(':id/read')
  async markAsRead(@Request() req, @Param('id') notificationId: string) {
    const userId = req.user.userId || req.user.id;
    await this.notificationService.markAsRead(notificationId, userId);
    return { success: true, message: 'Notification marked as read' };
  }

  /**
   * Mark all notifications as read
   */
  @Post('read-all')
  async markAllAsRead(@Request() req) {
    const userId = req.user.userId || req.user.id;
    await this.notificationService.markAllAsRead(userId);
    return { success: true, message: 'All notifications marked as read' };
  }

  /**
   * Archive notification
   */
  @Patch(':id/archive')
  async archiveNotification(@Request() req, @Param('id') notificationId: string) {
    const userId = req.user.userId || req.user.id;
    await this.notificationService.archiveNotification(notificationId, userId);
    return { success: true, message: 'Notification archived' };
  }

  /**
   * Delete notification
   */
  @Delete(':id')
  async deleteNotification(@Request() req, @Param('id') notificationId: string) {
    const userId = req.user.userId || req.user.id;
    await this.notificationService.deleteNotification(notificationId, userId);
    return { success: true, message: 'Notification deleted' };
  }
}

