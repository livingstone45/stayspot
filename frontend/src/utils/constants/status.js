/**
 * Status constants for various entities in the StaySpot application
 * Defines all status types, their display properties, and transitions
 */

/**
 * Property status constants
 */
export const PROPERTY_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
  ARCHIVED: 'archived',
  PENDING_APPROVAL: 'pending_approval',
  REJECTED: 'rejected'
};

/**
 * Unit status constants
 */
export const UNIT_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  MAINTENANCE: 'maintenance',
  UNAVAILABLE: 'unavailable',
  PENDING_INSPECTION: 'pending_inspection',
  READY_FOR_RENT: 'ready_for_rent',
  NOTICE_GIVEN: 'notice_given'
};

/**
 * Lease status constants
 */
export const LEASE_STATUS = {
  DRAFT: 'draft',
  PENDING_SIGNATURE: 'pending_signature',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
  RENEWED: 'renewed',
  CANCELLED: 'cancelled',
  PENDING_RENEWAL: 'pending_renewal',
  VIOLATION: 'violation'
};

/**
 * Tenant status constants
 */
export const TENANT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  MOVED_OUT: 'moved_out',
  EVICTED: 'evicted',
  DECEASED: 'deceased'
};

/**
 * Application status constants
 */
export const APPLICATION_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  SCREENING_IN_PROGRESS: 'screening_in_progress',
  APPROVED: 'approved',
  CONDITIONALLY_APPROVED: 'conditionally_approved',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
  EXPIRED: 'expired',
  WAITLISTED: 'waitlisted'
};

/**
 * Payment status constants
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
  DISPUTED: 'disputed',
  OVERDUE: 'overdue',
  SCHEDULED: 'scheduled'
};

/**
 * Invoice status constants
 */
export const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  VIEWED: 'viewed',
  PAID: 'paid',
  PARTIALLY_PAID: 'partially_paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  DISPUTED: 'disputed'
};

/**
 * Maintenance request status constants
 */
export const MAINTENANCE_STATUS = {
  SUBMITTED: 'submitted',
  ACKNOWLEDGED: 'acknowledged',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ON_HOLD: 'on_hold',
  REQUIRES_APPROVAL: 'requires_approval',
  REJECTED: 'rejected'
};

/**
 * Work order status constants
 */
export const WORK_ORDER_STATUS = {
  CREATED: 'created',
  ASSIGNED: 'assigned',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  VERIFIED: 'verified',
  CANCELLED: 'cancelled',
  ON_HOLD: 'on_hold',
  REQUIRES_PARTS: 'requires_parts'
};

/**
 * Inspection status constants
 */
export const INSPECTION_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PASSED: 'passed',
  FAILED: 'failed',
  REQUIRES_FOLLOW_UP: 'requires_follow_up',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled'
};

/**
 * Vendor status constants
 */
export const VENDOR_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
  BLACKLISTED: 'blacklisted'
};

/**
 * Communication status constants
 */
export const COMMUNICATION_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  REPLIED: 'replied',
  FAILED: 'failed',
  SCHEDULED: 'scheduled'
};

/**
 * Document status constants
 */
export const DOCUMENT_STATUS = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SIGNED: 'signed',
  EXPIRED: 'expired',
  ARCHIVED: 'archived',
  REQUIRES_SIGNATURE: 'requires_signature'
};

/**
 * Task status constants
 */
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ON_HOLD: 'on_hold',
  OVERDUE: 'overdue'
};

/**
 * User status constants
 */
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
  PENDING_VERIFICATION: 'pending_verification',
  VERIFIED: 'verified'
};

/**
 * Status display configurations
 */
