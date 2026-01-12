const { Assignment, Task, User, Property } = require('../../models');
const { Op } = require('sequelize');
const { sendEmail } = require('../../services/communication/email.service');
const { createNotification } = require('../../services/communication/notification.service');

const assignmentController = {
  // Get all assignments
  getAllAssignments: async (req, res) => {
    try {
      const { 
        assignedToId, 
        assignedById,
        taskId,
        status, 
        fromDate,
        toDate,
        search,
        page = 1, 
        limit = 20 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = { companyId: req.user.companyId };
      if (assignedToId) where.assignedToId = assignedToId;
      if (assignedById) where.assignedById = assignedById;
      if (taskId) where.taskId = taskId;
      if (status) where.status = status;
      
      if (fromDate || toDate) {
        where.assignedAt = {};
        if (fromDate) where.assignedAt[Op.gte] = new Date(fromDate);
        if (toDate) where.assignedAt[Op.lte] = new Date(toDate);
      }
      
      if (search) {
        where[Op.or] = [
          { '$Task.title$': { [Op.like]: `%${search}%` } },
          { '$Task.taskNumber$': { [Op.like]: `%${search}%` } },
          { '$AssignedTo.firstName$': { [Op.like]: `%${search}%` } },
          { '$AssignedTo.lastName$': { [Op.like]: `%${search}%` } }
        ];
      }
      
      const assignments = await Assignment.findAndCountAll({
        where,
        include: [
          {
            model: Task,
            attributes: ['id', 'taskNumber', 'title', 'status', 'priority', 'dueDate'],
            include: [{
              model: Property,
              attributes: ['id', 'name']
            }]
          },
          {
            model: User,
            as: 'AssignedTo',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: User,
            as: 'AssignedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['assignedAt', 'DESC']]
      });
      
      res.json({
        success: true,
        data: assignments.rows,
        pagination: {
          total: assignments.count,
          page: parseInt(page),
          pages: Math.ceil(assignments.count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get assignment by ID
  getAssignmentById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const assignment = await Assignment.findByPk(id, {
        include: [
          {
            model: Task,
            include: [
              { model: Property },
              { model: Unit },
              { model: Tenant }
            ]
          },
          {
            model: User,
            as: 'AssignedTo',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: User,
            as: 'AssignedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: User,
            as: 'PreviousAssignee',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });
      
      if (!assignment) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }
      
      // Check if assignment belongs to user's company
      if (assignment.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this assignment'
        });
      }
      
      res.json({ success: true, data: assignment });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Create assignment
  createAssignment: async (req, res) => {
    try {
      const {
        taskId,
        assignedToId,
        notes,
        priority,
        dueDate
      } = req.body;
      
      // Validate task
      const task = await Task.findByPk(taskId);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      
      // Check if task belongs to user's company
      if (task.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to assign this task'
        });
      }
      
      // Validate assigned user
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
      
      // Check for existing active assignment
      const existingAssignment = await Assignment.findOne({
        where: {
          taskId,
          assignedToId,
          status: 'active'
        }
      });
      
      if (existingAssignment) {
        return res.status(400).json({
          success: false,
          message: 'Active assignment already exists for this task and user'
        });
      }
      
      // Create assignment
      const assignment = await Assignment.create({
        taskId,
        assignedToId,
        assignedById: req.user.id,
        assignedAt: new Date(),
        notes: notes || '',
        priority: priority || task.priority,
        dueDate: dueDate ? new Date(dueDate) : task.dueDate,
        status: 'active',
        companyId: task.companyId,
        portfolioId: task.portfolioId
      });
      
      // Update task
      await task.update({
        assignedToId,
        assignedAt: new Date(),
        priority: priority || task.priority,
        dueDate: dueDate ? new Date(dueDate) : task.dueDate,
        status: 'assigned'
      });
      
      // Send assignment notification
      await sendEmail({
        to: assignedUser.email,
        subject: `New Task Assignment: ${task.taskNumber}`,
        template: 'task-assigned',
        data: {
          firstName: assignedUser.firstName,
          taskNumber: task.taskNumber,
          title: task.title,
          priority: priority || task.priority,
          dueDate: dueDate ? new Date(dueDate).toLocaleDateString() : 
            (task.dueDate ? task.dueDate.toLocaleDateString() : 'No due date'),
          assignedBy: `${req.user.firstName} ${req.user.lastName}`,
          notes: notes || ''
        }
      });
      
      // Create notification
      await createNotification({
        userId: req.user.id,
        type: 'task_assigned',
        title: 'Task Assigned',
        message: `Task ${task.taskNumber} assigned to ${assignedUser.firstName} ${assignedUser.lastName}`,
        data: { taskId: task.id, assignedToId },
        recipients: ['property_managers']
      });
      
      res.status(201).json({
        success: true,
        message: 'Assignment created successfully',
        data: assignment
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update assignment
  updateAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const assignment = await Assignment.findByPk(id, {
        include: [{ model: Task }]
      });
      
      if (!assignment) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }
      
      // Check if assignment belongs to user's company
      if (assignment.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this assignment'
        });
      }
      
      // Handle status changes
      if (updates.status && updates.status !== assignment.status) {
        const validStatuses = ['active', 'completed', 'cancelled', 'reassigned'];
        if (!validStatuses.includes(updates.status)) {
          return res.status(400).json({
            success: false,
            message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
          });
        }
        
        if (updates.status === 'completed') {
          updates.completedAt = new Date();
          
          // Update task status if this is the active assignment
          if (assignment.Task && assignment.Task.assignedToId === assignment.assignedToId) {
            await assignment.Task.update({
              status: 'completed',
              completedAt: new Date(),
              completedById: req.user.id
            });
          }
        } else if (updates.status === 'cancelled') {
          updates.cancelledAt = new Date();
          updates.cancelledById = req.user.id;
        }
      }
      
      // Update assignment
      await assignment.update(updates);
      
      res.json({
        success: true,
        message: 'Assignment updated successfully',
        data: assignment
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Reassign task
  reassignTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { newAssigneeId, reason, notes } = req.body;
      
      const assignment = await Assignment.findByPk(id, {
        include: [
          { model: Task },
          { model: User, as: 'AssignedTo' }
        ]
      });
      
      if (!assignment) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }
      
      // Check if assignment belongs to user's company
      if (assignment.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to reassign this task'
        });
      }
      
      // Validate new assignee
      const newAssignee = await User.findByPk(newAssigneeId);
      if (!newAssignee) {
        return res.status(404).json({ success: false, message: 'New assignee not found' });
      }
      
      // Check if user belongs to same company
      if (newAssignee.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'Cannot reassign task to user from different company'
        });
      }
      
      // Mark current assignment as reassigned
      await assignment.update({
        status: 'reassigned',
        reassignedAt: new Date(),
        reassignedById: req.user.id,
        reassignmentReason: reason,
        reassignmentNotes: notes
      });
      
      // Create new assignment
      const newAssignment = await Assignment.create({
        taskId: assignment.taskId,
        assignedToId: newAssigneeId,
        assignedById: req.user.id,
        assignedAt: new Date(),
        notes: notes || '',
        priority: assignment.priority,
        dueDate: assignment.dueDate,
        status: 'active',
        previousAssignmentId: assignment.id,
        companyId: assignment.companyId,
        portfolioId: assignment.portfolioId
      });
      
      // Update task
      await assignment.Task.update({
        assignedToId: newAssigneeId,
        assignedAt: new Date(),
        status: 'assigned'
      });
      
      // Send notification to new assignee
      await sendEmail({
        to: newAssignee.email,
        subject: `Task Reassigned to You: ${assignment.Task.taskNumber}`,
        template: 'task-reassigned-new',
        data: {
          firstName: newAssignee.firstName,
          taskNumber: assignment.Task.taskNumber,
          title: assignment.Task.title,
          previousAssignee: `${assignment.AssignedTo.firstName} ${assignment.AssignedTo.lastName}`,
          reassignedBy: `${req.user.firstName} ${req.user.lastName}`,
          reason: reason,
          notes: notes,
          priority: assignment.priority,
          dueDate: assignment.dueDate ? assignment.dueDate.toLocaleDateString() : 'No due date'
        }
      });
      
      // Send notification to previous assignee
      await sendEmail({
        to: assignment.AssignedTo.email,
        subject: `Task Reassigned: ${assignment.Task.taskNumber}`,
        template: 'task-reassigned-previous',
        data: {
          firstName: assignment.AssignedTo.firstName,
          taskNumber: assignment.Task.taskNumber,
          title: assignment.Task.title,
          newAssignee: `${newAssignee.firstName} ${newAssignee.lastName}`,
          reassignedBy: `${req.user.firstName} ${req.user.lastName}`,
          reason: reason
        }
      });
      
      res.json({
        success: true,
        message: 'Task reassigned successfully',
        data: {
          previousAssignment: assignment,
          newAssignment: newAssignment
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get user assignments
  getUserAssignments: async (req, res) => {
    try {
      const { userId, status, includeCompleted } = req.query;
      
      const targetUserId = userId || req.user.id;
      
      const where = {
        assignedToId: targetUserId,
        companyId: req.user.companyId
      };
      
      if (status) {
        where.status = status;
      } else if (!includeCompleted) {
        where.status = { [Op.ne]: 'completed' };
      }
      
      const assignments = await Assignment.findAll({
        where,
        include: [
          {
            model: Task,
            include: [
              { model: Property, attributes: ['id', 'name', 'address'] },
              { model: Unit, attributes: ['id', 'unitNumber'] }
            ]
          },
          {
            model: User,
            as: 'AssignedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        order: [
          ['priority', 'DESC'],
          ['dueDate', 'ASC'],
          ['assignedAt', 'DESC']
        ],
        limit: 100
      });
      
      // Calculate statistics
      const totalAssignments = assignments.length;
      const activeAssignments = assignments.filter(a => a.status === 'active').length;
      const completedAssignments = assignments.filter(a => a.status === 'completed').length;
      const overdueAssignments = assignments.filter(a => 
        a.dueDate && 
        new Date(a.dueDate) < new Date() && 
        ['active'].includes(a.status)
      ).length;
      
      res.json({
        success: true,
        data: {
          assignments,
          statistics: {
            totalAssignments,
            activeAssignments,
            completedAssignments,
            overdueAssignments,
            completionRate: totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get assignment statistics
  getAssignmentStatistics: async (req, res) => {
    try {
      const { startDate, endDate, assignedToId } = req.query;
      
      const where = { companyId: req.user.companyId };
      if (assignedToId) where.assignedToId = assignedToId;
      if (startDate || endDate) {
        where.assignedAt = {};
        if (startDate) where.assignedAt[Op.gte] = new Date(startDate);
        if (endDate) where.assignedAt[Op.lte] = new Date(endDate);
      }
      
      // Total assignments
      const totalAssignments = await Assignment.count({ where });
      
      // By status
      const byStatus = await Assignment.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where,
        group: ['status']
      });
      
      // By user (top assignees)
      const byUser = await Assignment.findAll({
        attributes: [
          'assignedToId',
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalAssignments'],
          [sequelize.fn('SUM', sequelize.literal('CASE WHEN status = "completed" THEN 1 ELSE 0 END')), 'completed']
        ],
        where,
        group: ['assignedToId'],
        include: [{
          model: User,
          as: 'AssignedTo',
          attributes: ['firstName', 'lastName']
        }],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10
      });
      
      // Average assignment duration (for completed assignments)
      const completedAssignments = await Assignment.findAll({
        where: {
          ...where,
          status: 'completed',
          completedAt: { [Op.not]: null },
          assignedAt: { [Op.not]: null }
        },
        attributes: ['id', 'assignedAt', 'completedAt']
      });
      
      let totalDuration = 0;
      completedAssignments.forEach(assignment => {
        if (assignment.completedAt && assignment.assignedAt) {
          const duration = new Date(assignment.completedAt) - new Date(assignment.assignedAt);
          totalDuration += duration;
        }
      });
      
      const avgDuration = completedAssignments.length > 0 
        ? totalDuration / completedAssignments.length 
        : 0;
      
      // Reassignment rate
      const reassignedCount = await Assignment.count({
        where: {
          ...where,
          status: 'reassigned'
        }
      });
      
      const reassignmentRate = totalAssignments > 0 ? (reassignedCount / totalAssignments) * 100 : 0;
      
      res.json({
        success: true,
        data: {
          totalAssignments,
          byStatus: byStatus.reduce((acc, item) => {
            acc[item.status] = parseInt(item.dataValues.count);
            return acc;
          }, {}),
          byUser: byUser.map(item => ({
            userId: item.assignedToId,
            userName: item.AssignedTo ? 
              `${item.AssignedTo.firstName} ${item.AssignedTo.lastName}` : 
              'Unknown',
            totalAssignments: parseInt(item.dataValues.totalAssignments),
            completed: parseInt(item.dataValues.completed || 0),
            completionRate: parseInt(item.dataValues.totalAssignments) > 0 ? 
              (parseInt(item.dataValues.completed || 0) / parseInt(item.dataValues.totalAssignments)) * 100 : 0
          })),
          avgDuration: parseFloat((avgDuration / (1000 * 60 * 60 * 24)).toFixed(1)), // Days
          reassignmentRate: parseFloat(reassignmentRate.toFixed(2))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Bulk assign tasks
  bulkAssignTasks: async (req, res) => {
    try {
      const { taskIds, assignedToId, notes, dueDate } = req.body;
      
      if (!Array.isArray(taskIds) || taskIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Task IDs are required'
        });
      }
      
      if (!assignedToId) {
        return res.status(400).json({
          success: false,
          message: 'Assignee ID is required'
        });
      }
      
      // Validate assigned user
      const assignedUser = await User.findByPk(assignedToId);
      if (!assignedUser) {
        return res.status(404).json({ success: false, message: 'Assigned user not found' });
      }
      
      // Check if user belongs to same company
      if (assignedUser.companyId !== req.user.companyId && req.user.role !== 'system_admin') {
        return res.status(403).json({
          success: false,
          message: 'Cannot assign tasks to user from different company'
        });
      }
      
      const results = {
        assigned: [],
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
          
          // Check for existing active assignment
          const existingAssignment = await Assignment.findOne({
            where: {
              taskId,
              assignedToId,
              status: 'active'
            }
          });
          
          if (existingAssignment) {
            results.failed.push({
              taskId,
              taskNumber: task.taskNumber,
              error: 'Active assignment already exists'
            });
            continue;
          }
          
          // Create assignment
          const assignment = await Assignment.create({
            taskId,
            assignedToId,
            assignedById: req.user.id,
            assignedAt: new Date(),
            notes: notes || '',
            priority: task.priority,
            dueDate: dueDate ? new Date(dueDate) : task.dueDate,
            status: 'active',
            companyId: task.companyId,
            portfolioId: task.portfolioId
          });
          
          // Update task
          await task.update({
            assignedToId,
            assignedAt: new Date(),
            dueDate: dueDate ? new Date(dueDate) : task.dueDate,
            status: 'assigned'
          });
          
          results.assigned.push({
            taskId,
            taskNumber: task.taskNumber,
            title: task.title,
            assignmentId: assignment.id
          });
          
        } catch (error) {
          results.failed.push({
            taskId,
            error: error.message
          });
        }
      }
      
      // Send bulk assignment notification
      if (results.assigned.length > 0) {
        await sendEmail({
          to: assignedUser.email,
          subject: `Bulk Task Assignment: ${results.assigned.length} Tasks`,
          template: 'bulk-task-assignment',
          data: {
            firstName: assignedUser.firstName,
            taskCount: results.assigned.length,
            assignedBy: `${req.user.firstName} ${req.user.lastName}`,
            notes: notes || '',
            dueDate: dueDate ? new Date(dueDate).toLocaleDateString() : 'As per individual tasks',
            tasks: results.assigned.map(a => ({
              taskNumber: a.taskNumber,
              title: a.title
            }))
          }
        });
      }
      
      res.json({
        success: true,
        message: `Assigned ${results.assigned.length} tasks successfully, ${results.failed.length} failed`,
        data: results
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = assignmentController;