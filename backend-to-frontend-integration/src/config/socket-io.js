import { Server } from 'socket.io';

export const initializeSocket = (server) => {
  try {
    const corsOrigin = process.env.SOCKET_IO_CORS_ORIGIN || 'http://localhost:3000';
    
    const io = new Server(server, {
      cors: {
        origin: corsOrigin,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
      pingInterval: 25000,
      pingTimeout: 20000,
    });

    io.on('connection', (socket) => {
      console.log(`[Socket.IO] User connected: ${socket.id}`);

      // Group events
      socket.on('join-group', (groupId) => {
        socket.join(`group-${groupId}`);
        io.to(`group-${groupId}`).emit('member-joined', {
          message: 'A new member joined the group',
          timestamp: new Date(),
        });
      });

      socket.on('leave-group', (groupId) => {
        socket.leave(`group-${groupId}`);
        io.to(`group-${groupId}`).emit('member-left', {
          message: 'A member left the group',
          timestamp: new Date(),
        });
      });

      // Property events
      socket.on('join-property', (propertyId) => {
        socket.join(`property-${propertyId}`);
      });

      socket.on('leave-property', (propertyId) => {
        socket.leave(`property-${propertyId}`);
      });

      // User dashboard
      socket.on('join-user-dashboard', (userId) => {
        socket.join(`user-${userId}`);
      });

      socket.on('leave-user-dashboard', (userId) => {
        socket.leave(`user-${userId}`);
      });

      socket.on('error', (error) => {
        console.error(`[Socket.IO] Error for socket ${socket.id}:`, error.message);
      });

      socket.on('disconnect', () => {
        console.log(`[Socket.IO] User disconnected: ${socket.id}`);
      });
    });

    console.log('[Socket.IO] Initialized successfully');
    return io;
  } catch (error) {
    console.error('[Socket.IO] Initialization error:', error.message);
    throw error;
  }
};

export default initializeSocket;
