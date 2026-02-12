import express from 'express';
import {
  register,
  sendOTP,
  verifyOTP,
  completeSignup,
  loginWithOTP,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
} from '../controllers/authController.js';
import {
  validateOTPVerification,
  handleValidationErrors,
} from '../utils/validators.js';
import { authenticateUser, refreshTokenMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Register user - phone, email, fullName, preferredCity
router.post('/register', (req, res, next) => {
  try {
    register(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Send OTP for login
router.post('/send-otp', (req, res, next) => {
  try {
    sendOTP(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Verify OTP and login
router.post('/verify-otp', validateOTPVerification, handleValidationErrors, (req, res, next) => {
  try {
    verifyOTP(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Login with OTP (same as verify-otp)
router.post('/login', validateOTPVerification, handleValidationErrors, (req, res, next) => {
  try {
    loginWithOTP(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Complete Signup (after OTP verification)
router.post('/complete-signup', authenticateUser, (req, res, next) => {
  try {
    completeSignup(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Refresh Token
router.post('/refresh-token', refreshTokenMiddleware, (req, res, next) => {
  try {
    refreshToken(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Forgot Password - Send OTP for account recovery
router.post('/forgot-password', (req, res, next) => {
  try {
    forgotPassword(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Reset Password - Verify OTP and allow re-login
router.post('/reset-password', validateOTPVerification, handleValidationErrors, (req, res, next) => {
  try {
    resetPassword(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', authenticateUser, (req, res, next) => {
  try {
    logout(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;
