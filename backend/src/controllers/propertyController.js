import Property from '../models/Property.js';
import cloudinaryService from '../services/cloudinaryService.js';
import { AppError } from '../utils/errorHandler.js';
import { getPaginationParams } from '../utils/helpers.js';

// Get all properties with filters
export const getProperties = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, city, developer, priceMin, priceMax } = req.query;
    const { skip, limit: limitNum } = getPaginationParams(page, limit);

    const filter = {};
    if (status) filter.status = status;
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (developer) filter.developer = { $regex: developer, $options: 'i' };
    if (priceMin || priceMax) {
      filter['priceRange.min'] = {};
      if (priceMin) filter['priceRange.min'].$gte = parseInt(priceMin);
      if (priceMax) filter['priceRange.max'].$lte = parseInt(priceMax);
    }

    const properties = await Property.find(filter)
      .skip(skip)
      .limit(limitNum)
      .select('-gallery'); // Exclude large gallery arrays from list view

    const total = await Property.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        properties,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single property
export const getProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id).populate('groups');

    if (!property) {
      return next(new AppError('Property not found', 404));
    }

    res.status(200).json({
      success: true,
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

// Create property (Admin only)
export const createProperty = async (req, res, next) => {
  try {
    const {
      name,
      developer,
      location,
      city,
      address,
      description,
      configurations,
      amenities,
      priceRange,
      estimatedSavings,
      status,
      joinBefore,
      launchDate,
      completionDate,
      totalSlots,
    } = req.body;

    // Helper function to safely parse JSON
    const safeJsonParse = (value) => {
      if (!value) return Array.isArray(value) ? [] : {};
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (e) {
          return Array.isArray(value) ? [] : {};
        }
      }
      return value; // Already an object/array
    };

    const property = new Property({
      name,
      developer,
      location,
      city,
      address,
      description,
      configurations: safeJsonParse(configurations),
      amenities: safeJsonParse(amenities),
      priceRange: safeJsonParse(priceRange),
      estimatedSavings: safeJsonParse(estimatedSavings),
      status,
      joinBefore,
      launchDate,
      completionDate,
      totalSlots,
      slotsAvailable: totalSlots,
    });

    // Handle layout images for configurations
    if (req.files && req.files.length > 0) {
      const uploadedFiles = await cloudinaryService.uploadPropertyGallery(
        req.files,
        property._id
      );

      property.configurations.forEach((config, index) => {
        if (uploadedFiles[index]) {
          config.layoutImage = uploadedFiles[index].secure_url;
        }
      });
    }

    await property.save();

    // Emit Socket.IO event
    global.io?.emit('property-created', property);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

// Update property (Admin only)
export const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Parse JSON fields if they're strings
    if (updates.configurations) {
      updates.configurations = typeof updates.configurations === 'string'
        ? JSON.parse(updates.configurations)
        : updates.configurations;
    }
    if (updates.amenities) {
      updates.amenities = typeof updates.amenities === 'string'
        ? JSON.parse(updates.amenities)
        : updates.amenities;
    }
    if (updates.priceRange) {
      updates.priceRange = typeof updates.priceRange === 'string'
        ? JSON.parse(updates.priceRange)
        : updates.priceRange;
    }

    const property = await Property.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!property) {
      return next(new AppError('Property not found', 404));
    }

    // Emit Socket.IO event
    global.io?.emit('property-updated', property);

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

// Delete property (Admin only)
export const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      return next(new AppError('Property not found', 404));
    }

    // Emit Socket.IO event
    global.io?.emit('property-deleted', { propertyId: id });

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Upload gallery images
export const uploadGallery = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      return next(new AppError('No files uploaded', 400));
    }

    const property = await Property.findById(id);
    if (!property) {
      return next(new AppError('Property not found', 404));
    }

    const uploadedFiles = await cloudinaryService.uploadPropertyGallery(
      req.files,
      id
    );

    const galleryItems = uploadedFiles.map((file, index) => ({
      url: file.secure_url,
      caption: req.body.captions?.[index] || '',
      uploadedAt: new Date(),
    }));

    property.gallery.push(...galleryItems);
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Gallery uploaded successfully',
      data: { gallery: property.gallery },
    });
  } catch (error) {
    next(error);
  }
};

// Delete gallery image
export const deleteGalleryImage = async (req, res, next) => {
  try {
    const { id, galleryId } = req.params;

    const property = await Property.findById(id);
    if (!property) {
      return next(new AppError('Property not found', 404));
    }

    property.gallery = property.gallery.filter(
      (img) => img._id.toString() !== galleryId
    );
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
