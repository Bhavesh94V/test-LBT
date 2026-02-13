import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Group from '../models/Group.js';
import emailService from '../services/emailService.js';
import smsService from '../services/smsService.js';
import { AppError } from '../utils/errorHandler.js';
import { getPaginationParams } from '../utils/helpers.js';

// Get all payments (Admin only)
export const getPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, paymentMethod, propertyId } = req.query;
    const { skip, limit: limitNum } = getPaginationParams(page, limit);

    const filter = {};
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (propertyId) filter.propertyId = propertyId;

    const payments = await Payment.find(filter)
      .populate('userId', 'firstName lastName email phone')
      .populate('propertyId', 'name')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        payments,
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

// Get single payment (Admin only)
export const getPayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate('userId')
      .populate('propertyId')
      .populate('groupId')
      .populate('verifiedBy', 'firstName lastName email');

    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    res.status(200).json({
      success: true,
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};

// Create payment (Admin only)
export const createPayment = async (req, res, next) => {
  try {
    const { userId, propertyId, groupId, amount, paymentMethod, paymentLink } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const payment = new Payment({
      userId,
      propertyId,
      groupId,
      amount,
      paymentMethod,
      paymentLink,
      status: 'pending',
      requestedDate: new Date(),
    });

    await payment.save();

    // Add to user's payments
    user.paymentsMade.push(payment._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};

// Send payment link (Admin only)
export const sendPaymentLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentLink, sendVia } = req.body; // sendVia: 'email' or 'sms'

    const payment = await Payment.findById(id).populate('userId').populate('propertyId');
    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    // Send link
    if (sendVia === 'email') {
      try {
        await emailService.sendPaymentLink(
          payment.userId.email,
          paymentLink,
          payment.propertyId.name,
          payment.amount
        );
        payment.emailNotifications.push({
          type: 'payment-link-sent',
          sentDate: new Date(),
        });
      } catch (emailError) {
        console.log('[v0] Email service error:', emailError.message);
        // Continue anyway, log but don't fail
      }
    } else if (sendVia === 'sms') {
      try {
        await smsService.sendMessage(
          payment.userId.phone,
          `Payment link: ${paymentLink}`
        );
        payment.smsNotifications.push({
          type: 'payment-link-sent',
          sentDate: new Date(),
        });
      } catch (smsError) {
        console.log('[v0] SMS service error:', smsError.message);
        // Continue anyway, log but don't fail
      }
    }

    payment.linkSentDate = new Date();
    await payment.save();

    res.status(200).json({
      success: true,
      message: `Payment link sent via ${sendVia}`,
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};

// Verify payment (Admin only)
export const verifyPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { verificationStatus, receiptUrl, notes } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    payment.verificationStatus = verificationStatus;
    payment.verificationNotes = notes;
    payment.verificationDate = new Date();
    payment.verifiedBy = req.adminId;

    if (verificationStatus === 'verified') {
      payment.status = 'completed';
      payment.completedDate = new Date();

      // Update group member payment status
      if (payment.groupId) {
        const group = await Group.findById(payment.groupId);
        if (group) {
          const memberIndex = group.members.findIndex(
            (m) => m.paymentId.toString() === id
          );
          if (memberIndex !== -1) {
            group.members[memberIndex].paymentStatus = 'completed';
            await group.save();

            // Emit Socket.IO event
            global.io?.to(`group-${payment.groupId}`).emit('payment-verified', {
              userId: payment.userId,
              memberCount: group.memberCount,
            });
          }
        }
      }
    } else if (verificationStatus === 'rejected') {
      payment.status = 'failed';
    }

    if (receiptUrl) {
      payment.receiptUrl = receiptUrl;
      payment.receiptUploadedAt = new Date();
    }

    await payment.save();

    // Emit Socket.IO event
    global.io?.to(`user-${payment.userId}`).emit('payment-status-updated', {
      paymentId: payment._id,
      status: payment.status,
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};

// Process refund (Admin only)
export const processRefund = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { refundAmount, reason } = req.body;

    const payment = await Payment.findById(id).populate('userId');
    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    payment.status = 'refunded';
    payment.refundAmount = refundAmount;
    payment.refundReason = reason;
    payment.refundStatus = 'pending';
    payment.refundDate = new Date();
    await payment.save();

    // Send notification to user
    await smsService.sendMessage(
      payment.userId.phone,
      `Refund of ₹${refundAmount} initiated for your payment. Refund reason: ${reason}`
    );

    // Emit Socket.IO event
    global.io?.to(`user-${payment.userId._id}`).emit('refund-initiated', {
      paymentId: payment._id,
      refundAmount,
    });

    res.status(200).json({
      success: true,
      message: 'Refund initiated successfully',
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};

// Get user's payments
export const getUserPayments = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const payments = await Payment.find({ userId })
      .populate('propertyId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { payments },
    });
  } catch (error) {
    next(error);
  }
};

// Webhook for payment confirmation (from Razorpay or other provider)
export const paymentWebhook = async (req, res, next) => {
  try {
    const { paymentId, status } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status,
        completedDate: status === 'completed' ? new Date() : undefined,
      },
      { new: true }
    );

    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    // Emit Socket.IO event
    global.io?.to(`user-${payment.userId}`).emit('payment-status-updated', {
      paymentId: payment._id,
      status: payment.status,
    });

    res.status(200).json({
      success: true,
      message: 'Webhook processed',
    });
  } catch (error) {
    next(error);
  }
};
