import { body, validationResult, param, query } from 'express-validator';

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Indian phone number format
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 number
  return password.length >= 8;
};

export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

// Express validator middleware
export const validateSignup = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Valid 10-digit phone number is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

export const validateLogin = [
  body('emailOrPhone')
    .trim()
    .notEmpty()
    .withMessage('Email or phone is required'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
];

export const validateOTPVerification = [
  body('phone')
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Valid 10-digit phone number is required'),
  body('otp')
    .trim()
    .matches(/^\d{6}$/)
    .withMessage('OTP must be 6 digits'),
];

export const validateInquiry = [
  body('propertyId')
    .optional()
    .isMongoId()
    .withMessage('Valid property ID is required'),
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),
  body('email')
    .optional({ values: 'falsy' })
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
  body('phone')
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Valid phone is required'),
  body('configurationInterested')
    .optional()
    .trim(),
  body('timeline')
    .optional()
    .trim(),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
