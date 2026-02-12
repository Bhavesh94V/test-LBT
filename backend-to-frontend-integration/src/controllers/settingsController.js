import Settings from '../models/Settings.js';
import { errorResponse, successResponse } from '../utils/helpers.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    return res.json(successResponse(settings, 'Settings retrieved successfully'));
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json(errorResponse('Error fetching settings', error.message));
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { body } = req;
    const allowedFields = ['siteName', 'description', 'email', 'phone', 'address', 'socialLinks', 'paymentMethods', 'emailSettings', 'smsSettings', 'maintenanceMode'];

    // Filter allowed fields
    const updateData = {};
    allowedFields.forEach(field => {
      if (field in body) {
        updateData[field] = body[field];
      }
    });

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(updateData);
    } else {
      Object.assign(settings, updateData);
    }

    await settings.save();
    return res.json(successResponse(settings, 'Settings updated successfully'));
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json(errorResponse('Error updating settings', error.message));
  }
};

export const getSystemStats = async (req, res) => {
  try {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    return res.json(successResponse({
      uptime: Math.floor(uptime),
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024)
      },
      timestamp: new Date()
    }, 'System stats retrieved successfully'));
  } catch (error) {
    console.error('Error fetching system stats:', error);
    return res.status(500).json(errorResponse('Error fetching system stats', error.message));
  }
};

export const getEmailTemplates = async (req, res) => {
  try {
    const templates = {
      welcome: {
        subject: 'Welcome to Let\'s Buy',
        body: 'Thank you for joining our platform.'
      },
      resetPassword: {
        subject: 'Reset Your Password',
        body: 'Click the link to reset your password.'
      },
      inquiryConfirmation: {
        subject: 'Inquiry Confirmation',
        body: 'Your inquiry has been received.'
      },
      paymentReceipt: {
        subject: 'Payment Receipt',
        body: 'Thank you for your payment.'
      }
    };

    return res.json(successResponse(templates, 'Email templates retrieved successfully'));
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return res.status(500).json(errorResponse('Error fetching email templates', error.message));
  }
};

export const testEmailConfiguration = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(errorResponse('Email address is required'));
    }

    // Here you would typically send a test email
    return res.json(successResponse({
      status: 'test_email_queued',
      email
    }, 'Test email configuration sent'));
  } catch (error) {
    console.error('Error testing email configuration:', error);
    return res.status(500).json(errorResponse('Error testing email configuration', error.message));
  }
};

export const testSmsConfiguration = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json(errorResponse('Phone number is required'));
    }

    // Here you would typically send a test SMS
    return res.json(successResponse({
      status: 'test_sms_queued',
      phone
    }, 'Test SMS configuration sent'));
  } catch (error) {
    console.error('Error testing SMS configuration:', error);
    return res.status(500).json(errorResponse('Error testing SMS configuration', error.message));
  }
};

export const getMaintenanceStatus = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    return res.json(successResponse({
      maintenanceMode: settings?.maintenanceMode || false,
      message: settings?.maintenanceMessage || ''
    }, 'Maintenance status retrieved'));
  } catch (error) {
    console.error('Error fetching maintenance status:', error);
    return res.status(500).json(errorResponse('Error fetching maintenance status', error.message));
  }
};

export const setMaintenanceMode = async (req, res) => {
  try {
    const { enabled, message } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    settings.maintenanceMode = enabled;
    settings.maintenanceMessage = message || '';

    await settings.save();

    return res.json(successResponse({
      maintenanceMode: settings.maintenanceMode,
      message: settings.maintenanceMessage
    }, 'Maintenance mode updated'));
  } catch (error) {
    console.error('Error setting maintenance mode:', error);
    return res.status(500).json(errorResponse('Error setting maintenance mode', error.message));
  }
};
