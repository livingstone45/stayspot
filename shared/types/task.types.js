/**
 * Task and Workflow Types for StaySpot Platform
 * Task management, maintenance, and workflow definitions
 */

// Task Types
export const TASK_TYPES = {
  MAINTENANCE: 'maintenance',
  INSPECTION: 'inspection',
  LEASING: 'leasing',
  ADMINISTRATIVE: 'administrative',
  FINANCIAL: 'financial',
  MARKETING: 'marketing',
  LEGAL: 'legal',
  EMERGENCY: 'emergency',
  ROUTINE: 'routine',
  FOLLOW_UP: 'follow_up'
};

// Task Status
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ON_HOLD: 'on_hold',
  OVERDUE: 'overdue',
  SCHEDULED: 'scheduled',
  WAITING_APPROVAL: 'waiting_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Task Priority Levels
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
  EMERGENCY: 'emergency'
};

// Maintenance Categories
export const MAINTENANCE_CATEGORIES = {
  PLUMBING: 'plumbing',
  ELECTRICAL: 'electrical',
  HVAC: 'hvac',
  APPLIANCES: 'appliances',
  FLOORING: 'flooring',
  PAINTING: 'painting',
  CARPENTRY: 'carpentry',
  ROOFING: 'roofing',
  LANDSCAPING: 'landscaping',
  CLEANING: 'cleaning',
  PEST_CONTROL: 'pest_control',
  SECURITY: 'security',
  GENERAL: 'general'
};

// Maintenance Request Types
export const MAINTENANCE_REQUEST_TYPES = {
  REPAIR: 'repair',
  REPLACEMENT: 'replacement',
  INSTALLATION: 'installation',
  INSPECTION: 'inspection',
  PREVENTIVE: 'preventive',
  EMERGENCY: 'emergency',
  COSMETIC: 'cosmetic',
  SAFETY: 'safety'
};

// Work Order Status
export const WORK_ORDER_STATUS = {
  CREATED: 'created',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ON_HOLD: 'on_hold',
  WAITING_PARTS: 'waiting_parts',
  WAITING_APPROVAL: 'waiting_approval',
  QUALITY_CHECK: 'quality_check'
};

// Vendor Categories
export const VENDOR_CATEGORIES = {
  PLUMBER: 'plumber',
  ELECTRICIAN: 'electrician',
  HVAC_TECHNICIAN: 'hvac_technician',
  HANDYMAN: 'handyman',
  PAINTER: 'painter',
  CARPENTER: 'carpenter',
  ROOFER: 'roofer',
  LANDSCAPER: 'landscaper',
  CLEANER: 'cleaner',
  PEST_CONTROL: 'pest_control',
  LOCKSMITH: 'locksmith',
  APPLIANCE_REPAIR: 'appliance_repair',
  CONTRACTOR: 'contractor'
};

// Inspection Categories
export const INSPECTION_CATEGORIES = {
  MOVE_IN: 'move_in',
  MOVE_OUT: 'move_out',
  ROUTINE: 'routine',
  ANNUAL: 'annual',
  SAFETY: 'safety',
  MAINTENANCE: 'maintenance',
  COMPLIANCE: 'compliance',
  INSURANCE: 'insurance',
  GOVERNMENT: 'government'
};

// Task Assignment Types
export const ASSIGNMENT_TYPES = {
  MANUAL: 'manual',
  AUTOMATIC: 'automatic',
  ROUND_ROBIN: 'round_robin',
  SKILL_BASED: 'skill_based',
  WORKLOAD_BASED: 'workload_based',
  LOCATION_BASED: 'location_based'
};

// Workflow Status
export const WORKFLOW_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DRAFT: 'draft'
};

// Workflow Trigger Types
export const WORKFLOW_TRIGGERS = {
  MANUAL: 'manual',
  SCHEDULED: 'scheduled',
  EVENT_BASED: 'event_based',
  CONDITION_BASED: 'condition_based',
  TIME_BASED: 'time_based'
};

