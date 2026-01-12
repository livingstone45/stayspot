/**
 * Validation rules and custom validators
 * Provides reusable validation rules and custom validation functions
 */

/**
 * Common validation patterns
 */
export const VALIDATION_PATTERNS = {
  // Email patterns
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  EMAIL_SIMPLE: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Phone patterns
  PHONE_US: /^(\+1\s?)?(\([0-9]{3}\)\s?|[0-9]{3}[\s.-]?)[0-9]{3}[\s.-]?[0-9]{4}$/,
  PHONE_INTERNATIONAL: /^\+[1-9]\d{1,14}$/,
  PHONE_DIGITS_ONLY: /^\d{10,15}$/,
  
  // Address patterns
  ZIP_CODE_US: /^\d{5}(-\d{4})?$/,
  ZIP_CODE_CA: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/,
  POSTAL_CODE_UK: /^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/,
  
  // Password patterns
  PASSWORD_WEAK: /^.{6,}$/,
  PASSWORD_MEDIUM: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  
  // Text patterns
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHABETIC: /^[a-zA-Z]+$/,
  NUMERIC: /^\d+$/,
  DECIMAL: /^\d+(\.\d{1,2})?$/,
  CURRENCY: /^\d+(\.\d{2})?$/,
  
  // Identification patterns
  SSN: /^\d{3}-\d{2}-\d{4}$/,
  SSN_DIGITS: /^\d{9}$/,
  EIN: /^\d{2}-\d{7}$/,
  CREDIT_CARD: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
  
  // URL patterns
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  URL_SIMPLE: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  
  // Date patterns
  DATE_US: /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/,
  DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,
  TIME_24H: /^([01]\d|2[0-3]):([0-5]\d)$/,
  TIME_12H: /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i,
  
  // Property specific patterns
  UNIT_NUMBER: /^[A-Za-z0-9#\-\s]{1,20}$/,
  PROPERTY_CODE: /^[A-Z0-9]{3,10}$/,
  LEASE_NUMBER: /^[A-Z0-9\-]{5,20}$/
};

/**
 * Validation error messages
 */
export const ERROR_MESSAGES = {
  // Required field messages
  REQUIRED: 'This field is required',
  REQUIRED_FIELD: (field) => `${field} is required`,
  
  // Format validation messages
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_DATE: 'Please enter a valid date',
  INVALID_TIME: 'Please enter a valid time',
  INVALID_ZIP_CODE: 'Please enter a valid ZIP code',
  INVALID_SSN: 'Please enter a valid Social Security Number',
  INVALID_CREDIT_CARD: 'Please enter a valid credit card number',
  
  // Length validation messages
  MIN_LENGTH: (min) => `Must be at least ${min} characters long`,
  MAX_LENGTH: (max) => `Must be no more than ${max} characters long`,
  EXACT_LENGTH: (length) => `Must be exactly ${length} characters long`,
  
  // Number validation messages
  MIN_VALUE: (min) => `Must be at least ${min}`,
  MAX_VALUE: (max) => `Must be no more than ${max}`,
  POSITIVE_NUMBER: 'Must be a positive number',
  NEGATIVE_NUMBER: 'Must be a negative number',
  INTEGER_ONLY: 'Must be a whole number',
  DECIMAL_PLACES: (places) => `Must have no more than ${places} decimal places`,
  
  // Date validation messages
  FUTURE_DATE: 'Date must be in the future',
  PAST_DATE: 'Date must be in the past',
  DATE_RANGE: (start, end) => `Date must be between ${start} and ${end}`,
  MIN_AGE: (age) => `Must be at least ${age} years old`,
  MAX_AGE: (age) => `Must be no more than ${age} years old`,
  
  // Password validation messages
  PASSWORD_WEAK: 'Password is too weak',
  PASSWORD_MEDIUM: 'Password must contain uppercase, lowercase, and numbers',
  PASSWORD_STRONG: 'Password must contain uppercase, lowercase, numbers, and special characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  PASSWORD_CURRENT: 'Current password is incorrect',
  
  // File validation messages
  FILE_REQUIRED: 'Please select a file',
  FILE_SIZE_LIMIT: (size) => `File size must be less than ${size}`,
  FILE_TYPE_INVALID: (types) => `File must be one of: ${types.join(', ')}`,
  FILE_COUNT_LIMIT: (count) => `Maximum ${count} files allowed`,
  
  // Custom validation messages
  DUPLICATE_VALUE: 'This value already exists',
  INVALID_SELECTION: 'Please make a valid selection',
  TERMS_NOT_ACCEPTED: 'You must accept the terms and conditions',
  PRIVACY_NOT_ACCEPTED: 'You must accept the privacy policy'
};

/**
 * Basic validation rules
 */
export const validationRules = {
  /**
   * Required field validation
   * @param {any} value - Value to validate
   * @param {string} fieldName - Field name for error message
   * @returns {Object} Validation result
   */
  required: (value, fieldName = 'Field') => {
    if (value === null || value === undefined || value === '') {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED_FIELD(fieldName) };
    }
    if (Array.isArray(value) && value.length === 0) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED_FIELD(fieldName) };
    }
    return { isValid: true };
  },

  /**
   * Email validation
   * @param {string} email - Email to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  email: (email, options = {}) => {
    const { required = false, pattern = VALIDATION_PATTERNS.EMAIL } = options;
    
    if (!email && !required) {
      return { isValid: true };
    }
    
    if (!email && required) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    
    if (!pattern.test(email)) {
      return { isValid: false, message: ERROR_MESSAGES.INVALID_EMAIL };
    }
    
    return { isValid: true };
  },

  /**
   * Phone number validation
   * @param {string} phone - Phone number to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  phone: (phone, options = {}) => {
    const { required = false, pattern = VALIDATION_PATTERNS.PHONE_US } = options;
    
    if (!phone && !required) {
      return { isValid: true };
    }
    
    if (!phone && required) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    
    if (!pattern.test(phone)) {
      return { isValid: false, message: ERROR_MESSAGES.INVALID_PHONE };
    }
    
    return { isValid: true };
  },

  /**
   * Password validation
   * @param {string} password - Password to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  password: (password, options = {}) => {
    const { 
      required = true, 
      minLength = 8, 
      strength = 'medium',
      confirmPassword = null 
    } = options;
    
    if (!password && required) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    
    if (!password && !required) {
      return { isValid: true };
    }
    
    if (password.length < minLength) {
      return { isValid: false, message: ERROR_MESSAGES.MIN_LENGTH(minLength) };
    }
    
    // Check password strength
    const strengthPatterns = {
      weak: VALIDATION_PATTERNS.PASSWORD_WEAK,
      medium: VALIDATION_PATTERNS.PASSWORD_MEDIUM,
      strong: VALIDATION_PATTERNS.PASSWORD_STRONG
    };
    
    const pattern = strengthPatterns[strength];
    if (pattern && !pattern.test(password)) {
      const messages = {
        weak: ERROR_MESSAGES.PASSWORD_WEAK,
        medium: ERROR_MESSAGES.PASSWORD_MEDIUM,
        strong: ERROR_MESSAGES.PASSWORD_STRONG
      };
      return { isValid: false, message: messages[strength] };
    }
    
    // Check password confirmation
    if (confirmPassword !== null && password !== confirmPassword) {
      return { isValid: false, message: ERROR_MESSAGES.PASSWORD_MISMATCH };
    }
    
    return { isValid: true };
  },

  /**
   * String length validation
   * @param {string} value - String to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  length: (value, options = {}) => {
    const { min, max, exact } = options;
    
    if (!value) {
      return { isValid: true };
    }
    
    const length = value.length;
    
    if (exact !== undefined && length !== exact) {
      return { isValid: false, message: ERROR_MESSAGES.EXACT_LENGTH(exact) };
    }
    
    if (min !== undefined && length < min) {
      return { isValid: false, message: ERROR_MESSAGES.MIN_LENGTH(min) };
    }
    
    if (max !== undefined && length > max) {
      return { isValid: false, message: ERROR_MESSAGES.MAX_LENGTH(max) };
    }
    
    return { isValid: true };
  },

  /**
   * Number validation
   * @param {any} value - Value to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  number: (value, options = {}) => {
    const { 
      min, 
      max, 
      integer = false, 
      positive = false, 
      negative = false,
      decimalPlaces 
    } = options;
    
    if (value === '' || value === null || value === undefined) {
      return { isValid: true };
    }
    
    const numValue = Number(value);
    
    if (isNaN(numValue)) {
      return { isValid: false, message: 'Must be a valid number' };
    }
    
    if (integer && !Number.isInteger(numValue)) {
      return { isValid: false, message: ERROR_MESSAGES.INTEGER_ONLY };
    }
    
    if (positive && numValue <= 0) {
      return { isValid: false, message: ERROR_MESSAGES.POSITIVE_NUMBER };
    }
    
    if (negative && numValue >= 0) {
      return { isValid: false, message: ERROR_MESSAGES.NEGATIVE_NUMBER };
    }
    
    if (min !== undefined && numValue < min) {
      return { isValid: false, message: ERROR_MESSAGES.MIN_VALUE(min) };
    }
    
    if (max !== undefined && numValue > max) {
      return { isValid: false, message: ERROR_MESSAGES.MAX_VALUE(max) };
    }
    
    if (decimalPlaces !== undefined) {
      const decimals = (numValue.toString().split('.')[1] || '').length;
      if (decimals > decimalPlaces) {
        return { isValid: false, message: ERROR_MESSAGES.DECIMAL_PLACES(decimalPlaces) };
      }
    }
    
    return { isValid: true };
  },

  /**
   * Date validation
   * @param {any} value - Date value to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  date: (value, options = {}) => {
    const { 
      min, 
      max, 
      future = false, 
      past = false,
      minAge,
      maxAge 
    } = options;
    
    if (!value) {
      return { isValid: true };
    }
    
    const date = new Date(value);
    
    if (isNaN(date.getTime())) {
      return { isValid: false, message: ERROR_MESSAGES.INVALID_DATE };
    }
    
    const now = new Date();
    
    if (future && date <= now) {
      return { isValid: false, message: ERROR_MESSAGES.FUTURE_DATE };
    }
    
    if (past && date >= now) {
      return { isValid: false, message: ERROR_MESSAGES.PAST_DATE };
    }
    
    if (min && date < new Date(min)) {
      return { isValid: false, message: ERROR_MESSAGES.DATE_RANGE(min, max || 'present') };
    }
    
    if (max && date > new Date(max)) {
      return { isValid: false, message: ERROR_MESSAGES.DATE_RANGE(min || 'past', max) };
    }
    
    // Age validation
    if (minAge !== undefined || maxAge !== undefined) {
      const age = Math.floor((now - date) / (365.25 * 24 * 60 * 60 * 1000));
      
      if (minAge !== undefined && age < minAge) {
        return { isValid: false, message: ERROR_MESSAGES.MIN_AGE(minAge) };
      }
      
      if (maxAge !== undefined && age > maxAge) {
        return { isValid: false, message: ERROR_MESSAGES.MAX_AGE(maxAge) };
      }
    }
    
    return { isValid: true };
  },

  /**
   * URL validation
   * @param {string} url - URL to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  url: (url, options = {}) => {
    const { required = false, protocols = ['http', 'https'] } = options;
    
    if (!url && !required) {
      return { isValid: true };
    }
    
    if (!url && required) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    
    try {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol.slice(0, -1);
      
      if (!protocols.includes(protocol)) {
        return { 
          isValid: false, 
          message: `URL must use one of these protocols: ${protocols.join(', ')}` 
        };
      }
      
      return { isValid: true };
    } catch {
      return { isValid: false, message: ERROR_MESSAGES.INVALID_URL };
    }
  },

  /**
   * File validation
   * @param {File|FileList} files - File(s) to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  file: (files, options = {}) => {
    const { 
      required = false,
      maxSize = 10 * 1024 * 1024, // 10MB
      allowedTypes = [],
      allowedExtensions = [],
      maxCount = 1
    } = options;
    
    if (!files && required) {
      return { isValid: false, message: ERROR_MESSAGES.FILE_REQUIRED };
    }
    
    if (!files) {
      return { isValid: true };
    }
    
    const fileArray = Array.from(files instanceof FileList ? files : [files]);
    
    if (fileArray.length > maxCount) {
      return { isValid: false, message: ERROR_MESSAGES.FILE_COUNT_LIMIT(maxCount) };
    }
    
    for (const file of fileArray) {
      // Size validation
      if (file.size > maxSize) {
        const sizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        return { isValid: false, message: ERROR_MESSAGES.FILE_SIZE_LIMIT(`${sizeMB}MB`) };
      }
      
      // Type validation
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        return { isValid: false, message: ERROR_MESSAGES.FILE_TYPE_INVALID(allowedTypes) };
      }
      
      // Extension validation
      if (allowedExtensions.length > 0) {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!extension || !allowedExtensions.includes(extension)) {
          return { isValid: false, message: ERROR_MESSAGES.FILE_TYPE_INVALID(allowedExtensions) };
        }
      }
    }
    
    return { isValid: true };
  },

  /**
   * Pattern validation
   * @param {string} value - Value to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  pattern: (value, options = {}) => {
    const { pattern, message = 'Invalid format', required = false } = options;
    
    if (!value && !required) {
      return { isValid: true };
    }
    
    if (!value && required) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    
    if (!pattern.test(value)) {
      return { isValid: false, message };
    }
    
    return { isValid: true };
  }
};

/**
 * Custom validation rules for specific use cases
 */
