import nodemailer from 'nodemailer';
import { google } from 'googleapis';

let oauth2Client = null;
let transporter = null;
let initialized = false;

// Initialize OAuth2 client lazily when first needed
const initializeGmail = () => {
  if (initialized) return oauth2Client;
  
  initialized = true;
  
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  
  if (!clientId || !clientSecret || !refreshToken) {
    console.warn(`[Gmail] Missing credentials: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_FROM_EMAIL`);
    return null;
  }
  
  try {
    oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });
    console.log('[Gmail] OAuth2 client initialized successfully');
    return oauth2Client;
  } catch (error) {
    console.error('[Gmail] Failed to initialize OAuth2 client:', error.message);
    return null;
  }
};

const getAccessToken = async () => {
  const client = initializeGmail();
  if (!client) {
    throw new Error('Gmail OAuth2 client not initialized');
  }
  
  try {
    const { credentials } = await client.refreshAccessToken();
    return credentials.access_token;
  } catch (error) {
    console.error('[Gmail] Error generating access token:', error.message);
    throw error;
  }
};

const createTransporter = async () => {
  const client = initializeGmail();
  if (!client) {
    throw new Error('Gmail service not configured');
  }
  
  try {
    if (transporter) return transporter;
    
    const accessToken = await getAccessToken();

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_FROM_EMAIL,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    
    return transporter;
  } catch (error) {
    console.error('[Gmail] Error creating transporter:', error.message);
    throw error;
  }
};

export { createTransporter, getAccessToken };
