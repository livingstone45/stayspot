const { Message, User, Property, Unit, Tenant } = require('../../models');
const { Op } = require('sequelize');
const { sendEmail } = require('../../services/communication/email.service');
const { createNotification } = require('../../services/communication/notification.service');

const messageController = {
  // Get all messages
  getAllMessages: async (req, res) => {
    try {
      const { 
        senderId, 
        recipientId,
        propertyId,
        unitId,
        tenantId,
        type,
        status,
        isRead,
        search,
        page = 1, 
        limit = 20 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = { companyId: req.user.companyId };
      if (senderId) where.senderId = senderId;
      if (recipientId) where.recipientId = recipientId;
      if (propertyId) where.propertyId = propertyId;
      if (unitId) where.unitId = unitId;
      if (tenantId) where.tenantId = tenantId;
      if (type) where.type = type;
      if (status) where.status = status;
      if (isRead !== undefined) where.isRead = isRead === 'true';
      
      if (search) {
        where[Op.or] = [
          { subject: { [Op.like]: `%${search}%` } },
          { body: { [Op.like]: `%${search}%` } },
          { '$Sender.firstName$': { [Op.like]: `%${search}%` } },
          { '$Sender.lastName$': { [Op.like]: `%${search}%` } },
          { '$Recipient.firstName$': { [Op.like]: `%${search}%` } },
          { '$Recipient.lastName$': { [Op.like]: `%${search}%` } }
        ];
      }
      
      const messages = await Message.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'Sender',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          },
          {
            model: User,
            as: 'Recipient',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          },
          {
            model: Property,
            attributes: ['id', 'name']
          },
          {
            model: Unit,
            attributes: ['id', 'unitNumber']
          },
          {
            model: Tenant,
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });
      
      res.json({
        success: true,
        data: messages.rows,
        pagination: {
          total: messages.count,
          page: parseInt(page),
          pages: Math.ceil(messages.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get message by ID
  getMessageById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const message = await Message.findByPk(id, {
        include: [
          {
            model: User,
            as: 'Sender',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'avatar']
          },
          {
            model: User,
            as: 'Recipient',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'avatar']
          },
          {
            model: Property,
            attributes: ['id', 'name', 'address']
          },
          {
            model: Unit,
            attributes: ['id', 'unitNumber', 'type']
          },
          {
            model: Tenant,
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          }
        ]
      });
      
      if (!message) {
        return res.status(404).json({ success: false, message: 'Message not found' });
      }
      
      // Check permissions
      const canView = (
        message.senderId === req.user.id ||
        message.recipientId === req.user.id ||
        req.user.role === 'system_admin' ||
        message.companyId === req.user.companyId
      );
      
      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this message'
        });
      }
      
      // Mark as read if recipient is viewing
      if (message.recipientId === req.user.id && !message.isRead) {
        await message.update({
          isRead: true,
          readAt: new Date()
        });
      }
      
      res.json({ success: true, data: message });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Send message
  sendMessage: async (req, res) => {
    try {
      const {
        recipientId,
        propertyId,
        unitId,
        tenantId,
        subject,
        body,
        type,
        priority,
        attachments,
        sendEmail: shouldSendEmail
      } = req.body;
      
      const files = req.files || [];
      
      // Validate recipient
      const recipient = await User.findByPk(recipientId);
      if (!recipient) {
        return res.status(404).json({ success: false, message: 'Recipient not found' });
      }
      
      // Validate property if provided
      let property = null;
      if (propertyId) {
        property = await Property.findByPk(propertyId);
        if (!property) {
          return res.status(404).json({ success: false, message: 'Property not found' });
        }
      }
      
      // Validate unit if provided
      if (unitId) {
        const unit = await Unit.findByPk(unitId);
        if (!unit) {
          return res.status(404).json({ success: false, message: 'Unit not found' });
        }
      }
      
      // Validate tenant if provided
      let tenant = null;
      if (tenantId) {
        tenant = await Tenant.findByPk(tenantId);
        if (!tenant) {
          return res.status(404).json({ success: false, message: 'Tenant not found' });
        }
      }
      
      // Create message
      const message = await Message.create({
        senderId: req.user.id,
        recipientId,
        propertyId,
        unitId,
        tenantId,
        subject: subject || 'No subject',
        body: body || '',
        type: type || 'general', // general, maintenance, payment, lease, emergency
        priority: priority || 'normal', // low, normal, high, urgent
        attachments: attachments || [],
        status: 'sent',
        isRead: false,
        companyId: req.user.companyId,
        portfolioId: property?.portfolioId || null
      });
      
      // Handle file uploads
      const uploadedAttachments = [];
      for (const file of files) {
        uploadedAttachments.push({
          name: file.originalname,
          url: file.path,
          type: file.mimetype,
          size: file.size,
          uploadedAt: new Date()
        });
      }
      
      if (uploadedAttachments.length > 0) {
        await message.update({
          attachments: [...(message.attachments || []), ...uploadedAttachments]
        });
      }
      
      // Send email notification if requested
      if (shouldSendEmail) {
        await sendEmail({
          to: recipient.email,
          subject: `New Message: ${subject}`,
          template: 'new-message',
          data: {
            firstName: recipient.firstName,
            senderName: `${req.user.firstName} ${req.user.lastName}`,
            subject,
            body,
            priority: priority || 'normal',
            propertyName: property?.name,
            unitNumber: unitId ? (await Unit.findByPk(unitId))?.unitNumber : null,
            messageUrl: `${process.env.FRONTEND_URL}/messages/${message.id}`
          }
        });
      }
      
      // Create in-app notification
      await createNotification({
        userId: req.user.id,
        type: 'message_sent',
        title: 'New Message',
        message: `New message from ${req.user.firstName} ${req.user.lastName}`,
        data: { messageId: message.id, senderId: req.user.id },
        recipientIds: [recipientId]
      });
      
      // Send real-time notification via WebSocket
      // This would use Socket.io to notify the recipient in real-time
      
      res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: message
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Send bulk message
  sendBulkMessage: async (req, res) => {
    try {
      const {
        recipientIds,
        propertyIds,
        tenantGroup,
        subject,
        body,
        type,
        priority,
        templateId,
        mergeFields
      } = req.body;
      
      if (!recipientIds && !propertyIds && !tenantGroup) {
        return res.status(400).json({
          success: false,
          message: 'Recipient information is required'
        });
      }
      
      let recipients = [];
      
      // Determine recipients based on input
      if (recipientIds && Array.isArray(recipientIds)) {
        recipients = await User.findAll({
          where: {
            id: { [Op.in]: recipientIds },
            companyId: req.user.companyId
          }
        });
      } else if (propertyIds && Array.isArray(propertyIds)) {
        // Get tenants for specified properties
        const tenants = await Tenant.findAll({
          where: {
            propertyId: { [Op.in]: propertyIds },
            companyId: req.user.companyId
          },
          include: [{ model: User }]
        });
        
        recipients = tenants.map(tenant => tenant.User).filter(user => user);
      } else if (tenantGroup) {
        // Get tenants based on group (e.g., 'overdue', 'active', 'new')
        const where = { companyId: req.user.companyId };
        
        switch (tenantGroup) {
          case 'overdue':
            // This would join with Payment model
            // For now, get all active tenants
            where.status = 'active';
            break;
          case 'active':
            where.status = 'active';
            break;
          case 'new':
            where.status = 'pending';
            break;
          case 'all':
            // No filter
            break;
          default:
            where.status = tenantGroup;
        }
        
        const tenants = await Tenant.findAll({
          where,
          include: [{ model: User }]
        });
        
        recipients = tenants.map(tenant => tenant.User).filter(user => user);
      }
      
      if (recipients.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No recipients found'
        });
      }
      
      const results = {
        sent: [],
        failed: []
      };
      
      for (const recipient of recipients) {
        try {
          // Create individual message
          const message = await Message.create({
            senderId: req.user.id,
            recipientId: recipient.id,
            subject,
            body: applyMergeFields(body, recipient, mergeFields),
            type: type || 'general',
            priority: priority || 'normal',
            status: 'sent',
            isRead: false,
            isBulk: true,
            bulkBatchId: Date.now().toString(),
            companyId: req.user.companyId
          });
          
          // Send email
          await sendEmail({
            to: recipient.email,
            subject: applyMergeFields(subject, recipient, mergeFields),
            template: templateId || 'bulk-message',
            data: {
              firstName: recipient.firstName,
              senderName: `${req.user.firstName} ${req.user.lastName}`,
              subject: applyMergeFields(subject, recipient, mergeFields),
              body: applyMergeFields(body, recipient, mergeFields),
              priority: priority || 'normal'
            }
          });
          
          results.sent.push({
            recipientId: recipient.id,
            recipientName: `${recipient.firstName} ${recipient.lastName}`,
            email: recipient.email,
            messageId: message.id
          });
          
        } catch (error) {
          results.failed.push({
            recipientId: recipient.id,
            recipientName: `${recipient.firstName} ${recipient.lastName}`,
            email: recipient.email,
            error: error.message
          });
        }
      }
      
      res.json({
        success: true,
        message: `Sent ${results.sent.length} messages successfully, ${results.failed.length} failed`,
        data: results
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Reply to message
  replyToMessage: async (req, res) => {
    try {
      const { id } = req.params;
      const { body, sendEmail } = req.body;
      const files = req.files || [];
      
      const originalMessage = await Message.findByPk(id, {
        include: [
          { model: User, as: 'Sender' },
          { model: User, as: 'Recipient' }
        ]
      });
      
      if (!originalMessage) {
        return res.status(404).json({ success: false, message: 'Original message not found' });
      }
      
      // Check permissions
      const canReply = (
        originalMessage.senderId === req.user.id ||
        originalMessage.recipientId === req.user.id ||
        req.user.role === 'system_admin'
      );
      
      if (!canReply) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to reply to this message'
        });
      }
      
      // Determine recipient (swap sender and recipient)
      const recipientId = originalMessage.senderId === req.user.id ? 
        originalMessage.recipientId : originalMessage.senderId;
      
      const recipient = await User.findByPk(recipientId);
      if (!recipient) {
        return res.status(404).json({ success: false, message: 'Recipient not found' });
      }
      
      // Create reply message
      const replyMessage = await Message.create({
        senderId: req.user.id,
        recipientId,
        propertyId: originalMessage.propertyId,
        unitId: originalMessage.unitId,
        tenantId: originalMessage.tenantId,
        subject: `Re: ${originalMessage.subject}`,
        body: body || '',
        type: originalMessage.type,
        priority: originalMessage.priority,
        parentMessageId: originalMessage.id,
        status: 'sent',
        isRead: false,
        companyId: originalMessage.companyId,
        portfolioId: originalMessage.portfolioId
      });
      
      // Handle file uploads
      const uploadedAttachments = [];
      for (const file of files) {
        uploadedAttachments.push({
          name: file.originalname,
          url: file.path,
          type: file.mimetype,
          size: file.size,
          uploadedAt: new Date()
        });
      }
      
      if (uploadedAttachments.length > 0) {
        await replyMessage.update({
          attachments: uploadedAttachments
        });
      }
      
      // Update original message thread
      await originalMessage.update({
        hasReplies: true,
        lastRepliedAt: new Date()
      });
      
      // Send email notification if requested
      if (sendEmail) {
        await sendEmail({
          to: recipient.email,
          subject: `Re: ${originalMessage.subject}`,
          template: 'message-reply',
          data: {
            firstName: recipient.firstName,
            senderName: `${req.user.firstName} ${req.user.lastName}`,
            originalSubject: originalMessage.subject,
            body,
            messageUrl: `${process.env.FRONTEND_URL}/messages/${replyMessage.id}`
          }
        });
      }
      
      // Create notification
      await createNotification({
        userId: req.user.id,
        type: 'message_reply',
        title: 'Message Reply',
        message: `Reply to: ${originalMessage.subject}`,
        data: { messageId: replyMessage.id, originalMessageId: originalMessage.id },
        recipientIds: [recipientId]
      });
      
      res.status(201).json({
        success: true,
        message: 'Reply sent successfully',
        data: replyMessage
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get message thread
  getMessageThread: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find the root message
      const rootMessage = await Message.findByPk(id);
      
      if (!rootMessage) {
        return res.status(404).json({ success: false, message: 'Message not found' });
      }
      
      // Check permissions
      const canView = (
        rootMessage.senderId === req.user.id ||
        rootMessage.recipientId === req.user.id ||
        req.user.role === 'system_admin' ||
        rootMessage.companyId === req.user.companyId
      );
      
      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this thread'
        });
      }
      
      // Find all messages in the thread
      const threadMessages = await Message.findAll({
        where: {
          [Op.or]: [
            { id: rootMessage.id },
            { parentMessageId: rootMessage.id },
            { 
              [Op.and]: [
                { parentMessageId: { [Op.not]: null } },
                { id: { [Op.in]: sequelize.literal(
                  `(SELECT id FROM messages WHERE parentMessageId = ${rootMessage.id})`
                ) } }
              ]
            }
          ]
        },
        include: [
          {
            model: User,
            as: 'Sender',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          },
          {
            model: User,
            as: 'Recipient',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          }
        ],
        order: [['createdAt', 'ASC']]
      });
      
      // Mark unread messages as read for the current user
      await Message.update(
        { isRead: true, readAt: new Date() },
        {
          where: {
            id: { [Op.in]: threadMessages.map(m => m.id) },
            recipientId: req.user.id,
            isRead: false
          }
        }
      );
      
      // Refresh messages to get updated read status
      const updatedThread = await Message.findAll({
        where: { id: { [Op.in]: threadMessages.map(m => m.id) } },
        include: [
          {
            model: User,
            as: 'Sender',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          },
          {
            model: User,
            as: 'Recipient',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          }
        ],
        order: [['createdAt', 'ASC']]
      });
      
      res.json({
        success: true,
        data: {
          thread: updatedThread,
          participants: getThreadParticipants(updatedThread, req.user.id)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get user's messages (inbox/sent)
  getUserMessages: async (req, res) => {
    try {
      const { folder = 'inbox', isRead, type, priority, page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;
      
      const where = { companyId: req.user.companyId };
      
      if (folder === 'inbox') {
        where.recipientId = req.user.id;
      } else if (folder === 'sent') {
        where.senderId = req.user.id;
      } else if (folder === 'unread') {
        where.recipientId = req.user.id;
        where.isRead = false;
      } else if (folder === 'important') {
        where[Op.or] = [
          { senderId: req.user.id },
          { recipientId: req.user.id }
        ];
        where.priority = 'high';
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid folder. Use: inbox, sent, unread, important'
        });
      }
      
      if (isRead !== undefined) where.isRead = isRead === 'true';
      if (type) where.type = type;
      if (priority) where.priority = priority;
      
      const messages = await Message.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'Sender',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          },
          {
            model: User,
            as: 'Recipient',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          },
          {
            model: Property,
            attributes: ['id', 'name']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });
      
      // Get message statistics
      const inboxCount = await Message.count({
        where: {
          recipientId: req.user.id,
          isRead: false,
          companyId: req.user.companyId
        }
      });
      
      const sentCount = await Message.count({
        where: {
          senderId: req.user.id,
          companyId: req.user.companyId
        }
      });
      
      res.json({
        success: true,
        data: {
          messages: messages.rows,
          statistics: {
            inbox: inboxCount,
            sent: sentCount,
            unread: inboxCount
          },
          pagination: {
            total: messages.count,
            page: parseInt(page),
            pages: Math.ceil(messages.count / limit),
            limit: parseInt(limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update message status
  updateMessageStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { isRead, isArchived, isStarred } = req.body;
      
      const message = await Message.findByPk(id);
      
      if (!message) {
        return res.status(404).json({ success: false, message: 'Message not found' });
      }
      
      // Check permissions
      const canUpdate = (
        message.senderId === req.user.id ||
        message.recipientId === req.user.id ||
        req.user.role === 'system_admin'
      );
      
      if (!canUpdate) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this message'
        });
      }
      
      const updates = {};
      if (isRead !== undefined) {
        updates.isRead = isRead;
        if (isRead) {
          updates.readAt = new Date();
        }
      }
      if (isArchived !== undefined) updates.isArchived = isArchived;
      if (isStarred !== undefined) updates.isStarred = isStarred;
      
      await message.update(updates);
      
      res.json({
        success: true,
        message: 'Message status updated successfully',
        data: message
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Delete message
  deleteMessage: async (req, res) => {
    try {
      const { id } = req.params;
      const { permanent } = req.query;
      
      const message = await Message.findByPk(id);
      
      if (!message) {
        return res.status(404).json({ success: false, message: 'Message not found' });
      }
      
      // Check permissions
      const canDelete = (
        message.senderId === req.user.id ||
        message.recipientId === req.user.id ||
        req.user.role === 'system_admin'
      );
      
      if (!canDelete) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this message'
        });
      }
      
      if (permanent === 'true') {
        // Permanent delete
        await message.destroy();
      } else {
        // Soft delete (mark as deleted for user)
        const deletedBy = message.senderId === req.user.id ? 'sender' : 'recipient';
        await message.update({
          [`deletedBy${deletedBy.charAt(0).toUpperCase() + deletedBy.slice(1)}`]: true,
          deletedAt: new Date()
        });
      }
      
      res.json({
        success: true,
        message: `Message ${permanent === 'true' ? 'permanently deleted' : 'moved to trash'} successfully`
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get message templates
  getMessageTemplates: async (req, res) => {
    try {
      const { type } = req.query;
      
      const where = { 
        companyId: req.user.companyId,
        isActive: true 
      };
      
      if (type) where.type = type;
      
      // This would query from MessageTemplate model
      // For now, return predefined templates
      const templates = [
        {
          id: 'welcome_tenant',
          name: 'Welcome New Tenant',
          type: 'tenant',
          subject: 'Welcome to {{propertyName}}!',
          body: 'Dear {{tenantName}},\n\nWelcome to {{propertyName}}! We\'re excited to have you as our tenant.\n\nYour unit {{unitNumber}} is ready for move-in. Please find attached your lease agreement and move-in checklist.\n\nBest regards,\n{{companyName}} Team',
          variables: ['tenantName', 'propertyName', 'unitNumber', 'companyName']
        },
        {
          id: 'rent_reminder',
          name: 'Rent Payment Reminder',
          type: 'payment',
          subject: 'Rent Due Reminder - {{propertyName}}',
          body: 'Dear {{tenantName}},\n\nThis is a friendly reminder that your rent payment of {{amount}} for {{month}} is due on {{dueDate}}.\n\nYou can make your payment through the tenant portal.\n\nThank you,\n{{companyName}}',
          variables: ['tenantName', 'propertyName', 'amount', 'month', 'dueDate', 'companyName']
        },
        {
          id: 'maintenance_update',
          name: 'Maintenance Update',
          type: 'maintenance',
          subject: 'Update on Maintenance Request #{{requestNumber}}',
          body: 'Dear {{tenantName}},\n\nWe wanted to provide an update on your maintenance request #{{requestNumber}}.\n\nStatus: {{status}}\nUpdate: {{update}}\n\nOur team will contact you if we need access to your unit.\n\nThank you for your patience,\n{{companyName}}',
          variables: ['tenantName', 'requestNumber', 'status', 'update', 'companyName']
        }
      ];
      
      res.json({
        success: true,
        data: templates
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get message statistics
  getMessageStatistics: async (req, res) => {
    try {
      const { startDate, endDate, type } = req.query;
      
      const where = { companyId: req.user.companyId };
      if (type) where.type = type;
      
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = new Date(startDate);
        if (endDate) where.createdAt[Op.lte] = new Date(endDate);
      }
      
      // Total messages
      const totalMessages = await Message.count({ where });
      
      // By type
      const byType = await Message.findAll({
        attributes: [
          'type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['type']
      });
      
      // By priority
      const byPriority = await Message.findAll({
        attributes: [
          'priority',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['priority']
      });
      
      // Read rate
      const readCount = await Message.count({
        where: {
          ...where,
          isRead: true
        }
      });
      
      const readRate = totalMessages > 0 ? (readCount / totalMessages) * 100 : 0;
      
      // Response rate (messages with replies)
      const repliedCount = await Message.count({
        where: {
          ...where,
          hasReplies: true
        }
      });
      
      const responseRate = totalMessages > 0 ? (repliedCount / totalMessages) * 100 : 0;
      
      // Average response time
      const messagesWithReplies = await Message.findAll({
        where: {
          ...where,
          hasReplies: true,
          lastRepliedAt: { [Op.not]: null },
          createdAt: { [Op.not]: null }
        },
        attributes: ['id', 'createdAt', 'lastRepliedAt']
      });
      
      let totalResponseTime = 0;
      messagesWithReplies.forEach(message => {
        if (message.lastRepliedAt && message.createdAt) {
          const responseTime = new Date(message.lastRepliedAt) - new Date(message.createdAt);
          totalResponseTime += responseTime;
        }
      });
      
      const avgResponseTime = messagesWithReplies.length > 0 ? 
        totalResponseTime / messagesWithReplies.length : 0;
      
      // Monthly trend
      const monthlyTrend = await Message.findAll({
        where,
        attributes: [
          [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.literal('CASE WHEN is_read = true THEN 1 ELSE 0 END')), 'read']
        ],
        group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
        order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'ASC']],
        limit: 12
      });
      
      res.json({
        success: true,
        data: {
          totalMessages,
          byType: byType.map(item => ({
            type: item.type,
            count: parseInt(item.dataValues.count)
          })),
          byPriority: byPriority.map(item => ({
            priority: item.priority,
            count: parseInt(item.dataValues.count)
          })),
          readRate: parseFloat(readRate.toFixed(2)),
          responseRate: parseFloat(responseRate.toFixed(2)),
          avgResponseTime: parseFloat((avgResponseTime / (1000 * 60 * 60)).toFixed(1)), // Hours
          monthlyTrend: monthlyTrend.map(item => ({
            month: item.dataValues.month,
            total: parseInt(item.dataValues.count),
            read: parseInt(item.dataValues.read || 0),
            readRate: parseInt(item.dataValues.count) > 0 ? 
              (parseInt(item.dataValues.read || 0) / parseInt(item.dataValues.count)) * 100 : 0
          }))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Helper functions
function applyMergeFields(text, recipient, mergeFields) {
  if (!text || !recipient) return text;
  
  let result = text;
  const fields = {
    '{{firstName}}': recipient.firstName || '',
    '{{lastName}}': recipient.lastName || '',
    '{{fullName}}': `${recipient.firstName} ${recipient.lastName}`,
    '{{email}}': recipient.email || '',
    '{{phone}}': recipient.phone || ''
  };
  
  // Add custom merge fields
  if (mergeFields && typeof mergeFields === 'object') {
    Object.assign(fields, mergeFields);
  }
  
  // Replace all placeholders
  Object.keys(fields).forEach(key => {
    const regex = new RegExp(key, 'g');
    result = result.replace(regex, fields[key]);
  });
  
  return result;
}

function getThreadParticipants(messages, currentUserId) {
  const participants = new Set();
  
  messages.forEach(message => {
    if (message.senderId && message.senderId !== currentUserId) {
      participants.add(message.senderId);
    }
    if (message.recipientId && message.recipientId !== currentUserId) {
      participants.add(message.recipientId);
    }
  });
  
  return Array.from(participants);
}

module.exports = messageController;