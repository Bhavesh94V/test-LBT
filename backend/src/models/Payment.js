import mongoose from 'mongoose';
import {
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  VERIFICATION_STATUS,
} from '../utils/constants.js';

const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
    inquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inquiry',
    },

    // Payment Details
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
    },

    // Payment Links
    paymentLink: String,
    externalPaymentId: String,

    // Status
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },

    // Verification
    verificationStatus: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.PENDING,
    },
    verificationNotes: String,
    verificationDate: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },

    // Receipt
    receiptUrl: String,
    receiptUploadedAt: Date,

    // Timeline
    requestedDate: {
      type: Date,
      default: Date.now,
    },
    linkSentDate: Date,
    completedDate: Date,
    refundDate: Date,

    // Refund
    refundAmount: Number,
    refundReason: String,
    refundStatus: {
      type: String,
      enum: ['pending', 'completed'],
    },

    // Notifications Sent
    emailNotifications: [
      {
        type: {
          type: String,
          enum: ['payment-link-sent', 'reminder', 'status-update'],
        },
        sentDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    smsNotifications: [
      {
        type: {
          type: String,
          enum: ['payment-link-sent', 'reminder', 'status-update'],
        },
        sentDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
PaymentSchema.index({ userId: 1, status: 1 });
PaymentSchema.index({ propertyId: 1 });
PaymentSchema.index({ groupId: 1 });

export default mongoose.model('Payment', PaymentSchema);