export const STATUS_DISPLAY = {
  // Property status display
  [PROPERTY_STATUS.DRAFT]: {
    label: 'Draft',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: '📝'
  },
  [PROPERTY_STATUS.ACTIVE]: {
    label: 'Active',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: '✅'
  },
  [PROPERTY_STATUS.INACTIVE]: {
    label: 'Inactive',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: '❌'
  },
  [PROPERTY_STATUS.MAINTENANCE]: {
    label: 'Under Maintenance',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: '🔧'
  },
  [PROPERTY_STATUS.ARCHIVED]: {
    label: 'Archived',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: '📦'
  },

  // Unit status display
  [UNIT_STATUS.AVAILABLE]: {
    label: 'Available',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: '🏠'
  },
  [UNIT_STATUS.OCCUPIED]: {
    label: 'Occupied',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: '👥'
  },
  [UNIT_STATUS.RESERVED]: {
    label: 'Reserved',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    icon: '🔒'
  },
  [UNIT_STATUS.MAINTENANCE]: {
    label: 'Maintenance',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: '🔧'
  },
  [UNIT_STATUS.UNAVAILABLE]: {
    label: 'Unavailable',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: '🚫'
  },

  // Lease status display
  [LEASE_STATUS.DRAFT]: {
    label: 'Draft',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: '📝'
  },
  [LEASE_STATUS.PENDING_SIGNATURE]: {
    label: 'Pending Signature',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: '✍️'
  },
  [LEASE_STATUS.ACTIVE]: {
    label: 'Active',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: '✅'
  },
  [LEASE_STATUS.EXPIRED]: {
    label: 'Expired',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: '⏰'
  },
  [LEASE_STATUS.TERMINATED]: {
    label: 'Terminated',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: '🚫'
  },

  // Payment status display
  [PAYMENT_STATUS.PENDING]: {
    label: 'Pending',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: '⏳'
  },
  [PAYMENT_STATUS.COMPLETED]: {
    label: 'Completed',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: '✅'
  },
  [PAYMENT_STATUS.FAILED]: {
    label: 'Failed',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: '❌'
  },
  [PAYMENT_STATUS.OVERDUE]: {
    label: 'Overdue',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: '⚠️'
  },

  // Maintenance status display
  [MAINTENANCE_STATUS.SUBMITTED]: {
    label: 'Submitted',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: '📋'
  },
  [MAINTENANCE_STATUS.ASSIGNED]: {
    label: 'Assigned',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    icon: '👷'
  },
  [MAINTENANCE_STATUS.IN_PROGRESS]: {
    label: 'In Progress',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: '🔧'
  },
  [MAINTENANCE_STATUS.COMPLETED]: {
    label: 'Completed',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: '✅'
  },

  // Application status display
  [APPLICATION_STATUS.SUBMITTED]: {
    label: 'Submitted',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: '📄'
  },
  [APPLICATION_STATUS.UNDER_REVIEW]: {
    label: 'Under Review',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: '🔍'
  },
  [APPLICATION_STATUS.APPROVED]: {
    label: 'Approved',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: '✅'
  },
  [APPLICATION_STATUS.REJECTED]: {
    label: 'Rejected',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: '❌'
  }
};

/**
 * Status transition rules
 */
