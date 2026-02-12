import mongoose from 'mongoose';
import { NOTIFICATION_TYPE, DELIVERY_CHANNEL } from '../utils/constants.js';

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Content
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPE),
      default: NOTIFICATION_TYPE.SYSTEM,
    },

    // Links
    actionLink: String,
    actionLabel: String,

    // Status
    read: {
      type: Boolean,
      default: false,
    },
    readAt: Date,

    // Delivery
    deliveredVia: [
      {
        type: String,
        enum: Object.values(DELIVERY_CHANNEL),
      },
    ],
    deliveryStatus: {
      email: String,
      sms: String,
      push: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  },
  { timestamps: true }
);

// TTL index for auto-deletion
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster queries
NotificationSchema.index({ userId: 1, read: 1 });

export default mongoose.model('Notification', NotificationSchema);
