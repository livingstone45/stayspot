const authMiddleware = require('./auth');
const uploadMiddleware = require('./upload');
const validationMiddleware = require('./validation');
const rateLimiterMiddleware = require('./rateLimiter');
const roleCheckMiddleware = require('./roleCheck');
const errorHandlerMiddleware = require('./errorHandler');

module.exports = {
  ...authMiddleware,
  ...uploadMiddleware,
  ...validationMiddleware,
  ...rateLimiterMiddleware,
  ...roleCheckMiddleware,
  ...errorHandlerMiddleware
};