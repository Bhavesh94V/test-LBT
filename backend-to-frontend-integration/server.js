import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

import http from 'http';
import connectDB from './src/config/database.js';
import app from './src/app.js';
import { initializeSocket } from './src/config/socket-io.js';
import { initializeRedis } from './src/config/redis.js';

let PORT = process.env.PORT || 5000;

const findAvailablePort = (startPort) => {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.listen(startPort, () => {
      server.close(() => {
        resolve(startPort);
      });
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`[Server] Port ${startPort} is in use, trying next port...`);
        resolve(findAvailablePort(startPort + 1));
      } else {
        resolve(startPort);
      }
    });
  });
};

const startServer = async () => {
  try {
    console.log('[Server] Starting initialization...');
    
    // Find available port if default is in use
    const availablePort = await findAvailablePort(PORT);
    if (availablePort !== PORT) {
      console.log(`[Server] Port ${PORT} was unavailable, using port ${availablePort} instead`);
      PORT = availablePort;
    }
    
    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO
    const io = initializeSocket(server);
    global.io = io;

    // Initialize Redis
    console.log('[Server] Initializing Redis...');
    await initializeRedis();

    // Connect to MongoDB
    console.log('[Server] Connecting to MongoDB...');
    await connectDB();

    // Start listening
    server.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
      console.log('✓ All services initialized successfully');
    });

    // Handle listen error
    server.on('error', (err) => {
      console.error('[Server] Server error:', err.message);
      if (err.code === 'EADDRINUSE') {
        console.error(`[Server] Port ${PORT} is still in use`);
        process.exit(1);
      }
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('[Server] Failed to start server:', error.message);
    console.error(error);
    process.exit(1);
  }
};

startServer();
