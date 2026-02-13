import { AppError } from '../utils/errorHandler.js';

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Handler]', {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
      path: req.path,
    });
  }

  // Wrong MongoDB ID error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new AppError(message, 400);
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'JSON Web Token is invalid, try again';
    err = new AppError(message, 401);
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    const message = 'JSON Web Token is expired, try again';
    err = new AppError(message, 401);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    err = new AppError(message, 400);
  }

  // Duplicate Key error
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    err = new AppError(message, 409);
  }

  // Multer file upload error
  if (err.name === 'MulterError') {
    let message = 'File upload error';
    if (err.code === 'FILE_TOO_LARGE') message = 'File size exceeds maximum limit';
    if (err.code === 'LIMIT_FILE_COUNT') message = 'Too many files uploaded';
    err = new AppError(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
