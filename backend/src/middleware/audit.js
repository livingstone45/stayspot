const { AuditLog } = require('../models');
const { logger } = require('../utils/logger');

const auditMiddleware = (action, resource) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log the audit trail
      logAuditTrail(req, res, action, resource, data);
      return originalSend.call(this, data);
    };
    
    next();
  };
};

const logAuditTrail = async (req, res, action, resource, responseData) => {
  try {
    const auditData = {
      userId: req.user?.id || null,
      action,
      resource,
      resourceId: req.params.id || null,
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip,
      requestBody: sanitizeData(req.body),
      responseStatus: res.statusCode,
      timestamp: new Date()
    };

    // Only log successful operations or errors
    if (res.statusCode < 400 || res.statusCode >= 500) {
      await AuditLog.create(auditData);
    }

    // Log to file for critical actions
    if (isCriticalAction(action)) {
      logger.info('Audit Trail:', auditData);
    }
  } catch (error) {
    logger.error('Audit logging failed:', error);
  }
};

const sanitizeData = (data) => {
  if (!data) return null;
  
  const sanitized = { ...data };
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'secret', 'key'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

const isCriticalAction = (action) => {
  const criticalActions = [
    'user.create',
    'user.delete',
    'property.delete',
    'payment.process',
    'lease.create',
    'lease.terminate'
  ];
  
  return criticalActions.includes(action);
};

module.exports = {
  auditMiddleware,
  logAuditTrail
};