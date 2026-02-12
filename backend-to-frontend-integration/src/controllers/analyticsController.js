import User from '../models/User.js';
import Property from '../models/Property.js';
import Group from '../models/Group.js';
import Payment from '../models/Payment.js';
import Inquiry from '../models/Inquiry.js';
import { AppError } from '../utils/errorHandler.js';

// Get dashboard analytics
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ status: 'active' });
    const totalProperties = await Property.countDocuments();
    const totalGroups = await Group.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalInquiries = await Inquiry.countDocuments();
    const convertedInquiries = await Inquiry.countDocuments({
      status: 'converted',
    });
    const conversionRate =
      totalInquiries > 0
        ? ((convertedInquiries / totalInquiries) * 100).toFixed(2)
        : 0;

    // Get 30-day user growth
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get property distribution by status
    const propertyStats = await Property.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get top properties
    const topProperties = await Property.find()
      .sort({ buyersInterested: -1 })
      .limit(5)
      .select('name buyersInterested city');

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProperties,
        totalGroups,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalInquiries,
        conversionRate,
        userGrowth,
        propertyStats,
        topProperties,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get revenue analytics
export const getRevenueAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { status: 'completed' };
    if (startDate || endDate) {
      filter.completedDate = {};
      if (startDate) filter.completedDate.$gte = new Date(startDate);
      if (endDate) filter.completedDate.$lte = new Date(endDate);
    }

    const totalRevenue = await Payment.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const revenueByPaymentMethod = await Payment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$paymentMethod',
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const revenueByProperty = await Payment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$propertyId',
          amount: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'properties',
          localField: '_id',
          foreignField: '_id',
          as: 'property',
        },
      },
      { $unwind: '$property' },
      {
        $project: {
          propertyName: '$property.name',
          amount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalRevenue[0]?.total || 0,
        revenueByPaymentMethod,
        revenueByProperty,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get property analytics
export const getPropertyAnalytics = async (req, res, next) => {
  try {
    const propertiesCount = await Property.countDocuments();

    const propertiesByStatus = await Property.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const topProperties = await Property.find()
      .sort({ buyersInterested: -1 })
      .limit(10)
      .select('name buyersInterested city priceRange');

    res.status(200).json({
      success: true,
      data: {
        propertiesCount,
        propertiesByStatus,
        topProperties,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get inquiry analytics
export const getInquiryAnalytics = async (req, res, next) => {
  try {
    const inquiriesByStatus = await Inquiry.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const inquiriesByProperty = await Inquiry.aggregate([
      {
        $group: {
          _id: '$propertyId',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'properties',
          localField: '_id',
          foreignField: '_id',
          as: 'property',
        },
      },
      { $unwind: '$property' },
      {
        $project: {
          propertyName: '$property.name',
          count: 1,
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        inquiriesByStatus,
        inquiriesByProperty,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user analytics
export const getUserAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const suspendedUsers = await User.countDocuments({ status: 'suspended' });

    const usersByCity = await User.aggregate([
      {
        $group: {
          _id: '$address.city',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Users joined in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        usersByCity,
        newUsersLast30Days,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get group analytics
export const getGroupAnalytics = async (req, res, next) => {
  try {
    const totalGroups = await Group.countDocuments();

    const groupsByStatus = await Group.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const avgMembersPerGroup =
      (await Group.aggregate([
        {
          $group: {
            _id: null,
            avgMembers: { $avg: '$memberCount' },
          },
        },
      ]))[0]?.avgMembers || 0;

    const groupsFilledStatus = await Group.aggregate([
      {
        $project: {
          isFilled: {
            $cond: [
              { $eq: ['$slotsFilled', '$totalSlots'] },
              'filled',
              'available',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$isFilled',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalGroups,
        groupsByStatus,
        avgMembersPerGroup: avgMembersPerGroup.toFixed(2),
        groupsFilledStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};
