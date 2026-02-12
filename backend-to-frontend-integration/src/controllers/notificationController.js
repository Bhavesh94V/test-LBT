import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Group from '../models/Group.js';
import emailService from '../services/emailService.js';
import smsService from '../services/smsService.js';
import { AppError } from '../utils/errorHandler.js';
import { getPaginationParams } from '../utils/helpers.js';

// Get user notifications
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10, read } = req.query;
    const { skip, limit: limitNum } = getPaginationParams(page, limit);

    const filter = { userId };
    if (read !== undefined) {
      filter.read = read === 'true';
    }

    const notifications = await Notification.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      userId,
      read: false,
    });

    const total = await Notification.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      {
        read: true,
        readAt: new Date(),
      },
      { new: true }
    );

    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Marked as read',
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

// Delete notification
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    next(error);
  }
};

// Send notification (Admin only)
export const sendNotification = async (req, res, next) => {
  try {
    const { targetUsers, userIds, message, title, type } = req.body;
    // targetUsers: 'all' | 'specific' | 'group'

    let recipientUserIds = [];

    if (targetUsers === 'all') {
      const users = await User.find({ status: 'active' }).select('_id');
      recipientUserIds = users.map((u) => u._id);
    } else if (targetUsers === 'specific') {
      recipientUserIds = userIds || [];
    } else if (targetUsers === 'group') {
      const group = await Group.findById(userIds[0]);
      if (group) {
        recipientUserIds = group.members.map((m) => m.userId);
      }
    }

    const notifications = [];

    for (const recipientUserId of recipientUserIds) {
      const notification = new Notification({
        userId: recipientUserId,
        title,
        message,
        type,
      });

      await notification.save();
      notifications.push(notification);

      // Send via email/SMS if enabled
      const user = await User.findById(recipientUserId);
      if (user) {
        if (user.notificationPreferences.emailNotifications) {
          await emailService.sendEmail(
            user.email,
            title,
            `<p>${message}</p>`
          );
        }

        if (user.notificationPreferences.smsNotifications && message.length <= 160) {
          await smsService.sendMessage(user.phone, message);
        }
      }

      // Emit Socket.IO event
      global.io?.to(`user-${recipientUserId}`).emit('notification-received', notification);
    }

    res.status(201).json({
      success: true,
      message: 'Notifications sent successfully',
      data: { notificationCount: notifications.length },
    });
  } catch (error) {
    next(error);
  }
};

// Create notification (Internal use)
export const createNotification = async (userId, title, message, type, actionLink, actionLabel) => {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      actionLink,
      actionLabel,
    });

    await notification.save();

    // Emit Socket.IO event
    global.io?.to(`user-${userId}`).emit('notification-received', notification);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
