import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    // General
    platformName: {
      type: String,
      default: "Let's Buy",
    },
    logo: String,
    favicon: String,
    supportEmail: String,
    supportPhone: String,

    // Business
    businessName: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,

    // Features
    paymentMethods: [String], // bank-transfer, razorpay, upi
    emailTemplatesEnabled: {
      type: Boolean,
      default: true,
    },
    smsNotificationsEnabled: {
      type: Boolean,
      default: true,
    },

    // Integrations
    googleAnalyticsEnabled: {
      type: Boolean,
      default: false,
    },
    twilioEnabled: {
      type: Boolean,
      default: true,
    },
    cloudinaryEnabled: {
      type: Boolean,
      default: true,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', SettingsSchema);
