const config = require('../config')

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = null, details = null) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.isOperational = true
    
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Validation error class
 */
class ValidationError extends AppError {
  constructor(message, errors = {}) {
    super(message, 422, 'VALIDATION_ERROR', errors)
    this.name = 'ValidationError'
    this.errors = errors
  }
}

/**
 * Authentication error class
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
  }
}

/**
 * Authorization error class
 */
class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR')
    this.name = 'AuthorizationError'
  }
}

/**
 * Not found error class
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR')
    this.name = 'NotFoundError'
  }
}

/**
 * Conflict error class
 */
class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR')
    this.name = 'ConflictError'
  }
}

/**
 * Rate limit error class
 */
class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_ERROR')
    this.name = 'RateLimitError'
  }
}

/**
 * Database error handler
 */
const handleDatabaseError = (error) => {
  console.error('Database error:', error)

  // Sequelize validation errors
  if (error.name === 'SequelizeValidationError') {
    const errors = {}
    error.errors.forEach(err => {
      errors[err.path] = err.message
    })
    return new ValidationError('Validation failed', errors)
  }

  // Sequelize unique constraint errors
  if (error.name === 'SequelizeUniqueConstraintError') {
    const field = error.errors[0]?.path || 'field'
    const value = error.errors[0]?.value || 'value'
    return new ConflictError(`${field} '${value}' already exists`)
  }

  // Sequelize foreign key constraint errors
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return new ValidationError('Invalid reference to related resource')
  }

  // Sequelize connection errors
  if (error.name === 'SequelizeConnectionError') {
    return new AppError('Database connection failed', 503, 'DATABASE_CONNECTION_ERROR')
  }

  // Sequelize timeout errors
  if (error.name === 'SequelizeTimeoutError') {
    return new AppError('Database operation timed out', 504, 'DATABASE_TIMEOUT_ERROR')
  }

  // Generic database error
  return new AppError('Database operation failed', 500, 'DATABASE_ERROR')
}

/**
 * JWT error handler
 */
const handleJWTError = (error) => {
  if (error.name === 'JsonWebTokenError') {
    return new AuthenticationError('Invalid token')
  }
  
  if (error.name === 'TokenExpiredError') {
    return new AuthenticationError('Token expired')
  }
  
  if (error.name === 'NotBeforeError') {
    return new AuthenticationError('Token not active')
  }
  
  return new AuthenticationError('Token verification failed')
}

/**
 * Multer error handler
 */
const handleMulterError = (error) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return new ValidationError('File too large', {
      file: `File size exceeds the maximum limit of ${config.upload.maxFileSize} bytes`
    })
  }
  
  if (error.code === 'LIMIT_FILE_COUNT') {
    return new ValidationError('Too many files', {
      files: 'Number of files exceeds the maximum limit'
    })
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return new ValidationError('Unexpected file field', {
      file: `Unexpected field: ${error.field}`
    })
  }
  
  return new ValidationError('File upload failed', { file: error.message })
}

/**
 * Axios error handler (for external API calls)
 */
const handleAxiosError = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status
    const message = error.response.data?.message || 'External service error'
    
    if (status >= 400 && status < 500) {
      return new ValidationError(`External service validation error: ${message}`)
    }
    
    return new AppError(`External service error: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR')
  }
  
  if (error.request) {
    // Request was made but no response received
    return new AppError('External service unavailable', 503, 'EXTERNAL_SERVICE_UNAVAILABLE')
  }
  
  // Request setup error
  return new AppError('External service configuration error', 500, 'EXTERNAL_SERVICE_CONFIG_ERROR')
}

/**
 * Send error response in development
 */
const sendErrorDev = (err, req, res) => {
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    code: err.code,
    details: err.details,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    user: req.user?.id,
  })

  res.status(err.statusCode || 500).json({
    error: err.name || 'Error',
    message: err.message,
    code: err.code,
    details: err.details,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    requestId: req.id,
  })
}

/**
 * Send error response in production
 */
const sendErrorProd = (err, req, res) => {
  // Log error for monitoring
  console.error('Production error:', {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode,
    code: err.code,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.user?.id,
    timestamp: new Date().toISOString(),
  })

  // Send user-friendly error message
  if (err.isOperational) {
    // Operational errors - safe to send to client
    res.status(err.statusCode || 500).json({
      error: err.name || 'Error',
      message: err.message,
      code: err.code,
      details: err.details,
      timestamp: new Date().toISOString(),
      requestId: req.id,
    })
  } else {
    // Programming errors - don't leak details
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong. Please try again later.',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      requestId: req.id,
    })
  }
}

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Handle specific error types
  if (err.name?.startsWith('Sequelize')) {
    error = handleDatabaseError(err)
  } else if (err.name?.includes('JsonWebToken') || err.name?.includes('Token')) {
    error = handleJWTError(err)
  } else if (err.name === 'MulterError') {
    error = handleMulterError(err)
  } else if (err.isAxiosError) {
    error = handleAxiosError(err)
  } else if (err.name === 'CastError') {
    error = new ValidationError('Invalid ID format')
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    const field = Object.keys(err.keyValue)[0]
    error = new ConflictError(`${field} already exists`)
  }

  // Send error response
  if (config.NODE_ENV === 'development') {
    sendErrorDev(error, req, res)
  } else {
    sendErrorProd(error, req, res)
  }
}

/**
 * Async error wrapper
 * Catches async errors and passes them to error handler
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * 404 handler
 */
const notFound = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`)
  next(error)
}

/**
 * Validation error helper
 */
const createValidationError = (errors) => {
  return new ValidationError('Validation failed', errors)
}

/**
 * Success response helper
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200, meta = {}) => {
  const response = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    ...meta,
  }

  res.status(statusCode).json(response)
}

/**
 * Paginated response helper
 */
const sendPaginatedResponse = (res, data, pagination, message = 'Success') => {
  const response = {
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.limit),
      hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrev: pagination.page > 1,
    },
    timestamp: new Date().toISOString(),
  }

  // Set pagination headers
  res.setHeader('X-Total-Count', pagination.total)
  res.setHeader('X-Page-Count', Math.ceil(pagination.total / pagination.limit))
  res.setHeader('X-Current-Page', pagination.page)
  res.setHeader('X-Per-Page', pagination.limit)

  res.status(200).json(response)
}

module.exports = {
  // Error classes
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,

  // Error handlers
  errorHandler,
  asyncHandler,
  notFound,

  // Error helpers
  handleDatabaseError,
  handleJWTError,
  handleMulterError,
  handleAxiosError,
  createValidationError,

  // Response helpers
  sendSuccess,
  sendPaginatedResponse,
}