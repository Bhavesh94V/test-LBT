import mongoose from 'mongoose';
import { PROPERTY_STATUS } from '../utils/constants.js';

const PropertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Property name is required'],
      trim: true,
    },
    developer: {
      type: String,
      required: [true, 'Developer name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    address: String,
    description: String,

    // Configurations (Array)
    configurations: [
      {
        name: String, // e.g., "2BHK", "3BHK"
        area: Number, // sq ft
        price: Number,
        layoutImage: String, // Cloudinary URL
      },
    ],

    // Gallery
    gallery: [
      {
        url: String, // Cloudinary URL
        caption: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Amenities
    amenities: [String], // Array of amenity names

    // Pricing
    priceRange: {
      min: Number,
      max: Number,
    },
    estimatedSavings: {
      min: Number,
      max: Number,
    },

    // Status
    status: {
      type: String,
      enum: Object.values(PROPERTY_STATUS),
      default: PROPERTY_STATUS.NEWLY_LAUNCHED,
    },

    // Timeline
    joinBefore: Date,
    launchDate: Date,
    completionDate: Date,

    // Statistics
    buyersInterested: {
      type: Number,
      default: 0,
    },
    totalPositions: Number,

    // Groups
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
      },
    ],
    groupCount: {
      type: Number,
      default: 0,
    },

    // Meta
    totalSlots: Number,
    slotsAvailable: Number,

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
PropertySchema.index({ city: 1, status: 1 });
PropertySchema.index({ developer: 1 });
PropertySchema.index({ name: 'text', developer: 'text', city: 'text' });

export default mongoose.model('Property', PropertySchema);
