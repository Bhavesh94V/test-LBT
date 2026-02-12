import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errorHandler.js';

export const authenticateUser = (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401));
    }
    next(new AppError('Invalid token', 401));
  }
};

export const authenticateAdmin = (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Support both adminId and userId in token payload
    if (decoded.adminId) {
      req.adminId = decoded.adminId;
    } else if (decoded.userId) {
      // Also accept userId for backward compatibility, but reject unless admin role
      req.userId = decoded.userId;
      req.adminId = null; // Will be validated in roleBasedAccess middleware
    }
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401));
    }
    next(new AppError('Invalid token', 401));
  }
};

export const refreshTokenMiddleware = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token not provided', 400));
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(new AppError('Invalid refresh token', 401));
  }
};

// Alias for authenticateUser
export const authenticate = authenticateUser;

// Authorization middleware - checks user role
export const authorize = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (!req.userId && !req.adminId) {
        return next(new AppError('Unauthorized', 401));
      }

      // Admin check
      if (requiredRole === 'admin' && !req.adminId) {
        return next(new AppError('Admin access required', 403));
      }

      next();
    } catch (error) {
      next(new AppError('Authorization error', 403));
    }
  };
};
