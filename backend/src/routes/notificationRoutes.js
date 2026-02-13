import express from 'express';
import {
  getNotifications,
  markAsRead,
  deleteNotification,
  sendNotification,
} from '../controllers/notificationController.js';
import { authenticateUser, authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.get('/', authenticateUser, getNotifications);
router.put('/:id/read', authenticateUser, markAsRead);
router.delete('/:id', authenticateUser, deleteNotification);

// Admin routes
router.post('/', authenticateAdmin, sendNotification);

export default router;