// Communication Types
export const COMMUNICATION_TYPES = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH_NOTIFICATION: 'push_notification',
  IN_APP: 'in_app',
  PHONE_CALL: 'phone_call',
  LETTER: 'letter'
};

// Document Types for Tasks
export const TASK_DOCUMENT_TYPES = {
  WORK_ORDER: 'work_order',
  INVOICE: 'invoice',
  RECEIPT: 'receipt',
  PHOTO_BEFORE: 'photo_before',
  PHOTO_AFTER: 'photo_after',
  ESTIMATE: 'estimate',
  CONTRACT: 'contract',
  PERMIT: 'permit',
  INSPECTION_REPORT: 'inspection_report',
  WARRANTY: 'warranty'
};

// Recurring Task Patterns
export const RECURRING_PATTERNS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  SEMI_ANNUALLY: 'semi_annually',
  ANNUALLY: 'annually',
  CUSTOM: 'custom'
};

// Task Completion Requirements
export const COMPLETION_REQUIREMENTS = {
  PHOTO_REQUIRED: 'photo_required',
  SIGNATURE_REQUIRED: 'signature_required',
  APPROVAL_REQUIRED: 'approval_required',
  INVOICE_REQUIRED: 'invoice_required',
  INSPECTION_REQUIRED: 'inspection_required',
  DOCUMENTATION_REQUIRED: 'documentation_required'
};

// Quality Control Status
export const QUALITY_CONTROL_STATUS = {
  PENDING: 'pending',
  PASSED: 'passed',
  FAILED: 'failed',
  NEEDS_REWORK: 'needs_rework',
  PARTIAL_PASS: 'partial_pass'
};

// Utility Functions
export const getTaskPriorityColor = (priority) => {
  const priorityColors = {
    [TASK_PRIORITY.LOW]: 'green',
    [TASK_PRIORITY.MEDIUM]: 'yellow',
    [TASK_PRIORITY.HIGH]: 'orange',
    [TASK_PRIORITY.URGENT]: 'red',
    [TASK_PRIORITY.EMERGENCY]: 'purple'
  };
  return priorityColors[priority] || 'gray';
};

export const getTaskStatusColor = (status) => {
  const statusColors = {
    [TASK_STATUS.PENDING]: 'gray',
    [TASK_STATUS.IN_PROGRESS]: 'blue',
    [TASK_STATUS.COMPLETED]: 'green',
    [TASK_STATUS.CANCELLED]: 'red',
    [TASK_STATUS.ON_HOLD]: 'yellow',
    [TASK_STATUS.OVERDUE]: 'red',
    [TASK_STATUS.SCHEDULED]: 'purple',
    [TASK_STATUS.WAITING_APPROVAL]: 'orange',
    [TASK_STATUS.APPROVED]: 'green',
    [TASK_STATUS.REJECTED]: 'red'
  };
  return statusColors[status] || 'gray';
};

export const calculateTaskMetrics = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.status === TASK_STATUS.COMPLETED).length;
  const inProgress = tasks.filter(task => task.status === TASK_STATUS.IN_PROGRESS).length;
  const overdue = tasks.filter(task => task.status === TASK_STATUS.OVERDUE).length;
  const pending = tasks.filter(task => task.status === TASK_STATUS.PENDING).length;
  
  return {
    total,
    completed,
    inProgress,
    overdue,
    pending,
    completionRate: total > 0 ? (completed / total) * 100 : 0,
    overdueRate: total > 0 ? (overdue / total) * 100 : 0
  };
};

export const isTaskOverdue = (task) => {
  if (!task.dueDate) return false;
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  return dueDate < now && task.status !== TASK_STATUS.COMPLETED;
};

export const getTaskUrgencyLevel = (task) => {
  if (task.priority === TASK_PRIORITY.EMERGENCY) return 5;
  if (task.priority === TASK_PRIORITY.URGENT) return 4;
  if (task.priority === TASK_PRIORITY.HIGH) return 3;
  if (task.priority === TASK_PRIORITY.MEDIUM) return 2;
  return 1;
};

export const formatTaskDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end - start;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours % 24} hour${diffHours % 24 !== 1 ? 's' : ''}`;
  }
  return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
};