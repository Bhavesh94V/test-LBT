import ActivityLog from '../models/ActivityLog.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

class LogService {
  // Log activity to database
  async logActivity(userId, action, details, resourceType, resourceId) {
    try {
      const log = new ActivityLog({
        userId,
        action,
        details,
        resourceType,
        resourceId,
        timestamp: new Date(),
        ipAddress: details?.ipAddress,
        userAgent: details?.userAgent
      });

      await log.save();
      return log;
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  // Log error
  async logError(error, context = {}) {
    try {
      const errorLog = {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString()
      };

      // Log to file
      this.logToFile('error', errorLog);

      // Also save to database for critical errors
      if (context.critical) {
        const log = new ActivityLog({
          action: 'ERROR',
          details: errorLog,
          resourceType: 'system',
          timestamp: new Date()
        });
        await log.save();
      }
    } catch (err) {
      console.error('Error in logError:', err);
    }
  }

  // Log API request
  async logApiRequest(req, res, responseTime) {
    try {
      const log = {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        responseTime: `${responseTime}ms`,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        timestamp: new Date().toISOString()
      };

      this.logToFile('api', log);
    } catch (error) {
      console.error('Error logging API request:', error);
    }
  }

  // Log authentication event
  async logAuthEvent(userId, eventType, details) {
    try {
      const log = new ActivityLog({
        userId,
        action: `AUTH_${eventType}`,
        details,
        resourceType: 'auth',
        timestamp: new Date()
      });

      await log.save();
      this.logToFile('auth', { userId, eventType, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Error logging auth event:', error);
    }
  }

  // Log to file
  logToFile(type, data) {
    try {
      const date = new Date().toISOString().split('T')[0];
      const fileName = `${type}-${date}.log`;
      const filePath = path.join(logsDir, fileName);

      const logEntry = `[${new Date().toISOString()}] ${JSON.stringify(data)}\n`;
      fs.appendFileSync(filePath, logEntry);
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }

  // Get activity logs
  async getActivityLogs(filters = {}, limit = 50, skip = 0) {
    try {
      const query = {};

      if (filters.userId) query.userId = filters.userId;
      if (filters.action) query.action = new RegExp(filters.action, 'i');
      if (filters.resourceType) query.resourceType = filters.resourceType;

      if (filters.startDate || filters.endDate) {
        query.timestamp = {};
        if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
        if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
      }

      const logs = await ActivityLog.find(query)
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await ActivityLog.countDocuments(query);

      return { logs, total };
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      throw error;
    }
  }

  // Get user activity
  async getUserActivity(userId, limit = 20) {
    try {
      return await ActivityLog.find({ userId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  }

  // Export logs
  async exportLogs(startDate, endDate) {
    try {
      const logs = await ActivityLog.find({
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }).lean();

      return logs;
    } catch (error) {
      console.error('Error exporting logs:', error);
      throw error;
    }
  }

  // Clean old logs
  async cleanOldLogs(daysOld = 90) {
    try {
      const date = new Date();
      date.setDate(date.getDate() - daysOld);

      const result = await ActivityLog.deleteMany({ timestamp: { $lt: date } });
      return result;
    } catch (error) {
      console.error('Error cleaning old logs:', error);
      throw error;
    }
  }

  // Get log statistics
  async getLogStatistics(startDate, endDate) {
    try {
      const stats = await ActivityLog.aggregate([
        {
          $match: {
            timestamp: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: '$action',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return stats;
    } catch (error) {
      console.error('Error getting log statistics:', error);
      throw error;
    }
  }
}

export default new LogService();
