/**
 * Validation schemas for form validation using Yup
 * Provides comprehensive validation schemas for all forms in the application
 */

import * as Yup from 'yup';

/**
 * Common validation patterns and messages
 */
const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  PHONE_US: /^(\+1\s?)?(\([0-9]{3}\)\s?|[0-9]{3}[\s.-]?)[0-9]{3}[\s.-]?[0-9]{4}$/,
  ZIP_CODE_US: /^\d{5}(-\d{4})?$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NUMERIC: /^\d+$/,
  DECIMAL: /^\d+(\.\d{1,2})?$/
};

const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PHONE_INVALID: 'Please enter a valid phone number',
  PASSWORD_WEAK: 'Password must contain at least 8 characters with uppercase, lowercase, number, and special character',
  ZIP_CODE_INVALID: 'Please enter a valid ZIP code',
  MIN_LENGTH: (min) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max) => `Must be no more than ${max} characters`,
  MIN_VALUE: (min) => `Must be at least ${min}`,
  MAX_VALUE: (max) => `Must be no more than ${max}`,
  POSITIVE_NUMBER: 'Must be a positive number',
  VALID_URL: 'Please enter a valid URL'
};

/**
 * Authentication schemas
 */
export const authSchemas = {
  login: Yup.object({
    email: Yup.string()
      .matches(VALIDATION_PATTERNS.EMAIL, VALIDATION_MESSAGES.EMAIL_INVALID)
      .required(VALIDATION_MESSAGES.REQUIRED),
    password: Yup.string()
      .min(6, VALIDATION_MESSAGES.MIN_LENGTH(6))
      .required(VALIDATION_MESSAGES.REQUIRED),
    rememberMe: Yup.boolean()
  }),

  register: Yup.object({
    firstName: Yup.string()
      .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2))
      .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50))
      .required(VALIDATION_MESSAGES.REQUIRED),
    lastName: Yup.string()
      .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2))
      .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50))
      .required(VALIDATION_MESSAGES.REQUIRED),
    email: Yup.string()
      .matches(VALIDATION_PATTERNS.EMAIL, VALIDATION_MESSAGES.EMAIL_INVALID)
      .required(VALIDATION_MESSAGES.REQUIRED),
    password: Yup.string()
      .min(8, VALIDATION_MESSAGES.MIN_LENGTH(8))
      .matches(VALIDATION_PATTERNS.PASSWORD_STRONG, VALIDATION_MESSAGES.PASSWORD_WEAK)
      .required(VALIDATION_MESSAGES.REQUIRED),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required(VALIDATION_MESSAGES.REQUIRED),
    phone: Yup.string()
      .matches(VALIDATION_PATTERNS.PHONE_US, VALIDATION_MESSAGES.PHONE_INVALID)
      .nullable(),
    company: Yup.string()
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .nullable(),
    role: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    termsAccepted: Yup.boolean()
      .oneOf([true], 'You must accept the terms and conditions')
      .required(VALIDATION_MESSAGES.REQUIRED)
  }),

  forgotPassword: Yup.object({
    email: Yup.string()
      .matches(VALIDATION_PATTERNS.EMAIL, VALIDATION_MESSAGES.EMAIL_INVALID)
      .required(VALIDATION_MESSAGES.REQUIRED)
  }),

  resetPassword: Yup.object({
    password: Yup.string()
      .min(8, VALIDATION_MESSAGES.MIN_LENGTH(8))
      .matches(VALIDATION_PATTERNS.PASSWORD_STRONG, VALIDATION_MESSAGES.PASSWORD_WEAK)
      .required(VALIDATION_MESSAGES.REQUIRED),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required(VALIDATION_MESSAGES.REQUIRED)
  }),

  changePassword: Yup.object({
    currentPassword: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    newPassword: Yup.string()
      .min(8, VALIDATION_MESSAGES.MIN_LENGTH(8))
      .matches(VALIDATION_PATTERNS.PASSWORD_STRONG, VALIDATION_MESSAGES.PASSWORD_WEAK)
      .required(VALIDATION_MESSAGES.REQUIRED),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required(VALIDATION_MESSAGES.REQUIRED)
  })
};

/**
 * User profile schemas
 */
