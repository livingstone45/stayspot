const { Assignment, User, Task, UserRole } = require('../../models');
const { Op } = require('sequelize');

class AssignmentService {
  async createAssignmentRule(data) {
    return await Assignment.create({
      name: data.name,
      task_type: data.task_type,
      assignment_type: data.assignment_type, // 'role_based', 'user_specific', 'round_robin'
      criteria: data.criteria,
      target_role: data.target_role,
      target_user: data.target_user,
      priority: data.priority || 1,
      is_active: true,
      company_id: data.company_id
    });
  }

  async autoAssignTask(taskId) {
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('Task not found');

    const rules = await Assignment.findAll({
      where: {
        company_id: task.company_id,
        task_type: task.type,
        is_active: true
      },
      order: [['priority', 'DESC']]
    });

    for (const rule of rules) {
      const assignee = await this.findAssignee(rule, task);
      if (assignee) {
        await task.update({
          assigned_to: assignee.id,
          status: 'assigned',
          assigned_at: new Date()
        });
        return assignee;
      }
    }

    return null; // No suitable assignee found
  }

  async findAssignee(rule, task) {
    switch (rule.assignment_type) {
      case 'role_based':
        return await this.findByRole(rule.target_role, task.company_id);
      case 'user_specific':
        return await User.findByPk(rule.target_user);
      case 'round_robin':
        return await this.findRoundRobin(rule, task.company_id);
      case 'workload_based':
        return await this.findByWorkload(rule.target_role, task.company_id);
      default:
        return null;
    }
  }

  async findByRole(roleId, companyId) {
    const users = await User.findAll({
      include: [{
        model: UserRole,
        where: { role_id: roleId },
        required: true
      }],
      where: { company_id: companyId, status: 'active' }
    });

    return users.length > 0 ? users[Math.floor(Math.random() * users.length)] : null;
  }

  async findRoundRobin(rule, companyId) {
    // Get users eligible for this assignment type
    const users = await User.findAll({
      include: [{
        model: UserRole,
        where: { role_id: rule.target_role },
        required: true
      }],
      where: { company_id: companyId, status: 'active' }
    });

    if (users.length === 0) return null;

    // Find user with least recent assignment for this rule
    const assignments = await Task.findAll({
      where: {
        company_id: companyId,
        type: rule.task_type,
        assigned_to: { [Op.in]: users.map(u => u.id) }
      },
      order: [['assigned_at', 'DESC']]
    });

    // Find user not in recent assignments or with oldest assignment
    const recentAssignees = assignments.slice(0, users.length).map(a => a.assigned_to);
    const availableUsers = users.filter(u => !recentAssignees.includes(u.id));
    
    return availableUsers.length > 0 ? availableUsers[0] : users[0];
  }

  async findByWorkload(roleId, companyId) {
    const users = await User.findAll({
      include: [{
        model: UserRole,
        where: { role_id: roleId },
        required: true
      }],
      where: { company_id: companyId, status: 'active' }
    });

    if (users.length === 0) return null;

    // Count active tasks for each user
    const userWorkloads = await Promise.all(
      users.map(async user => {
        const taskCount = await Task.count({
          where: {
            assigned_to: user.id,
            status: { [Op.in]: ['assigned', 'in_progress'] }
          }
        });
        return { user, taskCount };
      })
    );

    // Return user with lowest workload
    userWorkloads.sort((a, b) => a.taskCount - b.taskCount);
    return userWorkloads[0].user;
  }

  async reassignTask(taskId, newUserId, reason) {
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('Task not found');

    const oldAssignee = task.assigned_to;
    
    await task.update({
      assigned_to: newUserId,
      assigned_at: new Date()
    });

    // Log reassignment
    console.log(`Task ${taskId} reassigned from ${oldAssignee} to ${newUserId}: ${reason}`);

    return task;
  }

  async getAssignmentStats(companyId, period = 30) {
    const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);
    
    const assignments = await Task.findAll({
      where: {
        company_id: companyId,
        assigned_at: { [Op.gte]: startDate }
      },
      include: [{ model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name'] }]
    });

    const stats = {
      totalAssignments: assignments.length,
      autoAssigned: assignments.filter(a => a.auto_assigned).length,
      manualAssigned: assignments.filter(a => !a.auto_assigned).length,
      byUser: {}
    };

    assignments.forEach(assignment => {
      const userId = assignment.assigned_to;
      if (!stats.byUser[userId]) {
        stats.byUser[userId] = {
          user: assignment.assignee,
          count: 0,
          completed: 0
        };
      }
      stats.byUser[userId].count++;
      if (assignment.status === 'completed') {
        stats.byUser[userId].completed++;
      }
    });

    return stats;
  }
}

module.exports = new AssignmentService();
