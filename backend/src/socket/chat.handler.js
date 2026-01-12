const logger = require('../config/logger');
const connectionHandler = require('./connection.handler');

class ChatHandler {
  constructor(io) {
    this.io = io;
    this.connectionHandler = connectionHandler;
    this.chatRooms = new Map(); // roomId -> { participants: Set, messages: Array }
    this.initializeChatHandling();
  }

  /**
   * Initialize chat handling
   */
  initializeChatHandling() {
    logger.info('Chat handler initialized');
  }

  /**
   * Create or get chat room
   * @param {Array} participantIds - Array of user IDs
   * @param {string} roomType - Type of chat room
   * @param {Object} metadata - Additional room metadata
   * @returns {Promise<Object>} Chat room info
   */
  async createChatRoom(participantIds, roomType = 'private', metadata = {}) {
    try {
      const db = require('../models');
      
      // Validate participants
      if (!Array.isArray(participantIds) || participantIds.length < 2) {
        throw new Error('At least 2 participants are required');
      }
      
      // Sort participant IDs to ensure consistent room ID
      const sortedParticipants = [...participantIds].sort((a, b) => a - b);
      const roomId = this.generateRoomId(sortedParticipants, roomType);
      
      // Check if room already exists
      let chatRoom = await db.ChatRoom.findOne({
        where: { roomId }
      });
      
      if (!chatRoom) {
        // Create new chat room
        chatRoom = await db.ChatRoom.create({
          roomId,
          roomType,
          participantIds: sortedParticipants,
          metadata,
          createdBy: sortedParticipants[0],
          createdAt: new Date()
        });
        
        // Add participants to room
        for (const participantId of sortedParticipants) {
          await db.ChatParticipant.create({
            roomId: chatRoom.id,
            userId: participantId,
            joinedAt: new Date(),
            role: participantId === sortedParticipants[0] ? 'creator' : 'participant'
          });
        }
        
        logger.info(`Chat room created: ${roomId} with ${sortedParticipants.length} participants`);
      }
      
      // Join socket rooms for online participants
      this.joinChatRoomSockets(chatRoom.roomId, sortedParticipants);
      
      return {
        success: true,
        roomId: chatRoom.roomId,
        chatRoomId: chatRoom.id,
        participantIds: sortedParticipants,
        roomType,
        metadata,
        createdAt: chatRoom.createdAt
      };
    } catch (error) {
      logger.error('Failed to create chat room:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create property chat room
   * @param {number} propertyId - Property ID
   * @param {Array} participantIds - Additional participant IDs
   * @returns {Promise<Object>} Chat room info
   */
  async createPropertyChatRoom(propertyId, participantIds = []) {
    try {
      const db = require('../models');
      
      // Get property info
      const property = await db.Property.findByPk(propertyId, {
        include: [
          { model: db.User, as: 'owner', attributes: ['id'] },
          { model: db.User, as: 'managers', attributes: ['id'] }
        ]
      });
      
      if (!property) {
        throw new Error(`Property ${propertyId} not found`);
      }
      
      // Collect all participants
      const allParticipants = new Set();
      
      // Add property owner
      if (property.ownerId) {
        allParticipants.add(property.ownerId);
      }
      
      // Add property managers
      if (property.managers) {
        property.managers.forEach(manager => {
          allParticipants.add(manager.id);
        });
      }
      
      // Add additional participants
      participantIds.forEach(id => {
        allParticipants.add(id);
      });
      
      // Create room
      return await this.createChatRoom(
        Array.from(allParticipants),
        'property',
        {
          propertyId,
          propertyName: property.name
        }
      );
    } catch (error) {
      logger.error(`Failed to create property chat room for property ${propertyId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create task chat room
   * @param {number} taskId - Task ID
   * @returns {Promise<Object>} Chat room info
   */
  async createTaskChatRoom(taskId) {
    try {
      const db = require('../models');
      
      // Get task info
      const task = await db.Task.findByPk(taskId, {
        include: [
          { model: db.User, as: 'assignee', attributes: ['id'] },
          { model: db.User, as: 'createdBy', attributes: ['id'] },
          { model: db.Property, attributes: ['id', 'ownerId'] }
        ]
      });
      
      if (!task) {
        throw new Error(`Task ${taskId} not found`);
      }
      
      // Collect all participants
      const participants = new Set();
      
      // Add task assignee
      if (task.assigneeId) {
        participants.add(task.assigneeId);
      }
      
      // Add task creator
      if (task.createdById) {
        participants.add(task.createdById);
      }
      
      // Add property owner if different
      if (task.Property?.ownerId && 
          !participants.has(task.Property.ownerId)) {
        participants.add(task.Property.ownerId);
      }
      
      // Create room
      return await this.createChatRoom(
        Array.from(participants),
        'task',
        {
          taskId,
          taskTitle: task.title,
          propertyId: task.propertyId
        }
      );
    } catch (error) {
      logger.error(`Failed to create task chat room for task ${taskId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send message to chat room
   * @param {string} roomId - Chat room ID
   * @param {number} senderId - Sender user ID
   * @param {Object} message - Message content
   * @returns {Promise<Object>} Result
   */
  async sendMessage(roomId, senderId, message) {
    try {
      const db = require('../models');
      
      // Get chat room
      const chatRoom = await db.ChatRoom.findOne({
        where: { roomId },
        include: [{
          model: db.ChatParticipant,
          where: { userId: senderId },
          required: true
        }]
      });
      
      if (!chatRoom) {
        throw new Error(`Chat room ${roomId} not found or user not a participant`);
      }
      
      // Create message in database
      const dbMessage = await db.ChatMessage.create({
        roomId: chatRoom.id,
        senderId,
        message: message.content,
        messageType: message.type || 'text',
        metadata: message.metadata || {},
        status: 'sent',
        sentAt: new Date()
      });
      
      // Get message with sender info
      const fullMessage = await db.ChatMessage.findByPk(dbMessage.id, {
        include: [{
          model: db.User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }]
      });
      
      // Prepare message for delivery
      const messageData = {
        messageId: fullMessage.id,
        roomId: chatRoom.roomId,
        senderId: fullMessage.senderId,
        senderName: `${fullMessage.User.firstName} ${fullMessage.User.lastName}`,
        content: fullMessage.message,
        type: fullMessage.messageType,
        metadata: fullMessage.metadata,
        sentAt: fullMessage.sentAt,
        timestamp: new Date().toISOString()
      };
      
      // Send to all room participants via socket
      const deliveredCount = this.emitToRoom(`chat:${roomId}`, 'chat_message', messageData);
      
      // Update message status for delivered participants
      if (deliveredCount > 0) {
        await this.updateMessageDeliveryStatus(dbMessage.id, roomId);
      }
      
      // Store delivery info
      await this.storeMessageDelivery(dbMessage.id, roomId, deliveredCount);
      
      logger.info(`Message ${dbMessage.id} sent to room ${roomId} by user ${senderId}`);
      
      return {
        success: true,
        messageId: dbMessage.id,
        roomId: chatRoom.roomId,
        deliveredCount,
        message: messageData
      };
    } catch (error) {
      logger.error(`Failed to send message to room ${roomId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get chat room messages
   * @param {string} roomId - Chat room ID
   * @param {number} userId - User ID requesting messages
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Messages
   */
  async getRoomMessages(roomId, userId, options = {}) {
    try {
      const db = require('../models');
      
      const {
        limit = 50,
        offset = 0,
        before = null,
        after = null
      } = options;
      
      // Verify user is a participant
      const chatRoom = await db.ChatRoom.findOne({
        where: { roomId },
        include: [{
          model: db.ChatParticipant,
          where: { userId },
          required: true
        }]
      });
      
      if (!chatRoom) {
        throw new Error(`Access denied to room ${roomId} or room not found`);
      }
      
      // Build query conditions
      const where = { roomId: chatRoom.id };
      
      if (before) {
        where.sentAt = { [db.Sequelize.Op.lt]: before };
      }
      
      if (after) {
        where.sentAt = { [db.Sequelize.Op.gt]: after };
      }
      
      // Get messages
      const messages = await db.ChatMessage.findAll({
        where,
        include: [{
          model: db.User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }],
        order: [['sentAt', 'DESC']],
        limit,
        offset
      });
      
      // Format messages
      const formattedMessages = messages.map(message => ({
        messageId: message.id,
        roomId: chatRoom.roomId,
        senderId: message.senderId,
        senderName: `${message.User.firstName} ${message.User.lastName}`,
        content: message.message,
        type: message.messageType,
        metadata: message.metadata,
        sentAt: message.sentAt,
        status: message.status
      })).reverse(); // Reverse to get chronological order
      
      return formattedMessages;
    } catch (error) {
      logger.error(`Failed to get messages for room ${roomId}:`, error);
      throw error;
    }
  }

  /**
   * Get user chat rooms
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Chat rooms
   */
  async getUserChatRooms(userId, options = {}) {
    try {
      const db = require('../models');
      
      const {
        limit = 20,
        offset = 0,
        roomType = null
      } = options;
      
      const where = { userId };
      const includeWhere = {};
      
      if (roomType) {
        includeWhere.roomType = roomType;
      }
      
      const chatRooms = await db.ChatParticipant.findAll({
        where,
        include: [{
          model: db.ChatRoom,
          where: includeWhere,
          include: [{
            model: db.ChatMessage,
            limit: 1,
            order: [['sentAt', 'DESC']],
            include: [{
              model: db.User,
              attributes: ['firstName', 'lastName']
            }]
          }]
        }],
        order: [[db.ChatRoom, 'updatedAt', 'DESC']],
        limit,
        offset
      });
      
      // Format rooms
      const formattedRooms = await Promise.all(chatRooms.map(async (participant) => {
        const room = participant.ChatRoom;
        const lastMessage = room.ChatMessages?.[0];
        
        return {
          roomId: room.roomId,
          chatRoomId: room.id,
          roomType: room.roomType,
          participantIds: room.participantIds,
          metadata: room.metadata,
          unreadCount: await this.getUnreadCount(room.id, userId),
          lastMessage: lastMessage ? {
            senderId: lastMessage.senderId,
            senderName: `${lastMessage.User.firstName} ${lastMessage.User.lastName}`,
            content: lastMessage.message,
            sentAt: lastMessage.sentAt
          } : null,
          updatedAt: room.updatedAt,
          joinedAt: participant.joinedAt
        };
      }));
      
      return formattedRooms;
    } catch (error) {
      logger.error(`Failed to get chat rooms for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Mark messages as read
   * @param {string} roomId - Chat room ID
   * @param {number} userId - User ID
   * @param {Array} messageIds - Array of message IDs to mark as read
   * @returns {Promise<Object>} Result
   */
  async markMessagesAsRead(roomId, userId, messageIds = []) {
    try {
      const db = require('../models');
      
      // Get chat room
      const chatRoom = await db.ChatRoom.findOne({
        where: { roomId },
        include: [{
          model: db.ChatParticipant,
          where: { userId },
          required: true
        }]
      });
      
      if (!chatRoom) {
        throw new Error(`Access denied to room ${roomId} or room not found`);
      }
      
      // Build query
      const where = {
        roomId: chatRoom.id,
        senderId: { [db.Sequelize.Op.ne]: userId } // Don't mark own messages as read
      };
      
      if (messageIds.length > 0) {
        where.id = { [db.Sequelize.Op.in]: messageIds };
      } else {
        // Mark all unread messages in the room
        where.status = 'sent';
      }
      
      // Update messages
      const result = await db.ChatMessage.update(
        { status: 'read' },
        { where }
      );
      
      // Update message deliveries
      await db.MessageDelivery.update(
        { status: 'read', readAt: new Date() },
        {
          where: {
            messageId: { [db.Sequelize.Op.in]: messageIds },
            userId
          }
        }
      );
      
      // Notify room that messages were read
      this.emitToRoom(`chat:${roomId}`, 'messages_read', {
        roomId,
        userId,
        messageIds: messageIds.length > 0 ? messageIds : 'all',
        readAt: new Date()
      });
      
      return {
        success: true,
        count: result[0]
      };
    } catch (error) {
      logger.error(`Failed to mark messages as read in room ${roomId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Add participant to chat room
   * @param {string} roomId - Chat room ID
   * @param {number} userId - User ID to add
   * @param {number} addedBy - User ID who is adding
   * @returns {Promise<Object>} Result
   */
  async addParticipant(roomId, userId, addedBy) {
    try {
      const db = require('../models');
      
      // Get chat room
      const chatRoom = await db.ChatRoom.findOne({
        where: { roomId },
        include: [{
          model: db.ChatParticipant,
          where: { userId: addedBy },
          required: true
        }]
      });
      
      if (!chatRoom) {
        throw new Error(`Access denied to room ${roomId} or room not found`);
      }
      
      // Check if user is already a participant
      const existingParticipant = await db.ChatParticipant.findOne({
        where: {
          roomId: chatRoom.id,
          userId
        }
      });
      
      if (existingParticipant) {
        return {
          success: true,
          message: 'User is already a participant',
          participant: existingParticipant
        };
      }
      
      // Add participant
      const participant = await db.ChatParticipant.create({
        roomId: chatRoom.id,
        userId,
        addedBy,
        joinedAt: new Date(),
        role: 'participant'
      });
      
      // Update room participant list
      const updatedParticipants = [...chatRoom.participantIds, userId].sort((a, b) => a - b);
      await chatRoom.update({
        participantIds: updatedParticipants
      });
      
      // Generate new room ID with updated participants
      const newRoomId = this.generateRoomId(updatedParticipants, chatRoom.roomType);
      await chatRoom.update({ roomId: newRoomId });
      
      // Join socket room for new participant
      this.joinChatRoomSockets(newRoomId, [userId]);
      
      // Notify existing participants
      this.emitToRoom(`chat:${chatRoom.roomId}`, 'participant_added', {
        roomId: chatRoom.roomId,
        userId,
        addedBy,
        addedAt: new Date()
      });
      
      // Notify new participant
      this.emitToUser(userId, 'added_to_chat', {
        roomId: chatRoom.roomId,
        roomType: chatRoom.roomType,
        addedBy,
        addedAt: new Date()
      });
      
      return {
        success: true,
        roomId: chatRoom.roomId,
        participant,
        message: 'Participant added successfully'
      };
    } catch (error) {
      logger.error(`Failed to add participant to room ${roomId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Remove participant from chat room
   * @param {string} roomId - Chat room ID
   * @param {number} userId - User ID to remove
   * @param {number} removedBy - User ID who is removing
   * @returns {Promise<Object>} Result
   */
  async removeParticipant(roomId, userId, removedBy) {
    try {
      const db = require('../models');
      
      // Get chat room
      const chatRoom = await db.ChatRoom.findOne({
        where: { roomId },
        include: [{
          model: db.ChatParticipant,
          where: { userId: removedBy },
          required: true
        }]
      });
      
      if (!chatRoom) {
        throw new Error(`Access denied to room ${roomId} or room not found`);
      }
      
      // Find participant to remove
      const participant = await db.ChatParticipant.findOne({
        where: {
          roomId: chatRoom.id,
          userId
        }
      });
      
      if (!participant) {
        return {
          success: true,
          message: 'User is not a participant'
        };
      }
      
      // Remove participant
      await participant.destroy();
      
      // Update room participant list
      const updatedParticipants = chatRoom.participantIds.filter(id => id !== userId);
      
      if (updatedParticipants.length < 2) {
        // If less than 2 participants, archive the room
        await chatRoom.update({
          status: 'archived',
          archivedAt: new Date()
        });
      } else {
        // Update participant list and regenerate room ID
        await chatRoom.update({
          participantIds: updatedParticipants.sort((a, b) => a - b)
        });
        
        const newRoomId = this.generateRoomId(updatedParticipants, chatRoom.roomType);
        await chatRoom.update({ roomId: newRoomId });
      }
      
      // Leave socket room for removed participant
      this.leaveChatRoomSockets(chatRoom.roomId, [userId]);
      
      // Notify remaining participants
      this.emitToRoom(`chat:${chatRoom.roomId}`, 'participant_removed', {
        roomId: chatRoom.roomId,
        userId,
        removedBy,
        removedAt: new Date()
      });
      
      // Notify removed participant
      this.emitToUser(userId, 'removed_from_chat', {
        roomId: chatRoom.roomId,
        removedBy,
        removedAt: new Date()
      });
      
      return {
        success: true,
        roomId: chatRoom.roomId,
        message: 'Participant removed successfully'
      };
    } catch (error) {
      logger.error(`Failed to remove participant from room ${roomId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update chat room metadata
   * @param {string} roomId - Chat room ID
   * @param {number} userId - User ID updating metadata
   * @param {Object} metadata - New metadata
   * @returns {Promise<Object>} Result
   */
  async updateRoomMetadata(roomId, userId, metadata) {
    try {
      const db = require('../models');
      
      // Get chat room
      const chatRoom = await db.ChatRoom.findOne({
        where: { roomId },
        include: [{
          model: db.ChatParticipant,
          where: { userId },
          required: true
        }]
      });
      
      if (!chatRoom) {
        throw new Error(`Access denied to room ${roomId} or room not found`);
      }
      
      // Update metadata
      await chatRoom.update({
        metadata: { ...chatRoom.metadata, ...metadata },
        updatedAt: new Date()
      });
      
      // Notify participants
      this.emitToRoom(`chat:${roomId}`, 'room_updated', {
        roomId,
        updatedBy: userId,
        metadata: chatRoom.metadata,
        updatedAt: chatRoom.updatedAt
      });
      
      return {
        success: true,
        roomId,
        metadata: chatRoom.metadata,
        updatedAt: chatRoom.updatedAt
      };
    } catch (error) {
      logger.error(`Failed to update metadata for room ${roomId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get unread message count for room
   * @param {number} roomId - Chat room ID (database ID)
   * @param {number} userId - User ID
   * @returns {Promise<number>} Unread count
   */
  async getUnreadCount(roomId, userId) {
    try {
      const db = require('../models');
      
      const count = await db.ChatMessage.count({
        where: {
          roomId,
          senderId: { [db.Sequelize.Op.ne]: userId },
          status: 'sent'
        }
      });
      
      return count;
    } catch (error) {
      logger.error(`Failed to get unread count for room ${roomId}:`, error);
      return 0;
    }
  }

  /**
   * Generate room ID from participants
   * @param {Array} participantIds - Sorted array of participant IDs
   * @param {string} roomType - Room type
   * @returns {string} Room ID
   */
  generateRoomId(participantIds, roomType) {
    const participantsHash = participantIds.join('_');
    return `${roomType}_${participantsHash}`;
  }

  /**
   * Join socket rooms for chat participants
   * @param {string} roomId - Chat room ID
   * @param {Array} participantIds - Participant user IDs
   */
  joinChatRoomSockets(roomId, participantIds) {
    participantIds.forEach(userId => {
      const userSockets = this.connectionHandler.getUserSockets(userId);
      userSockets.forEach(socketId => {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
          socket.join(`chat:${roomId}`);
        }
      });
    });
  }

  /**
   * Leave socket rooms for chat participants
   * @param {string} roomId - Chat room ID
   * @param {Array} participantIds - Participant user IDs
   */
  leaveChatRoomSockets(roomId, participantIds) {
    participantIds.forEach(userId => {
      const userSockets = this.connectionHandler.getUserSockets(userId);
      userSockets.forEach(socketId => {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
          socket.leave(`chat:${roomId}`);
        }
      });
    });
  }

  /**
   * Update message delivery status
   * @param {number} messageId - Message ID
   * @param {string} roomId - Chat room ID
   */
  async updateMessageDeliveryStatus(messageId, roomId) {
    try {
      const db = require('../models');
      
      const chatRoom = await db.ChatRoom.findOne({
        where: { roomId }
      });
      
      if (!chatRoom) return;
      
      // Get participants
      const participants = await db.ChatParticipant.findAll({
        where: { roomId: chatRoom.id },
        attributes: ['userId']
      });
      
      const participantIds = participants.map(p => p.userId);
      
      // Update message deliveries
      for (const userId of participantIds) {
        const isOnline = this.connectionHandler.getUserSockets(userId).size > 0;
        
        await db.MessageDelivery.upsert({
          messageId,
          userId,
          status: isOnline ? 'delivered' : 'pending',
          deliveredAt: isOnline ? new Date() : null
        });
      }
    } catch (error) {
      logger.error(`Failed to update message delivery status for message ${messageId}:`, error);
    }
  }

  /**
   * Store message delivery info
   * @param {number} messageId - Message ID
   * @param {string} roomId - Chat room ID
   * @param {number} deliveredCount - Number of sockets delivered to
   */
  async storeMessageDelivery(messageId, roomId, deliveredCount) {
    try {
      const db = require('../models');
      
      await db.ChatMessage.update(
        {
          deliveryCount: deliveredCount,
          deliveredAt: deliveredCount > 0 ? new Date() : null
        },
        {
          where: { id: messageId }
        }
      );
    } catch (error) {
      logger.error(`Failed to store message delivery for message ${messageId}:`, error);
    }
  }

  /**
   * Emit event to user via socket
   * @param {number} userId - User ID
   * @param {string} event - Event name
   * @param {Object} data - Event data
   * @returns {number} Number of sockets delivered to
   */
  emitToUser(userId, event, data) {
    return this.connectionHandler.emitToUser(userId, event, data);
  }

  /**
   * Emit event to room via socket
   * @param {string} room - Room name
   * @param {string} event - Event name
   * @param {Object} data - Event data
   * @returns {number} Number of sockets delivered to
   */
  emitToRoom(room, event, data) {
    return this.connectionHandler.emitToRoom(room, event, data);
  }

  /**
   * Handle incoming chat events from socket
   * @param {Socket} socket - Socket.io socket
   */
  setupSocketHandlers(socket) {
    const { userId } = socket.user;
    
    // Send message
    socket.on('chat_send_message', async (data) => {
      try {
        const { roomId, message, type = 'text', metadata = {} } = data;
        
        const result = await this.sendMessage(roomId, userId, {
          content: message,
          type,
          metadata
        });
        
        if (result.success) {
          socket.emit('chat_message_sent', result);
        } else {
          socket.emit('chat_error', {
            type: 'send_failed',
            message: result.error,
            roomId
          });
        }
      } catch (error) {
        logger.error(`Socket chat message send failed for user ${userId}:`, error);
        socket.emit('chat_error', {
          type: 'send_failed',
          message: error.message
        });
      }
    });
    
    // Join chat room
    socket.on('chat_join_room', async (roomId) => {
      try {
        const result = await this.joinChatRoom(roomId, userId);
        if (result.success) {
          socket.join(`chat:${roomId}`);
          socket.emit('chat_room_joined', result);
        } else {
          socket.emit('chat_error', {
            type: 'join_failed',
            message: result.error,
            roomId
          });
        }
      } catch (error) {
        logger.error(`Socket chat join failed for user ${userId}:`, error);
        socket.emit('chat_error', {
          type: 'join_failed',
          message: error.message
        });
      }
    });
    
    // Leave chat room
    socket.on('chat_leave_room', (roomId) => {
      socket.leave(`chat:${roomId}`);
      socket.emit('chat_room_left', { roomId });
    });
    
    // Mark messages as read
    socket.on('chat_mark_read', async (data) => {
      try {
        const { roomId, messageIds } = data;
        const result = await this.markMessagesAsRead(roomId, userId, messageIds);
        socket.emit('chat_messages_read', result);
      } catch (error) {
        logger.error(`Socket chat mark read failed for user ${userId}:`, error);
        socket.emit('chat_error', {
          type: 'mark_read_failed',
          message: error.message
        });
      }
    });
    
    // Typing indicator
    socket.on('chat_typing', (data) => {
      const { roomId, isTyping } = data;
      socket.to(`chat:${roomId}`).emit('chat_user_typing', {
        roomId,
        userId,
        isTyping,
        timestamp: new Date()
      });
    });
    
    // Request room messages
    socket.on('chat_get_messages', async (data) => {
      try {
        const { roomId, limit, offset, before, after } = data;
        const messages = await this.getRoomMessages(roomId, userId, {
          limit,
          offset,
          before,
          after
        });
        socket.emit('chat_messages', {
          roomId,
          messages,
          timestamp: new Date()
        });
      } catch (error) {
        logger.error(`Socket get messages failed for user ${userId}:`, error);
        socket.emit('chat_error', {
          type: 'get_messages_failed',
          message: error.message
        });
      }
    });
    
    // Request user rooms
    socket.on('chat_get_rooms', async (data) => {
      try {
        const { limit, offset, roomType } = data || {};
        const rooms = await this.getUserChatRooms(userId, {
          limit,
          offset,
          roomType
        });
        socket.emit('chat_rooms', {
          rooms,
          timestamp: new Date()
        });
      } catch (error) {
        logger.error(`Socket get rooms failed for user ${userId}:`, error);
        socket.emit('chat_error', {
          type: 'get_rooms_failed',
          message: error.message
        });
      }
    });
  }

  /**
   * Join chat room (helper for socket handler)
   * @param {string} roomId - Chat room ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Result
   */
  async joinChatRoom(roomId, userId) {
    try {
      const db = require('../models');
      
      const chatRoom = await db.ChatRoom.findOne({
        where: { roomId },
        include: [{
          model: db.ChatParticipant,
          where: { userId },
          required: false
        }]
      });
      
      if (!chatRoom) {
        return {
          success: false,
          error: 'Chat room not found'
        };
      }
      
      // If user is not a participant, add them
      if (!chatRoom.ChatParticipants || chatRoom.ChatParticipants.length === 0) {
        await this.addParticipant(roomId, userId, userId);
      }
      
      return {
        success: true,
        roomId,
        roomType: chatRoom.roomType,
        metadata: chatRoom.metadata,
        participantIds: chatRoom.participantIds
      };
    } catch (error) {
      logger.error(`Failed to join chat room ${roomId} for user ${userId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = ChatHandler;