export const userSchemas = {
  profile: Yup.object({
    firstName: Yup.string()
      .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2))
      .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50))
      .required(VALIDATION_MESSAGES.REQUIRED),
    lastName: Yup.string()
      .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2))
      .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50))
      .required(VALIDATION_MESSAGES.REQUIRED),
    email: Yup.string()
      .matches(VALIDATION_PATTERNS.EMAIL, VALIDATION_MESSAGES.EMAIL_INVALID)
      .required(VALIDATION_MESSAGES.REQUIRED),
    phone: Yup.string()
      .matches(VALIDATION_PATTERNS.PHONE_US, VALIDATION_MESSAGES.PHONE_INVALID)
      .nullable(),
    dateOfBirth: Yup.date()
      .max(new Date(), 'Date of birth cannot be in the future')
      .nullable(),
    bio: Yup.string()
      .max(500, VALIDATION_MESSAGES.MAX_LENGTH(500))
      .nullable(),
    website: Yup.string()
      .url(VALIDATION_MESSAGES.VALID_URL)
      .nullable(),
    linkedIn: Yup.string()
      .url(VALIDATION_MESSAGES.VALID_URL)
      .nullable(),
    emergencyContactName: Yup.string()
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .nullable(),
    emergencyContactPhone: Yup.string()
      .matches(VALIDATION_PATTERNS.PHONE_US, VALIDATION_MESSAGES.PHONE_INVALID)
      .nullable()
  }),

  address: Yup.object({
    street1: Yup.string()
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .required(VALIDATION_MESSAGES.REQUIRED),
    street2: Yup.string()
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .nullable(),
    city: Yup.string()
      .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50))
      .required(VALIDATION_MESSAGES.REQUIRED),
    state: Yup.string()
      .length(2, 'State must be 2 characters')
      .required(VALIDATION_MESSAGES.REQUIRED),
    zipCode: Yup.string()
      .matches(VALIDATION_PATTERNS.ZIP_CODE_US, VALIDATION_MESSAGES.ZIP_CODE_INVALID)
      .required(VALIDATION_MESSAGES.REQUIRED),
    country: Yup.string()
      .default('US')
      .required(VALIDATION_MESSAGES.REQUIRED)
  })
};

/**
 * Property schemas
 */
export const propertySchemas = {
  basic: Yup.object({
    name: Yup.string()
      .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2))
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .required(VALIDATION_MESSAGES.REQUIRED),
    type: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    description: Yup.string()
      .max(1000, VALIDATION_MESSAGES.MAX_LENGTH(1000))
      .nullable(),
    yearBuilt: Yup.number()
      .min(1800, VALIDATION_MESSAGES.MIN_VALUE(1800))
      .max(new Date().getFullYear(), `Cannot be later than ${new Date().getFullYear()}`)
      .nullable(),
    totalUnits: Yup.number()
      .min(1, VALIDATION_MESSAGES.MIN_VALUE(1))
      .max(10000, VALIDATION_MESSAGES.MAX_VALUE(10000))
      .required(VALIDATION_MESSAGES.REQUIRED),
    totalSquareFeet: Yup.number()
      .min(100, VALIDATION_MESSAGES.MIN_VALUE(100))
      .nullable(),
    lotSize: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    parkingSpaces: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable()
  }),

  address: Yup.object({
    street1: Yup.string()
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .required(VALIDATION_MESSAGES.REQUIRED),
    street2: Yup.string()
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .nullable(),
    city: Yup.string()
      .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50))
      .required(VALIDATION_MESSAGES.REQUIRED),
    state: Yup.string()
      .length(2, 'State must be 2 characters')
      .required(VALIDATION_MESSAGES.REQUIRED),
    zipCode: Yup.string()
      .matches(VALIDATION_PATTERNS.ZIP_CODE_US, VALIDATION_MESSAGES.ZIP_CODE_INVALID)
      .required(VALIDATION_MESSAGES.REQUIRED),
    country: Yup.string()
      .default('US')
      .required(VALIDATION_MESSAGES.REQUIRED),
    latitude: Yup.number()
      .min(-90, 'Latitude must be between -90 and 90')
      .max(90, 'Latitude must be between -90 and 90')
      .nullable(),
    longitude: Yup.number()
      .min(-180, 'Longitude must be between -180 and 180')
      .max(180, 'Longitude must be between -180 and 180')
      .nullable()
  }),

  financial: Yup.object({
    purchasePrice: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    currentValue: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    monthlyIncome: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    monthlyExpenses: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    propertyTaxes: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    insurance: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    hoaFees: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable()
  })
};

