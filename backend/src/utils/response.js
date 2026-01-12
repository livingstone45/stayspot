/**
 * Standardized API response utilities
 */

/**
 * Success response
 */
const success = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Error response
 */
const error = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

/**
 * Validation error response
 */
const validationError = (res, errors, message = 'Validation failed') => {
  return res.status(400).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

/**
 * Not found response
 */
const notFound = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};

/**
 * Unauthorized response
 */
const unauthorized = (res, message = 'Unauthorized access') => {
  return res.status(401).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};

/**
 * Forbidden response
 */
const forbidden = (res, message = 'Access forbidden') => {
  return res.status(403).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};

/**
 * Conflict response
 */
const conflict = (res, message = 'Resource conflict') => {
  return res.status(409).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};

/**
 * Too many requests response
 */
const tooManyRequests = (res, message = 'Too many requests') => {
  return res.status(429).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};

/**
 * Paginated response
 */
const paginated = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.limit),
      hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrev: pagination.page > 1
    },
    timestamp: new Date().toISOString()
  });
};

/**
 * Created response
 */
const created = (res, data = null, message = 'Resource created successfully') => {
  return res.status(201).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * No content response
 */
const noContent = (res) => {
  return res.status(204).send();
};

module.exports = {
  success,
  error,
  validationError,
  notFound,
  unauthorized,
  forbidden,
  conflict,
  tooManyRequests,
  paginated,
  created,
  noContent
};