export const customValidationRules = {
  /**
   * Social Security Number validation
   * @param {string} ssn - SSN to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  ssn: (ssn, options = {}) => {
    return validationRules.pattern(ssn, {
      pattern: VALIDATION_PATTERNS.SSN,
      message: ERROR_MESSAGES.INVALID_SSN,
      ...options
    });
  },

  /**
   * Credit card validation using Luhn algorithm
   * @param {string} cardNumber - Credit card number
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  creditCard: (cardNumber, options = {}) => {
    const { required = false } = options;
    
    if (!cardNumber && !required) {
      return { isValid: true };
    }
    
    if (!cardNumber && required) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    
    // Check if it's all digits and proper length
    if (!/^\d{13,19}$/.test(cleaned)) {
      return { isValid: false, message: ERROR_MESSAGES.INVALID_CREDIT_CARD };
    }
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    if (sum % 10 !== 0) {
      return { isValid: false, message: ERROR_MESSAGES.INVALID_CREDIT_CARD };
    }
    
    return { isValid: true };
  },

  /**
   * Unit number validation
   * @param {string} unitNumber - Unit number to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  unitNumber: (unitNumber, options = {}) => {
    return validationRules.pattern(unitNumber, {
      pattern: VALIDATION_PATTERNS.UNIT_NUMBER,
      message: 'Unit number can only contain letters, numbers, #, -, and spaces',
      ...options
    });
  },

  /**
   * Rent amount validation
   * @param {any} rent - Rent amount to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  rentAmount: (rent, options = {}) => {
    const { min = 0, max = 50000 } = options;
    
    return validationRules.number(rent, {
      min,
      max,
      positive: true,
      decimalPlaces: 2,
      ...options
    });
  },

  /**
   * Lease term validation
   * @param {any} term - Lease term in months
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  leaseTerm: (term, options = {}) => {
    const { min = 1, max = 60 } = options;
    
    return validationRules.number(term, {
      min,
      max,
      integer: true,
      positive: true,
      ...options
    });
  },

  /**
   * Property square footage validation
   * @param {any} sqft - Square footage to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  squareFootage: (sqft, options = {}) => {
    const { min = 100, max = 100000 } = options;
    
    return validationRules.number(sqft, {
      min,
      max,
      positive: true,
      integer: true,
      ...options
    });
  },

  /**
   * Occupancy validation
   * @param {any} occupancy - Number of occupants
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  occupancy: (occupancy, options = {}) => {
    const { min = 1, max = 20 } = options;
    
    return validationRules.number(occupancy, {
      min,
      max,
      integer: true,
      positive: true,
      ...options
    });
  },

  /**
   * Percentage validation
   * @param {any} percentage - Percentage value
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  percentage: (percentage, options = {}) => {
    const { min = 0, max = 100 } = options;
    
    return validationRules.number(percentage, {
      min,
      max,
      decimalPlaces: 2,
      ...options
    });
  }
};

/**
 * Validation rule composer for complex validations
 */
export const validationComposer = {
  /**
   * Combine multiple validation rules
   * @param {Array} rules - Array of validation functions
   * @returns {Function} Combined validation function
   */
  combine: (rules) => {
    return (value, options = {}) => {
      for (const rule of rules) {
        const result = rule(value, options);
        if (!result.isValid) {
          return result;
        }
      }
      return { isValid: true };
    };
  },

  /**
   * Create conditional validation
   * @param {Function} condition - Condition function
   * @param {Function} rule - Validation rule to apply if condition is true
   * @returns {Function} Conditional validation function
   */
  when: (condition, rule) => {
    return (value, options = {}, formData = {}) => {
      if (condition(formData, value)) {
        return rule(value, options);
      }
      return { isValid: true };
    };
  },

  /**
   * Create async validation rule
   * @param {Function} asyncRule - Async validation function
   * @returns {Function} Async validation function
   */
  async: (asyncRule) => {
    return async (value, options = {}) => {
      try {
        return await asyncRule(value, options);
      } catch (error) {
        return { isValid: false, message: error.message };
      }
    };
  }
};

/**
 * Validation utilities
 */
export const validationUtils = {
  /**
   * Validate multiple fields
   * @param {Object} data - Data to validate
   * @param {Object} rules - Validation rules for each field
   * @returns {Object} Validation results
   */
  validateFields: (data, rules) => {
    const results = {};
    let isValid = true;
    
    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field];
      const result = rule(value, {}, data);
      
      results[field] = result;
      if (!result.isValid) {
        isValid = false;
      }
    }
    
    return { isValid, results };
  },

  /**
   * Get first validation error
   * @param {Object} validationResults - Validation results
   * @returns {string|null} First error message
   */
  getFirstError: (validationResults) => {
    for (const result of Object.values(validationResults)) {
      if (!result.isValid) {
        return result.message;
      }
    }
    return null;
  },

  /**
   * Check if any field has errors
   * @param {Object} validationResults - Validation results
   * @returns {boolean} Whether there are any errors
   */
  hasErrors: (validationResults) => {
    return Object.values(validationResults).some(result => !result.isValid);
  },

  /**
   * Get all error messages
   * @param {Object} validationResults - Validation results
   * @returns {Array} Array of error messages
   */
  getAllErrors: (validationResults) => {
    return Object.values(validationResults)
      .filter(result => !result.isValid)
      .map(result => result.message);
  }
};

// Export all validation rules and utilities
export default {
  VALIDATION_PATTERNS,
  ERROR_MESSAGES,
  validationRules,
  customValidationRules,
  validationComposer,
  validationUtils
};