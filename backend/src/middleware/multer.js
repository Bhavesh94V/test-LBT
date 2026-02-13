import multer from 'multer';
import path from 'path';

// Use memory storage for direct upload to Cloudinary
const storage = multer.memoryStorage();

// File filter with enhanced validation
const fileFilter = (req, file, cb) => {
  try {
    // Allowed image types
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (!file.originalname) {
      return cb(new Error('File must have a name'));
    }

    if (file.originalname.length > 255) {
      return cb(new Error('Filename is too long'));
    }

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'));
    }
  } catch (error) {
    cb(error);
  }
};

// Upload middleware with error handling
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 50, // Max files in single request
  },
  fileFilter: fileFilter,
});

// Wrap multer to handle errors properly
const wrapMulter = (middleware) => {
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'FILE_TOO_LARGE') {
          return next(new Error('File size exceeds 10MB limit'));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new Error('Too many files uploaded'));
        }
        return next(err);
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

export const singleImageUpload = wrapMulter(upload.single('image'));
export const multipleImagesUpload = wrapMulter(upload.array('images', 10)); // Max 10 images
export const galleryUpload = wrapMulter(upload.array('gallery', 20)); // Max 20 images for gallery

export default upload;
