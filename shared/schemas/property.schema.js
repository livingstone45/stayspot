/**
 * Property Validation Schemas
 * Joi-based schemas for property validation across the application
 */

const Joi = require('joi');

/**
 * Property Creation Schema
 * Validates property creation request data
 */
const propertyCreateSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must not exceed 255 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .max(5000)
    .optional(),
  type: Joi.string()
    .valid('apartment', 'house', 'townhouse', 'condo', 'villa', 'studio', 'commercial', 'office', 'retail', 'land', 'warehouse', 'industrial')
    .required()
    .messages({
      'any.required': 'Property type is required'
    }),
  status: Joi.string()
    .valid('active', 'inactive', 'maintenance', 'rented', 'available', 'pending', 'sold', 'archived')
    .default('pending')
    .optional(),
  location: Joi.object({
    street: Joi.string()
      .required()
      .messages({
        'any.required': 'Street address is required'
      }),
    city: Joi.string()
      .required()
      .messages({
        'any.required': 'City is required'
      }),
    state: Joi.string()
      .required()
      .messages({
        'any.required': 'State is required'
      }),
    zipCode: Joi.string()
      .pattern(/^[0-9]{5}(-[0-9]{4})?$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid zip code format',
        'any.required': 'Zip code is required'
      }),
    country: Joi.string()
      .default('USA')
      .optional(),
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .optional(),
    longitude: Joi.number()
      .min(-180)
      .max(180)
      .optional(),
    neighborhood: Joi.string().optional()
  }).required(),
  dimensions: Joi.object({
    totalArea: Joi.number()
      .positive()
      .required()
      .messages({
        'number.positive': 'Total area must be a positive number',
        'any.required': 'Total area is required'
      }),
    bedrooms: Joi.number()
      .integer()
      .min(0)
      .optional(),
    bathrooms: Joi.number()
      .integer()
      .min(0)
      .optional(),
    floors: Joi.number()
      .integer()
      .min(1)
      .optional(),
    yearBuilt: Joi.number()
      .integer()
      .min(1800)
      .max(new Date().getFullYear() + 1)
      .optional(),
    lotSize: Joi.number()
      .positive()
      .optional(),
    areaUnit: Joi.string()
      .valid('sqft', 'sqm')
      .default('sqft')
      .optional()
  }).required(),
  monthlyRent: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'Monthly rent must be greater than 0',
      'any.required': 'Monthly rent is required'
    }),
  securityDeposit: Joi.number()
    .positive()
    .optional(),
  petDeposit: Joi.number()
    .positive()
    .optional(),
  features: Joi.array()
    .items(Joi.string())
    .optional(),
  amenities: Joi.array()
    .items(Joi.string())
    .optional(),
  leaseType: Joi.string()
    .valid('residential', 'commercial', 'short_term', 'long_term', 'vacation', 'corporate')
    .default('residential')
    .optional(),
  furnitureStatus: Joi.string()
    .valid('unfurnished', 'semi_furnished', 'fully_furnished')
    .default('unfurnished')
    .optional(),
  petPolicy: Joi.string()
    .valid('no_pets', 'cats_only', 'dogs_only', 'cats_and_dogs', 'all_pets')
    .default('no_pets')
    .optional(),
  utilities: Joi.array()
    .items(Joi.object({
      type: Joi.string().required(),
      provider: Joi.string().optional(),
      paymentStatus: Joi.string().valid('included', 'tenant_paid', 'metered').optional()
    }))
    .optional(),
  managerIds: Joi.array()
    .items(Joi.string())
    .optional(),
  rules: Joi.object().optional()
});

/**
 * Property Update Schema
 * Validates property update request data
 */
const propertyUpdateSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(255)
    .optional(),
  description: Joi.string()
    .max(5000)
    .optional(),
  status: Joi.string()
    .valid('active', 'inactive', 'maintenance', 'rented', 'available', 'pending', 'sold', 'archived')
    .optional(),
  monthlyRent: Joi.number()
    .positive()
    .optional(),
  securityDeposit: Joi.number()
    .positive()
    .optional(),
  petDeposit: Joi.number()
    .positive()
    .optional(),
  features: Joi.array()
    .items(Joi.string())
    .optional(),
  amenities: Joi.array()
    .items(Joi.string())
    .optional(),
  location: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    country: Joi.string().optional(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
    neighborhood: Joi.string().optional()
  }).optional(),
  managerIds: Joi.array()
    .items(Joi.string())
    .optional(),
  rules: Joi.object().optional()
}).min(1);

/**
 * Property Query Filter Schema
 * Validates property query filters
 */
const propertyQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .optional(),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .optional(),
  search: Joi.string()
    .max(255)
    .optional(),
  type: Joi.string().optional(),
  status: Joi.string().optional(),
  city: Joi.string().optional(),
  minPrice: Joi.number()
    .positive()
    .optional(),
  maxPrice: Joi.number()
    .positive()
    .optional(),
  minBedrooms: Joi.number()
    .integer()
    .min(0)
    .optional(),
  maxBedrooms: Joi.number()
    .integer()
    .min(0)
    .optional(),
  features: Joi.array()
    .items(Joi.string())
    .optional(),
  sortBy: Joi.string()
    .default('createdAt')
    .optional(),
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .optional()
});