/**
 * Unit schemas
 */
export const unitSchemas = {
  basic: Yup.object({
    unitNumber: Yup.string()
      .max(20, VALIDATION_MESSAGES.MAX_LENGTH(20))
      .required(VALIDATION_MESSAGES.REQUIRED),
    type: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    bedrooms: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .max(20, VALIDATION_MESSAGES.MAX_VALUE(20))
      .required(VALIDATION_MESSAGES.REQUIRED),
    bathrooms: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .max(20, VALIDATION_MESSAGES.MAX_VALUE(20))
      .required(VALIDATION_MESSAGES.REQUIRED),
    squareFeet: Yup.number()
      .min(100, VALIDATION_MESSAGES.MIN_VALUE(100))
      .max(50000, VALIDATION_MESSAGES.MAX_VALUE(50000))
      .nullable(),
    floor: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .max(200, VALIDATION_MESSAGES.MAX_VALUE(200))
      .nullable(),
    description: Yup.string()
      .max(500, VALIDATION_MESSAGES.MAX_LENGTH(500))
      .nullable()
  }),

  pricing: Yup.object({
    baseRent: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .required(VALIDATION_MESSAGES.REQUIRED),
    securityDeposit: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    petDeposit: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    applicationFee: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    adminFee: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    petRent: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    parkingFee: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    storageFee: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable()
  })
};

/**
 * Tenant schemas
 */
export const tenantSchemas = {
  personal: Yup.object({
    firstName: Yup.string()
      .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2))
      .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50))
      .required(VALIDATION_MESSAGES.REQUIRED),
    lastName: Yup.string()
      .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2))
      .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50))
      .required(VALIDATION_MESSAGES.REQUIRED),
    email: Yup.string()
      .matches(VALIDATION_PATTERNS.EMAIL, VALIDATION_MESSAGES.EMAIL_INVALID)
      .required(VALIDATION_MESSAGES.REQUIRED),
    phone: Yup.string()
      .matches(VALIDATION_PATTERNS.PHONE_US, VALIDATION_MESSAGES.PHONE_INVALID)
      .required(VALIDATION_MESSAGES.REQUIRED),
    dateOfBirth: Yup.date()
      .max(new Date(), 'Date of birth cannot be in the future')
      .required(VALIDATION_MESSAGES.REQUIRED),
    ssn: Yup.string()
      .matches(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in format XXX-XX-XXXX')
      .nullable(),
    driversLicense: Yup.string()
      .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50))
      .nullable()
  }),

  employment: Yup.object({
    employer: Yup.string()
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .required(VALIDATION_MESSAGES.REQUIRED),
    jobTitle: Yup.string()
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .required(VALIDATION_MESSAGES.REQUIRED),
    employmentType: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    monthlyIncome: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .required(VALIDATION_MESSAGES.REQUIRED),
    employmentStartDate: Yup.date()
      .max(new Date(), 'Employment start date cannot be in the future')
      .required(VALIDATION_MESSAGES.REQUIRED),
    supervisorName: Yup.string()
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .nullable(),
    supervisorPhone: Yup.string()
      .matches(VALIDATION_PATTERNS.PHONE_US, VALIDATION_MESSAGES.PHONE_INVALID)
      .nullable()
  }),

  application: Yup.object({
    desiredMoveInDate: Yup.date()
      .min(new Date(), 'Move-in date cannot be in the past')
      .required(VALIDATION_MESSAGES.REQUIRED),
    leaseTerm: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    numberOfOccupants: Yup.number()
      .min(1, VALIDATION_MESSAGES.MIN_VALUE(1))
      .max(20, VALIDATION_MESSAGES.MAX_VALUE(20))
      .required(VALIDATION_MESSAGES.REQUIRED),
    hasPets: Yup.boolean(),
    petDetails: Yup.string()
      .when('hasPets', {
        is: true,
        then: (schema) => schema.required('Pet details are required when you have pets'),
        otherwise: (schema) => schema.nullable()
      }),
    hasVehicles: Yup.boolean(),
    vehicleDetails: Yup.string()
      .when('hasVehicles', {
        is: true,
        then: (schema) => schema.required('Vehicle details are required when you have vehicles'),
        otherwise: (schema) => schema.nullable()
      }),
    emergencyContactName: Yup.string()
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .required(VALIDATION_MESSAGES.REQUIRED),
    emergencyContactPhone: Yup.string()
      .matches(VALIDATION_PATTERNS.PHONE_US, VALIDATION_MESSAGES.PHONE_INVALID)
      .required(VALIDATION_MESSAGES.REQUIRED),
    emergencyContactRelationship: Yup.string()
      .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50))
      .required(VALIDATION_MESSAGES.REQUIRED)
  })
};

