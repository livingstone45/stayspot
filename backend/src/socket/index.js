const ConnectionHandler = require('./connection.handler');
const ChatHandler = require('./chat.handler');
const NotificationHandler = require('./notification.handler');
const RealtimeHandler = require('./realtime.handler');

class SocketManager {
  constructor(server) {
    this.io = require('socket.io')(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.initializeHandlers();
    this.setupMiddleware();
    this.handleConnections();
  }

  initializeHandlers() {
    this.connectionHandler = new ConnectionHandler(this.io);
    this.chatHandler = new ChatHandler(this.io, this.connectionHandler);
    this.notificationHandler = new NotificationHandler(this.io, this.connectionHandler);
    this.realtimeHandler = new RealtimeHandler(
      this.io, 
      this.connectionHandler, 
      this.chatHandler, 
      this.notificationHandler
    );
  }

  setupMiddleware() {
    this.io.use((socket, next) => {
      // Rate limiting
      socket.rateLimit = {
        messages: 0,
        lastReset: Date.now()
      };
      next();
    });

    this.io.use((socket, next) => {
      // Logging
      console.log(`Socket attempting connection: ${socket.id}`);
      next();
    });
  }

  handleConnections() {
    this.io.on('connection', (socket) => {
      // Initialize all handlers for this socket
      this.connectionHandler.handleConnection(socket);
      this.chatHandler.handleChatEvents(socket);
      this.notificationHandler.handleNotificationEvents(socket);
      this.realtimeHandler.handleRealtimeEvents(socket);

      // Rate limiting middleware
      socket.use((packet, next) => {
        const now = Date.now();
        
        // Reset counter every minute
        if (now - socket.rateLimit.lastReset > 60000) {
          socket.rateLimit.messages = 0;
          socket.rateLimit.lastReset = now;
        }

        socket.rateLimit.messages++;
        
        // Allow 100 messages per minute
        if (socket.rateLimit.messages > 100) {
          socket.emit('rate_limit_exceeded');
          return;
        }

        next();
      });

      // Handle disconnection cleanup
      socket.on('disconnect', () => {
        if (socket.userId) {
          this.realtimeHandler.handleUserDisconnect(socket.userId);
          this.notificationHandler.deliverQueuedNotifications(socket.userId);
        }
      });

      // Health check
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: Date.now() });
      });
    });
  }

  // Public methods for external use
  getConnectionHandler() {
    return this.connectionHandler;
  }

  getChatHandler() {
    return this.chatHandler;
  }

  getNotificationHandler() {
    return this.notificationHandler;
  }

  getRealtimeHandler() {
    return this.realtimeHandler;
  }

  // Utility methods
  getStats() {
    return {
      connectedUsers: this.connectionHandler.connectedUsers.size,
      activeConnections: this.realtimeHandler.getActiveConnections(),
      uptime: process.uptime()
    };
  }

  // Broadcast methods for external services
  async broadcastToCompany(companyId, event, data) {
    this.connectionHandler.broadcastToCompany(companyId, event, data);
  }

  async sendToUser(userId, event, data) {
    this.connectionHandler.sendToUser(userId, event, data);
  }

  async sendNotification(notification) {
    return await this.notificationHandler.sendNotification(notification);
  }

  async sendBulkNotification(userIds, notification) {
    return await this.notificationHandler.sendBulkNotification(userIds, notification);
  }

  async broadcastPropertyUpdate(propertyId, updateType, data) {
    await this.realtimeHandler.broadcastPropertyUpdate(propertyId, updateType, data);
  }

  async broadcastEmergencyAlert(companyId, alert) {
    await this.realtimeHandler.broadcastEmergencyAlert(companyId, alert);
  }
}

module.exports = SocketManager;