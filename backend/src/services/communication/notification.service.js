const { Notification, User } = require('../../models');
const { Op } = require('sequelize');

class NotificationService {
  async createNotification(notificationData) {
    const { userId, title, message, type, relatedId, relatedType, priority = 'normal' } = notificationData;

    return await Notification.create({
      user_id: userId,
      title,
      message,
      type,
      related_id: relatedId,
      related_type: relatedType,
      priority,
      status: 'unread'
    });
  }

  async createBulkNotifications(notifications) {
    return await Notification.bulkCreate(notifications);
  }

  async getUserNotifications(userId, options = {}) {
    const { limit = 20, offset = 0, status, type } = options;
    
    const where = { user_id: userId };
    if (status) where.status = status;
    if (type) where.type = type;

    return await Notification.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
  }

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId }
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return await notification.update({
      status: 'read',
      read_at: new Date()
    });
  }

  async markAllAsRead(userId) {
    return await Notification.update(
      { status: 'read', read_at: new Date() },
      { where: { user_id: userId, status: 'unread' } }
    );
  }

  async deleteNotification(notificationId, userId) {
    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId }
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return await notification.destroy();
  }

  async getUnreadCount(userId) {
    return await Notification.count({
      where: { user_id: userId, status: 'unread' }
    });
  }

  // Specific notification types
  async notifyMaintenanceUpdate(tenantId, maintenanceRequest) {
    return await this.createNotification({
      userId: tenantId,
      title: 'Maintenance Update',
      message: `Your maintenance request "${maintenanceRequest.title}" has been updated to ${maintenanceRequest.status}`,
      type: 'maintenance',
      relatedId: maintenanceRequest.id,
      relatedType: 'maintenance_request'
    });
  }

  async notifyPaymentDue(tenantId, payment) {
    return await this.createNotification({
      userId: tenantId,
      title: 'Payment Due',
      message: `Your rent payment of $${payment.amount} is due on ${payment.due_date}`,
      type: 'payment',
      relatedId: payment.id,
      relatedType: 'payment',
      priority: 'high'
    });
  }

  async notifyLeaseExpiry(tenantId, lease) {
    return await this.createNotification({
      userId: tenantId,
      title: 'Lease Expiring Soon',
      message: `Your lease expires on ${lease.end_date}. Please contact us for renewal.`,
      type: 'lease',
      relatedId: lease.id,
      relatedType: 'lease',
      priority: 'high'
    });
  }

  async notifyNewTenant(managerId, tenant) {
    return await this.createNotification({
      userId: managerId,
      title: 'New Tenant Application',
      message: `New application received from ${tenant.first_name} ${tenant.last_name}`,
      type: 'application',
      relatedId: tenant.id,
      relatedType: 'tenant'
    });
  }

  async notifyTaskAssignment(userId, task) {
    return await this.createNotification({
      userId,
      title: 'New Task Assigned',
      message: `You have been assigned a new task: ${task.title}`,
      type: 'task',
      relatedId: task.id,
      relatedType: 'task'
    });
  }

  async cleanupOldNotifications(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return await Notification.destroy({
      where: {
        created_at: { [Op.lt]: cutoffDate },
        status: 'read'
      }
    });
  }
}

module.exports = new NotificationService();