export const STATUS_TRANSITIONS = {
  // Property status transitions
  [PROPERTY_STATUS.DRAFT]: [PROPERTY_STATUS.ACTIVE, PROPERTY_STATUS.ARCHIVED],
  [PROPERTY_STATUS.ACTIVE]: [PROPERTY_STATUS.INACTIVE, PROPERTY_STATUS.MAINTENANCE, PROPERTY_STATUS.ARCHIVED],
  [PROPERTY_STATUS.INACTIVE]: [PROPERTY_STATUS.ACTIVE, PROPERTY_STATUS.ARCHIVED],
  [PROPERTY_STATUS.MAINTENANCE]: [PROPERTY_STATUS.ACTIVE, PROPERTY_STATUS.INACTIVE],
  [PROPERTY_STATUS.ARCHIVED]: [],

  // Unit status transitions
  [UNIT_STATUS.AVAILABLE]: [UNIT_STATUS.RESERVED, UNIT_STATUS.OCCUPIED, UNIT_STATUS.MAINTENANCE, UNIT_STATUS.UNAVAILABLE],
  [UNIT_STATUS.OCCUPIED]: [UNIT_STATUS.AVAILABLE, UNIT_STATUS.NOTICE_GIVEN, UNIT_STATUS.MAINTENANCE],
  [UNIT_STATUS.RESERVED]: [UNIT_STATUS.OCCUPIED, UNIT_STATUS.AVAILABLE],
  [UNIT_STATUS.MAINTENANCE]: [UNIT_STATUS.AVAILABLE, UNIT_STATUS.READY_FOR_RENT],
  [UNIT_STATUS.UNAVAILABLE]: [UNIT_STATUS.AVAILABLE, UNIT_STATUS.MAINTENANCE],

  // Lease status transitions
  [LEASE_STATUS.DRAFT]: [LEASE_STATUS.PENDING_SIGNATURE, LEASE_STATUS.CANCELLED],
  [LEASE_STATUS.PENDING_SIGNATURE]: [LEASE_STATUS.ACTIVE, LEASE_STATUS.CANCELLED],
  [LEASE_STATUS.ACTIVE]: [LEASE_STATUS.TERMINATED, LEASE_STATUS.EXPIRED, LEASE_STATUS.RENEWED, LEASE_STATUS.PENDING_RENEWAL],
  [LEASE_STATUS.EXPIRED]: [LEASE_STATUS.RENEWED],
  [LEASE_STATUS.TERMINATED]: [],
  [LEASE_STATUS.CANCELLED]: [],

  // Payment status transitions
  [PAYMENT_STATUS.PENDING]: [PAYMENT_STATUS.PROCESSING, PAYMENT_STATUS.CANCELLED],
  [PAYMENT_STATUS.PROCESSING]: [PAYMENT_STATUS.COMPLETED, PAYMENT_STATUS.FAILED],
  [PAYMENT_STATUS.COMPLETED]: [PAYMENT_STATUS.REFUNDED, PAYMENT_STATUS.PARTIALLY_REFUNDED, PAYMENT_STATUS.DISPUTED],
  [PAYMENT_STATUS.FAILED]: [PAYMENT_STATUS.PENDING],
  [PAYMENT_STATUS.OVERDUE]: [PAYMENT_STATUS.COMPLETED, PAYMENT_STATUS.CANCELLED],

  // Maintenance status transitions
  [MAINTENANCE_STATUS.SUBMITTED]: [MAINTENANCE_STATUS.ACKNOWLEDGED, MAINTENANCE_STATUS.ASSIGNED, MAINTENANCE_STATUS.CANCELLED],
  [MAINTENANCE_STATUS.ACKNOWLEDGED]: [MAINTENANCE_STATUS.ASSIGNED, MAINTENANCE_STATUS.CANCELLED],
  [MAINTENANCE_STATUS.ASSIGNED]: [MAINTENANCE_STATUS.IN_PROGRESS, MAINTENANCE_STATUS.ON_HOLD, MAINTENANCE_STATUS.CANCELLED],
  [MAINTENANCE_STATUS.IN_PROGRESS]: [MAINTENANCE_STATUS.COMPLETED, MAINTENANCE_STATUS.ON_HOLD, MAINTENANCE_STATUS.REQUIRES_APPROVAL],
  [MAINTENANCE_STATUS.ON_HOLD]: [MAINTENANCE_STATUS.IN_PROGRESS, MAINTENANCE_STATUS.CANCELLED],
  [MAINTENANCE_STATUS.REQUIRES_APPROVAL]: [MAINTENANCE_STATUS.COMPLETED, MAINTENANCE_STATUS.REJECTED],
  [MAINTENANCE_STATUS.COMPLETED]: [],
  [MAINTENANCE_STATUS.CANCELLED]: []
};

/**
 * Status priority levels (for sorting and filtering)
 */
