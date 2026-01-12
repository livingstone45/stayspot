const { Task, User, Property, Unit, Tenant, Assignment, Document } = require('../../models');
const { Op } = require('sequelize');
const { sendEmail } = require('../../services/communication/email.service');
const { createNotification } = require('../../services/communication/notification.service');
const { assignTaskAutomatically } = require('../../services/workflow/assignment.service');

const taskController = {
  // Get all tasks
  getAllTasks: async (req, res) => {
    try {
      const { 
        assignedToId, 
        createdById,
        propertyId, 
        unitId,
        tenantId,
        status, 
        priority,
        type,
        category,
        dueDateFrom,
        dueDateTo,
        search,
        page = 1, 
        limit = 20 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = { companyId: req.user.companyId };
      if (assignedToId) where.assignedToId = assignedToId;
      if (createdById) where.createdById = createdById;
      if (propertyId) where.propertyId = propertyId;
      if (unitId) where.unitId = unitId;
      if (tenantId) where.tenantId = tenantId;
      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (type) where.type = type;
      if (category) where.category = category;
      
      if (dueDateFrom || dueDateTo) {
        where.dueDate = {};
        if (dueDateFrom) where.dueDate[Op.gte] = new Date(dueDateFrom);
        if (dueDateTo) where.dueDate[Op.lte] = new Date(dueDateTo);
      }
      
      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { '$Property.name$': { [Op.like]: `%${search}%` } },
          { '$AssignedTo.firstName$': { [Op.like]: `%${search}%` } },
          { '$AssignedTo.lastName$': { [Op.like]: `%${search}%` } }
        ];
      }
      
      const tasks = await Task.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'AssignedTo',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: Property,
            attributes: ['id', 'name', 'address']
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
        order: [
          ['priority', 'DESC'],
          ['dueDate', 'ASC']
        ]
      });
      
      res.json({
        success: true,
        data: tasks.rows,
        pagination: {
          total: tasks.count,
          page: parseInt(page),
          pages: Math.ceil(tasks.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get task by ID
  getTaskById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const task = await Task.findByPk(id, {
        include: [
          {
            model: User,
            as: 'AssignedTo',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: User,
            as: 'CompletedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Property,
            include: ['address']
          },
          {
            model: Unit,
            attributes: ['id', 'unitNumber', 'type']
          },
          {
            model: Tenant,
            include: [{
              model: User,
              attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
            }]
          },
          {
            model: Assignment,
            include: [{
              model: User,
              attributes: ['id', 'firstName', 'lastName']
            }]
          },
          {
            model: Document,
            where: { entityType: 'Task', entityId: id },
            required: false
          }
        ]
      });
      
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      
      // Check if task belongs to user's company
      if (task.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this task'
        });
      }
      
      res.json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Create task
  createTask: async (req, res) => {
    try {
      const {
        title,
        description,
        assignedToId,
        propertyId,
        unitId,
        tenantId,
        priority,
        type,
        category,
        dueDate,
        estimatedHours,
        dependencies,
        checklist,
        attachments
      } = req.body;
      
      const files = req.files || [];
      
      // Validate assigned user if provided
      if (assignedToId) {
        const assignedUser = await User.findByPk(assignedToId);
        if (!assignedUser) {
          return res.status(404).json({ success: false, message: 'Assigned user not found' });
        }
        
        // Check if user belongs to same company
        if (assignedUser.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
          return res.status(403).json({
            success: false,
            message: 'Cannot assign task to user from different company'
          });
        }
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
      if (tenantId) {
        const tenant = await Tenant.findByPk(tenantId);
        if (!tenant) {
          return res.status(404).json({ success: false, message: 'Tenant not found' });
        }
      }
      
      // Generate task number
      const taskCount = await Task.count();
      const taskNumber = `TASK-${new Date().getFullYear()}-${String(taskCount + 1).padStart(6, '0')}`;
      
      // Auto-assign if not specified
      let finalAssignedToId = assignedToId;
      if (!assignedToId) {
        const autoAssignment = await assignTaskAutomatically({
          type: type || 'general',
          category: category || 'maintenance',
          priority: priority || 'medium',
          propertyId,
          estimatedHours
        });
        
        if (autoAssignment.assignedTo) {
          finalAssignedToId = autoAssignment.assignedTo;
        }
      }
      
      // Create task
      const task = await Task.create({
        taskNumber,
        title,
        description: description || '',
        assignedToId: finalAssignedToId,
        propertyId,
        unitId,
        tenantId,
        priority: priority || 'medium',
        type: type || 'general', // maintenance, inspection, administrative, financial, other
        category: category || 'general',
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours: parseFloat(estimatedHours) || 0,
        dependencies: dependencies || [],
        checklist: checklist || [],
        status: finalAssignedToId ? 'assigned' : 'pending',
        createdById: req.user.id,
        companyId: req.user.companyId,
        portfolioId: property?.portfolioId || null
      });
      
      // Handle file uploads
      const uploadedDocuments = [];
      for (const file of files) {
        const document = await Document.create({
          type: 'task_attachment',
          name: file.originalname,
          url: file.path,
          mimeType: file.mimetype,
          size: file.size,
          entityType: 'Task',
          entityId: task.id,
          uploadedById: req.user.id,
          category: file.fieldname || 'attachment'
        });
        
        uploadedDocuments.push(document);
      }
      
      // Handle attachment metadata
      if (attachments && Array.isArray(attachments)) {
        for (const attachmentData of attachments) {
          const document = await Document.create({
            type: attachmentData.type || 'task_attachment',
            name: attachmentData.name,
            url: attachmentData.url,
            mimeType: attachmentData.mimeType,
            size: attachmentData.size,
            entityType: 'Task',
            entityId: task.id,
            uploadedById: req.user.id,
            category: attachmentData.category,
            metadata: attachmentData.metadata
          });
          
          uploadedDocuments.push(document);
        }
      }
      
      // Create assignment record if assigned
      if (finalAssignedToId) {
        await Assignment.create({
          taskId: task.id,
          assignedToId: finalAssignedToId,
          assignedById: req.user.id,
          assignedAt: new Date(),
          status: 'assigned'
        });
        
        // Send notification to assigned user
        const assignedUser = await User.findByPk(finalAssignedToId);
        if (assignedUser) {
          await sendEmail({
            to: assignedUser.email,
            subject: `New Task Assigned: ${taskNumber}`,
            template: 'task-assigned',
            data: {
              firstName: assignedUser.firstName,
              taskNumber,
              title,
              priority: task.priority,
              dueDate: task.dueDate ? task.dueDate.toLocaleDateString() : 'No due date',
              createdBy: `${req.user.firstName} ${req.user.lastName}`
            }
          });
        }
      }
      
      // Create notification
      await createNotification({
        userId: req.user.id,
        type: 'task_created',
        title: 'New Task Created',
        message: `Task ${taskNumber}: ${title}`,
        data: { taskId: task.id, priority: task.priority },
        recipients: ['property_managers', 'task_assignees']
      });
      
      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: {
          task,
          documents: uploadedDocuments
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update task
  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const task = await Task.findByPk(id);
      
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      
      // Check if task belongs to user's company
      if (task.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this task'
        });
      }
      
      // Handle status transitions
      if (updates.status && updates.status !== task.status) {
        const validTransitions = {
          pending: ['assigned', 'cancelled'],
          assigned: ['in_progress', 'cancelled'],
          in_progress: ['completed', 'cancelled'],
          completed: [], // No transitions from completed
          cancelled: [] // No transitions from cancelled
        };
        
        const allowedTransitions = validTransitions[task.status] || [];
        if (!allowedTransitions.includes(updates.status)) {
          return res.status(400).json({
            success: false,
            message: `Cannot transition from ${task.status} to ${updates.status}`
          });
        }
        
        // Set timestamps for status changes
        if (updates.status === 'assigned' && updates.assignedToId) {
          updates.assignedAt = new Date();
        } else if (updates.status === 'in_progress') {
          updates.startedAt = new Date();
        } else if (updates.status === 'completed') {
          updates.completedAt = new Date();
          updates.completedById = req.user.id;
        } else if (updates.status === 'cancelled') {
          updates.cancelledAt = new Date();
          updates.cancelledById = req.user.id;
        }
      }
      
      // Handle assignment changes
      if (updates.assignedToId && updates.assignedToId !== task.assignedToId) {
        const newAssignee = await User.findByPk(updates.assignedToId);
        if (!newAssignee) {
          return res.status(404).json({ success: false, message: 'New assignee not found' });
        }
        
        // Create new assignment record
        await Assignment.create({
          taskId: task.id,
          assignedToId: updates.assignedToId,
          assignedById: req.user.id,
          assignedAt: new Date(),
          status: 'reassigned',
          previousAssigneeId: task.assignedToId
        });
        
        // Send notification to new assignee
        await sendEmail({
          to: newAssignee.email,
          subject: `Task Reassigned: ${task.taskNumber}`,
          template: 'task-reassigned',
          data: {
            firstName: newAssignee.firstName,
            taskNumber: task.taskNumber,
            title: task.title,
            previousAssignee: task.assignedToId ? 
              (await User.findByPk(task.assignedToId))?.firstName : 'Unassigned',
            reassignedBy: `${req.user.firstName} ${req.user.lastName}`
          }
        });
      }
      
      // Update task
      await task.update(updates);
      
      res.json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update task status
  updateTaskStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes, completionNotes } = req.body;
      
      const task = await Task.findByPk(id, {
        include: [
          { model: User, as: 'AssignedTo' },
          { model: User, as: 'CreatedBy' }
        ]
      });
      
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      
      // Check if task belongs to user's company
      if (task.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this task'
        });
      }
      
      const validStatuses = ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
      
      const oldStatus = task.status;
      
      // Validate status transition
      const validTransitions = {
        pending: ['assigned', 'cancelled'],
        assigned: ['in_progress', 'cancelled'],
        in_progress: ['completed', 'cancelled'],
        completed: [],
        cancelled: []
      };
      
      const allowedTransitions = validTransitions[task.status] || [];
      if (!allowedTransitions.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot transition from ${task.status} to ${status}`
        });
      }
      
      const updateData = {
        status,
        statusNotes: notes
      };
      
      // Set timestamps based on status
      if (status === 'assigned') {
        updateData.assignedAt = new Date();
      } else if (status === 'in_progress') {
        updateData.startedAt = new Date();
      } else if (status === 'completed') {
        updateData.completedAt = new Date();
        updateData.completedById = req.user.id;
        updateData.completionNotes = completionNotes;
      } else if (status === 'cancelled') {
        updateData.cancelledAt = new Date();
        updateData.cancelledById = req.user.id;
      }
      
      // Update task
      await task.update(updateData);
      
      // Update assignment record
      if (task.assignedToId) {
        await Assignment.update(
          { status: status === 'completed' ? 'completed' : 'active' },
          {
            where: {
              taskId: task.id,
              assignedToId: task.assignedToId,
              status: 'active'
            }
          }
        );
      }
      
      // Send notifications
      if (status === 'completed') {
        // Notify task creator
        if (task.CreatedBy && task.CreatedBy.id !== req.user.id) {
          await sendEmail({
            to: task.CreatedBy.email,
            subject: `Task Completed: ${task.taskNumber}`,
            template: 'task-completed-creator',
            data: {
              firstName: task.CreatedBy.firstName,
              taskNumber: task.taskNumber,
              title: task.title,
              completedBy: task.AssignedTo ? 
                `${task.AssignedTo.firstName} ${task.AssignedTo.lastName}` : 
                `${req.user.firstName} ${req.user.lastName}`,
              completionNotes: completionNotes
            }
          });
        }
      } else if (status === 'in_progress') {
        // Notify task creator that work has started
        if (task.CreatedBy && task.CreatedBy.id !== req.user.id) {
          await sendEmail({
            to: task.CreatedBy.email,
            subject: `Task In Progress: ${task.taskNumber}`,
            template: 'task-in-progress',
            data: {
              firstName: task.CreatedBy.firstName,
              taskNumber: task.taskNumber,
              title: task.title,
              startedBy: task.AssignedTo ? 
                `${task.AssignedTo.firstName} ${task.AssignedTo.lastName}` : 
                `${req.user.firstName} ${req.user.lastName}`
            }
          });
        }
      }
      
      res.json({
        success: true,
        message: `Task status updated from ${oldStatus} to ${status}`,
        data: task
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Add task comment/update
  addTaskComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { comment, isInternal } = req.body;
      const files = req.files || [];
      
      const task = await Task.findByPk(id, {
        include: [
          { model: User, as: 'AssignedTo' },
          { model: User, as: 'CreatedBy' }
        ]
      });
      
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      
      // Check if task belongs to user's company
      if (task.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this task'
        });
      }
      
      // Create comment entry
      const comments = task.comments || [];
      const newComment = {
        id: Date.now(),
        userId: req.user.id,
        userName: `${req.user.firstName} ${req.user.lastName}`,
        comment,
        timestamp: new Date(),
        isInternal: isInternal || false,
        attachments: []
      };
      
      // Handle file uploads
      if (files.length > 0) {
        newComment.attachments = files.map(file => ({
          name: file.originalname,
          url: file.path,
          uploadedAt: new Date()
        }));
      }
      
      comments.push(newComment);
      
      // Update task
      await task.update({
        comments,
        lastUpdatedAt: new Date(),
        lastUpdatedById: req.user.id
      });
      
      // Send notification to other involved users if not internal
      if (!isInternal) {
        const recipients = new Set();
        
        // Add task creator
        if (task.createdById !== req.user.id) {
          recipients.add(task.createdById);
        }
        
        // Add assigned user
        if (task.assignedToId && task.assignedToId !== req.user.id) {
          recipients.add(task.assignedToId);
        }
        
        // Send notifications
        for (const userId of recipients) {
          const user = await User.findByPk(userId);
          if (user) {
            await sendEmail({
              to: user.email,
              subject: `Update on Task ${task.taskNumber}`,
              template: 'task-update',
              data: {
                firstName: user.firstName,
                taskNumber: task.taskNumber,
                title: task.title,
                commenter: `${req.user.firstName} ${req.user.lastName}`,
                comment: comment,
                taskStatus: task.status
              }
            });
          }
        }
      }
      
      res.json({
        success: true,
        message: 'Comment added successfully',
        data: newComment
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update checklist item
  updateChecklistItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { itemId, completed, notes } = req.body;
      
      const task = await Task.findByPk(id);
      
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      
      // Check if task belongs to user's company
      if (task.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this task'
        });
      }
      
      const checklist = task.checklist || [];
      const itemIndex = checklist.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: 'Checklist item not found' });
      }
      
      // Update checklist item
      checklist[itemIndex] = {
        ...checklist[itemIndex],
        completed: completed !== undefined ? completed : checklist[itemIndex].completed,
        completedBy: completed ? req.user.id : null,
        completedAt: completed ? new Date() : null,
        notes: notes || checklist[itemIndex].notes
      };
      
      // Check if all items are completed
      const allCompleted = checklist.every(item => item.completed);
      if (allCompleted && task.status !== 'completed') {
        // Auto-complete the task if all checklist items are done
        await task.update({
          checklist,
          status: 'completed',
          completedAt: new Date(),
          completedById: req.user.id
        });
      } else {
        // Just update the checklist
        await task.update({ checklist });
      }
      
      res.json({
        success: true,
        message: 'Checklist item updated successfully',
        data: checklist[itemIndex]
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get task statistics
  getTaskStatistics: async (req, res) => {
    try {
      const { assignedToId, propertyId, timeframe = '30d' } = req.query;
      
      const where = { companyId: req.user.companyId };
      if (assignedToId) where.assignedToId = assignedToId;
      if (propertyId) where.propertyId = propertyId;
      
      // Calculate date range
      const now = new Date();
      let startDate;
      
      switch (timeframe) {
        case '7d':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case '30d':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case '90d':
          startDate = new Date(now.setDate(now.getDate() - 90));
          break;
        case '1y':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 30));
      }
      
      where.createdAt = { [Op.gte]: startDate };
      
      const totalTasks = await Task.count({ where });
      
      const byStatus = await Task.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where,
        group: ['status']
      });
      
      const byPriority = await Task.findAll({
        attributes: ['priority', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where,
        group: ['priority']
      });
      
      const byType = await Task.findAll({
        attributes: ['type', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where,
        group: ['type'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10
      });
      
      // Calculate completion rate
      const completedCount = byStatus.find(s => s.status === 'completed')?.dataValues.count || 0;
      const completionRate = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
      
      // Calculate average completion time
      const completedTasks = await Task.findAll({
        where: {
          ...where,
          status: 'completed',
          completedAt: { [Op.not]: null },
          createdAt: { [Op.not]: null }
        },
        attributes: ['id', 'createdAt', 'completedAt']
      });
      
      let totalCompletionTime = 0;
      completedTasks.forEach(task => {
        if (task.completedAt && task.createdAt) {
          const completionTime = new Date(task.completedAt) - new Date(task.createdAt);
          totalCompletionTime += completionTime;
        }
      });
      
      const avgCompletionTime = completedTasks.length > 0 
        ? totalCompletionTime / completedTasks.length 
        : 0;
      
      // Overdue tasks
      const overdueTasks = await Task.count({
        where: {
          ...where,
          status: { [Op.in]: ['assigned', 'in_progress'] },
          dueDate: { [Op.lt]: new Date() }
        }
      });
      
      // Tasks due today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const dueToday = await Task.count({
        where: {
          ...where,
          status: { [Op.in]: ['pending', 'assigned'] },
          dueDate: { [Op.between]: [today, tomorrow] }
        }
      });
      
      res.json({
        success: true,
        data: {
          totalTasks,
          byStatus: byStatus.reduce((acc, item) => {
            acc[item.status] = parseInt(item.dataValues.count);
            return acc;
          }, {}),
          byPriority: byPriority.reduce((acc, item) => {
            acc[item.priority] = parseInt(item.dataValues.count);
            return acc;
          }, {}),
          byType: byType.map(item => ({
            type: item.type,
            count: parseInt(item.dataValues.count)
          })),
          completionRate: parseFloat(completionRate.toFixed(2)),
          avgCompletionTime: parseFloat((avgCompletionTime / (1000 * 60 * 60 * 24)).toFixed(1)), // Days
          overdueTasks,
          dueToday
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get user's tasks
  getUserTasks: async (req, res) => {
    try {
      const { userId, status, priority } = req.query;
      
      const targetUserId = userId || req.user.id;
      
      const where = {
        assignedToId: targetUserId,
        companyId: req.user.companyId
      };
      
      if (status) where.status = status;
      if (priority) where.priority = priority;
      
      const tasks = await Task.findAll({
        where,
        include: [
          {
            model: Property,
            attributes: ['id', 'name', 'address']
          },
          {
            model: Unit,
            attributes: ['id', 'unitNumber']
          },
          {
            model: User,
            as: 'CreatedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        order: [
          ['priority', 'DESC'],
          ['dueDate', 'ASC'],
          ['createdAt', 'DESC']
        ],
        limit: 100
      });
      
      // Calculate statistics for the user
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
      const overdueTasks = tasks.filter(t => 
        t.dueDate && 
        new Date(t.dueDate) < new Date() && 
        ['pending', 'assigned', 'in_progress'].includes(t.status)
      ).length;
      
      res.json({
        success: true,
        data: {
          tasks,
          statistics: {
            totalTasks,
            completedTasks,
            inProgressTasks,
            overdueTasks,
            completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Bulk update tasks
  bulkUpdateTasks: async (req, res) => {
    try {
      const { taskIds, updates } = req.body;
      
      if (!Array.isArray(taskIds) || taskIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Task IDs are required'
        });
      }
      
      const results = {
        updated: [],
        failed: []
      };
      
      for (const taskId of taskIds) {
        try {
          const task = await Task.findByPk(taskId);
          
          if (!task) {
            results.failed.push({
              taskId,
              error: 'Task not found'
            });
            continue;
          }
          
          // Check if task belongs to user's company
          if (task.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
            results.failed.push({
              taskId,
              error: 'Permission denied'
            });
            continue;
          }
          
          // Update task
          await task.update(updates);
          
          results.updated.push({
            taskId,
            taskNumber: task.taskNumber,
            title: task.title
          });
          
        } catch (error) {
          results.failed.push({
            taskId,
            error: error.message
          });
        }
      }
      
      res.json({
        success: true,
        message: `Updated ${results.updated.length} tasks successfully, ${results.failed.length} failed`,
        data: results
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = taskController;