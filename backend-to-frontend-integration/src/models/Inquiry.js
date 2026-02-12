import mongoose from 'mongoose';
import { INQUIRY_STATUS, CONTACT_TYPE } from '../utils/constants.js';

const InquirySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      default: null,
    },
    subject: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      default: null,
    },
    inquiryType: {
      type: String,
      enum: ['contact', 'property_interest', 'general'],
      default: 'general',
    },

    // Inquiry Details
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      required: true,
    },

    // Interest Details
    configurationInterested: String,
    budgetRange: {
      min: Number,
      max: Number,
    },
    timeline: {
      type: String,
    },
    comments: String,

    // Status
    status: {
      type: String,
      enum: Object.values(INQUIRY_STATUS),
      default: INQUIRY_STATUS.NEW,
    },

    // Tracking
    receivedDate: {
      type: Date,
      default: Date.now,
    },
    contactedDate: Date,
    conversionDate: Date,

    // Admin Notes
    adminNotes: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },

    // Contact History
    contactHistory: [
      {
        type: {
          type: String,
          enum: Object.values(CONTACT_TYPE),
        },
        date: {
          type: Date,
          default: Date.now,
        },
        notes: String,
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
InquirySchema.index({ propertyId: 1, status: 1 });
InquirySchema.index({ email: 1 });
InquirySchema.index({ phone: 1 });

export default mongoose.model('Inquiry', InquirySchema);
