const ErrorCodes = {
  // General Errors (1000-1999)
  VALIDATION_ERROR: 1001,
  DATABASE_ERROR: 1002,
  NETWORK_ERROR: 1003,
  TIMEOUT_ERROR: 1004,
  CONFIGURATION_ERROR: 1005,
  FILE_PROCESSING_ERROR: 1006,
  
  // Authentication & Authorization Errors (2000-2999)
  AUTHENTICATION_FAILED: 2001,
  INVALID_TOKEN: 2002,
  TOKEN_EXPIRED: 2003,
  ACCESS_DENIED: 2004,
  INSUFFICIENT_PERMISSIONS: 2005,
  USER_SUSPENDED: 2006,
  ACCOUNT_LOCKED: 2007,
  INVALID_CREDENTIALS: 2008,
  SESSION_EXPIRED: 2009,
  
  // User Management Errors (3000-3999)
  USER_NOT_FOUND: 3001,
  USER_ALREADY_EXISTS: 3002,
  EMAIL_ALREADY_REGISTERED: 3003,
  INVALID_USER_STATUS: 3004,
  USER_PROFILE_INCOMPLETE: 3005,
  PASSWORD_POLICY_VIOLATION: 3006,
  PASSWORD_RESET_EXPIRED: 3007,
  INVITATION_EXPIRED: 3008,
  INVITATION_INVALID: 3009,
  
  // Property Management Errors (4000-4999)
  PROPERTY_NOT_FOUND: 4001,
  PROPERTY_ALREADY_EXISTS: 4002,
  PROPERTY_UPLOAD_FAILED: 4003,
  INVALID_PROPERTY_DATA: 4004,
  PROPERTY_APPROVAL_REQUIRED: 4005,
  PROPERTY_ACCESS_DENIED: 4006,
  GEOCODING_FAILED: 4007,
  PROPERTY_IMAGE_PROCESSING_FAILED: 4008,
  PROPERTY_BULK_UPLOAD_LIMIT_EXCEEDED: 4009,
  
  // Unit Management Errors (4100-4199)
  UNIT_NOT_FOUND: 4101,
  UNIT_ALREADY_EXISTS: 4102,
  UNIT_OCCUPIED: 4103,
  UNIT_UNAVAILABLE: 4104,
  INVALID_UNIT_DATA: 4105,
  
  // Tenant Management Errors (4200-4299)
  TENANT_NOT_FOUND: 4201,
  TENANT_ALREADY_EXISTS: 4202,
  TENANT_SCREENING_FAILED: 4203,
  TENANT_BLACKLISTED: 4204,
  INVALID_TENANT_DATA: 4205,
  
  // Lease Management Errors (4300-4399)
  LEASE_NOT_FOUND: 4301,
  LEASE_ALREADY_EXISTS: 4302,
  LEASE_OVERLAP: 4303,
  LEASE_TERMINATION_FAILED: 4304,
  LEASE_RENEWAL_FAILED: 4305,
  INVALID_LEASE_DATA: 4306,
  LEASE_EXPIRED: 4307,
  
  // Maintenance Management Errors (4400-4499)
  MAINTENANCE_REQUEST_NOT_FOUND: 4401,
  MAINTENANCE_ASSIGNMENT_FAILED: 4402,
  MAINTENANCE_APPROVAL_REQUIRED: 4403,
  VENDOR_UNAVAILABLE: 4404,
  INVALID_MAINTENANCE_DATA: 4405,
  
  // Work Order Errors (4500-4599)
  WORK_ORDER_NOT_FOUND: 4501,
  WORK_ORDER_ALREADY_ASSIGNED: 4502,
  WORK_ORDER_COMPLETION_FAILED: 4503,
  INVALID_WORK_ORDER_DATA: 4504,
  
  // Task Management Errors (4600-4699)
  TASK_NOT_FOUND: 4601,
  TASK_ASSIGNMENT_FAILED: 4602,
  TASK_UPDATE_FAILED: 4603,
  INVALID_TASK_DATA: 4604,
  TASK_OVERDUE: 4605,
  
  // Assignment Errors (4700-4799)
  ASSIGNMENT_NOT_FOUND: 4701,
  ASSIGNMENT_ALREADY_EXISTS: 4702,
  ASSIGNMENT_REJECTED: 4703,
  INVALID_ASSIGNMENT_DATA: 4704,
  
  // Financial Management Errors (5000-5999)
  PAYMENT_NOT_FOUND: 5001,
  PAYMENT_PROCESSING_FAILED: 5002,
  INSUFFICIENT_FUNDS: 5003,
  PAYMENT_GATEWAY_ERROR: 5004,
  REFUND_FAILED: 5005,
  INVALID_PAYMENT_DATA: 5006,
  PAYMENT_ALREADY_PROCESSED: 5007,
  
  // Transaction Errors (5100-5199)
  TRANSACTION_NOT_FOUND: 5101,
  TRANSACTION_PROCESSING_FAILED: 5102,
  INVALID_TRANSACTION_DATA: 5103,
  
  // Invoice Errors (5200-5299)
  INVOICE_NOT_FOUND: 5201,
  INVOICE_GENERATION_FAILED: 5202,
  INVOICE_SENDING_FAILED: 5203,
  INVALID_INVOICE_DATA: 5204,
  INVOICE_ALREADY_PAID: 5205,
  
  // Company Management Errors (6000-6099)
  COMPANY_NOT_FOUND: 6001,
  COMPANY_ALREADY_EXISTS: 6002,
  COMPANY_ACCESS_DENIED: 6003,
  INVALID_COMPANY_DATA: 6004,
  
  // Portfolio Management Errors (6100-6199)
  PORTFOLIO_NOT_FOUND: 6101,
  PORTFOLIO_ALREADY_EXISTS: 6102,
  PORTFOLIO_ACCESS_DENIED: 6103,
  INVALID_PORTFOLIO_DATA: 6104,
  
  // Vendor Management Errors (6200-6299)
  VENDOR_NOT_FOUND: 6201,
  VENDOR_ALREADY_EXISTS: 6202,
  VENDOR_APPROVAL_REQUIRED: 6203,
  VENDOR_BLACKLISTED: 6204,
  INVALID_VENDOR_DATA: 6205,
  
  // Integration Errors (7000-7099)
  INTEGRATION_NOT_FOUND: 7001,
  INTEGRATION_FAILED: 7002,
  API_LIMIT_EXCEEDED: 7003,
  INVALID_API_KEY: 7004,
  SYNC_FAILED: 7005,
  WEBHOOK_PROCESSING_FAILED: 7006,
  
  // Market Data Errors (7100-7199)
  MARKET_DATA_NOT_FOUND: 7101,
  MARKET_DATA_FETCH_FAILED: 7102,
  INVALID_MARKET_DATA: 7103,
  MARKET_DATA_EXPIRED: 7104,
  
  // Communication Errors (8000-8099)
  MESSAGE_SENDING_FAILED: 8001,
  NOTIFICATION_FAILED: 8002,
  EMAIL_SENDING_FAILED: 8003,
  SMS_SENDING_FAILED: 8004,
  INVALID_MESSAGE_DATA: 8005,
  
  // Document Management Errors (8100-8199)
  DOCUMENT_NOT_FOUND: 8101,
  DOCUMENT_UPLOAD_FAILED: 8102,
  DOCUMENT_PROCESSING_FAILED: 8103,
  INVALID_DOCUMENT_TYPE: 8104,
  DOCUMENT_SIZE_EXCEEDED: 8105,
  
  // Reporting Errors (8200-8299)
  REPORT_GENERATION_FAILED: 8201,
  REPORT_NOT_FOUND: 8202,
  REPORT_EXPORT_FAILED: 8203,
  INVALID_REPORT_PARAMETERS: 8204,
  
  // Audit Errors (8300-8399)
  AUDIT_LOG_NOT_FOUND: 8301,
  AUDIT_LOG_CREATION_FAILED: 8302,
  AUDIT_EXPORT_FAILED: 8303,
  
  // Rate Limiting Errors (9000-9099)
  RATE_LIMIT_EXCEEDED: 9001,
  TOO_MANY_REQUESTS: 9002,
  
  // System Errors (10000-10999)
  INTERNAL_SERVER_ERROR: 10001,
  SERVICE_UNAVAILABLE: 10002,
  DATABASE_CONNECTION_FAILED: 10003,
  CACHE_CONNECTION_FAILED: 10004,
  QUEUE_PROCESSING_FAILED: 10005,
  BACKGROUND_JOB_FAILED: 10006,
  SYSTEM_MAINTENANCE: 10007
};

