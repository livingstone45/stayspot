const { Task, User, Property } = require('../../models');
const { Op } = require('sequelize');

class TaskService {
  async createTask(data) {
    return await Task.create({
      title: data.title,
      description: data.description,
      type: data.type,
      priority: data.priority || 'medium',
      status: 'pending',
      due_date: data.due_date,
      assigned_to: data.assigned_to,
      created_by: data.created_by,
      property_id: data.property_id,
      company_id: data.company_id
    });
  }

  async assignTask(taskId, userId) {
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('Task not found');

    await task.update({
      assigned_to: userId,
      status: 'assigned',
      assigned_at: new Date()
    });

    return task;
  }

  async updateTaskStatus(taskId, status, userId) {
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('Task not found');

    const updates = { status };
    
    if (status === 'in_progress') {
      updates.started_at = new Date();
    } else if (status === 'completed') {
      updates.completed_at = new Date();
      updates.completed_by = userId;
    }

    await task.update(updates);
    return task;
  }

  async getTasksByUser(userId, filters = {}) {
    const where = { assigned_to: userId };
    
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.type) where.type = filters.type;

    return await Task.findAll({
      where,
      include: [
        { model: Property, as: 'property', attributes: ['id', 'name', 'address'] },
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name'] }
      ],
      order: [['due_date', 'ASC'], ['priority', 'DESC']]
    });
  }

  async getOverdueTasks(companyId) {
    return await Task.findAll({
      where: {
        company_id: companyId,
        status: { [Op.notIn]: ['completed', 'cancelled'] },
        due_date: { [Op.lt]: new Date() }
      },
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Property, as: 'property', attributes: ['id', 'name'] }
      ]
    });
  }

  async getTaskMetrics(companyId, period = 30) {
    const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);
    
    const tasks = await Task.findAll({
      where: {
        company_id: companyId,
        created_at: { [Op.gte]: startDate }
      }
    });

    const metrics = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => t.due_date < new Date() && t.status !== 'completed').length,
      byPriority: {
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length
      },
      byType: {}
    };

    // Group by type
    tasks.forEach(task => {
      metrics.byType[task.type] = (metrics.byType[task.type] || 0) + 1;
    });

    metrics.completionRate = metrics.total > 0 ? (metrics.completed / metrics.total * 100).toFixed(1) : 0;

    return metrics;
  }

  async bulkAssign(taskIds, userId) {
    await Task.update(
      {
        assigned_to: userId,
        status: 'assigned',
        assigned_at: new Date()
      },
      {
        where: { id: { [Op.in]: taskIds } }
      }
    );

    return { assigned: taskIds.length };
  }
}

module.exports = new TaskService();
