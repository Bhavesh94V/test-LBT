import User from '../models/User.js';
import Property from '../models/Property.js';
import Inquiry from '../models/Inquiry.js';
import Payment from '../models/Payment.js';
import Group from '../models/Group.js';
import redis from '../config/redis.js';

class AnalyticsService {
  // Dashboard statistics
  async getDashboardStats(timeRange = '30d') {
    try {
      const dateFilter = this.getDateFilter(timeRange);

      const [
        totalUsers,
        activeUsers,
        totalProperties,
        activeProperties,
        totalInquiries,
        totalPayments,
        totalGroups,
        totalRevenue
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ lastLogin: { $gte: dateFilter } }),
        Property.countDocuments(),
        Property.countDocuments({ status: 'active' }),
        Inquiry.countDocuments({ createdAt: { $gte: dateFilter } }),
        Payment.countDocuments({ createdAt: { $gte: dateFilter } }),
        Group.countDocuments(),
        this.getTotalRevenue(dateFilter)
      ]);

      return {
        totalUsers,
        activeUsers,
        totalProperties,
        activeProperties,
        totalInquiries,
        totalPayments,
        totalGroups,
        totalRevenue,
        period: timeRange
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  // User analytics
  async getUserAnalytics(timeRange = '30d') {
    try {
      const dateFilter = this.getDateFilter(timeRange);

      const [registrations, activeUsers, avgSessionDuration] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: dateFilter } }),
        User.countDocuments({
          $or: [
            { lastLogin: { $gte: dateFilter } },
            { lastActivity: { $gte: dateFilter } }
          ]
        }),
        this.getAverageSessionDuration(dateFilter)
      ]);

      return {
        registrations,
        activeUsers,
        avgSessionDuration,
        period: timeRange
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw error;
    }
  }

  // Property analytics
  async getPropertyAnalytics(timeRange = '30d') {
    try {
      const dateFilter = this.getDateFilter(timeRange);

      const properties = await Property.aggregate([
        { $match: { createdAt: { $gte: dateFilter } } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' }
          }
        }
      ]);

      const totalListings = await Property.countDocuments({ createdAt: { $gte: dateFilter } });
      const activeSales = await Property.countDocuments({ status: 'active', createdAt: { $gte: dateFilter } });

      return {
        totalListings,
        activeSales,
        byStatus: properties,
        period: timeRange
      };
    } catch (error) {
      console.error('Error getting property analytics:', error);
      throw error;
    }
  }

  // Inquiry analytics
  async getInquiryAnalytics(timeRange = '30d') {
    try {
      const dateFilter = this.getDateFilter(timeRange);

      const inquiries = await Inquiry.aggregate([
        { $match: { createdAt: { $gte: dateFilter } } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalInquiries = await Inquiry.countDocuments({ createdAt: { $gte: dateFilter } });
      const avgResponseTime = await this.getAverageInquiryResponseTime(dateFilter);

      return {
        totalInquiries,
        avgResponseTime,
        byStatus: inquiries,
        period: timeRange
      };
    } catch (error) {
      console.error('Error getting inquiry analytics:', error);
      throw error;
    }
  }

  // Payment analytics
  async getPaymentAnalytics(timeRange = '30d') {
    try {
      const dateFilter = this.getDateFilter(timeRange);

      const payments = await Payment.aggregate([
        { $match: { createdAt: { $gte: dateFilter } } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]);

      const successfulTransactions = await Payment.countDocuments({
        status: 'completed',
        createdAt: { $gte: dateFilter }
      });

      const totalRevenue = await this.getTotalRevenue(dateFilter);

      return {
        totalTransactions: await Payment.countDocuments({ createdAt: { $gte: dateFilter } }),
        successfulTransactions,
        totalRevenue,
        byStatus: payments,
        period: timeRange
      };
    } catch (error) {
      console.error('Error getting payment analytics:', error);
      throw error;
    }
  }

  // Group analytics
  async getGroupAnalytics(timeRange = '30d') {
    try {
      const dateFilter = this.getDateFilter(timeRange);

      const groups = await Group.aggregate([
        { $match: { createdAt: { $gte: dateFilter } } },
        {
          $group: {
            _id: null,
            totalGroups: { $sum: 1 },
            avgMembers: { $avg: { $size: '$members' } }
          }
        }
      ]);

      const activeGroups = await Group.countDocuments({
        $and: [
          { createdAt: { $gte: dateFilter } },
          { status: 'active' }
        ]
      });

      return {
        totalGroups: groups[0]?.totalGroups || 0,
        activeGroups,
        avgMembers: groups[0]?.avgMembers || 0,
        period: timeRange
      };
    } catch (error) {
      console.error('Error getting group analytics:', error);
      throw error;
    }
  }

  // Top performing properties
  async getTopProperties(limit = 10) {
    try {
      return await Property.find({ status: 'active' })
        .sort({ views: -1 })
        .limit(limit)
        .select('title price views inquiryCount');
    } catch (error) {
      console.error('Error getting top properties:', error);
      throw error;
    }
  }

  // User growth trend
  async getUserGrowthTrend(days = 30) {
    try {
      const trend = await User.aggregate([
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: days }
      ]);

      return trend;
    } catch (error) {
      console.error('Error getting user growth trend:', error);
      throw error;
    }
  }

  // Revenue trend
  async getRevenueTrend(days = 30) {
    try {
      const trend = await Payment.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            revenue: { $sum: '$amount' },
            transactions: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: days }
      ]);

      return trend;
    } catch (error) {
      console.error('Error getting revenue trend:', error);
      throw error;
    }
  }

  // Helper methods
  getDateFilter(timeRange) {
    const now = new Date();
    const date = new Date(now);

    switch (timeRange) {
      case '7d':
        date.setDate(date.getDate() - 7);
        break;
      case '30d':
        date.setDate(date.getDate() - 30);
        break;
      case '90d':
        date.setDate(date.getDate() - 90);
        break;
      case '1y':
        date.setFullYear(date.getFullYear() - 1);
        break;
      default:
        date.setDate(date.getDate() - 30);
    }

    return date;
  }

  async getTotalRevenue(dateFilter) {
    try {
      const result = await Payment.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: dateFilter } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      return result[0]?.total || 0;
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      return 0;
    }
  }

  async getAverageSessionDuration(dateFilter) {
    // Placeholder - implement based on your session tracking
    return 0;
  }

  async getAverageInquiryResponseTime(dateFilter) {
    try {
      const result = await Inquiry.aggregate([
        { $match: { createdAt: { $gte: dateFilter }, respondedAt: { $exists: true } } },
        {
          $group: {
            _id: null,
            avgResponseTime: {
              $avg: { $subtract: ['$respondedAt', '$createdAt'] }
            }
          }
        }
      ]);

      return result[0]?.avgResponseTime || 0;
    } catch (error) {
      console.error('Error calculating average response time:', error);
      return 0;
    }
  }

  // Cache analytics
  async cacheAnalytics(key, data, ttl = 3600) {
    try {
      await redis.setex(`analytics:${key}`, ttl, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error caching analytics:', error);
      return false;
    }
  }

  // Get cached analytics
  async getCachedAnalytics(key) {
    try {
      const data = await redis.get(`analytics:${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting cached analytics:', error);
      return null;
    }
  }
}

export default new AnalyticsService();
