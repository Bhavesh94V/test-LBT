import redis from '../config/redis.js';
import emailService from './emailService.js';
import smsService from './smsService.js';
import notificationService from './notificationService.js';

class JobQueueService {
  constructor() {
    this.queue = 'job:queue';
    this.processing = false;
  }

  // Add job to queue
  async addJob(jobType, data, priority = 'normal', delayMs = 0) {
    try {
      const job = {
        id: `${jobType}:${Date.now()}:${Math.random()}`,
        type: jobType,
        data,
        priority,
        createdAt: new Date(),
        attempts: 0,
        maxAttempts: 3,
        delayUntil: new Date(Date.now() + delayMs)
      };

      const queueKey = `${this.queue}:${priority}`;
      await redis.lpush(queueKey, JSON.stringify(job));

      return job;
    } catch (error) {
      console.error('Error adding job to queue:', error);
      throw error;
    }
  }

  // Process jobs
  async processJobs() {
    if (this.processing) return;
    this.processing = true;

    try {
      while (true) {
        const job = await this.getNextJob();
        if (!job) {
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
          continue;
        }

        try {
          await this.executeJob(job);
        } catch (error) {
          console.error(`Error executing job ${job.id}:`, error);
          await this.retryJob(job, error);
        }
      }
    } catch (error) {
      console.error('Error in job processor:', error);
      this.processing = false;
    }
  }

  // Get next job from queue
  async getNextJob() {
    try {
      // Check high priority first
      let job = await redis.rpop(`${this.queue}:high`);
      if (job) return JSON.parse(job);

      job = await redis.rpop(`${this.queue}:normal`);
      if (job) return JSON.parse(job);

      job = await redis.rpop(`${this.queue}:low`);
      if (job) return JSON.parse(job);

      return null;
    } catch (error) {
      console.error('Error getting next job:', error);
      return null;
    }
  }

  // Execute job
  async executeJob(job) {
    switch (job.type) {
      case 'send_email':
        return await emailService.sendEmail(
          job.data.to,
          job.data.subject,
          job.data.template,
          job.data.templateData
        );

      case 'send_sms':
        return await smsService.sendSMS(
          job.data.phone,
          job.data.message
        );

      case 'send_notification':
        return await notificationService.sendMultiChannelNotification(
          job.data.userId,
          job.data.notification
        );

      case 'process_payment':
        return await this.processPayment(job.data);

      case 'cleanup_old_data':
        return await this.cleanupOldData(job.data);

      case 'generate_report':
        return await this.generateReport(job.data);

      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
  }

  // Retry job
  async retryJob(job, error) {
    try {
      job.attempts += 1;

      if (job.attempts < job.maxAttempts) {
        const delayMs = Math.pow(2, job.attempts) * 1000; // Exponential backoff
        job.delayUntil = new Date(Date.now() + delayMs);
        job.lastError = error.message;

        const queueKey = `${this.queue}:${job.priority}`;
        await redis.lpush(queueKey, JSON.stringify(job));

        console.log(`Job ${job.id} retrying (attempt ${job.attempts}/${job.maxAttempts})`);
      } else {
        console.error(`Job ${job.id} failed after ${job.maxAttempts} attempts`);
        await redis.lpush('job:failed', JSON.stringify(job));
      }
    } catch (error) {
      console.error('Error retrying job:', error);
    }
  }

  // Process payment (stub)
  async processPayment(data) {
    // Implement payment processing logic
    console.log('Processing payment:', data);
    return { success: true };
  }

  // Cleanup old data
  async cleanupOldData(data) {
    const daysOld = data.daysOld || 30;
    const date = new Date();
    date.setDate(date.getDate() - daysOld);

    console.log(`Cleaning up data older than ${daysOld} days`);
    return { success: true };
  }

  // Generate report
  async generateReport(data) {
    console.log('Generating report:', data);
    return { success: true };
  }

  // Get queue stats
  async getQueueStats() {
    try {
      const highCount = await redis.llen(`${this.queue}:high`);
      const normalCount = await redis.llen(`${this.queue}:normal`);
      const lowCount = await redis.llen(`${this.queue}:low`);
      const failedCount = await redis.llen('job:failed');

      return {
        high: highCount,
        normal: normalCount,
        low: lowCount,
        failed: failedCount,
        total: highCount + normalCount + lowCount
      };
    } catch (error) {
      console.error('Error getting queue stats:', error);
      return null;
    }
  }

  // Clear queue
  async clearQueue() {
    try {
      await redis.del(`${this.queue}:high`, `${this.queue}:normal`, `${this.queue}:low`);
      return { success: true };
    } catch (error) {
      console.error('Error clearing queue:', error);
      throw error;
    }
  }
}

export default new JobQueueService();
