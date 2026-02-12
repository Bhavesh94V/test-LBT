import express from 'express';
import {
  getPayments,
  getPayment,
  createPayment,
  sendPaymentLink,
  verifyPayment,
  processRefund,
  getUserPayments,
  paymentWebhook,
} from '../controllers/paymentController.js';
import { authenticateUser, authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Webhook (public, no auth)
router.post('/webhook', paymentWebhook);

// Admin routes
router.get('/', authenticateAdmin, getPayments);
router.get('/:id', authenticateAdmin, getPayment);
router.post('/', authenticateAdmin, createPayment);
router.post('/:id/send-link', authenticateAdmin, sendPaymentLink);
router.post('/:id/verify', authenticateAdmin, verifyPayment);
router.post('/:id/refund', authenticateAdmin, processRefund);

// User routes
router.get('/user/:userId', authenticateUser, getUserPayments);

export default router;
