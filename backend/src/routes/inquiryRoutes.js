import express from 'express';
import {
  createInquiry,
  getInquiries,
  getInquiry,
  updateInquiryStatus,
  sendReplyToInquiry,
  deleteInquiry,
} from '../controllers/inquiryController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validateInquiry, handleValidationErrors } from '../utils/validators.js';

const router = express.Router();

// Public route
router.post('/', validateInquiry, handleValidationErrors, createInquiry);

// Admin routes
router.get('/', authenticateAdmin, getInquiries);
router.get('/:id', authenticateAdmin, getInquiry);
router.put('/:id', authenticateAdmin, updateInquiryStatus);
router.post('/:id/reply', authenticateAdmin, sendReplyToInquiry);
router.delete('/:id', authenticateAdmin, deleteInquiry);

export default router;
