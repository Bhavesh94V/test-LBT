import getTwilioClient from '../config/twilio.js';

class SMSService {
  async sendOTP(phone, otp) {
    try {
      const twilio = getTwilioClient();
      if (!twilio) {
        console.warn('[SMS] Twilio not initialized. Skipping SMS send.');
        return { success: false, error: 'SMS service unavailable' };
      }
      
      const message = await twilio.messages.create({
        body: `Your OTP for Let's Buy is: ${otp}. Valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phone}`,
      });

      console.log('[SMS] OTP sent:', message.sid);
      return { success: true, messageSid: message.sid };
    } catch (error) {
      console.error('[SMS] Error sending OTP:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendMessage(phone, message) {
    try {
      const twilio = getTwilioClient();
      if (!twilio) {
        console.warn('[SMS] Twilio not initialized. Skipping message send.');
        return { success: false, error: 'SMS service unavailable' };
      }
      
      const result = await twilio.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phone}`,
      });

      console.log('[SMS] Message sent:', result.sid);
      return { success: true, messageSid: result.sid };
    } catch (error) {
      console.error('[SMS] Error sending message:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendBulkMessages(phones, message) {
    try {
      const twilio = getTwilioClient();
      if (!twilio) {
        console.warn('[SMS] Twilio not initialized. Skipping bulk messages.');
        return phones.map(phone => ({ phone, success: false, error: 'SMS service unavailable' }));
      }

      const results = [];

      for (const phone of phones) {
        try {
          const result = await twilio.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${phone}`,
          });
          results.push({ phone, success: true, messageSid: result.sid });
        } catch (error) {
          results.push({ phone, success: false, error: error.message });
        }
      }

      return results;
    } catch (error) {
      console.error('[SMS] Error sending bulk messages:', error.message);
      return phones.map(phone => ({ phone, success: false, error: error.message }));
    }
  }
}

export default new SMSService();