/**
 * Property Media Upload Schema
 * Validates property media uploads
 */
const propertyMediaUploadSchema = Joi.object({
  propertyId: Joi.string()
    .required()
    .messages({
      'any.required': 'Property ID is required'
    }),
  title: Joi.string()
    .max(255)
    .optional(),
  caption: Joi.string()
    .max(1000)
    .optional(),
  displayOrder: Joi.number()
    .integer()
    .min(0)
    .optional(),
  isThumbnail: Joi.boolean().optional()
});

/**
 * Property Inspection Schema
 * Validates property inspection data
 */
const propertyInspectionSchema = Joi.object({
  propertyId: Joi.string()
    .required()
    .messages({
      'any.required': 'Property ID is required'
    }),
  inspectorId: Joi.string()
    .required()
    .messages({
      'any.required': 'Inspector ID is required'
    }),
  type: Joi.string()
    .valid('move_in', 'move_out', 'routine', 'damage', 'maintenance', 'pest_control', 'safety')
    .required()
    .messages({
      'any.required': 'Inspection type is required'
    }),
  inspectionDate: Joi.date()
    .required()
    .messages({
      'any.required': 'Inspection date is required'
    }),
  findings: Joi.object().optional(),
  notes: Joi.string()
    .max(5000)
    .optional(),
  status: Joi.string()
    .valid('pending', 'complete', 'approved', 'rejected')
    .default('pending')
    .optional()
});

/**
 * Property Review Schema
 * Validates property review submission
 */
const propertyReviewSchema = Joi.object({
  propertyId: Joi.string()
    .required()
    .messages({
      'any.required': 'Property ID is required'
    }),
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.min': 'Rating must be between 1 and 5',
      'number.max': 'Rating must be between 1 and 5',
      'any.required': 'Rating is required'
    }),
  title: Joi.string()
    .min(3)
    .max(255)
    .optional(),
  comment: Joi.string()
    .min(10)
    .max(2000)
    .optional(),
  tags: Joi.array()
    .items(Joi.string())
    .optional()
});

/**
 * Property Document Upload Schema
 * Validates property document uploads
 */
const propertyDocumentSchema = Joi.object({
  propertyId: Joi.string()
    .required()
    .messages({
      'any.required': 'Property ID is required'
    }),
  documentType: Joi.string()
    .valid('lease', 'inspection', 'floor_plan', 'deed', 'insurance', 'tax', 'maintenance', 'other')
    .required()
    .messages({
      'any.required': 'Document type is required'
    }),
  fileName: Joi.string()
    .max(255)
    .required()
    .messages({
      'any.required': 'File name is required'
    })
});

/**
 * Lease Agreement Schema
 * Validates lease agreement creation
 */
const leaseAgreementSchema = Joi.object({
  propertyId: Joi.string()
    .required()
    .messages({
      'any.required': 'Property ID is required'
    }),
  tenantId: Joi.string()
    .required()
    .messages({
      'any.required': 'Tenant ID is required'
    }),
  startDate: Joi.date()
    .required()
    .messages({
      'any.required': 'Start date is required'
    }),
  endDate: Joi.date()
    .min(Joi.ref('startDate'))
    .required()
    .messages({
      'date.min': 'End date must be after start date',
      'any.required': 'End date is required'
    }),
  monthlyRent: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'Monthly rent must be greater than 0',
      'any.required': 'Monthly rent is required'
    }),
  securityDeposit: Joi.number()
    .positive()
    .optional(),
  terms: Joi.string()
    .max(5000)
    .optional(),
  status: Joi.string()
    .valid('draft', 'pending', 'active', 'expired', 'terminated')
    .default('draft')
    .optional()
});

/**
 * Property Maintenance Request Schema
 * Validates maintenance request submission
 */
const maintenanceRequestSchema = Joi.object({
  propertyId: Joi.string()
    .required()
    .messages({
      'any.required': 'Property ID is required'
    }),
  title: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Description must be at least 10 characters',
      'any.required': 'Description is required'
    }),
  category: Joi.string()
    .valid('plumbing', 'electrical', 'hvac', 'appliances', 'flooring', 'painting', 'carpentry', 'roofing', 'landscaping', 'cleaning', 'pest_control', 'security', 'general')
    .required()
    .messages({
      'any.required': 'Category is required'
    }),
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent', 'emergency')
    .default('medium')
    .optional(),
  requestType: Joi.string()
    .valid('repair', 'replacement', 'installation', 'inspection', 'preventive', 'emergency', 'cosmetic', 'safety')
    .default('repair')
    .optional(),
  preferredDate: Joi.date().optional(),
  notes: Joi.string()
    .max(1000)
    .optional()
});

module.exports = {
  propertyCreateSchema,
  propertyUpdateSchema,
  propertyQuerySchema,
  propertyMediaUploadSchema,
  propertyInspectionSchema,
  propertyReviewSchema,
  propertyDocumentSchema,
  leaseAgreementSchema,
  maintenanceRequestSchema
};
