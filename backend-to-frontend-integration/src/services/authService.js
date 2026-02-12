import User from '../models/User.js';
import Admin from '../models/Admin.js';
import {
  generateOTP,
  generateToken,
  generateRefreshToken,
  OTP_EXPIRY_TIME,
} from '../utils/helpers.js';
import { AppError } from '../utils/errorHandler.js';
import smsService from './smsService.js';

class AuthService {
  // Register user with phone, email, fullName, and preferredCity
  async register(phone, email, fullName, preferredCity) {
    try {
      if (!phone) {
        throw new AppError('Phone number is required', 400);
      }

      if (!fullName) {
        throw new AppError('Full name is required', 400);
      }

      // Check if user already exists with same phone
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        throw new AppError('User with this phone number already exists. Please login instead.', 409);
      }

      // Check if email already exists (if provided)
      if (email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          throw new AppError('User with this email already exists. Please use a different email.', 409);
        }
      }

      // Parse fullName into firstName and lastName
      const nameParts = fullName ? fullName.trim().split(' ') : ['User'];
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create new user
      const userData = {
        firstName,
        lastName,
        phone,
        email: email || null,
        preferredCity: preferredCity || null,
        phoneVerified: false,
        emailVerified: false,
      };

      const user = new User(userData);
      await user.save();

      return {
        success: true,
        message: 'User registered successfully. Please verify with OTP.',
        user: {
          userId: user._id,
          name: fullName || firstName,
          email: user.email,
          phone: user.phone,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Send OTP to phone - ONLY for existing users (login flow)
  async sendOTP(phone) {
    try {
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_TIME);

      // Find existing user - do NOT upsert
      const user = await User.findOne({ phone });

      if (!user) {
        // Return isNewUser flag so frontend can redirect to register
        return {
          success: true,
          message: 'User not found. Please register first.',
          isNewUser: true,
        };
      }

      // Update the existing user's OTP
      user.otp = { code: otp, expiresAt };
      user.otpVerified = false;
      await user.save();

      // Send OTP via SMS
      await smsService.sendOTP(phone, otp);

      return {
        success: true,
        message: 'OTP sent successfully',
        isNewUser: false,
      };
    } catch (error) {
      throw error;
    }
  }

  // Verify OTP
  async verifyOTP(phone, otp) {
    try {
      const user = await User.findOne({ phone });

      if (!user) {
        throw new AppError('User not found. Please register first.', 404);
      }

      // Check if OTP is valid
      if (!user.otp || !user.otp.code) {
        throw new AppError('No OTP was sent. Please request a new OTP.', 400);
      }

      if (user.otp.code !== otp) {
        throw new AppError('Invalid OTP. Please try again.', 400);
      }

      // Check if OTP is expired
      if (new Date() > user.otp.expiresAt) {
        throw new AppError('OTP has expired. Please request a new one.', 400);
      }

      // Mark OTP as verified
      user.otpVerified = true;
      user.phoneVerified = true;
      user.otp = { code: null, expiresAt: null };
      await user.save();

      // Check if user has completed their profile
      const isNewUser = !user.firstName || user.firstName === 'User';

      return {
        success: true,
        message: 'OTP verified successfully',
        user,
        isNewUser,
      };
    } catch (error) {
      throw error;
    }
  }

  // Complete signup (add profile details after OTP verification)
  async completeSignup(userId, data) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          emailVerified: true,
          address: data.address || {},
        },
        { new: true }
      );

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const token = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      return {
        success: true,
        message: 'User profile completed successfully',
        user,
        token,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  // Refresh token
  async refreshAccessToken(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const token = generateToken(user._id);

      return {
        success: true,
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  // Forgot password - send OTP (same as sendOTP but requires existing user)
  async forgotPassword(phone) {
    try {
      const user = await User.findOne({ phone });

      if (!user) {
        throw new AppError('No account found with this phone number.', 404);
      }

      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_TIME);

      user.otp = { code: otp, expiresAt };
      await user.save();

      // Send OTP via SMS
      await smsService.sendOTP(user.phone, otp);

      return {
        success: true,
        message: 'OTP sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
