import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT Token (supports both user and admin)
export const generateToken = (id, expiresIn = '15m', isAdmin = false) => {
  const payload = isAdmin ? { adminId: id } : { userId: id };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

// Generate Refresh Token (supports both user and admin)
export const generateRefreshToken = (id, isAdmin = false) => {
  const payload = isAdmin ? { adminId: id } : { userId: id };
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY,
  });
};

// Verify Token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

// Generate Random String
export const generateRandomString = (length = 10) => {
  return crypto.randomBytes(length).toString('hex');
};

// Format response
export const formatResponse = (success, message, data = null) => {
  const response = {
    success,
    message,
  };
  if (data) {
    response.data = data;
  }
  return response;
};

// Calculate pagination
export const getPaginationParams = (page = 1, limit = 10) => {
  const pageNum = parseInt(page) > 0 ? parseInt(page) : 1;
  const limitNum = parseInt(limit) > 0 ? parseInt(limit) : 10;
  const skip = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, skip };
};

// OTP expiry time (5 minutes)
export const OTP_EXPIRY_TIME = 5 * 60 * 1000;

// Token expiry times
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Success Response Helper
export const successResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
  };
};

// Error Response Helper
export const errorResponse = (message = 'Error', error = null) => {
  return {
    success: false,
    message,
    error: error || null,
  };
};
