import mongoose from 'mongoose';
import { USER_ROLES, USER_STATUS } from '../utils/constants.js';

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      default: 'User',
    },
    lastName: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    preferredCity: {
      type: String,
      default: null,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    otp: {
      code: String,
      expiresAt: Date,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
    lastLogin: Date,

    // User Activity
    propertiesInterested: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
    groupsJoined: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
      },
    ],
    shortlistedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
    paymentsMade: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
      },
    ],

    // Preferences
    notificationPreferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      smsNotifications: {
        type: Boolean,
        default: true,
      },
      pushNotifications: {
        type: Boolean,
        default: false,
      },
    },

    // Address
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },

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



// Method to get full name
UserSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

// Hide sensitive data
UserSchema.methods.toJSON = function () {
  const { password, otp, ...rest } = this.toObject();
  return rest;
};

export default mongoose.model('User', UserSchema);
