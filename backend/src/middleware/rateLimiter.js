const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');
const { RateLimiterMemory, RateLimiterRedis } = require('rate-limiter-flexible');

// Redis client for rate limiting
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * General API rate limiter
 */
const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:api:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
  keyGenerator: (req) => {
    return req.ip; // Use IP address as key
  },
  skip: (req) => {
    // Skip rate limiting for certain paths or IPs
    const skipPaths = ['/health', '/status', '/metrics'];
    if (skipPaths.includes(req.path)) {
      return true;
    }
    
    // Skip for trusted IPs (admin, internal services)
    const trustedIPs = ['127.0.0.1', '::1', '10.0.0.0/8', '192.168.0.0/16'];
    return trustedIPs.some(ip => req.ip.startsWith(ip));
  }
});

/**
 * Authentication rate limiter (stricter)
 */
const authLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:auth:'
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  message: {
    success: false,
    message: 'Too many login attempts, please try again after an hour'
  },
  skipSuccessfulRequests: true // Don't count successful logins
});

/**
 * Property upload rate limiter
 */
const uploadLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:upload:'
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit to 50 uploads per hour per user
  message: {
    success: false,
    message: 'Too many uploads, please try again after an hour'
  },
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise IP
    return req.user ? `user:${req.user.id}` : req.ip;
  }
});

/**
 * API key rate limiter
 */
const apiKeyLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:apikey:'
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute per API key
  message: {
    success: false,
    message: 'API rate limit exceeded'
  },
  keyGenerator: (req) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    return apiKey || req.ip;
  }
});

/**
 * Dynamic rate limiter based on user role
 */
const dynamicLimiter = (req, res, next) => {
  let windowMs, maxRequests;
  
  if (!req.user) {
    // Guest/unauthenticated users
    windowMs = 15 * 60 * 1000; // 15 minutes
    maxRequests = 30;
  } else {
    // Based on user role
    const userRoles = req.user.Roles?.map(role => role.name) || [];
    
    if (userRoles.includes('system_admin')) {
      windowMs = 60 * 1000; // 1 minute
      maxRequests = 1000; // High limit for admins
    } else if (userRoles.includes('company_admin')) {
      windowMs = 60 * 1000;
      maxRequests = 500;
    } else if (userRoles.includes('property_manager')) {
      windowMs = 60 * 1000;
      maxRequests = 300;
    } else if (userRoles.includes('landlord')) {
      windowMs = 60 * 1000;
      maxRequests = 200;
    } else if (userRoles.includes('tenant')) {
      windowMs = 60 * 1000;
      maxRequests = 100;
    } else {
      windowMs = 15 * 60 * 1000;
      maxRequests = 50;
    }
  }
  
  const limiter = rateLimit({
    store: new RedisStore({
      client: redisClient,
      prefix: 'rl:dynamic:'
    }),
    windowMs,
    max: maxRequests,
    message: {
      success: false,
      message: 'Rate limit exceeded for your account type'
    },
    keyGenerator: (req) => {
      return req.user ? `user:${req.user.id}` : req.ip;
    }
  });
  
  limiter(req, res, next);
};

/**
 * Rate limiter for specific endpoints with burst protection
 */
const burstLimiter = (points = 10, duration = 1) => {
  const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'burst',
    points: points, // Number of points
    duration: duration, // Per second(s)
    blockDuration: 60, // Block for 60 seconds if exceeded
  });
  
  return async (req, res, next) => {
    const key = req.user ? `user:${req.user.id}:${req.path}` : `${req.ip}:${req.path}`;
    
    try {
      await rateLimiter.consume(key, 1);
      next();
    } catch (rejRes) {
      const retryAfter = Math.ceil(rejRes.msBeforeNext / 1000) || 1;
      
      res.set('Retry-After', retryAfter.toString());
      return res.status(429).json({
        success: false,
        message: `Too many requests. Please try again in ${retryAfter} seconds.`,
        retryAfter
      });
    }
  };
};

/**
 * Concurrent request limiter
 */
const concurrentLimiter = new RateLimiterMemory({
  points: 5, // 5 concurrent requests
  duration: 1,
});

const concurrentRequestLimiter = async (req, res, next) => {
  const key = req.user ? `user:${req.user.id}` : req.ip;
  
  try {
    await concurrentLimiter.consume(key);
    
    // Release the point when response is sent
    const originalSend = res.send;
    res.send = function (...args) {
      concurrentLimiter.delete(key);
      originalSend.apply(this, args);
    };
    
    next();
  } catch (rejRes) {
    return res.status(429).json({
      success: false,
      message: 'Too many concurrent requests. Please wait a moment.'
    });
  }
};

/**
 * Rate limiter for file downloads
 */
const downloadLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:download:'
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Max 20 downloads per hour
  message: {
    success: false,
    message: 'Download limit exceeded. Please try again in an hour.'
  }
});

/**
 * Middleware to set rate limit headers
 */
const rateLimitHeaders = (req, res, next) => {
  // Custom headers for rate limit information
  res.set({
    'X-RateLimit-Limit': req.rateLimit?.limit || 'unlimited',
    'X-RateLimit-Remaining': req.rateLimit?.remaining || 'unlimited',
    'X-RateLimit-Reset': req.rateLimit?.resetTime || 'N/A'
  });
  
  next();
};

/**
 * Reset rate limit for a specific key
 */
const resetRateLimit = async (key) => {
  try {
    await redisClient.del(`rl:api:${key}`);
    await redisClient.del(`rl:auth:${key}`);
    await redisClient.del(`rl:upload:${key}`);
    await redisClient.del(`rl:dynamic:${key}`);
    return true;
  } catch (error) {
    console.error('Error resetting rate limit:', error);
    return false;
  }
};

/**
 * Get rate limit info for debugging
 */
const getRateLimitInfo = async (key) => {
  try {
    const keys = [
      `rl:api:${key}`,
      `rl:auth:${key}`,
      `rl:upload:${key}`,
      `rl:dynamic:${key}`
    ];
    
    const info = {};
    
    for (const redisKey of keys) {
      const data = await redisClient.get(redisKey);
      if (data) {
        const parsed = JSON.parse(data);
        info[redisKey] = parsed;
      }
    }
    
    return info;
  } catch (error) {
    console.error('Error getting rate limit info:', error);
    return null;
  }
};

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  apiKeyLimiter,
  dynamicLimiter,
  burstLimiter,
  concurrentRequestLimiter,
  downloadLimiter,
  rateLimitHeaders,
  resetRateLimit,
  getRateLimitInfo
};