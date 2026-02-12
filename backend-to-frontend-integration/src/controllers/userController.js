import User from '../models/User.js';
import Group from '../models/Group.js';
import Payment from '../models/Payment.js';
import cloudinaryService from '../services/cloudinaryService.js';
import { AppError } from '../utils/errorHandler.js';

// Get user profile
export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, email, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        email,
        phone,
        address,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Upload profile picture if provided
    if (req.file) {
      const uploadedImage = await cloudinaryService.uploadProfilePicture(
        req.file,
        userId
      );
      user.profilePicture = uploadedImage.secure_url;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Change password
export const changePassword = async (req, res, next) => {
  try {
    // Password management is no longer available in OTP-based authentication
    // Users must use /api/auth/forgot-password endpoint for account recovery
    res.status(400).json({
      success: false,
      message: 'Password-based authentication is no longer supported. Use OTP-based login instead. For account recovery, use /api/auth/forgot-password',
    });
  } catch (error) {
    next(error);
  }
};

// Get user dashboard data
export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .populate('groupsJoined')
      .populate('shortlistedProperties');

    const payments = await Payment.find({ userId }).sort({ createdAt: -1 });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        groups: user.groupsJoined,
        payments,
        shortlistedProperties: user.shortlistedProperties,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user's groups
export const getUserGroups = async (req, res, next) => {
  try {
    const userId = req.userId;

    const groups = await Group.find({
      'members.userId': userId,
    }).populate('propertyId');

    res.status(200).json({
      success: true,
      data: { groups },
    });
  } catch (error) {
    next(error);
  }
};

// Get user's payments
export const getUserPayments = async (req, res, next) => {
  try {
    const userId = req.userId;

    const payments = await Payment.find({ userId })
      .populate('propertyId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { payments },
    });
  } catch (error) {
    next(error);
  }
};

// Get shortlisted properties
export const getShortlistedProperties = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate(
      'shortlistedProperties'
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: { properties: user.shortlistedProperties },
    });
  } catch (error) {
    next(error);
  }
};

// Add property to shortlist
export const addToShortlist = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { propertyId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { shortlistedProperties: propertyId } },
      { new: true }
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Emit Socket.IO event
    global.io?.to(`user-${userId}`).emit('shortlist-updated', {
      propertyId,
      action: 'added',
    });

    res.status(200).json({
      success: true,
      message: 'Added to shortlist',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Remove property from shortlist
export const removeFromShortlist = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { propertyId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { shortlistedProperties: propertyId } },
      { new: true }
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Emit Socket.IO event
    global.io?.to(`user-${userId}`).emit('shortlist-updated', {
      propertyId,
      action: 'removed',
    });

    res.status(200).json({
      success: true,
      message: 'Removed from shortlist',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Delete user account
export const deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { emailNotifications, smsNotifications, pushNotifications } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        notificationPreferences: {
          emailNotifications,
          smsNotifications,
          pushNotifications,
        },
      },
      { new: true }
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