export const STATUS_PRIORITY = {
  // Payment status priority (higher number = higher priority)
  [PAYMENT_STATUS.OVERDUE]: 10,
  [PAYMENT_STATUS.FAILED]: 9,
  [PAYMENT_STATUS.DISPUTED]: 8,
  [PAYMENT_STATUS.PROCESSING]: 7,
  [PAYMENT_STATUS.PENDING]: 6,
  [PAYMENT_STATUS.SCHEDULED]: 5,
  [PAYMENT_STATUS.COMPLETED]: 4,
  [PAYMENT_STATUS.REFUNDED]: 3,
  [PAYMENT_STATUS.PARTIALLY_REFUNDED]: 2,
  [PAYMENT_STATUS.CANCELLED]: 1,

  // Maintenance status priority
  [MAINTENANCE_STATUS.REQUIRES_APPROVAL]: 10,
  [MAINTENANCE_STATUS.IN_PROGRESS]: 9,
  [MAINTENANCE_STATUS.ASSIGNED]: 8,
  [MAINTENANCE_STATUS.ACKNOWLEDGED]: 7,
  [MAINTENANCE_STATUS.SUBMITTED]: 6,
  [MAINTENANCE_STATUS.ON_HOLD]: 5,
  [MAINTENANCE_STATUS.COMPLETED]: 4,
  [MAINTENANCE_STATUS.CANCELLED]: 3,
  [MAINTENANCE_STATUS.REJECTED]: 2,

  // Application status priority
  [APPLICATION_STATUS.UNDER_REVIEW]: 10,
  [APPLICATION_STATUS.SCREENING_IN_PROGRESS]: 9,
  [APPLICATION_STATUS.CONDITIONALLY_APPROVED]: 8,
  [APPLICATION_STATUS.SUBMITTED]: 7,
  [APPLICATION_STATUS.WAITLISTED]: 6,
  [APPLICATION_STATUS.APPROVED]: 5,
  [APPLICATION_STATUS.REJECTED]: 4,
  [APPLICATION_STATUS.WITHDRAWN]: 3,
  [APPLICATION_STATUS.EXPIRED]: 2
};

/**
 * Status categories for grouping
 */
export const STATUS_CATEGORIES = {
  ACTIVE: 'active',
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ERROR: 'error'
};

/**
 * Status category mappings
 */
export const STATUS_CATEGORY_MAPPING = {
  [STATUS_CATEGORIES.ACTIVE]: [
    PROPERTY_STATUS.ACTIVE,
    UNIT_STATUS.OCCUPIED,
    LEASE_STATUS.ACTIVE,
    TENANT_STATUS.ACTIVE,
    PAYMENT_STATUS.PROCESSING,
    MAINTENANCE_STATUS.IN_PROGRESS,
    WORK_ORDER_STATUS.IN_PROGRESS
  ],
  [STATUS_CATEGORIES.PENDING]: [
    PROPERTY_STATUS.PENDING_APPROVAL,
    UNIT_STATUS.PENDING_INSPECTION,
    LEASE_STATUS.PENDING_SIGNATURE,
    TENANT_STATUS.PENDING,
    APPLICATION_STATUS.UNDER_REVIEW,
    PAYMENT_STATUS.PENDING,
    MAINTENANCE_STATUS.SUBMITTED,
    WORK_ORDER_STATUS.ASSIGNED
  ],
  [STATUS_CATEGORIES.COMPLETED]: [
    LEASE_STATUS.EXPIRED,
    PAYMENT_STATUS.COMPLETED,
    MAINTENANCE_STATUS.COMPLETED,
    WORK_ORDER_STATUS.COMPLETED,
    INSPECTION_STATUS.COMPLETED
  ],
  [STATUS_CATEGORIES.CANCELLED]: [
    LEASE_STATUS.CANCELLED,
    PAYMENT_STATUS.CANCELLED,
    MAINTENANCE_STATUS.CANCELLED,
    WORK_ORDER_STATUS.CANCELLED
  ],
  [STATUS_CATEGORIES.ERROR]: [
    PAYMENT_STATUS.FAILED,
    PAYMENT_STATUS.DISPUTED,
    APPLICATION_STATUS.REJECTED,
    MAINTENANCE_STATUS.REJECTED
  ]
};

