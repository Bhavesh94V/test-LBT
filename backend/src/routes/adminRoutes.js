import express from 'express';
import {
  adminLogin,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  resetAdminPassword,
  changeAdminPassword,
  suspendUser,
  unsuspendUser,
} from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Login (public) - Uses SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD from env
router.post('/login', adminLogin);

// Admin routes (require authentication)
router.get('/', authenticateAdmin, getAdmins);
router.post('/', authenticateAdmin, createAdmin);
router.put('/:id', authenticateAdmin, updateAdmin);
router.delete('/:id', authenticateAdmin, deleteAdmin);
router.post('/:id/reset-password', authenticateAdmin, resetAdminPassword);

// Own password change
router.put('/:id/change-password', authenticateAdmin, changeAdminPassword);

// User management (require authentication)
router.post('/users/:userId/suspend', authenticateAdmin, suspendUser);
router.post('/users/:userId/unsuspend', authenticateAdmin, unsuspendUser);

export default router;
