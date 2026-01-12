// Property Status
const PropertyStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  UNDER_MAINTENANCE: 'under_maintenance',
  RENOVATING: 'renovating',
  ARCHIVED: 'archived',
  PENDING_APPROVAL: 'pending_approval',
  REJECTED: 'rejected'
};

// Property Types
const PropertyType = {
  APARTMENT: 'apartment',
  HOUSE: 'house',
  CONDO: 'condo',
  TOWNHOUSE: 'townhouse',
  VILLA: 'villa',
  COMMERCIAL: 'commercial',
  OFFICE: 'office',
  RETAIL: 'retail',
  INDUSTRIAL: 'industrial',
  LAND: 'land',
  OTHER: 'other'
};

// Rental Types
const RentalType = {
  LONG_TERM: 'long_term',
  SHORT_TERM: 'short_term',
  VACATION: 'vacation',
  MONTHLY: 'monthly',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  CORPORATE: 'corporate',
  STUDENT: 'student'
};

// Task Status
const TaskStatus = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  OVERDUE: 'overdue',
  ON_HOLD: 'on_hold'
};

// Task Priority
const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
  CRITICAL: 'critical'
};

// Task Types
const TaskType = {
  MAINTENANCE: 'maintenance',
  CLEANING: 'cleaning',
  INSPECTION: 'inspection',
  ADMINISTRATIVE: 'administrative',
  MARKETING: 'marketing',
  FINANCIAL: 'financial',
  LEGAL: 'legal',
  OTHER: 'other'
};

// Maintenance Request Status
const MaintenanceStatus = {
  SUBMITTED: 'submitted',
  REVIEWED: 'reviewed',
  APPROVED: 'approved',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected'
};

// Maintenance Priority
const MaintenancePriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  EMERGENCY: 'emergency'
};

// Payment Status
const PaymentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
  OVERDUE: 'overdue',
  PARTIALLY_PAID: 'partially_paid'
};

// Transaction Types
const TransactionType = {
  RENT: 'rent',
  DEPOSIT: 'deposit',
  FEE: 'fee',
  MAINTENANCE: 'maintenance',
  UTILITY: 'utility',
  REFUND: 'refund',
  OTHER_INCOME: 'other_income',
  OTHER_EXPENSE: 'other_expense'
};

// Invoice Status
const InvoiceStatus = {
  DRAFT: 'draft',
  SENT: 'sent',
  VIEWED: 'viewed',
  PARTIAL: 'partial',
  PAID: 'paid',
  OVERDUE: 'overdue',
  VOID: 'void'
};

// Lease Status
const LeaseStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
  RENEWED: 'renewed',
  PENDING: 'pending'
};

// Tenant Status
const TenantStatus = {
  APPLICANT: 'applicant',
  PROSPECTIVE: 'prospective',
  ACTIVE: 'active',
  FORMER: 'former',
  EVICTED: 'evicted',
  BLACKLISTED: 'blacklisted'
};

// Application Status
const ApplicationStatus = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn'
};

// Vendor Status
const VendorStatus = {
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  BLACKLISTED: 'blacklisted'
};

// Work Order Status
const WorkOrderStatus = {
  CREATED: 'created',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ON_HOLD: 'on_hold'
};

// Assignment Status
const AssignmentStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Invitation Status
const InvitationStatus = {
  PENDING: 'pending',
  SENT: 'sent',
  ACCEPTED: 'accepted',
  EXPIRED: 'expired',
  REVOKED: 'revoked'
};

// Notification Status
const NotificationStatus = {
  UNREAD: 'unread',
  READ: 'read',
  ARCHIVED: 'archived'
};

// Message Status
const MessageStatus = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed'
};

// Integration Status
const IntegrationStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ERROR: 'error',
  SYNCING: 'syncing',
  PENDING: 'pending'
};

// Audit Action Types
const AuditAction = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  LOGIN: 'login',
  LOGOUT: 'logout',
  DOWNLOAD: 'download',
  UPLOAD: 'upload',
  APPROVE: 'approve',
  REJECT: 'reject',
  ASSIGN: 'assign',
  COMPLETE: 'complete'
};

// Market Data Status
const MarketDataStatus = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  PENDING: 'pending',
  ERROR: 'error'
};

// Unit Status
const UnitStatus = {
  VACANT: 'vacant',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  MAINTENANCE: 'maintenance',
  RENOVATING: 'renovating',
  UNAVAILABLE: 'unavailable'
};

// Amenity Types
const AmenityType = {
  GENERAL: 'general',
  KITCHEN: 'kitchen',
  BEDROOM: 'bedroom',
  BATHROOM: 'bathroom',
  LIVING_AREA: 'living_area',
  OUTDOOR: 'outdoor',
  SECURITY: 'security',
  ACCESSIBILITY: 'accessibility',
  PARKING: 'parking',
  APPLIANCE: 'appliance'
};

// Document Types
const DocumentType = {
  LEASE: 'lease',
  IDENTIFICATION: 'identification',
  PROOF_OF_INCOME: 'proof_of_income',
  CREDIT_REPORT: 'credit_report',
  BACKGROUND_CHECK: 'background_check',
  PROPERTY_PHOTO: 'property_photo',
  INSPECTION_REPORT: 'inspection_report',
  MAINTENANCE_REPORT: 'maintenance_report',
  INVOICE: 'invoice',
  RECEIPT: 'receipt',
  CONTRACT: 'contract',
  LICENSE: 'license',
  INSURANCE: 'insurance',
  OTHER: 'other'
};

// Export all status constants
module.exports = {
  PropertyStatus,
  PropertyType,
  RentalType,
  TaskStatus,
  TaskPriority,
  TaskType,
  MaintenanceStatus,
  MaintenancePriority,
  PaymentStatus,
  TransactionType,
  InvoiceStatus,
  LeaseStatus,
  TenantStatus,
  ApplicationStatus,
  VendorStatus,
  WorkOrderStatus,
  AssignmentStatus,
  InvitationStatus,
  NotificationStatus,
  MessageStatus,
  IntegrationStatus,
  AuditAction,
  MarketDataStatus,
  UnitStatus,
  AmenityType,
  DocumentType
};