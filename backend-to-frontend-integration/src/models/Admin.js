import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { USER_ROLES } from '../utils/constants.js';

const AdminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

    // Role
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'manager'],
      default: USER_ROLES.ADMIN,
    },

    // Permissions (based on role)
    permissions: [String],

    // Status
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },

    // Activity
    lastLogin: Date,
    loginHistory: [
      {
        loginTime: Date,
        ipAddress: String,
        userAgent: String,
      },
    ],

    // Contact
    department: String,

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

// Hash password before saving
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Index for faster queries
AdminSchema.index({ email: 1 });
AdminSchema.index({ role: 1 });

export default mongoose.model('Admin', AdminSchema);
