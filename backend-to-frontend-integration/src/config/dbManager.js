import mongoose from 'mongoose';
import mockDatabase from './mockDatabase.js';

let db = null;
let isMongoConnected = false;

export const initializeDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('[DB] MONGODB_URI not set. Using mock database for development.');
      db = mockDatabase;
      return db;
    }

    console.log('[DB] Attempting MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('[DB] ✓ MongoDB connected successfully');
    isMongoConnected = true;
    db = mongoose.connection;
    return db;
  } catch (error) {
    console.warn(`[DB] MongoDB connection failed: ${error.message}`);
    console.warn('[DB] Falling back to mock database for development.');
    db = mockDatabase;
    isMongoConnected = false;
    return db;
  }
};

export const getDatabase = () => db || mockDatabase;
export const isConnected = () => isMongoConnected;

export default mongoose;
