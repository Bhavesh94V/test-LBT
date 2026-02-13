import twilio from 'twilio';

let client = null;
let initialized = false;

const getTwilioClient = () => {
  if (initialized) return client;
  
  initialized = true;
  
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken) {
    console.warn('[Twilio] Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN');
    return null;
  }
  
  try {
    client = twilio(accountSid, authToken);
    console.log('[Twilio] Client initialized successfully');
    return client;
  } catch (error) {
    console.error('[Twilio] Failed to initialize client:', error.message);
    return null;
  }
};

export { getTwilioClient };
export default getTwilioClient;