/**
 * Status utility functions
 */
export const STATUS_UTILS = {
  /**
   * Get status display information
   * @param {string} status - Status value
   * @returns {Object} Display information
   */
  getStatusDisplay: (status) => {
    return STATUS_DISPLAY[status] || {
      label: status,
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      icon: '❓'
    };
  },

  /**
   * Check if status transition is allowed
   * @param {string} fromStatus - Current status
   * @param {string} toStatus - Target status
   * @returns {boolean} Whether transition is allowed
   */
  canTransition: (fromStatus, toStatus) => {
    const allowedTransitions = STATUS_TRANSITIONS[fromStatus] || [];
    return allowedTransitions.includes(toStatus);
  },

  /**
   * Get allowed transitions for a status
   * @param {string} status - Current status
   * @returns {Array} Allowed next statuses
   */
  getAllowedTransitions: (status) => {
    return STATUS_TRANSITIONS[status] || [];
  },

  /**
   * Get status priority
   * @param {string} status - Status value
   * @returns {number} Priority level
   */
  getStatusPriority: (status) => {
    return STATUS_PRIORITY[status] || 0;
  },

  /**
   * Get status category
   * @param {string} status - Status value
   * @returns {string} Status category
   */
  getStatusCategory: (status) => {
    for (const [category, statuses] of Object.entries(STATUS_CATEGORY_MAPPING)) {
      if (statuses.includes(status)) {
        return category;
      }
    }
    return STATUS_CATEGORIES.ACTIVE;
  },

  /**
   * Filter statuses by category
   * @param {Array} statuses - Status array
   * @param {string} category - Category to filter by
   * @returns {Array} Filtered statuses
   */
  filterByCategory: (statuses, category) => {
    const categoryStatuses = STATUS_CATEGORY_MAPPING[category] || [];
    return statuses.filter(status => categoryStatuses.includes(status));
  },

  /**
   * Sort statuses by priority
   * @param {Array} statuses - Status array
   * @param {boolean} descending - Sort order
   * @returns {Array} Sorted statuses
   */
  sortByPriority: (statuses, descending = true) => {
    return [...statuses].sort((a, b) => {
      const priorityA = STATUS_UTILS.getStatusPriority(a);
      const priorityB = STATUS_UTILS.getStatusPriority(b);
      return descending ? priorityB - priorityA : priorityA - priorityB;
    });
  },

  /**
   * Check if status is final (no further transitions)
   * @param {string} status - Status to check
   * @returns {boolean} Whether status is final
   */
  isFinalStatus: (status) => {
    const transitions = STATUS_TRANSITIONS[status];
    return !transitions || transitions.length === 0;
  },

  /**
   * Get status badge class names
   * @param {string} status - Status value
   * @returns {string} CSS class names
   */
  getStatusBadgeClasses: (status) => {
    const display = STATUS_UTILS.getStatusDisplay(status);
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${display.bgColor} ${display.textColor}`;
  }
};

// Export all status constants and utilities
export default {
  PROPERTY_STATUS,
  UNIT_STATUS,
  LEASE_STATUS,
  TENANT_STATUS,
  APPLICATION_STATUS,
  PAYMENT_STATUS,
  INVOICE_STATUS,
  MAINTENANCE_STATUS,
  WORK_ORDER_STATUS,
  INSPECTION_STATUS,
  VENDOR_STATUS,
  COMMUNICATION_STATUS,
  DOCUMENT_STATUS,
  TASK_STATUS,
  USER_STATUS,
  STATUS_DISPLAY,
  STATUS_TRANSITIONS,
  STATUS_PRIORITY,
  STATUS_CATEGORIES,
  STATUS_CATEGORY_MAPPING,
  STATUS_UTILS
};