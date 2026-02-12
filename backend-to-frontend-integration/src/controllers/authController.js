import User from '../models/User.js';
import authService from '../services/authService.js';
import emailService from '../services/emailService.js';
import { generateToken, generateRefreshToken } from '../utils/helpers.js';
import { AppError } from '../utils/errorHandler.js';

// Register user with phone, email, fullName, and preferredCity
export const register = async (req, res, next) => {
  try {
    const { phone, email, fullName, preferredCity } = req.body;

    // Validation
    if (!phone) {
      return next(new AppError('Phone number is required', 400));
    }

    if (!fullName) {
      return next(new AppError('Full name is required', 400));
    }

    const result = await authService.register(phone, email || null, fullName, preferredCity || null);

    res.status(201).json({
      success: true,
      message: result.message,
      data: {
        userId: result.user.userId,
        name: result.user.name,
        email: result.user.email,
        phone: result.user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Send OTP
export const sendOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return next(new AppError('Phone number is required', 400));
    }

    const result = await authService.sendOTP(phone);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        isNewUser: result.isNewUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return next(new AppError('Phone and OTP are required', 400));
    }

    const result = await authService.verifyOTP(phone, otp);

    // Generate tokens
    const token = generateToken(result.user._id);
    const refreshToken = generateRefreshToken(result.user._id);

    // Update last login
    result.user.lastLogin = new Date();
    await result.user.save();

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
        isNewUser: result.isNewUser,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Complete Signup
export const completeSignup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, address } = req.body;
    const userId = req.userId;

    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }

    const result = await authService.completeSignup(userId, {
      firstName,
      lastName,
      email,
      address,
    });

    // Send welcome email
    await emailService.sendWelcomeEmail(
      email,
      `${firstName} ${lastName}`
    );

    res.status(201).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login with OTP
export const loginWithOTP = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return next(new AppError('Phone and OTP are required', 400));
    }

    // Verify OTP
    const result = await authService.verifyOTP(phone, otp);

    const token = generateToken(result.user._id);
    const refreshToken = generateRefreshToken(result.user._id);

    // Update last login
    result.user.lastLogin = new Date();
    await result.user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};



// Refresh Token
export const refreshToken = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }

    const result = await authService.refreshAccessToken(userId);

    res.status(200).json({
      success: true,
      data: {
        token: result.token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Forgot Password - Send OTP
export const forgotPassword = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return next(new AppError('Phone number is required', 400));
    }

    const result = await authService.forgotPassword(phone);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

// Reset Password - Just verify OTP and allow re-login (no password needed)
export const resetPassword = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return next(new AppError('Phone and OTP are required', 400));
    }

    const result = await authService.verifyOTP(phone, otp);

    const token = generateToken(result.user._id);
    const refreshToken = generateRefreshToken(result.user._id);

    // Update last login
    result.user.lastLogin = new Date();
    await result.user.save();

    res.status(200).json({
      success: true,
      message: 'Account verified successfully. You can now login.',
      data: {
        user: result.user,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
