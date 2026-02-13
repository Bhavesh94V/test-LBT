import mongoose from 'mongoose';
import { GROUP_STATUS } from '../utils/constants.js';

const GroupSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    configuration: {
      type: String,
      required: true, // e.g., "2BHK", "3BHK"
    },

    // Members
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        joinedDate: {
          type: Date,
          default: Date.now,
        },
        position: Number, // order in group
        paymentStatus: {
          type: String,
          enum: ['pending', 'completed', 'refunded'],
          default: 'pending',
        },
        paymentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Payment',
        },
      },
    ],

    // Slots
    totalSlots: {
      type: Number,
      required: true,
    },
    slotsFilled: {
      type: Number,
      default: 0,
    },

    // Status
    status: {
      type: String,
      enum: Object.values(GROUP_STATUS),
      default: GROUP_STATUS.OPEN,
    },

    // WhatsApp
    whatsappGroupLink: String,
    whatsappGroupName: String,

    // Timeline
    createdDate: {
      type: Date,
      default: Date.now,
    },
    joinDeadline: Date,
    expectedClosureDate: Date,

    // Statistics
    memberCount: {
      type: Number,
      default: 0,
    },
    averageSavingsPerMember: Number,

    // Admin
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    notes: String,

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
GroupSchema.index({ propertyId: 1, status: 1 });
GroupSchema.index({ 'members.userId': 1 });

export default mongoose.model('Group', GroupSchema);
