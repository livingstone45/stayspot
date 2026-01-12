/**
 * API Response and Request Types
 * Comprehensive type definitions for all API communication
 */

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  // 2xx Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // 3xx Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  
  // 4xx Client Error
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // 5xx Server Error
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
};

/**
 * API Response Format
 */
export const API_RESPONSE_FORMAT = {
  STANDARD: 'standard',
  PAGINATED: 'paginated',
  NESTED: 'nested',
  STREAM: 'stream',
  WEBHOOK: 'webhook'
};

/**
 * Error Types
 */
export const ERROR_TYPES = {
  VALIDATION_ERROR: 'validation_error',
  AUTHENTICATION_ERROR: 'authentication_error',
  AUTHORIZATION_ERROR: 'authorization_error',
  NOT_FOUND_ERROR: 'not_found_error',
  CONFLICT_ERROR: 'conflict_error',
  BUSINESS_LOGIC_ERROR: 'business_logic_error',
  DATABASE_ERROR: 'database_error',
  EXTERNAL_SERVICE_ERROR: 'external_service_error',
  RATE_LIMIT_ERROR: 'rate_limit_error',
  SERVER_ERROR: 'server_error'
};

/**
 * Request Methods
 */
export const REQUEST_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD'
};

/**
 * Content Types
 */
export const CONTENT_TYPES = {
  JSON: 'application/json',
  XML: 'application/xml',
  FORM_DATA: 'application/x-www-form-urlencoded',
  MULTIPART: 'multipart/form-data',
  PLAIN_TEXT: 'text/plain',
  HTML: 'text/html',
  CSV: 'text/csv',
  PDF: 'application/pdf'
};

/**
 * @typedef {Object} APIResponse
 * @property {boolean} success - Operation success status
 * @property {number} status - HTTP status code
 * @property {string} message - Response message
 * @property {*} data - Response data payload
 * @property {Object} errors - Validation or business logic errors
 * @property {string} requestId - Unique request identifier
 * @property {Date} timestamp - Response timestamp
 * @property {string} version - API version
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {boolean} success - Operation success status
 * @property {string} message - Response message
 * @property {Object} data - Response data
 * @property {*[]} data.items - Array of items
 * @property {Object} data.pagination - Pagination metadata
 * @property {number} data.pagination.page - Current page number
 * @property {number} data.pagination.pageSize - Items per page
 * @property {number} data.pagination.total - Total items
 * @property {number} data.pagination.pages - Total pages
 * @property {string} data.pagination.sortBy - Sort field
 * @property {string} data.pagination.sortOrder - Sort direction
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {boolean} success - Always false for errors
 * @property {number} status - HTTP status code
 * @property {string} errorType - Type of error
 * @property {string} message - Error message
 * @property {Object[]} errors - Detailed errors array
 * @property {string} errors[].field - Field name (if applicable)
 * @property {string} errors[].message - Error message for field
 * @property {string} errors[].code - Error code
 * @property {string} requestId - Unique request identifier
 * @property {Date} timestamp - Error timestamp
 */

/**
 * @typedef {Object} ValidationError
 * @property {string} field - Field name
 * @property {string} message - Error message
 * @property {string} code - Error code
 * @property {*} value - Invalid value
 * @property {string} validator - Validator that failed
 */

/**
 * @typedef {Object} PaginationParams
 * @property {number} page - Page number (default: 1)
 * @property {number} pageSize - Items per page (default: 20)
 * @property {string} sortBy - Field to sort by
 * @property {string} sortOrder - Sort order (asc/desc)
 * @property {string} search - Search query
 * @property {Object} filters - Additional filters
 */

/**
 * @typedef {Object} RequestMetadata
 * @property {string} requestId - Unique request identifier
 * @property {string} userId - Requesting user ID
 * @property {string} ip - Client IP address
 * @property {string} userAgent - Client user agent
 * @property {Date} timestamp - Request timestamp
 * @property {Object} headers - Request headers
 * @property {string} method - HTTP method
 * @property {string} path - Request path
 */

