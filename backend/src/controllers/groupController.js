import Group from '../models/Group.js';
import Property from '../models/Property.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import smsService from '../services/smsService.js';
import { AppError } from '../utils/errorHandler.js';
import { getPaginationParams } from '../utils/helpers.js';

// Get all groups
export const getGroups = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, propertyId, status } = req.query;
    const { skip, limit: limitNum } = getPaginationParams(page, limit);

    const filter = {};
    if (propertyId) filter.propertyId = propertyId;
    if (status) filter.status = status;

    const groups = await Group.find(filter)
      .populate('propertyId', 'name')
      .populate('members.userId', 'firstName lastName email phone')
      .skip(skip)
      .limit(limitNum);

    const total = await Group.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        groups,
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

// Get single group
export const getGroup = async (req, res, next) => {
  try {
    const { id } = req.params;

    const group = await Group.findById(id)
      .populate('propertyId')
      .populate('members.userId', 'firstName lastName email phone profilePicture');

    if (!group) {
      return next(new AppError('Group not found', 404));
    }

    res.status(200).json({
      success: true,
      data: { group },
    });
  } catch (error) {
    next(error);
  }
};

// Create group (Admin only)
export const createGroup = async (req, res, next) => {
  try {
    const { propertyId, configuration, totalSlots, joinDeadline, whatsappGroupLink, whatsappGroupName, notes } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return next(new AppError('Property not found', 404));
    }

    const group = new Group({
      propertyId,
      configuration,
      totalSlots,
      slotsFilled: 0,
      status: 'open',
      joinDeadline,
      whatsappGroupLink,
      whatsappGroupName,
      createdBy: req.adminId,
      notes,
    });

    await group.save();

    // Add group to property
    property.groups.push(group._id);
    property.groupCount = (property.groupCount || 0) + 1;
    await property.save();

    // Emit Socket.IO event
    global.io?.emit('group-created', group);

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: { group },
    });
  } catch (error) {
    next(error);
  }
};

// Update group (Admin only)
export const updateGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { totalSlots, status, whatsappGroupLink, whatsappGroupName, notes } = req.body;

    const group = await Group.findByIdAndUpdate(
      id,
      {
        totalSlots,
        status,
        whatsappGroupLink,
        whatsappGroupName,
        notes,
      },
      { new: true }
    );

    if (!group) {
      return next(new AppError('Group not found', 404));
    }

    // Emit Socket.IO event
    global.io?.emit('group-updated', group);

    res.status(200).json({
      success: true,
      message: 'Group updated successfully',
      data: { group },
    });
  } catch (error) {
    next(error);
  }
};

// Join group (User)
export const joinGroup = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const group = await Group.findById(id);
    if (!group) {
      return next(new AppError('Group not found', 404));
    }

    // Check if slots available
    if (group.slotsFilled >= group.totalSlots) {
      return next(new AppError('No slots available', 400));
    }

    // Check if already member
    const isMember = group.members.some((m) => m.userId.toString() === userId);
    if (isMember) {
      return next(new AppError('Already member of this group', 400));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Add user to group
    group.members.push({
      userId,
      joinedDate: new Date(),
      position: group.slotsFilled + 1,
      paymentStatus: 'pending',
    });

    group.slotsFilled += 1;
    group.memberCount = group.members.length;
    await group.save();

    // Add group to user
    user.groupsJoined.push(group._id);
    await user.save();

    // Create payment record
    const property = await Property.findById(group.propertyId);
    const payment = new Payment({
      userId,
      propertyId: group.propertyId,
      groupId: group._id,
      amount: 0, // To be set by admin
      status: 'pending',
    });
    await payment.save();

    // Update group member with payment ID
    const memberIndex = group.members.findIndex((m) => m.userId.toString() === userId);
    if (memberIndex !== -1) {
      group.members[memberIndex].paymentId = payment._id;
      await group.save();
    }

    // Emit Socket.IO event
    global.io?.to(`group-${id}`).emit('member-joined', {
      user: { firstName: user.firstName, lastName: user.lastName },
      memberCount: group.memberCount,
    });

    res.status(200).json({
      success: true,
      message: 'Joined group successfully',
      data: { group, payment },
    });
  } catch (error) {
    next(error);
  }
};

// Lock group (Admin only)
export const lockGroup = async (req, res, next) => {
  try {
    const { id } = req.params;

    const group = await Group.findByIdAndUpdate(
      id,
      { status: 'locked' },
      { new: true }
    ).populate('members.userId', 'phone');

    if (!group) {
      return next(new AppError('Group not found', 404));
    }

    // Send notification to all members
    const memberPhones = group.members.map((m) => m.userId.phone).filter(Boolean);
    if (memberPhones.length > 0) {
      await smsService.sendBulkMessages(
        memberPhones,
        `Your group for property has been locked. No more members will be added.`
      );
    }

    // Emit Socket.IO event
    global.io?.emit('group-locked', group);

    res.status(200).json({
      success: true,
      message: 'Group locked successfully',
      data: { group },
    });
  } catch (error) {
    next(error);
  }
};

// Delete group (Admin only)
export const deleteGroup = async (req, res, next) => {
  try {
    const { id } = req.params;

    const group = await Group.findByIdAndDelete(id);
    if (!group) {
      return next(new AppError('Group not found', 404));
    }

    // Remove from property
    await Property.findByIdAndUpdate(group.propertyId, {
      $pull: { groups: group._id },
    });

    res.status(200).json({
      success: true,
      message: 'Group deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
