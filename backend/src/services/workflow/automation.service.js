const { Task, Property, Tenant, MaintenanceRequest } = require('../../models');
const TaskService = require('./task.service');
const AssignmentService = require('./assignment.service');
const NotificationService = require('../communication/notification.service');

class AutomationService {
  constructor() {
    this.triggers = new Map();
    this.setupDefaultTriggers();
  }

  setupDefaultTriggers() {
    this.triggers.set('lease_expiring', this.handleLeaseExpiring.bind(this));
    this.triggers.set('maintenance_request', this.handleMaintenanceRequest.bind(this));
    this.triggers.set('payment_overdue', this.handlePaymentOverdue.bind(this));
    this.triggers.set('property_inspection', this.handlePropertyInspection.bind(this));
    this.triggers.set('tenant_move_in', this.handleTenantMoveIn.bind(this));
  }

  async executeTrigger(triggerType, data) {
    const handler = this.triggers.get(triggerType);
    if (!handler) {
      throw new Error(`Unknown trigger type: ${triggerType}`);
    }

    return await handler(data);
  }

  async handleLeaseExpiring(data) {
    const { leaseId, daysUntilExpiry } = data;
    
    const tasks = [];
    
    if (daysUntilExpiry <= 60) {
      tasks.push(await TaskService.createTask({
        title: 'Lease Renewal Notice',
        description: `Send lease renewal notice for lease ${leaseId}`,
        type: 'lease_management',
        priority: 'high',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        created_by: 1, // System user
        company_id: data.company_id
      }));
    }

    if (daysUntilExpiry <= 30) {
      tasks.push(await TaskService.createTask({
        title: 'Schedule Property Inspection',
        description: `Schedule move-out inspection for lease ${leaseId}`,
        type: 'inspection',
        priority: 'medium',
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        created_by: 1,
        company_id: data.company_id
      }));
    }

    // Auto-assign tasks
    for (const task of tasks) {
      await AssignmentService.autoAssignTask(task.id);
    }

    return { created: tasks.length, tasks };
  }

  async handleMaintenanceRequest(data) {
    const { requestId, priority, category } = data;
    
    const request = await MaintenanceRequest.findByPk(requestId);
    if (!request) throw new Error('Maintenance request not found');

    // Create task based on priority and category
    const task = await TaskService.createTask({
      title: `Maintenance: ${request.title}`,
      description: request.description,
      type: 'maintenance',
      priority: this.mapMaintenancePriority(priority),
      due_date: this.calculateMaintenanceDueDate(priority),
      property_id: request.property_id,
      created_by: 1,
      company_id: data.company_id
    });

    // Auto-assign based on category
    await AssignmentService.autoAssignTask(task.id);

    // Send notifications for urgent requests
    if (priority === 'emergency') {
      await NotificationService.sendUrgentMaintenanceAlert({
        requestId,
        taskId: task.id,
        companyId: data.company_id
      });
    }

    return { taskId: task.id, assigned: true };
  }

  async handlePaymentOverdue(data) {
    const { tenantId, daysOverdue, amount } = data;
    
    const tasks = [];
    
    if (daysOverdue >= 5) {
      tasks.push(await TaskService.createTask({
        title: 'Send Payment Reminder',
        description: `Send payment reminder to tenant (${daysOverdue} days overdue)`,
        type: 'payment_collection',
        priority: 'medium',
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        created_by: 1,
        company_id: data.company_id
      }));
    }

    if (daysOverdue >= 15) {
      tasks.push(await TaskService.createTask({
        title: 'Late Fee Assessment',
        description: `Assess late fees for overdue payment ($${amount})`,
        type: 'financial',
        priority: 'high',
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        created_by: 1,
        company_id: data.company_id
      }));
    }

    if (daysOverdue >= 30) {
      tasks.push(await TaskService.createTask({
        title: 'Legal Notice Preparation',
        description: `Prepare legal notice for tenant ${tenantId}`,
        type: 'legal',
        priority: 'high',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        created_by: 1,
        company_id: data.company_id
      }));
    }

    // Auto-assign all tasks
    for (const task of tasks) {
      await AssignmentService.autoAssignTask(task.id);
    }

    return { created: tasks.length, tasks };
  }

  async handlePropertyInspection(data) {
    const { propertyId, inspectionType, scheduledDate } = data;
    
    const task = await TaskService.createTask({
      title: `Property Inspection - ${inspectionType}`,
      description: `Conduct ${inspectionType} inspection`,
      type: 'inspection',
      priority: 'medium',
      due_date: scheduledDate,
      property_id: propertyId,
      created_by: 1,
      company_id: data.company_id
    });

    await AssignmentService.autoAssignTask(task.id);

    return { taskId: task.id };
  }

  async handleTenantMoveIn(data) {
    const { tenantId, moveInDate, propertyId } = data;
    
    const tasks = [
      await TaskService.createTask({
        title: 'Welcome Package Preparation',
        description: 'Prepare welcome package for new tenant',
        type: 'tenant_services',
        priority: 'medium',
        due_date: new Date(moveInDate.getTime() - 24 * 60 * 60 * 1000),
        property_id: propertyId,
        created_by: 1,
        company_id: data.company_id
      }),
      await TaskService.createTask({
        title: 'Move-in Inspection',
        description: 'Conduct move-in inspection with tenant',
        type: 'inspection',
        priority: 'high',
        due_date: moveInDate,
        property_id: propertyId,
        created_by: 1,
        company_id: data.company_id
      })
    ];

    // Auto-assign tasks
    for (const task of tasks) {
      await AssignmentService.autoAssignTask(task.id);
    }

    return { created: tasks.length, tasks };
  }

  mapMaintenancePriority(priority) {
    const mapping = {
      'emergency': 'high',
      'urgent': 'high',
      'normal': 'medium',
      'low': 'low'
    };
    return mapping[priority] || 'medium';
  }

  calculateMaintenanceDueDate(priority) {
    const hours = {
      'emergency': 2,
      'urgent': 24,
      'normal': 72,
      'low': 168
    };
    
    const hoursToAdd = hours[priority] || 72;
    return new Date(Date.now() + hoursToAdd * 60 * 60 * 1000);
  }

  async scheduleRecurringTasks(companyId) {
    // Monthly property inspections
    const properties = await Property.findAll({
      where: { company_id: companyId, status: 'active' }
    });

    const tasks = [];
    for (const property of properties) {
      if (this.shouldScheduleInspection(property)) {
        const task = await TaskService.createTask({
          title: 'Monthly Property Inspection',
          description: `Routine monthly inspection for ${property.name}`,
          type: 'inspection',
          priority: 'low',
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          property_id: property.id,
          created_by: 1,
          company_id: companyId
        });
        
        await AssignmentService.autoAssignTask(task.id);
        tasks.push(task);
      }
    }

    return { scheduled: tasks.length, tasks };
  }

  shouldScheduleInspection(property) {
    // Logic to determine if inspection should be scheduled
    // Based on last inspection date, property type, etc.
    return Math.random() > 0.7; // Simplified for demo
  }
}

module.exports = new AutomationService();
