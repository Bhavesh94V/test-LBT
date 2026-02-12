import { v2 as cloudinary } from 'cloudinary';

let configured = false;

// Initialize Cloudinary lazily when first needed
const initializeCloudinary = () => {
  if (configured) return cloudinary;
  
  configured = true;
  
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('[Cloudinary] Missing credentials: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
    console.warn('[Cloudinary] Not configured. Image uploads will be disabled.');
    return cloudinary;
  }
  
  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    console.log('[Cloudinary] Configured successfully');
  } catch (error) {
    console.error('[Cloudinary] Configuration error:', error.message);
  }
  
  return cloudinary;
};

export { initializeCloudinary };
export default cloudinary;