/**
 * Lease schemas
 */
export const leaseSchemas = {
  basic: Yup.object({
    tenantId: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    unitId: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    leaseType: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    startDate: Yup.date()
      .required(VALIDATION_MESSAGES.REQUIRED),
    endDate: Yup.date()
      .min(Yup.ref('startDate'), 'End date must be after start date')
      .required(VALIDATION_MESSAGES.REQUIRED),
    monthlyRent: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .required(VALIDATION_MESSAGES.REQUIRED),
    securityDeposit: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .required(VALIDATION_MESSAGES.REQUIRED),
    lateFee: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    gracePeriod: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .max(30, VALIDATION_MESSAGES.MAX_VALUE(30))
      .nullable()
  }),

  terms: Yup.object({
    petPolicy: Yup.string()
      .max(500, VALIDATION_MESSAGES.MAX_LENGTH(500))
      .nullable(),
    smokingPolicy: Yup.string()
      .max(500, VALIDATION_MESSAGES.MAX_LENGTH(500))
      .nullable(),
    guestPolicy: Yup.string()
      .max(500, VALIDATION_MESSAGES.MAX_LENGTH(500))
      .nullable(),
    maintenancePolicy: Yup.string()
      .max(500, VALIDATION_MESSAGES.MAX_LENGTH(500))
      .nullable(),
    renewalPolicy: Yup.string()
      .max(500, VALIDATION_MESSAGES.MAX_LENGTH(500))
      .nullable(),
    terminationPolicy: Yup.string()
      .max(500, VALIDATION_MESSAGES.MAX_LENGTH(500))
      .nullable()
  })
};

/**
 * Maintenance schemas
 */
export const maintenanceSchemas = {
  request: Yup.object({
    title: Yup.string()
      .min(5, VALIDATION_MESSAGES.MIN_LENGTH(5))
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .required(VALIDATION_MESSAGES.REQUIRED),
    description: Yup.string()
      .min(10, VALIDATION_MESSAGES.MIN_LENGTH(10))
      .max(1000, VALIDATION_MESSAGES.MAX_LENGTH(1000))
      .required(VALIDATION_MESSAGES.REQUIRED),
    category: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    priority: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    unitId: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    preferredDate: Yup.date()
      .min(new Date(), 'Preferred date cannot be in the past')
      .nullable(),
    allowEntry: Yup.boolean()
      .required(VALIDATION_MESSAGES.REQUIRED),
    contactPhone: Yup.string()
      .matches(VALIDATION_PATTERNS.PHONE_US, VALIDATION_MESSAGES.PHONE_INVALID)
      .nullable()
  }),

  workOrder: Yup.object({
    title: Yup.string()
      .min(5, VALIDATION_MESSAGES.MIN_LENGTH(5))
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .required(VALIDATION_MESSAGES.REQUIRED),
    description: Yup.string()
      .min(10, VALIDATION_MESSAGES.MIN_LENGTH(10))
      .max(1000, VALIDATION_MESSAGES.MAX_LENGTH(1000))
      .required(VALIDATION_MESSAGES.REQUIRED),
    category: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    priority: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    assignedTo: Yup.string()
      .nullable(),
    estimatedCost: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    estimatedHours: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    scheduledDate: Yup.date()
      .min(new Date(), 'Scheduled date cannot be in the past')
      .nullable(),
    materials: Yup.string()
      .max(500, VALIDATION_MESSAGES.MAX_LENGTH(500))
      .nullable()
  })
};

