import express from 'express';
import {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  joinGroup,
  lockGroup,
  deleteGroup,
} from '../controllers/groupController.js';
import { authenticateUser, authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getGroups);
router.get('/:id', getGroup);

// User routes
router.post('/:id/join', authenticateUser, joinGroup);

// Admin routes
router.post('/', authenticateAdmin, createGroup);
router.put('/:id', authenticateAdmin, updateGroup);
router.put('/:id/lock', authenticateAdmin, lockGroup);
router.delete('/:id', authenticateAdmin, deleteGroup);

export default router;