const ErrorMessages = {
  [ErrorCodes.VALIDATION_ERROR]: 'Validation failed',
  [ErrorCodes.DATABASE_ERROR]: 'Database operation failed',
  [ErrorCodes.NETWORK_ERROR]: 'Network error occurred',
  [ErrorCodes.TIMEOUT_ERROR]: 'Request timed out',
  [ErrorCodes.CONFIGURATION_ERROR]: 'System configuration error',
  [ErrorCodes.FILE_PROCESSING_ERROR]: 'File processing failed',
  
  [ErrorCodes.AUTHENTICATION_FAILED]: 'Authentication failed',
  [ErrorCodes.INVALID_TOKEN]: 'Invalid token',
  [ErrorCodes.TOKEN_EXPIRED]: 'Token has expired',
  [ErrorCodes.ACCESS_DENIED]: 'Access denied',
  [ErrorCodes.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions',
  [ErrorCodes.USER_SUSPENDED]: 'User account is suspended',
  [ErrorCodes.ACCOUNT_LOCKED]: 'Account is locked',
  [ErrorCodes.INVALID_CREDENTIALS]: 'Invalid credentials',
  [ErrorCodes.SESSION_EXPIRED]: 'Session has expired',
  
  [ErrorCodes.USER_NOT_FOUND]: 'User not found',
  [ErrorCodes.USER_ALREADY_EXISTS]: 'User already exists',
  [ErrorCodes.EMAIL_ALREADY_REGISTERED]: 'Email is already registered',
  [ErrorCodes.INVALID_USER_STATUS]: 'Invalid user status',
  [ErrorCodes.USER_PROFILE_INCOMPLETE]: 'User profile is incomplete',
  [ErrorCodes.PASSWORD_POLICY_VIOLATION]: 'Password does not meet policy requirements',
  [ErrorCodes.PASSWORD_RESET_EXPIRED]: 'Password reset link has expired',
  [ErrorCodes.INVITATION_EXPIRED]: 'Invitation has expired',
  [ErrorCodes.INVITATION_INVALID]: 'Invalid invitation',
  
  [ErrorCodes.PROPERTY_NOT_FOUND]: 'Property not found',
  [ErrorCodes.PROPERTY_ALREADY_EXISTS]: 'Property already exists',
  [ErrorCodes.PROPERTY_UPLOAD_FAILED]: 'Property upload failed',
  [ErrorCodes.INVALID_PROPERTY_DATA]: 'Invalid property data',
  [ErrorCodes.PROPERTY_APPROVAL_REQUIRED]: 'Property requires approval',
  [ErrorCodes.PROPERTY_ACCESS_DENIED]: 'Access to property denied',
  [ErrorCodes.GEOCODING_FAILED]: 'Geocoding failed',
  [ErrorCodes.PROPERTY_IMAGE_PROCESSING_FAILED]: 'Property image processing failed',
  [ErrorCodes.PROPERTY_BULK_UPLOAD_LIMIT_EXCEEDED]: 'Bulk upload limit exceeded',
  
  [ErrorCodes.UNIT_NOT_FOUND]: 'Unit not found',
  [ErrorCodes.UNIT_ALREADY_EXISTS]: 'Unit already exists',
  [ErrorCodes.UNIT_OCCUPIED]: 'Unit is occupied',
  [ErrorCodes.UNIT_UNAVAILABLE]: 'Unit is unavailable',
  [ErrorCodes.INVALID_UNIT_DATA]: 'Invalid unit data',
  
  [ErrorCodes.TENANT_NOT_FOUND]: 'Tenant not found',
  [ErrorCodes.TENANT_ALREADY_EXISTS]: 'Tenant already exists',
  [ErrorCodes.TENANT_SCREENING_FAILED]: 'Tenant screening failed',
  [ErrorCodes.TENANT_BLACKLISTED]: 'Tenant is blacklisted',
  [ErrorCodes.INVALID_TENANT_DATA]: 'Invalid tenant data',
  
  [ErrorCodes.LEASE_NOT_FOUND]: 'Lease not found',
  [ErrorCodes.LEASE_ALREADY_EXISTS]: 'Lease already exists',
  [ErrorCodes.LEASE_OVERLAP]: 'Lease dates overlap with existing lease',
  [ErrorCodes.LEASE_TERMINATION_FAILED]: 'Lease termination failed',
  [ErrorCodes.LEASE_RENEWAL_FAILED]: 'Lease renewal failed',
  [ErrorCodes.INVALID_LEASE_DATA]: 'Invalid lease data',
  [ErrorCodes.LEASE_EXPIRED]: 'Lease has expired',
  
  [ErrorCodes.MAINTENANCE_REQUEST_NOT_FOUND]: 'Maintenance request not found',
  [ErrorCodes.MAINTENANCE_ASSIGNMENT_FAILED]: 'Maintenance assignment failed',
  [ErrorCodes.MAINTENANCE_APPROVAL_REQUIRED]: 'Maintenance requires approval',
  [ErrorCodes.VENDOR_UNAVAILABLE]: 'Vendor is unavailable',
  [ErrorCodes.INVALID_MAINTENANCE_DATA]: 'Invalid maintenance data',
  
  [ErrorCodes.WORK_ORDER_NOT_FOUND]: 'Work order not found',
  [ErrorCodes.WORK_ORDER_ALREADY_ASSIGNED]: 'Work order already assigned',
  [ErrorCodes.WORK_ORDER_COMPLETION_FAILED]: 'Work order completion failed',
  [ErrorCodes.INVALID_WORK_ORDER_DATA]: 'Invalid work order data',
  
  [ErrorCodes.TASK_NOT_FOUND]: 'Task not found',
  [ErrorCodes.TASK_ASSIGNMENT_FAILED]: 'Task assignment failed',
  [ErrorCodes.TASK_UPDATE_FAILED]: 'Task update failed',
  [ErrorCodes.INVALID_TASK_DATA]: 'Invalid task data',
  [ErrorCodes.TASK_OVERDUE]: 'Task is overdue',
  
  [ErrorCodes.ASSIGNMENT_NOT_FOUND]: 'Assignment not found',
  [ErrorCodes.ASSIGNMENT_ALREADY_EXISTS]: 'Assignment already exists',
  [ErrorCodes.ASSIGNMENT_REJECTED]: 'Assignment was rejected',
  [ErrorCodes.INVALID_ASSIGNMENT_DATA]: 'Invalid assignment data',
  
  [ErrorCodes.PAYMENT_NOT_FOUND]: 'Payment not found',
  [ErrorCodes.PAYMENT_PROCESSING_FAILED]: 'Payment processing failed',
  [ErrorCodes.INSUFFICIENT_FUNDS]: 'Insufficient funds',
  [ErrorCodes.PAYMENT_GATEWAY_ERROR]: 'Payment gateway error',
  [ErrorCodes.REFUND_FAILED]: 'Refund failed',
  [ErrorCodes.INVALID_PAYMENT_DATA]: 'Invalid payment data',
  [ErrorCodes.PAYMENT_ALREADY_PROCESSED]: 'Payment already processed',
  
  [ErrorCodes.TRANSACTION_NOT_FOUND]: 'Transaction not found',
  [ErrorCodes.TRANSACTION_PROCESSING_FAILED]: 'Transaction processing failed',
  [ErrorCodes.INVALID_TRANSACTION_DATA]: 'Invalid transaction data',
  
  [ErrorCodes.INVOICE_NOT_FOUND]: 'Invoice not found',
  [ErrorCodes.INVOICE_GENERATION_FAILED]: 'Invoice generation failed',
  [ErrorCodes.INVOICE_SENDING_FAILED]: 'Invoice sending failed',
  [ErrorCodes.INVALID_INVOICE_DATA]: 'Invalid invoice data',
  [ErrorCodes.INVOICE_ALREADY_PAID]: 'Invoice already paid',
  
  [ErrorCodes.COMPANY_NOT_FOUND]: 'Company not found',
  [ErrorCodes.COMPANY_ALREADY_EXISTS]: 'Company already exists',
  [ErrorCodes.COMPANY_ACCESS_DENIED]: 'Access to company denied',
  [ErrorCodes.INVALID_COMPANY_DATA]: 'Invalid company data',
  
  [ErrorCodes.PORTFOLIO_NOT_FOUND]: 'Portfolio not found',
  [ErrorCodes.PORTFOLIO_ALREADY_EXISTS]: 'Portfolio already exists',
  [ErrorCodes.PORTFOLIO_ACCESS_DENIED]: 'Access to portfolio denied',
  [ErrorCodes.INVALID_PORTFOLIO_DATA]: 'Invalid portfolio data',
  
  [ErrorCodes.VENDOR_NOT_FOUND]: 'Vendor not found',
  [ErrorCodes.VENDOR_ALREADY_EXISTS]: 'Vendor already exists',
  [ErrorCodes.VENDOR_APPROVAL_REQUIRED]: 'Vendor requires approval',
  [ErrorCodes.VENDOR_BLACKLISTED]: 'Vendor is blacklisted',
  [ErrorCodes.INVALID_VENDOR_DATA]: 'Invalid vendor data',
  
  [ErrorCodes.INTEGRATION_NOT_FOUND]: 'Integration not found',
  [ErrorCodes.INTEGRATION_FAILED]: 'Integration failed',
  [ErrorCodes.API_LIMIT_EXCEEDED]: 'API limit exceeded',
  [ErrorCodes.INVALID_API_KEY]: 'Invalid API key',
  [ErrorCodes.SYNC_FAILED]: 'Sync failed',
  [ErrorCodes.WEBHOOK_PROCESSING_FAILED]: 'Webhook processing failed',
  
  [ErrorCodes.MARKET_DATA_NOT_FOUND]: 'Market data not found',
  [ErrorCodes.MARKET_DATA_FETCH_FAILED]: 'Market data fetch failed',
  [ErrorCodes.INVALID_MARKET_DATA]: 'Invalid market data',
  [ErrorCodes.MARKET_DATA_EXPIRED]: 'Market data has expired',
  
  [ErrorCodes.MESSAGE_SENDING_FAILED]: 'Message sending failed',
  [ErrorCodes.NOTIFICATION_FAILED]: 'Notification failed',
  [ErrorCodes.EMAIL_SENDING_FAILED]: 'Email sending failed',
  [ErrorCodes.SMS_SENDING_FAILED]: 'SMS sending failed',
  [ErrorCodes.INVALID_MESSAGE_DATA]: 'Invalid message data',
  
  [ErrorCodes.DOCUMENT_NOT_FOUND]: 'Document not found',
  [ErrorCodes.DOCUMENT_UPLOAD_FAILED]: 'Document upload failed',
  [ErrorCodes.DOCUMENT_PROCESSING_FAILED]: 'Document processing failed',
  [ErrorCodes.INVALID_DOCUMENT_TYPE]: 'Invalid document type',
  [ErrorCodes.DOCUMENT_SIZE_EXCEEDED]: 'Document size exceeded',
  
  [ErrorCodes.REPORT_GENERATION_FAILED]: 'Report generation failed',
  [ErrorCodes.REPORT_NOT_FOUND]: 'Report not found',
  [ErrorCodes.REPORT_EXPORT_FAILED]: 'Report export failed',
  [ErrorCodes.INVALID_REPORT_PARAMETERS]: 'Invalid report parameters',
  
  [ErrorCodes.AUDIT_LOG_NOT_FOUND]: 'Audit log not found',
  [ErrorCodes.AUDIT_LOG_CREATION_FAILED]: 'Audit log creation failed',
  [ErrorCodes.AUDIT_EXPORT_FAILED]: 'Audit export failed',
  
  [ErrorCodes.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded',
  [ErrorCodes.TOO_MANY_REQUESTS]: 'Too many requests',
  
  [ErrorCodes.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ErrorCodes.SERVICE_UNAVAILABLE]: 'Service unavailable',
  [ErrorCodes.DATABASE_CONNECTION_FAILED]: 'Database connection failed',
  [ErrorCodes.CACHE_CONNECTION_FAILED]: 'Cache connection failed',
  [ErrorCodes.QUEUE_PROCESSING_FAILED]: 'Queue processing failed',
  [ErrorCodes.BACKGROUND_JOB_FAILED]: 'Background job failed',
  [ErrorCodes.SYSTEM_MAINTENANCE]: 'System under maintenance'
};

const getErrorMessage = (code, customMessage = null) => {
  return customMessage || ErrorMessages[code] || 'An unexpected error occurred';
};

const getHttpStatus = (code) => {
  // Map error codes to HTTP status codes
  const codeRanges = {
    1000: 400, // Bad Request
    2000: 401, // Unauthorized
    3000: 400, // Bad Request
    4000: 404, // Not Found
    5000: 400, // Bad Request
    6000: 404, // Not Found
    7000: 400, // Bad Request
    8000: 400, // Bad Request
    9000: 429, // Too Many Requests
    10000: 500  // Internal Server Error
  };
  
  const range = Math.floor(code / 1000) * 1000;
  return codeRanges[range] || 500;
};

module.exports = {
  ErrorCodes,
  ErrorMessages,
  getErrorMessage,
  getHttpStatus
};