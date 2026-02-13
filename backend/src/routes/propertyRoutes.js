import express from 'express';
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadGallery,
  deleteGalleryImage,
} from '../controllers/propertyController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { galleryUpload } from '../middleware/multer.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/:id', getProperty);

// Admin routes
router.post('/', authenticateAdmin, createProperty);
router.put('/:id', authenticateAdmin, updateProperty);
router.delete('/:id', authenticateAdmin, deleteProperty);

// Gallery routes
router.post('/:id/gallery', authenticateAdmin, galleryUpload, uploadGallery);
router.delete('/:id/gallery/:galleryId', authenticateAdmin, deleteGalleryImage);

export default router;
