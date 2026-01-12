const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

class SocketService {
  constructor(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.onlineUsers = new Map(); // userId -> socketId
    this.userSockets = new Map(); // userId -> Set of socketIds
    this.roomSubscriptions = new Map(); // room -> Set of socketIds

    this.initialize();
  }

  initialize() {
    this.io.use(this.authenticateSocket.bind(this));
    
    this.io.on('connection', (socket) => {
      console.log(`⚡ New socket connected: ${socket.id}`);

      // Store user connection
      if (socket.user) {
        this.addUserSocket(socket.user.id, socket.id);
        socket.join(`user_${socket.user.id}`);
        
        // Join role-based rooms
        socket.user.roles.forEach(role => {
          socket.join(`role_${role.name}`);
        });

        // Join company room if applicable
        if (socket.user.company_id) {
          socket.join(`company_${socket.user.company_id}`);
        }

        // Notify user about successful connection
        socket.emit('connected', {
          userId: socket.user.id,
          online: true,
          timestamp: new Date().toISOString()
        });

        // Notify others in user's rooms about online status
        socket.to(`user_${socket.user.id}`).emit('user_online', {
          userId: socket.user.id,
          online: true
        });
      }

      // Handle property updates
      socket.on('subscribe_property', (propertyId) => {
        const room = `property_${propertyId}`;
        socket.join(room);
        this.addRoomSubscription(room, socket.id);
        console.log(`Socket ${socket.id} subscribed to property ${propertyId}`);
      });

      socket.on('unsubscribe_property', (propertyId) => {
        const room = `property_${propertyId}`;
        socket.leave(room);
        this.removeRoomSubscription(room, socket.id);
      });

      // Handle task updates
      socket.on('subscribe_task', (taskId) => {
        const room = `task_${taskId}`;
        socket.join(room);
        this.addRoomSubscription(room, socket.id);
      });

      // Handle company updates
      socket.on('subscribe_company', (companyId) => {
        const room = `company_${companyId}`;
        socket.join(room);
        this.addRoomSubscription(room, socket.id);
      });

      // Handle direct messaging
      socket.on('send_message', async (data) => {
        try {
          const { receiverId, message, conversationId } = data;
          
          // Validate receiver
          const receiver = await User.findByPk(receiverId);
          if (!receiver) {
            return socket.emit('error', { message: 'Receiver not found' });
          }

          const messageData = {
            senderId: socket.user.id,
            receiverId,
            message,
            conversationId: conversationId || `conversation_${socket.user.id}_${receiverId}`,
            timestamp: new Date().toISOString()
          };

          // Emit to sender
          socket.emit('message_sent', messageData);

          // Emit to receiver if online
          const receiverSocketIds = this.userSockets.get(receiverId);
          if (receiverSocketIds && receiverSocketIds.size > 0) {
            receiverSocketIds.forEach(socketId => {
              this.io.to(socketId).emit('receive_message', messageData);
            });
          }

          // Also emit to conversation room
          this.io.to(messageData.conversationId).emit('new_message', messageData);
        } catch (error) {
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle typing indicators
      socket.on('typing', (data) => {
        const { conversationId, isTyping } = data;
        socket.to(conversationId).emit('user_typing', {
          userId: socket.user.id,
          isTyping,
          conversationId
        });
      });

      // Handle presence updates
      socket.on('update_presence', (data) => {
        const { status, lastSeen } = data;
        socket.user.presence = {
          status: status || 'online',
          lastSeen: lastSeen || new Date().toISOString()
        };

        // Broadcast presence update to user's rooms
        socket.to(`user_${socket.user.id}`).emit('presence_update', {
          userId: socket.user.id,
          presence: socket.user.presence
        });
      });

      // Handle notifications
      socket.on('mark_notification_read', (notificationId) => {
        // Emit to user's room that notification was read
        this.io.to(`user_${socket.user.id}`).emit('notification_read', {
          notificationId,
          userId: socket.user.id
        });
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
        this.removeUserSocket(socket.user?.id, socket.id);
        
        if (socket.user) {
          // Check if user has no more sockets
          const userSockets = this.userSockets.get(socket.user.id);
          if (!userSockets || userSockets.size === 0) {
            // Notify others that user is offline
            this.io.to(`user_${socket.user.id}`).emit('user_offline', {
              userId: socket.user.id,
              online: false,
              lastSeen: new Date().toISOString()
            });
          }
        }

        // Clean up room subscriptions
        this.cleanupRoomSubscriptions(socket.id);
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });
  }

  async authenticateSocket(socket, next) {
    try {
      const token = socket.handshake.auth.token || 
                    socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'stayspot-secret-key');
      
      const user = await User.findOne({
        where: { id: decoded.id },
        include: [
          {
            model: Role,
            through: { attributes: [] },
            attributes: ['id', 'name', 'level']
          }
        ]
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      if (!user.is_active) {
        return next(new Error('Account is deactivated'));
      }

      const userData = user.toJSON();
      delete userData.password;
      socket.user = userData;

      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  }

  addUserSocket(userId, socketId) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId).add(socketId);
    this.onlineUsers.set(userId, socketId);
  }

  removeUserSocket(userId, socketId) {
    if (this.userSockets.has(userId)) {
      this.userSockets.get(userId).delete(socketId);
      if (this.userSockets.get(userId).size === 0) {
        this.userSockets.delete(userId);
        this.onlineUsers.delete(userId);
      }
    }
  }

  addRoomSubscription(room, socketId) {
    if (!this.roomSubscriptions.has(room)) {
      this.roomSubscriptions.set(room, new Set());
    }
    this.roomSubscriptions.get(room).add(socketId);
  }

  removeRoomSubscription(room, socketId) {
    if (this.roomSubscriptions.has(room)) {
      this.roomSubscriptions.get(room).delete(socketId);
      if (this.roomSubscriptions.get(room).size === 0) {
        this.roomSubscriptions.delete(room);
      }
    }
  }

  cleanupRoomSubscriptions(socketId) {
    for (const [room, sockets] of this.roomSubscriptions.entries()) {
      if (sockets.has(socketId)) {
        sockets.delete(socketId);
        if (sockets.size === 0) {
          this.roomSubscriptions.delete(room);
        }
      }
    }
  }

  // Emit property update to all subscribers
  emitPropertyUpdate(propertyId, updateData) {
    const room = `property_${propertyId}`;
    this.io.to(room).emit('property_updated', {
      propertyId,
      ...updateData,
      timestamp: new Date().toISOString()
    });
  }

  // Emit task update
  emitTaskUpdate(taskId, updateData) {
    const room = `task_${taskId}`;
    this.io.to(room).emit('task_updated', {
      taskId,
      ...updateData,
      timestamp: new Date().toISOString()
    });
  }

  // Emit notification to specific user
  emitNotification(userId, notificationData) {
    const userSocketIds = this.userSockets.get(userId);
    if (userSocketIds) {
      userSocketIds.forEach(socketId => {
        this.io.to(socketId).emit('new_notification', notificationData);
      });
    }
  }

  // Emit to company room
  emitCompanyUpdate(companyId, updateData) {
    const room = `company_${companyId}`;
    this.io.to(room).emit('company_updated', {
      companyId,
      ...updateData,
      timestamp: new Date().toISOString()
    });
  }

  // Emit to role-based room
  emitRoleUpdate(roleName, updateData) {
    const room = `role_${roleName}`;
    this.io.to(room).emit('role_update', {
      role: roleName,
      ...updateData,
      timestamp: new Date().toISOString()
    });
  }

  // Get online users count
  getOnlineUsersCount() {
    return this.onlineUsers.size;
  }

  // Get user's socket connections
  getUserSockets(userId) {
    return this.userSockets.get(userId) || new Set();
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.userSockets.has(userId) && this.userSockets.get(userId).size > 0;
  }
}

module.exports = SocketService;