/**
 * @typedef {Object} BatchRequest
 * @property {string} method - HTTP method
 * @property {string} path - Request path
 * @property {Object} body - Request body
 * @property {Object} headers - Additional headers
 */

/**
 * @typedef {Object} BatchResponse
 * @property {number} status - Response status
 * @property {Object} headers - Response headers
 * @property {*} body - Response body
 * @property {string} path - Request path
 */

/**
 * @typedef {Object} WebhookPayload
 * @property {string} event - Event type
 * @property {Date} timestamp - Event timestamp
 * @property {string} resourceType - Type of resource
 * @property {string} resourceId - Resource identifier
 * @property {string} action - Action performed
 * @property {Object} data - Event data
 * @property {Object} previousData - Previous state (for updates)
 * @property {string} triggeredBy - User ID who triggered event
 */

/**
 * @typedef {Object} RateLimitInfo
 * @property {number} limit - Request limit
 * @property {number} remaining - Remaining requests
 * @property {number} reset - Timestamp when limit resets
 * @property {string} retryAfter - Seconds to retry after
 */

/**
 * @typedef {Object} CacheConfig
 * @property {boolean} enabled - Is caching enabled
 * @property {number} ttl - Time to live in seconds
 * @property {string} key - Cache key
 * @property {string} strategy - Cache strategy (LRU, LFU, etc.)
 */

// API Error Messages
export const API_ERROR_MESSAGES = {
  INVALID_REQUEST: 'Invalid request parameters',
  UNAUTHORIZED: 'User is not authenticated',
  FORBIDDEN: 'User does not have permission',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource conflict',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded'
};

/**
 * API Response builder utility
 */
export const buildAPIResponse = (success, message, data = null, status = 200) => {
  return {
    success,
    status,
    message,
    data,
    timestamp: new Date(),
    requestId: generateRequestId()
  };
};

/**
 * Error response builder utility
 */
export const buildErrorResponse = (errorType, message, errors = [], status = 400) => {
  return {
    success: false,
    status,
    errorType,
    message,
    errors,
    timestamp: new Date(),
    requestId: generateRequestId()
  };
};

/**
 * Paginated response builder utility
 */
export const buildPaginatedResponse = (items, pagination, message = 'Success') => {
  return {
    success: true,
    message,
    data: {
      items,
      pagination: {
        page: pagination.page || 1,
        pageSize: pagination.pageSize || 20,
        total: pagination.total || items.length,
        pages: Math.ceil((pagination.total || items.length) / (pagination.pageSize || 20)),
        sortBy: pagination.sortBy || 'createdAt',
        sortOrder: pagination.sortOrder || 'desc'
      }
    },
    timestamp: new Date(),
    requestId: generateRequestId()
  };
};

/**
 * Generate unique request ID
 */
export const generateRequestId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Parse pagination parameters from query
 */
export const parsePaginationParams = (query = {}) => {
  return {
    page: parseInt(query.page) || 1,
    pageSize: parseInt(query.pageSize) || 20,
    sortBy: query.sortBy || 'createdAt',
    sortOrder: query.sortOrder || 'desc',
    search: query.search || '',
    filters: query.filters || {}
  };
};

/**
 * Validate pagination parameters
 */
export const validatePaginationParams = (params) => {
  const errors = [];
  
  if (params.page < 1) {
    errors.push({ field: 'page', message: 'Page must be greater than 0' });
  }
  
  if (params.pageSize < 1 || params.pageSize > 100) {
    errors.push({ field: 'pageSize', message: 'Page size must be between 1 and 100' });
  }
  
  if (!['asc', 'desc'].includes(params.sortOrder?.toLowerCase())) {
    errors.push({ field: 'sortOrder', message: 'Sort order must be asc or desc' });
  }
  
  return errors;
};

module.exports = {
  HTTP_STATUS,
  API_RESPONSE_FORMAT,
  ERROR_TYPES,
  REQUEST_METHODS,
  CONTENT_TYPES,
  API_ERROR_MESSAGES,
  buildAPIResponse,
  buildErrorResponse,
  buildPaginatedResponse,
  generateRequestId,
  parsePaginationParams,
  validatePaginationParams
};
