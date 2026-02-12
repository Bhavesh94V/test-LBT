import Admin from '../models/Admin.js';
import User from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';
import { USER_ROLES } from '../utils/constants.js';

export const authorizeRole = (...roles) => {
  return async (req, res, next) => {
    try {
      let userRole;

      if (req.userId) {
        const user = await User.findById(req.userId);
        if (!user) {
          return next(new AppError('User not found', 404));
        }
        userRole = user.role;
      } else if (req.adminId) {
        const admin = await Admin.findById(req.adminId);
        if (!admin) {
          return next(new AppError('Admin not found', 404));
        }
        userRole = admin.role;
      } else {
        return next(new AppError('Unauthorized', 401));
      }

      if (!roles.includes(userRole)) {
        return next(
          new AppError(
            'You do not have permission to access this resource',
            403
          )
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireAdminOrSuperAdmin = async (req, res, next) => {
  try {
    if (!req.adminId) {
      return next(new AppError('Admin authentication required', 401));
    }

    const admin = await Admin.findById(req.adminId);
    if (
      !admin ||
      !['admin', 'super_admin'].includes(admin.role)
    ) {
      return next(new AppError('Admin access required', 403));
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireSuperAdmin = async (req, res, next) => {
  try {
    if (!req.adminId) {
      return next(new AppError('Admin authentication required', 401));
    }

    const admin = await Admin.findById(req.adminId);
    if (!admin || admin.role !== 'super_admin') {
      return next(new AppError('Super admin access required', 403));
    }

    next();
  } catch (error) {
    next(error);
  }
};
