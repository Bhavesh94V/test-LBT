import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import {
  getSettings,
  updateSettings,
  getSystemStats,
  getEmailTemplates,
  testEmailConfiguration,
  testSmsConfiguration,
  getMaintenanceStatus,
  setMaintenanceMode
} from '../controllers/settingsController.js';

const router = express.Router();

// Public routes
router.get('/', getSettings);
router.get('/maintenance-status', getMaintenanceStatus);

// Protected routes - Admin only
router.put('/', authenticateAdmin, updateSettings);
router.get('/system-stats', authenticateAdmin, getSystemStats);
router.get('/email-templates', authenticateAdmin, getEmailTemplates);
router.post('/test-email', authenticateAdmin, testEmailConfiguration);
router.post('/test-sms', authenticateAdmin, testSmsConfiguration);
router.post('/maintenance-mode', authenticateAdmin, setMaintenanceMode);

export default router;
