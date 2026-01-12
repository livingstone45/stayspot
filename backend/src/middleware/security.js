const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'ws:', 'wss:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
});

// Rate limiting
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too Many Requests',
      message,
      retryAfter: Math.round(windowMs / 1000)
    });
  }
});

const generalLimiter = createRateLimit(
  15 * 60 * 1000,
  process.env.NODE_ENV === 'production' ? 100 : 1000,
  'Too many requests from this IP'
);

const authLimiter = createRateLimit(
  15 * 60 * 1000,
  5,
  'Too many authentication attempts'
);

const uploadLimiter = createRateLimit(
  60 * 1000,
  10,
  'Too many upload requests'
);

// IP whitelist middleware
const ipWhitelist = (req, res, next) => {
  const allowedIPs = process.env.ALLOWED_IPS?.split(',') || [];
  
  if (allowedIPs.length === 0) {
    return next();
  }
  
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (allowedIPs.includes(clientIP)) {
    next();
  } else {
    res.status(403).json({ error: 'IP not allowed' });
  }
};

module.exports = {
  securityHeaders,
  generalLimiter,
  authLimiter,
  uploadLimiter,
  ipWhitelist
};