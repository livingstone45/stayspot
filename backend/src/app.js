const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

// Import middleware
const { errorHandler } = require('./middleware/errorHandler')
const { auth } = require('./middleware/auth')
const { validation } = require('./middleware/validation')
const { upload } = require('./middleware/upload')

// Import routes
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const propertyRoutes = require('./routes/property.routes')
const managementRoutes = require('./routes/management.routes')
const tenantRoutes = require('./routes/tenant.routes')
const maintenanceRoutes = require('./routes/maintenance.routes')
const financialRoutes = require('./routes/financial.routes')
const paymentRoutes = require('./routes/payment.routes')
const taskRoutes = require('./routes/task.routes')
const integrationRoutes = require('./routes/integration.routes')
const communicationRoutes = require('./routes/communication.routes')
const systemRoutes = require('./routes/system.routes')
const transportationRoutes = require('./routes/transportation.routes')
const supportRoutes = require('./routes/support.routes')
const securityRoutes = require('./routes/security.routes')
const settingsRoutes = require('./routes/settings.routes')

// Create Express app
const app = express()

// Trust proxy (for deployment behind reverse proxy)
app.set('trust proxy', 1)

// Security middleware
app.use(helmet({
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
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://stayspot.app', // Production domain
    ]
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-HTTP-Method-Override',
    'Accept',
    'Cache-Control',
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page',
    'X-Per-Page',
  ],
  maxAge: 86400, // 24 hours
}

app.use(cors(corsOptions))

// Rate limiting configuration
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too Many Requests',
        message,
        retryAfter: Math.round(windowMs / 1000),
      })
    },
  })
}

// General API rate limiting
const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  process.env.NODE_ENV === 'production' ? 100 : 1000,
  'Too many requests from this IP, please try again later.'
)

// Strict rate limiting for authentication
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5,
  'Too many authentication attempts, please try again later.'
)

// Upload rate limiting
const uploadLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  10,
  'Too many upload requests, please try again later.'
)

// Apply rate limiting
app.use('/api/', generalLimiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/auth/forgot-password', authLimiter)
app.use('/api/*/upload', uploadLimiter)

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}))
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}))

// Compression middleware
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false
    }
    return compression.filter(req, res)
  },
  level: 6,
  threshold: 1024,
}))

// Logging middleware
const morganFormat = process.env.NODE_ENV === 'production' 
  ? 'combined' 
  : ':method :url :status :res[content-length] - :response-time ms'

app.use(morgan(morganFormat, {
  skip: (req, res) => {
    // Skip logging for health checks and static files
    return req.url === '/health' || req.url.startsWith('/static/')
  }
}))

// Request ID middleware
app.use((req, res, next) => {
  req.id = require('crypto').randomUUID()
  res.setHeader('X-Request-ID', req.id)
  next()
})

// Request timing middleware
app.use((req, res, next) => {
  req.startTime = Date.now()
  
  const originalSend = res.send
  res.send = function(data) {
    const duration = Date.now() - req.startTime
    res.setHeader('X-Response-Time', `${duration}ms`)
    return originalSend.call(this, data)
  }
  
  next()
})

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'StaySpot API',
    version: process.env.npm_package_version || '1.0.0',
    description: 'Comprehensive property management platform API',
    environment: process.env.NODE_ENV,
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      properties: '/api/properties',
      management: '/api/management',
      tenants: '/api/tenants',
      maintenance: '/api/maintenance',
      financial: '/api/financial',
      tasks: '/api/tasks',
      integrations: '/api/integrations',
      communication: '/api/communication',
      system: '/api/system',
    },
    documentation: '/api/docs',
    health: '/health',
  })
})

// Health check endpoint
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
    },
    cpu: process.cpuUsage(),
  }

  res.status(200).json(healthCheck)
})

// Detailed health check endpoint
app.get('/health/detailed', async (req, res) => {
  const { sequelize } = require('./models')
  const redis = require('./config/redis')
  
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'OK',
    services: {},
  }

  try {
    // Database health check
    await sequelize.authenticate()
    checks.services.database = { status: 'OK', message: 'Connected' }
  } catch (error) {
    checks.services.database = { status: 'ERROR', message: error.message }
    checks.status = 'ERROR'
  }

  try {
    // Redis health check
    if (redis) {
      await redis.ping()
      checks.services.redis = { status: 'OK', message: 'Connected' }
    } else {
      checks.services.redis = { status: 'DISABLED', message: 'Not configured' }
    }
  } catch (error) {
    checks.services.redis = { status: 'ERROR', message: error.message }
    checks.status = 'ERROR'
  }

  // External services health check
  checks.services.external = {
    cloudinary: process.env.CLOUDINARY_URL ? 'CONFIGURED' : 'NOT_CONFIGURED',
    email: process.env.SMTP_HOST ? 'CONFIGURED' : 'NOT_CONFIGURED',
    maps: process.env.GOOGLE_MAPS_API_KEY ? 'CONFIGURED' : 'NOT_CONFIGURED',
  }

  const statusCode = checks.status === 'OK' ? 200 : 503
  res.status(statusCode).json(checks)
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', auth, userRoutes)
app.use('/api/properties', propertyRoutes) // Some endpoints are public
app.use('/api/management', auth, managementRoutes)
app.use('/api/tenants', auth, tenantRoutes)
app.use('/api/maintenance', auth, maintenanceRoutes)
app.use('/api/financial', auth, financialRoutes)
app.use('/api/payments', auth, paymentRoutes)
app.use('/api/tasks', auth, taskRoutes)
app.use('/api/integrations', auth, integrationRoutes)
app.use('/api/communication', auth, communicationRoutes)
app.use('/api/system', auth, systemRoutes)
app.use('/api/transportation', auth, transportationRoutes)
app.use('/api/support', auth, supportRoutes)
app.use('/api/security', auth, securityRoutes)
app.use('/api/settings', auth, settingsRoutes)

// Serve uploaded files
app.use('/uploads', express.static('uploads', {
  maxAge: '1d',
  etag: true,
  lastModified: true,
}))

// API documentation (in development)
if (process.env.NODE_ENV === 'development') {
  app.get('/api/docs', (req, res) => {
    res.json({
      message: 'API Documentation',
      note: 'In development, consider integrating Swagger/OpenAPI',
      routes: app._router.stack
        .filter(r => r.route)
        .map(r => ({
          path: r.route.path,
          methods: Object.keys(r.route.methods),
        })),
    })
  })
}

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path')
  const frontendPath = path.join(__dirname, '../../frontend/dist')
  
  app.use(express.static(frontendPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
  }))
  
  // Handle client-side routing
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({
        error: 'API endpoint not found',
        path: req.path,
      })
    }
    
    res.sendFile(path.join(frontendPath, 'index.html'))
  })
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `The requested API endpoint ${req.originalUrl} does not exist.`,
    availableEndpoints: [
      '/api/auth',
      '/api/users',
      '/api/properties',
      '/api/management',
      '/api/tenants',
      '/api/maintenance',
      '/api/financial',
      '/api/tasks',
      '/api/integrations',
      '/api/communication',
      '/api/system',
    ],
  })
})

// Global 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist.`,
  })
})

// Global error handler (must be last)
app.use(errorHandler)

module.exports = app