const express = require('express')
const router = express.Router()

// Import route modules
const authRoutes = require('./auth.routes')
const userRoutes = require('./user.routes')
const propertyRoutes = require('./property.routes')
const tenantRoutes = require('./tenant.routes')
const taskRoutes = require('./task.routes')
const maintenanceRoutes = require('./maintenance.routes')
const financialRoutes = require('./financial.routes')
const managementRoutes = require('./management.routes')
const communicationRoutes = require('./communication.routes')
const integrationRoutes = require('./integration.routes')
const systemRoutes = require('./system.routes')

// API version and health check
router.get('/', (req, res) => {
  res.json({
    message: 'StaySpot API v1.0',
    status: 'active',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '1.0.0'
  })
})

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Mount route modules
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/properties', propertyRoutes)
router.use('/tenants', tenantRoutes)
router.use('/tasks', taskRoutes)
router.use('/maintenance', maintenanceRoutes)
router.use('/financial', financialRoutes)
router.use('/management', managementRoutes)
router.use('/communication', communicationRoutes)
router.use('/integrations', integrationRoutes)
router.use('/system', systemRoutes)

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  })
})

module.exports = router