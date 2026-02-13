import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('[MongoDB] Attempting connection...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] ✓ Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] ✗ Connection failed: ${error.message}`);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('[MongoDB] Cannot connect. Check if MongoDB is running and URI is correct.');
    }
    
    throw error;
  }
};

export default connectDB;
