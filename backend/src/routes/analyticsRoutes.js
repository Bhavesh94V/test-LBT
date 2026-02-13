import express from 'express';
import {
  getDashboardAnalytics,
  getRevenueAnalytics,
  getPropertyAnalytics,
  getInquiryAnalytics,
  getUserAnalytics,
  getGroupAnalytics,
} from '../controllers/analyticsController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// All analytics routes require admin auth
router.use(authenticateAdmin);

router.get('/dashboard', getDashboardAnalytics);
router.get('/revenue', getRevenueAnalytics);
router.get('/properties', getPropertyAnalytics);
router.get('/inquiries', getInquiryAnalytics);
router.get('/users', getUserAnalytics);
router.get('/groups', getGroupAnalytics);

export default router;