/**
 * Financial schemas
 */
export const financialSchemas = {
  payment: Yup.object({
    amount: Yup.number()
      .min(0.01, 'Amount must be greater than 0')
      .required(VALIDATION_MESSAGES.REQUIRED),
    paymentMethod: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    description: Yup.string()
      .max(200, VALIDATION_MESSAGES.MAX_LENGTH(200))
      .nullable(),
    dueDate: Yup.date()
      .nullable(),
    reference: Yup.string()
      .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50))
      .nullable()
  }),

  expense: Yup.object({
    description: Yup.string()
      .min(3, VALIDATION_MESSAGES.MIN_LENGTH(3))
      .max(200, VALIDATION_MESSAGES.MAX_LENGTH(200))
      .required(VALIDATION_MESSAGES.REQUIRED),
    amount: Yup.number()
      .min(0.01, 'Amount must be greater than 0')
      .required(VALIDATION_MESSAGES.REQUIRED),
    category: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    date: Yup.date()
      .max(new Date(), 'Date cannot be in the future')
      .required(VALIDATION_MESSAGES.REQUIRED),
    vendor: Yup.string()
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .nullable(),
    propertyId: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    isRecurring: Yup.boolean(),
    recurringFrequency: Yup.string()
      .when('isRecurring', {
        is: true,
        then: (schema) => schema.required('Frequency is required for recurring expenses'),
        otherwise: (schema) => schema.nullable()
      })
  }),

  budget: Yup.object({
    name: Yup.string()
      .min(3, VALIDATION_MESSAGES.MIN_LENGTH(3))
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .required(VALIDATION_MESSAGES.REQUIRED),
    description: Yup.string()
      .max(500, VALIDATION_MESSAGES.MAX_LENGTH(500))
      .nullable(),
    startDate: Yup.date()
      .required(VALIDATION_MESSAGES.REQUIRED),
    endDate: Yup.date()
      .min(Yup.ref('startDate'), 'End date must be after start date')
      .required(VALIDATION_MESSAGES.REQUIRED),
    totalBudget: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .required(VALIDATION_MESSAGES.REQUIRED),
    propertyId: Yup.string()
      .nullable()
  })
};

/**
 * Communication schemas
 */
export const communicationSchemas = {
  message: Yup.object({
    subject: Yup.string()
      .min(3, VALIDATION_MESSAGES.MIN_LENGTH(3))
      .max(200, VALIDATION_MESSAGES.MAX_LENGTH(200))
      .required(VALIDATION_MESSAGES.REQUIRED),
    message: Yup.string()
      .min(10, VALIDATION_MESSAGES.MIN_LENGTH(10))
      .max(2000, VALIDATION_MESSAGES.MAX_LENGTH(2000))
      .required(VALIDATION_MESSAGES.REQUIRED),
    recipients: Yup.array()
      .min(1, 'At least one recipient is required')
      .required(VALIDATION_MESSAGES.REQUIRED),
    priority: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    category: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    scheduledDate: Yup.date()
      .min(new Date(), 'Scheduled date cannot be in the past')
      .nullable()
  }),

  announcement: Yup.object({
    title: Yup.string()
      .min(5, VALIDATION_MESSAGES.MIN_LENGTH(5))
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .required(VALIDATION_MESSAGES.REQUIRED),
    content: Yup.string()
      .min(20, VALIDATION_MESSAGES.MIN_LENGTH(20))
      .max(2000, VALIDATION_MESSAGES.MAX_LENGTH(2000))
      .required(VALIDATION_MESSAGES.REQUIRED),
    category: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    priority: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    targetAudience: Yup.array()
      .min(1, 'At least one target audience is required')
      .required(VALIDATION_MESSAGES.REQUIRED),
    publishDate: Yup.date()
      .min(new Date(), 'Publish date cannot be in the past')
      .nullable(),
    expiryDate: Yup.date()
      .min(Yup.ref('publishDate'), 'Expiry date must be after publish date')
      .nullable()
  })
};

/**
 * Company schemas
 */
