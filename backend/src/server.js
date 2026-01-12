const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const { createServer } = require('http')
const { Server } = require('socket.io')
require('dotenv').config()

// Import configurations
const config = require('./config')
const { sequelize } = require('./models')
const { getCorsOrigin, getBackendUrl, getPort } = require('./utils/urlHelper')

// Import middleware
const { errorHandler } = require('./middleware/errorHandler')
const { auth } = require('./middleware/auth')

// Import routes
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const propertyRoutes = require('./routes/property.routes')
const managementRoutes = require('./routes/management.routes')
const tenantRoutes = require('./routes/tenant.routes')
const maintenanceRoutes = require('./routes/maintenance.routes')
const financialRoutes = require('./routes/financial.routes')
const taskRoutes = require('./routes/task.routes')
const integrationRoutes = require('./routes/integration.routes')
const communicationRoutes = require('./routes/communication.routes')
// const systemRoutes = require('./routes/system.routes') // TODO: Fix system routes

// Import socket handlers
const { initializeSocket } = require('./socket/connection.handler')

// Import workers
const { startWorkers } = require('./workers')

// Create Express app
const app = express()
const server = createServer(app)

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: getCorsOrigin(),
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})

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
    },
  },
  crossOriginEmbedderPolicy: false,
}))

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ]
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/', limiter)

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 5 : 100, // Dev: 100, Prod: 5
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
  skipSuccessfulRequests: true,
})

app.use('/api/auth/login', process.env.NODE_ENV === 'production' ? authLimiter : (req, res, next) => next())
app.use('/api/auth/register', process.env.NODE_ENV === 'production' ? authLimiter : (req, res, next) => next())
app.use('/api/auth/forgot-password', process.env.NODE_ENV === 'production' ? authLimiter : (req, res, next) => next())

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression middleware
app.use(compression())

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', auth, userRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/management', auth, managementRoutes)
app.use('/api/tenants', auth, tenantRoutes)
app.use('/api/maintenance', auth, maintenanceRoutes)
app.use('/api/financial', auth, financialRoutes)
app.use('/api/tasks', auth, taskRoutes)
app.use('/api/integrations', auth, integrationRoutes)
app.use('/api/communication', auth, communicationRoutes)
// app.use('/api/system', auth, systemRoutes) // TODO: Fix system routes

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path')
  app.use(express.static(path.join(__dirname, '../../frontend/dist')))
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
  })
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist.`,
  })
})

// Global error handler
app.use(errorHandler)

// Initialize Socket.IO
initializeSocket(io)

// Database connection and server startup
async function startServer() {
  try {
    // Test database connection (keep connection alive)
    await sequelize.authenticate()
    console.log('✅ Database connection established successfully.')

    // Start server with dynamic port based on environment
    const PORT = getPort()
    const backendUrl = getBackendUrl()
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 Environment: ${process.env.NODE_ENV}`)
      console.log(`🔗 API URL: ${backendUrl}`)
      console.log(`✅ Database: Connected to ${process.env.DB_NAME}`)
    })

    // Graceful shutdown
    process.on('SIGTERM', gracefulShutdown)
    process.on('SIGINT', gracefulShutdown)
    
    // Keep connection alive
    const healthCheckInterval = setInterval(async () => {
      try {
        await sequelize.authenticate()
      } catch (error) {
        console.error('Database connection lost:', error.message)
      }
    }, 30000) // Check every 30 seconds
    
    // Store interval ID for cleanup
    global.dbHealthCheckInterval = healthCheckInterval

  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown function
async function gracefulShutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`)

  try {
    // Clear health check interval
    if (global.dbHealthCheckInterval) {
      clearInterval(global.dbHealthCheckInterval)
      console.log('✅ Database health check interval cleared.')
    }
    
    // Close server
    server.close(() => {
      console.log('✅ HTTP server closed.')
    })

    // Close database connection
    await sequelize.close()
    console.log('✅ Database connection closed.')

    // Close Socket.IO connections
    io.close(() => {
      console.log('✅ Socket.IO server closed.')
    })

    console.log('✅ Graceful shutdown completed.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error)
    process.exit(1)
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Start the server
startServer()

module.exports = { app, server, io }
