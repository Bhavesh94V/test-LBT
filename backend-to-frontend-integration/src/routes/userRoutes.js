import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserDashboard,
  getUserGroups,
  getUserPayments,
  getShortlistedProperties,
  addToShortlist,
  removeFromShortlist,
  deleteUserAccount,
  updateNotificationPreferences,
} from '../controllers/userController.js';
import { authenticateUser } from '../middleware/auth.js';
import { singleImageUpload } from '../middleware/multer.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticateUser);

// Profile
router.get('/profile', getUserProfile);
router.put('/profile', singleImageUpload, updateUserProfile);
router.put('/change-password', changePassword);

// Dashboard
router.get('/dashboard', getUserDashboard);
router.get('/groups', getUserGroups);
router.get('/payments', getUserPayments);

// Shortlist
router.get('/shortlisted', getShortlistedProperties);
router.post('/shortlist/:propertyId', addToShortlist);
router.delete('/shortlist/:propertyId', removeFromShortlist);

// Account
router.put('/preferences/notifications', updateNotificationPreferences);
router.delete('/account', deleteUserAccount);

export default router;