export const companySchemas = {
  basic: Yup.object({
    name: Yup.string()
      .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2))
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .required(VALIDATION_MESSAGES.REQUIRED),
    legalName: Yup.string()
      .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2))
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .nullable(),
    type: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    industry: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    description: Yup.string()
      .max(1000, VALIDATION_MESSAGES.MAX_LENGTH(1000))
      .nullable(),
    website: Yup.string()
      .url(VALIDATION_MESSAGES.VALID_URL)
      .nullable(),
    phone: Yup.string()
      .matches(VALIDATION_PATTERNS.PHONE_US, VALIDATION_MESSAGES.PHONE_INVALID)
      .required(VALIDATION_MESSAGES.REQUIRED),
    email: Yup.string()
      .matches(VALIDATION_PATTERNS.EMAIL, VALIDATION_MESSAGES.EMAIL_INVALID)
      .required(VALIDATION_MESSAGES.REQUIRED),
    taxId: Yup.string()
      .matches(/^\d{2}-\d{7}$/, 'Tax ID must be in format XX-XXXXXXX')
      .nullable(),
    licenseNumber: Yup.string()
      .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50))
      .nullable()
  }),

  settings: Yup.object({
    timezone: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    currency: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    dateFormat: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    fiscalYearStart: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED),
    defaultLeaseLength: Yup.number()
      .min(1, VALIDATION_MESSAGES.MIN_VALUE(1))
      .max(60, VALIDATION_MESSAGES.MAX_VALUE(60))
      .required(VALIDATION_MESSAGES.REQUIRED),
    lateFeeAmount: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .nullable(),
    lateFeeGracePeriod: Yup.number()
      .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
      .max(30, VALIDATION_MESSAGES.MAX_VALUE(30))
      .nullable(),
    allowOnlinePayments: Yup.boolean(),
    requireRentersInsurance: Yup.boolean(),
    allowPets: Yup.boolean(),
    petDepositAmount: Yup.number()
      .when('allowPets', {
        is: true,
        then: (schema) => schema.min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER),
        otherwise: (schema) => schema.nullable()
      })
  })
};

/**
 * Validation utility functions
 */
export const validationUtils = {
  /**
   * Validate a single field
   * @param {any} value - Value to validate
   * @param {Object} schema - Yup schema
   * @returns {Promise<Object>} Validation result
   */
  validateField: async (value, schema) => {
    try {
      await schema.validate(value);
      return { isValid: true, error: null };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  },

  /**
   * Validate entire form
   * @param {Object} values - Form values
   * @param {Object} schema - Yup schema
   * @returns {Promise<Object>} Validation result
   */
  validateForm: async (values, schema) => {
    try {
      await schema.validate(values, { abortEarly: false });
      return { isValid: true, errors: {} };
    } catch (error) {
      const errors = {};
      error.inner.forEach(err => {
        errors[err.path] = err.message;
      });
      return { isValid: false, errors };
    }
  },

  /**
   * Get validation schema by name
   * @param {string} schemaName - Schema name (e.g., 'auth.login')
   * @returns {Object} Yup schema
   */
  getSchema: (schemaName) => {
    const [category, type] = schemaName.split('.');
    const schemas = {
      auth: authSchemas,
      user: userSchemas,
      property: propertySchemas,
      unit: unitSchemas,
      tenant: tenantSchemas,
      lease: leaseSchemas,
      maintenance: maintenanceSchemas,
      financial: financialSchemas,
      communication: communicationSchemas,
      company: companySchemas
    };
    
    return schemas[category]?.[type] || null;
  },

  /**
   * Create conditional validation
   * @param {string} field - Field to watch
   * @param {any} value - Value to match
   * @param {Object} schema - Schema to apply when condition is met
   * @returns {Object} Conditional schema
   */
  when: (field, value, schema) => {
    return Yup.mixed().when(field, {
      is: value,
      then: schema,
      otherwise: Yup.mixed().nullable()
    });
  }
};

// Export all schemas and utilities
export default {
  authSchemas,
  userSchemas,
  propertySchemas,
  unitSchemas,
  tenantSchemas,
  leaseSchemas,
  maintenanceSchemas,
  financialSchemas,
  communicationSchemas,
  companySchemas,
  validationUtils,
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES
};