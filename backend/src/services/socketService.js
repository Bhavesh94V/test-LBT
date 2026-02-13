import notificationService from './notificationService.js';

class SocketService {
  constructor() {
    this.userSockets = new Map(); // userId -> socket.id mapping
    this.roomMembers = new Map(); // room -> Set of users
  }

  // Initialize socket connection
  initializeSocket(socket, userId) {
    this.userSockets.set(userId, socket.id);
    socket.join(`user:${userId}`);
    console.log(`[Socket] User ${userId} connected: ${socket.id}`);
  }

  // Handle user disconnect
  handleDisconnect(socket, userId) {
    this.userSockets.delete(userId);
    socket.leave(`user:${userId}`);
    console.log(`[Socket] User ${userId} disconnected: ${socket.id}`);
  }

  // Notify user
  notifyUser(io, userId, notification) {
    io.to(`user:${userId}`).emit('notification', notification);
  }

  // Notify multiple users
  notifyUsers(io, userIds, notification) {
    userIds.forEach(userId => {
      this.notifyUser(io, userId, notification);
    });
  }

  // Broadcast to room
  broadcastToRoom(io, room, event, data) {
    io.to(room).emit(event, data);
  }

  // Join room
  joinRoom(socket, room) {
    socket.join(room);
    this.roomMembers.set(room, (this.roomMembers.get(room) || new Set()).add(socket.id));
  }

  // Leave room
  leaveRoom(socket, room) {
    socket.leave(room);
    const members = this.roomMembers.get(room);
    if (members) {
      members.delete(socket.id);
    }
  }

  // Send message to room
  sendMessage(io, room, message) {
    io.to(room).emit('message', message);
  }

  // Update property in real-time
  updatePropertyStatus(io, propertyId, status) {
    io.to(`property:${propertyId}`).emit('propertyUpdated', {
      propertyId,
      status,
      updatedAt: new Date()
    });
  }

  // Update group in real-time
  updateGroupStatus(io, groupId, data) {
    io.to(`group:${groupId}`).emit('groupUpdated', {
      groupId,
      ...data,
      updatedAt: new Date()
    });
  }

  // Notify payment status
  notifyPaymentStatus(io, paymentId, status, userId) {
    this.notifyUser(io, userId, {
      type: 'payment_status',
      paymentId,
      status,
      message: `Payment ${status} successfully`,
      timestamp: new Date()
    });
  }

  // Notify inquiry status
  notifyInquiryStatus(io, inquiryId, status, userId) {
    this.notifyUser(io, userId, {
      type: 'inquiry_status',
      inquiryId,
      status,
      message: `Inquiry ${status}`,
      timestamp: new Date()
    });
  }

  // Get user socket id
  getUserSocketId(userId) {
    return this.userSockets.get(userId);
  }

  // Get room members count
  getRoomMembersCount(room) {
    const members = this.roomMembers.get(room);
    return members ? members.size : 0;
  }
}

export default new SocketService();
