const Joi = require('joi');
const { Property, User, Company, Tenant } = require('../models');

/**
 * Common validation schemas
 */
const schemas = {
  // Auth schemas
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
        'any.required': 'Password is required'
      }),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^[+]?[\d\s-()]+$/).optional(),
    role: Joi.string().valid('tenant', 'landlord', 'manager').optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Property schemas
  createProperty: Joi.object({
    name: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(2000).optional(),
    type: Joi.string().valid(
      'apartment', 'house', 'condo', 'townhouse', 
      'commercial', 'industrial', 'land', 'villa',
      'guesthouse', 'bnb', 'hostel', 'hotel'
    ).required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    totalUnits: Joi.number().integer().min(1).required(),
    yearBuilt: Joi.number().integer().min(1800).max(new Date().getFullYear()),
    amenities: Joi.array().items(Joi.string()).optional(),
    rules: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().default(true),
    portfolioId: Joi.number().integer().optional(),
    companyId: Joi.number().integer().optional(),
    landlordId: Joi.number().integer().optional()
  }),

  updateProperty: Joi.object({
    name: Joi.string().min(3).max(200),
    description: Joi.string().max(2000),
    type: Joi.string().valid(
      'apartment', 'house', 'condo', 'townhouse', 
      'commercial', 'industrial', 'land', 'villa',
      'guesthouse', 'bnb', 'hostel', 'hotel'
    ),
    address: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zipCode: Joi.string(),
    country: Joi.string(),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    totalUnits: Joi.number().integer().min(1),
    yearBuilt: Joi.number().integer().min(1800).max(new Date().getFullYear()),
    amenities: Joi.array().items(Joi.string()),
    rules: Joi.array().items(Joi.string()),
    isActive: Joi.boolean(),
    portfolioId: Joi.number().integer(),
    companyId: Joi.number().integer(),
    landlordId: Joi.number().integer()
  }),

  // Unit schemas
  createUnit: Joi.object({
    propertyId: Joi.number().integer().required(),
    unitNumber: Joi.string().required(),
    name: Joi.string().optional(),
    type: Joi.string().valid('studio', '1bed', '2bed', '3bed', '4bed', 'commercial', 'storage', 'parking').required(),
    size: Joi.number().positive().optional(),
    bedrooms: Joi.number().integer().min(0).default(0),
    bathrooms: Joi.number().positive().default(1),
    rentAmount: Joi.number().positive().required(),
    depositAmount: Joi.number().positive().default(0),
    status: Joi.string().valid('available', 'occupied', 'maintenance', 'renovating').default('available'),
    features: Joi.array().items(Joi.string()).optional(),
    furnishings: Joi.array().items(Joi.string()).optional(),
    availableFrom: Joi.date().optional(),
    isActive: Joi.boolean().default(true)
  }),

  // Tenant schemas
  createTenant: Joi.object({
    userId: Joi.number().integer().required(),
    unitId: Joi.number().integer().required(),
    emergencyContactName: Joi.string().optional(),
    emergencyContactPhone: Joi.string().optional(),
    emergencyContactRelationship: Joi.string().optional(),
    occupation: Joi.string().optional(),
    employer: Joi.string().optional(),
    income: Joi.number().positive().optional(),
    pets: Joi.array().items(Joi.object({
      type: Joi.string().required(),
      name: Joi.string().required(),
      breed: Joi.string().optional(),
      weight: Joi.number().optional()
    })).optional(),
    vehicles: Joi.array().items(Joi.object({
      make: Joi.string().required(),
      model: Joi.string().required(),
      year: Joi.number().required(),
      color: Joi.string().required(),
      licensePlate: Joi.string().required()
    })).optional()
  }),

  // Lease schemas
  createLease: Joi.object({
    tenantId: Joi.number().integer().required(),
    unitId: Joi.number().integer().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    monthlyRent: Joi.number().positive().required(),
    securityDeposit: Joi.number().positive().required(),
    lateFee: Joi.number().positive().default(50),
    gracePeriod: Joi.number().integer().min(0).default(5),
    paymentDueDay: Joi.number().integer().min(1).max(28).default(1),
    terms: Joi.string().optional(),
    specialConditions: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().default(true)
  }),

  // Maintenance schemas
  createMaintenance: Joi.object({
    unitId: Joi.number().integer().optional(),
    propertyId: Joi.number().integer().required(),
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'emergency').default('medium'),
    category: Joi.string().valid(
      'plumbing', 'electrical', 'heating', 'cooling', 
      'appliance', 'structural', 'pest', 'cleaning',
      'landscaping', 'security', 'other'
    ).required(),
    reportedBy: Joi.string().optional(),
    reportedByType: Joi.string().valid('tenant', 'owner', 'manager', 'system').default('tenant')
  }),

  // Task schemas
  createTask: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().optional(),
    type: Joi.string().valid(
      'maintenance', 'inspection', 'cleaning', 'showing',
      'documentation', 'payment', 'communication', 'other'
    ).required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    assignedTo: Joi.number().integer().optional(),
    propertyId: Joi.number().integer().optional(),
    unitId: Joi.number().integer().optional(),
    dueDate: Joi.date().optional(),
    estimatedHours: Joi.number().positive().optional(),
    status: Joi.string().valid('pending', 'assigned', 'in_progress', 'completed', 'cancelled').default('pending')
  }),

  // Invitation schemas
  createInvitation: Joi.object({
    email: Joi.string().email().required(),
    roleId: Joi.number().integer().required(),
    companyId: Joi.number().integer().optional(),
    portfolioId: Joi.number().integer().optional(),
    propertyIds: Joi.array().items(Joi.number().integer()).optional(),
    permissions: Joi.array().items(Joi.string()).optional(),
    expiresIn: Joi.number().integer().min(1).max(30).default(7) // days
  }),

  // Payment schemas
  createPayment: Joi.object({
    leaseId: Joi.number().integer().required(),
    amount: Joi.number().positive().required(),
    paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'bank_transfer', 'cash', 'check', 'online').required(),
    paymentDate: Joi.date().default(Date.now),
    referenceNumber: Joi.string().optional(),
    notes: Joi.string().optional(),
    isDeposit: Joi.boolean().default(false)
  }),

  // Search and filter schemas
  propertySearch: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().optional(),
    type: Joi.array().items(Joi.string()).optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    minPrice: Joi.number().positive().optional(),
    maxPrice: Joi.number().positive().optional(),
    bedrooms: Joi.number().integer().min(0).optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid('available', 'occupied', 'all').default('all'),
    sortBy: Joi.string().valid('price', 'createdAt', 'updatedAt', 'name').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // File upload validation
  fileUpload: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    size: Joi.number().positive().required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required()
  })
};

