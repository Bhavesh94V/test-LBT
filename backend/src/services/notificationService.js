import Notification from '../models/Notification.js';
import User from '../models/User.js';
import emailService from './emailService.js';
import smsService from './smsService.js';
import redis from '../config/redis.js';

class NotificationService {
  // Create notification
  async createNotification(data) {
    try {
      const notification = new Notification({
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || 'general',
        relatedId: data.relatedId,
        relatedModel: data.relatedModel,
        actionUrl: data.actionUrl,
        priority: data.priority || 'normal',
        channels: data.channels || ['in-app']
      });

      await notification.save();

      // Cache in Redis
      const cacheKey = `notifications:${data.userId}`;
      await redis.lpush(cacheKey, JSON.stringify(notification));
      await redis.ltrim(cacheKey, 0, 99); // Keep last 100

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Get user notifications
  async getUserNotifications(userId, limit = 20, skip = 0) {
    try {
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await Notification.countDocuments({ userId });

      return { notifications, total };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      return await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true, readAt: new Date() },
        { new: true }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all as read
  async markAllAsRead(userId) {
    try {
      return await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      return await Notification.findByIdAndDelete(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Send multi-channel notification
  async sendMultiChannelNotification(userId, data) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      const channels = data.channels || ['in-app'];
      const results = {};

      // Create in-app notification
      if (channels.includes('in-app')) {
        results.inApp = await this.createNotification({
          userId,
          ...data
        });
      }

      // Send email
      if (channels.includes('email') && user.email) {
        results.email = await emailService.sendNotification(
          user.email,
          data.title,
          data.message
        );
      }

      // Send SMS
      if (channels.includes('sms') && user.phone) {
        results.sms = await smsService.sendNotification(
          user.phone,
          data.message
        );
      }

      return results;
    } catch (error) {
      console.error('Error sending multi-channel notification:', error);
      throw error;
    }
  }

  // Batch create notifications
  async createBatchNotifications(data) {
    try {
      const notifications = await Notification.insertMany(data);
      return notifications;
    } catch (error) {
      console.error('Error creating batch notifications:', error);
      throw error;
    }
  }

  // Get unread count
  async getUnreadCount(userId) {
    try {
      return await Notification.countDocuments({ userId, isRead: false });
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Delete old notifications
  async deleteOldNotifications(daysOld = 30) {
    try {
      const date = new Date();
      date.setDate(date.getDate() - daysOld);

      return await Notification.deleteMany({ createdAt: { $lt: date } });
    } catch (error) {
      console.error('Error deleting old notifications:', error);
      throw error;
    }
  }
}

export default new NotificationService();
