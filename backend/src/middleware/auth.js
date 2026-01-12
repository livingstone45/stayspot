const jwt = require('jsonwebtoken')
const { sequelize } = require('../database')

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization')
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No authorization header provided',
      })
    }

    // Check if token starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid authorization header format. Use: Bearer <token>',
      })
    }

    // Extract token
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided',
      })
    }

    try {
      // Verify token - use process.env.JWT_SECRET since config might not work
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'
      const decoded = jwt.verify(token, jwtSecret)
      
      // Check if token is expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return res.status(401).json({
          error: 'Token expired',
          message: 'Your session has expired. Please login again.',
        })
      }

      // Find user using raw SQL to avoid Sequelize model issues
      const userId = decoded.id || decoded.userId
      if (!userId) {
        return res.status(401).json({
          error: 'Invalid token',
          message: 'No user ID in token',
        })
      }

      const users = await sequelize.query(
        'SELECT id, email, first_name, last_name, phone FROM users WHERE id = ? LIMIT 1',
        { replacements: [userId], type: sequelize.QueryTypes.SELECT }
      )

      if (!users || users.length === 0) {
        return res.status(401).json({
          error: 'Invalid token',
          message: 'User not found',
        })
      }

      const user = users[0]

      // Attach user to request
      req.user = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        userId: user.id, // Alias for compatibility
      }

      next()
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'Invalid token',
          message: 'Token verification failed',
        })
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Token expired',
          message: 'Your session has expired',
        })
      }
      throw err
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Authentication check failed',
    })
  }
}

/**
 * Optional authentication middleware
 * Attaches user to request if token is provided, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  const authHeader = req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next()
  }

  const token = authHeader.substring(7)
  
  try {
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'
    const decoded = jwt.verify(token, jwtSecret)
    
    const userId = decoded.id || decoded.userId
    if (userId) {
      const users = await sequelize.query(
        'SELECT id, email, first_name, last_name, phone FROM users WHERE id = ? LIMIT 1',
        { replacements: [userId], type: sequelize.QueryTypes.SELECT }
      )
      
      if (users && users.length > 0) {
        const user = users[0]
        req.user = {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
        }
      }
    }
  } catch (err) {
    // Silent fail - user is optional
  }
  
  next()
}

/**
 * Role-based authorization middleware
 * Requires specific role(s)
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please login to access this resource.',
      })
    }

    const userRoles = req.user.roles || []
    const hasRequiredRole = roles.some(role => userRoles.includes(role))

    if (!hasRequiredRole) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `This action requires one of the following roles: ${roles.join(', ')}`,
        requiredRoles: roles,
        userRoles,
      })
    }

    next()
  }
}

/**
 * Permission-based authorization middleware
 * Requires specific permission(s)
 */
const requirePermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please login to access this resource.',
      })
    }

    const userPermissions = req.user.permissions || []
    const hasRequiredPermission = permissions.some(permission => 
      userPermissions.includes(permission)
    )

    // System admin has all permissions
    if (req.user.roles && req.user.roles.includes('system_admin')) {
      return next()
    }

    if (!hasRequiredPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `This action requires one of the following permissions: ${permissions.join(', ')}`,
        requiredPermissions: permissions,
        userPermissions,
      })
    }

    next()
  }
}

module.exports = {
  auth,
  optionalAuth,
  requireRole,
  requirePermission,
}
