import Admin from '../models/Admin.js';
import User from '../models/User.js';
import emailService from '../services/emailService.js';
import { AppError } from '../utils/errorHandler.js';
import { generateRandomString, getPaginationParams, generateToken, generateRefreshToken } from '../utils/helpers.js';
import { USER_ROLES } from '../utils/constants.js';

// Admin login with fixed credentials
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Fixed credentials - from environment or defaults
    const ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'admin@letsbuy.com';
    const ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'letsbuyadmin123';

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Find or create admin in database for tracking
    let admin = await Admin.findOne({ email: ADMIN_EMAIL });
    
    if (!admin) {
      // Create default admin if doesn't exist
      admin = new Admin({
        firstName: 'Admin',
        lastName: 'User',
        email: ADMIN_EMAIL,
        phone: '9999999999',
        password: ADMIN_PASSWORD,
        role: 'super_admin',
        status: 'active',
      });
      await admin.save();
    }

    // Update last login
    admin.lastLogin = new Date();
    admin.loginHistory = admin.loginHistory || [];
    admin.loginHistory.push({
      loginTime: new Date(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
    await admin.save();

    const token = generateToken(admin._id, '15m', true);
    const refreshToken = generateRefreshToken(admin._id, true);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        admin,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all admin users (Super admin only)
export const getAdmins = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, status } = req.query;
    const { skip, limit: limitNum } = getPaginationParams(page, limit);

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const admins = await Admin.find(filter)
      .skip(skip)
      .limit(limitNum)
      .select('-password');

    const total = await Admin.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        admins,
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

// Create admin (Super admin only)
export const createAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, role, department } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return next(new AppError('Admin with this email already exists', 400));
    }

    const tempPassword = generateRandomString(12);

    const admin = new Admin({
      firstName,
      lastName,
      email,
      phone,
      password: tempPassword,
      role,
      department,
      status: 'active',
    });

    await admin.save();

    // Send email with temporary password
    await emailService.sendEmail(
      email,
      'Admin Account Created',
      `<p>Welcome ${firstName}!</p>
       <p>Your admin account has been created.</p>
       <p>Temporary Password: ${tempPassword}</p>
       <p>Please change your password after first login.</p>`
    );

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: { admin },
    });
  } catch (error) {
    next(error);
  }
};

// Update admin (Super admin only)
export const updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, role, status } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        phone,
        role,
        status,
      },
      { new: true }
    ).select('-password');

    if (!admin) {
      return next(new AppError('Admin not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      data: { admin },
    });
  } catch (error) {
    next(error);
  }
};

// Delete admin (Super admin only)
export const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return next(new AppError('Admin not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Reset admin password (Super admin only)
export const resetAdminPassword = async (req, res, next) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);

    if (!admin) {
      return next(new AppError('Admin not found', 404));
    }

    const tempPassword = generateRandomString(12);
    admin.password = tempPassword;
    await admin.save();

    // Send email with temporary password
    await emailService.sendEmail(
      admin.email,
      'Password Reset - Let\'s Buy Admin',
      `<p>Your password has been reset.</p>
       <p>Temporary Password: ${tempPassword}</p>
       <p>Please change your password after login.</p>`
    );

    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (error) {
    next(error);
  }
};

// Change own password (Admin)
export const changeAdminPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return next(new AppError('Passwords do not match', 400));
    }

    const admin = await Admin.findById(id).select('+password');

    if (!admin) {
      return next(new AppError('Admin not found', 404));
    }

    const isPasswordValid = await admin.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return next(new AppError('Current password is incorrect', 400));
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Suspend user (Admin)
export const suspendUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { status: 'suspended' },
      { new: true }
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Send email notification
    await emailService.sendEmail(
      user.email,
      'Account Suspended',
      `<p>Your account has been suspended.</p>
       <p>Reason: ${reason || 'N/A'}</p>
       <p>Please contact support for more information.</p>`
    );

    res.status(200).json({
      success: true,
      message: 'User suspended successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Unsuspend user (Admin)
export const unsuspendUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { status: 'active' },
      { new: true }
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Send email notification
    await emailService.sendEmail(
      user.email,
      'Account Restored',
      `<p>Your account has been restored and is now active.</p>`
    );

    res.status(200).json({
      success: true,
      message: 'User unsuspended successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
