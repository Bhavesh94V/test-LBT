import express from 'express';
import authRoutes from './authRoutes.js';
import propertyRoutes from './propertyRoutes.js';
import groupRoutes from './groupRoutes.js';
import userRoutes from './userRoutes.js';
import inquiryRoutes from './inquiryRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import adminRoutes from './adminRoutes.js';
import settingsRoutes from './settingsRoutes.js';

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/groups', groupRoutes);
router.use('/users', userRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/payments', paymentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);
router.use('/admins', adminRoutes);
router.use('/settings', settingsRoutes);

export default router;