/**
 * Custom validation functions
 */
const customValidators = {
  /**
   * Validate if email already exists
   */
  emailExists: async (email, excludeUserId = null) => {
    const where = { email };
    if (excludeUserId) {
      where.id = { [Sequelize.Op.ne]: excludeUserId };
    }
    
    const user = await User.findOne({ where });
    return !!user;
  },

  /**
   * Validate if property exists
   */
  propertyExists: async (propertyId) => {
    const property = await Property.findByPk(propertyId);
    return !!property;
  },

  /**
   * Validate if user has access to property
   */
  hasPropertyAccess: async (userId, propertyId) => {
    // This would check user roles and permissions
    // For now, return true for demo
    return true;
  },

  /**
   * Validate geographic coordinates
   */
  isValidCoordinates: (latitude, longitude) => {
    return (
      latitude >= -90 && latitude <= 90 &&
      longitude >= -180 && longitude <= 180
    );
  },

  /**
   * Validate date range
   */
  isValidDateRange: (startDate, endDate) => {
    return new Date(startDate) < new Date(endDate);
  },

  /**
   * Validate rent amount based on property type and location
   */
  isValidRentAmount: (amount, propertyType, location) => {
    // Implement market-based validation
    const minRents = {
      'apartment': 500,
      'house': 800,
      'condo': 600,
      'commercial': 1000
    };
    
    return amount >= (minRents[propertyType] || 300);
  }
};

/**
 * Validation middleware
 */
const validate = (schema, property = 'body') => {
  return async (req, res, next) => {
    try {
      const value = await schema.validateAsync(req[property], {
        abortEarly: false,
        stripUnknown: true
      });

      // Replace validated values
      req[property] = value;
      next();
    } catch (error) {
      if (error.isJoi) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      next(error);
    }
  };
};

/**
 * Sanitize input data
 */
const sanitize = {
  string: (value) => {
    if (typeof value !== 'string') return value;
    return value
      .trim()
      .replace(/<[^>]*>?/gm, '') // Remove HTML tags
      .replace(/[^\w\s@.-]/gi, ''); // Remove special characters
  },

  email: (value) => {
    if (typeof value !== 'string') return value;
    return value.trim().toLowerCase();
  },

  number: (value) => {
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    }
    return value;
  },

  boolean: (value) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  }
};

/**
 * Middleware to sanitize request data
 */
const sanitizeMiddleware = (req, res, next) => {
  ['body', 'query', 'params'].forEach(key => {
    if (req[key]) {
      Object.keys(req[key]).forEach(field => {
        const value = req[key][field];
        
        if (typeof value === 'string') {
          req[key][field] = sanitize.string(value);
        } else if (field.includes('email')) {
          req[key][field] = sanitize.email(value);
        }
      });
    }
  });
  
  next();
};

module.exports = {
  schemas,
  validate,
  validation: validate,
  sanitizeMiddleware,
  customValidators
};