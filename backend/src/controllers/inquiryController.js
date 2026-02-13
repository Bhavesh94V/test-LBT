import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';
import User from '../models/User.js';
import emailService from '../services/emailService.js';
import smsService from '../services/smsService.js';
import { AppError } from '../utils/errorHandler.js';
import { getPaginationParams } from '../utils/helpers.js';

// Create inquiry (for both "I'm Interested" and Contact form)
export const createInquiry = async (req, res, next) => {
  try {
    const {
      propertyId,
      fullName,
      email,
      phone,
      subject,
      message,
      configurationInterested,
      budgetRange,
      timeline,
      comments,
    } = req.body;

    // Determine inquiry type
    let inquiryType = 'general';
    let property = null;

    if (propertyId) {
      property = await Property.findById(propertyId);
      if (!property) {
        return next(new AppError('Property not found', 404));
      }
      inquiryType = 'property_interest';
    } else if (subject || message) {
      inquiryType = 'contact';
    }

    const inquiry = new Inquiry({
      userId: req.userId || null,
      propertyId: propertyId || null,
      fullName,
      email: email || null,
      phone,
      subject: subject || null,
      message: message || comments || null,
      inquiryType,
      configurationInterested,
      budgetRange,
      timeline,
      comments,
      status: 'new',
      receivedDate: new Date(),
    });

    await inquiry.save();

    // Update property interested count if property inquiry
    if (property) {
      await Property.findByIdAndUpdate(propertyId, { $inc: { buyersInterested: 1 } });
    }

    // Send email notification to admin
    try {
      await emailService.sendInquiryNotification({
        fullName,
        email,
        phone,
        propertyName: property ? property.name : 'General Contact',
        subject,
        message,
        configurationInterested,
        timeline,
        comments,
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the inquiry creation if email fails
    }

    // Emit Socket.IO event
    global.io?.emit('inquiry-created', inquiry);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: { inquiry },
    });
  } catch (error) {
    next(error);
  }
};

// Get all inquiries (Admin only)
export const getInquiries = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, propertyId, search } = req.query;
    const { skip, limit: limitNum } = getPaginationParams(page, limit);

    const filter = {};
    if (status) filter.status = status;
    if (propertyId) filter.propertyId = propertyId;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const inquiries = await Inquiry.find(filter)
      .populate('propertyId', 'name')
      .skip(skip)
      .limit(limitNum)
      .sort({ receivedDate: -1 });

    const total = await Inquiry.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        inquiries,
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

// Get single inquiry (Admin only)
export const getInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id)
      .populate('propertyId')
      .populate('assignedTo', 'firstName lastName email');

    if (!inquiry) {
      return next(new AppError('Inquiry not found', 404));
    }

    res.status(200).json({
      success: true,
      data: { inquiry },
    });
  } catch (error) {
    next(error);
  }
};

// Update inquiry status (Admin only)
export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, assignedTo } = req.body;

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      {
        status,
        adminNotes,
        assignedTo,
        ...(status === 'contacted' && { contactedDate: new Date() }),
        ...(status === 'converted' && { conversionDate: new Date() }),
      },
      { new: true }
    );

    if (!inquiry) {
      return next(new AppError('Inquiry not found', 404));
    }

    // Emit Socket.IO event
    global.io?.emit('inquiry-updated', inquiry);

    res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully',
      data: { inquiry },
    });
  } catch (error) {
    next(error);
  }
};

// Send reply to inquiry (Admin only)
export const sendReplyToInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message, type } = req.body; // type: 'email' or 'sms'

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return next(new AppError('Inquiry not found', 404));
    }

    // Send message
    if (type === 'email') {
      await emailService.sendEmail(
        inquiry.email,
        "Let's Buy - Response to your inquiry",
        message
      );
    } else if (type === 'sms') {
      await smsService.sendMessage(inquiry.phone, message);
    }

    // Add to contact history
    inquiry.contactHistory.push({
      type,
      date: new Date(),
      notes: message,
    });

    // Mark as contacted
    inquiry.status = 'contacted';
    inquiry.contactedDate = new Date();
    await inquiry.save();

    // Emit Socket.IO event
    global.io?.emit('inquiry-replied', inquiry);

    res.status(200).json({
      success: true,
      message: `Reply sent via ${type}`,
      data: { inquiry },
    });
  } catch (error) {
    next(error);
  }
};

// Delete inquiry (Admin only)
export const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) {
      return next(new AppError('Inquiry not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
