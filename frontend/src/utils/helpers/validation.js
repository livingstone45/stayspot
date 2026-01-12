/**
 * Validation utilities for form inputs and data validation
 * Provides comprehensive validation functions for various data types
 */

/**
 * Email validation regex pattern
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Phone number validation regex patterns
 */
const PHONE_PATTERNS = {
  US: /^(\+1\s?)?(\([0-9]{3}\)\s?|[0-9]{3}[\s.-]?)[0-9]{3}[\s.-]?[0-9]{4}$/,
  INTERNATIONAL: /^\+[1-9]\d{1,14}$/,
  DIGITS_ONLY: /^\d{10,15}$/
};

/**
 * Password strength requirements
 */
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

/**
 * Validation result structure
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the value is valid
 * @property {string} message - Validation message
 * @property {string} type - Type of validation error
 */

/**
 * Validate email addresses
 * @param {string} email - Email to validate
 * @param {Object} options - Validation options
 * @returns {ValidationResult} Validation result
 */
export const validateEmail = (email, options = {}) => {
  const { required = true, allowEmpty = false } = options;

  if (!email || email.trim() === '') {
    if (required && !allowEmpty) {
      return { isValid: false, message: 'Email is required', type: 'required' };
    }
    if (allowEmpty) {
      return { isValid: true, message: '', type: 'success' };
    }
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (trimmedEmail.length > 254) {
    return { isValid: false, message: 'Email is too long', type: 'length' };
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { isValid: false, message: 'Please enter a valid email address', type: 'format' };
  }

  // Check for common typos in domains
  const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const domain = trimmedEmail.split('@')[1];
  const suggestions = [];

  commonDomains.forEach(commonDomain => {
    if (domain && domain !== commonDomain && levenshteinDistance(domain, commonDomain) <= 2) {
      suggestions.push(commonDomain);
    }
  });

  if (suggestions.length > 0) {
    return {
      isValid: true,
      message: `Did you mean ${trimmedEmail.split('@')[0]}@${suggestions[0]}?`,
      type: 'suggestion',
      suggestion: `${trimmedEmail.split('@')[0]}@${suggestions[0]}`
    };
  }

  return { isValid: true, message: 'Valid email address', type: 'success' };
};

/**
 * Validate passwords
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {ValidationResult} Validation result with strength score
 */
export const validatePassword = (password, options = {}) => {
  const requirements = { ...PASSWORD_REQUIREMENTS, ...options };
  const { required = true, allowEmpty = false } = options;

  if (!password || password === '') {
    if (required && !allowEmpty) {
      return { isValid: false, message: 'Password is required', type: 'required', strength: 0 };
    }
    if (allowEmpty) {
      return { isValid: true, message: '', type: 'success', strength: 0 };
    }
  }

  const errors = [];
  let strength = 0;

  // Length validation
  if (password.length < requirements.minLength) {
    errors.push(`Password must be at least ${requirements.minLength} characters long`);
  } else {
    strength += 20;
  }

  if (password.length > requirements.maxLength) {
    errors.push(`Password must be no more than ${requirements.maxLength} characters long`);
  }

  // Character type requirements
  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (requirements.requireUppercase) {
    strength += 20;
  }

  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (requirements.requireLowercase) {
    strength += 20;
  }

  if (requirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else if (requirements.requireNumbers) {
    strength += 20;
  }

  if (requirements.requireSpecialChars) {
    const specialCharRegex = new RegExp(`[${requirements.specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`);
    if (!specialCharRegex.test(password)) {
      errors.push('Password must contain at least one special character');
    } else {
      strength += 20;
    }
  }

  // Additional strength factors
  if (password.length >= 12) strength += 10;
  if (/[A-Z].*[A-Z]/.test(password)) strength += 5;
  if (/\d.*\d/.test(password)) strength += 5;
  if (new Set(password).size >= password.length * 0.7) strength += 10; // Character diversity

  // Common password check
  if (isCommonPassword(password)) {
    errors.push('This password is too common. Please choose a more unique password');
    strength = Math.min(strength, 30);
  }

  const strengthLabel = getPasswordStrengthLabel(strength);

  if (errors.length > 0) {
    return {
      isValid: false,
      message: errors[0],
      type: 'validation',
      errors,
      strength,
      strengthLabel
    };
  }

  return {
    isValid: true,
    message: `Password strength: ${strengthLabel}`,
    type: 'success',
    strength,
    strengthLabel
  };
};

/**
 * Validate phone numbers
 * @param {string} phone - Phone number to validate
 * @param {Object} options - Validation options
 * @returns {ValidationResult} Validation result
 */
export const validatePhoneNumber = (phone, options = {}) => {
  const { required = true, allowEmpty = false, format = 'US' } = options;

  if (!phone || phone.trim() === '') {
    if (required && !allowEmpty) {
      return { isValid: false, message: 'Phone number is required', type: 'required' };
    }
    if (allowEmpty) {
      return { isValid: true, message: '', type: 'success' };
    }
  }

  const cleanedPhone = phone.replace(/\D/g, '');

  if (cleanedPhone.length === 0) {
    return { isValid: false, message: 'Please enter a valid phone number', type: 'format' };
  }

  const pattern = PHONE_PATTERNS[format] || PHONE_PATTERNS.US;

  if (!pattern.test(phone)) {
    const formatExamples = {
      US: '(555) 123-4567 or 555-123-4567',
      INTERNATIONAL: '+1 555 123 4567',
      DIGITS_ONLY: '5551234567'
    };

    return {
      isValid: false,
      message: `Please enter a valid phone number (e.g., ${formatExamples[format] || formatExamples.US})`,
      type: 'format'
    };
  }

  return { isValid: true, message: 'Valid phone number', type: 'success' };
};

/**
 * Validate required fields
 * @param {any} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {ValidationResult} Validation result
 */
export const validateRequired = (value, options = {}) => {
  const { fieldName = 'Field', customMessage } = options;

  if (value === null || value === undefined) {
    return {
      isValid: false,
      message: customMessage || `${fieldName} is required`,
      type: 'required'
    };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return {
      isValid: false,
      message: customMessage || `${fieldName} is required`,
      type: 'required'
    };
  }

  if (Array.isArray(value) && value.length === 0) {
    return {
      isValid: false,
      message: customMessage || `${fieldName} is required`,
      type: 'required'
    };
  }

  return { isValid: true, message: '', type: 'success' };
};

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {Object} options - Validation options
 * @returns {ValidationResult} Validation result
 */
export const validateLength = (value, options = {}) => {
  const { min, max, fieldName = 'Field' } = options;

  if (!value || typeof value !== 'string') {
    return { isValid: true, message: '', type: 'success' };
  }

  const length = value.length;

  if (min !== undefined && length < min) {
    return {
      isValid: false,
      message: `${fieldName} must be at least ${min} characters long`,
      type: 'length'
    };
  }

  if (max !== undefined && length > max) {
    return {
      isValid: false,
      message: `${fieldName} must be no more than ${max} characters long`,
      type: 'length'
    };
  }

  return { isValid: true, message: '', type: 'success' };
};

/**
 * Validate numeric values
 * @param {any} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {ValidationResult} Validation result
 */
export const validateNumber = (value, options = {}) => {
  const { min, max, integer = false, fieldName = 'Number' } = options;

  if (value === '' || value === null || value === undefined) {
    return { isValid: true, message: '', type: 'success' };
  }

  const numValue = Number(value);

  if (isNaN(numValue)) {
    return {
      isValid: false,
      message: `${fieldName} must be a valid number`,
      type: 'format'
    };
  }

  if (integer && !Number.isInteger(numValue)) {
    return {
      isValid: false,
      message: `${fieldName} must be a whole number`,
      type: 'format'
    };
  }

  if (min !== undefined && numValue < min) {
    return {
      isValid: false,
      message: `${fieldName} must be at least ${min}`,
      type: 'range'
    };
  }

  if (max !== undefined && numValue > max) {
    return {
      isValid: false,
      message: `${fieldName} must be no more than ${max}`,
      type: 'range'
    };
  }

  return { isValid: true, message: '', type: 'success' };
};

/**
 * Validate dates
 * @param {any} value - Date value to validate
 * @param {Object} options - Validation options
 * @returns {ValidationResult} Validation result
 */
export const validateDate = (value, options = {}) => {
  const { min, max, fieldName = 'Date', format = 'YYYY-MM-DD' } = options;

  if (!value) {
    return { isValid: true, message: '', type: 'success' };
  }

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      message: `${fieldName} must be a valid date`,
      type: 'format'
    };
  }

  if (min) {
    const minDate = new Date(min);
    if (date < minDate) {
      return {
        isValid: false,
        message: `${fieldName} must be after ${minDate.toLocaleDateString()}`,
        type: 'range'
      };
    }
  }

  if (max) {
    const maxDate = new Date(max);
    if (date > maxDate) {
      return {
        isValid: false,
        message: `${fieldName} must be before ${maxDate.toLocaleDateString()}`,
        type: 'range'
      };
    }
  }

  return { isValid: true, message: '', type: 'success' };
};

/**
 * Validate URLs
 * @param {string} url - URL to validate
 * @param {Object} options - Validation options
 * @returns {ValidationResult} Validation result
 */
export const validateURL = (url, options = {}) => {
  const { required = false, allowEmpty = true, protocols = ['http', 'https'] } = options;

  if (!url || url.trim() === '') {
    if (required && !allowEmpty) {
      return { isValid: false, message: 'URL is required', type: 'required' };
    }
    return { isValid: true, message: '', type: 'success' };
  }

  try {
    const urlObj = new URL(url);
    
    if (!protocols.includes(urlObj.protocol.slice(0, -1))) {
      return {
        isValid: false,
        message: `URL must use one of these protocols: ${protocols.join(', ')}`,
        type: 'protocol'
      };
    }

    return { isValid: true, message: 'Valid URL', type: 'success' };
  } catch {
    return {
      isValid: false,
      message: 'Please enter a valid URL (e.g., https://example.com)',
      type: 'format'
    };
  }
};

/**
 * Validate file uploads
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {ValidationResult} Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [],
    allowedExtensions = [],
    required = false
  } = options;

  if (!file) {
    if (required) {
      return { isValid: false, message: 'File is required', type: 'required' };
    }
    return { isValid: true, message: '', type: 'success' };
  }

  // Size validation
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      message: `File size must be less than ${maxSizeMB}MB`,
      type: 'size'
    };
  }

  // Type validation
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: `File type must be one of: ${allowedTypes.join(', ')}`,
      type: 'type'
    };
  }

  // Extension validation
  if (allowedExtensions.length > 0) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return {
        isValid: false,
        message: `File extension must be one of: ${allowedExtensions.join(', ')}`,
        type: 'extension'
      };
    }
  }

  return { isValid: true, message: 'Valid file', type: 'success' };
};

/**
 * Validate credit card numbers using Luhn algorithm
 * @param {string} cardNumber - Credit card number
 * @param {Object} options - Validation options
 * @returns {ValidationResult} Validation result
 */
export const validateCreditCard = (cardNumber, options = {}) => {
  const { required = false, allowEmpty = true } = options;

  if (!cardNumber || cardNumber.trim() === '') {
    if (required && !allowEmpty) {
      return { isValid: false, message: 'Credit card number is required', type: 'required' };
    }
    return { isValid: true, message: '', type: 'success' };
  }

  const cleaned = cardNumber.replace(/\D/g, '');

  if (cleaned.length < 13 || cleaned.length > 19) {
    return {
      isValid: false,
      message: 'Credit card number must be between 13 and 19 digits',
      type: 'length'
    };
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
    return {
      isValid: false,
      message: 'Please enter a valid credit card number',
      type: 'format'
    };
  }

  // Detect card type
  const cardType = detectCardType(cleaned);

  return {
    isValid: true,
    message: `Valid ${cardType} card`,
    type: 'success',
    cardType
  };
};

/**
 * Validate postal codes
 * @param {string} postalCode - Postal code to validate
 * @param {Object} options - Validation options
 * @returns {ValidationResult} Validation result
 */
export const validatePostalCode = (postalCode, options = {}) => {
  const { country = 'US', required = false, allowEmpty = true } = options;

  if (!postalCode || postalCode.trim() === '') {
    if (required && !allowEmpty) {
      return { isValid: false, message: 'Postal code is required', type: 'required' };
    }
    return { isValid: true, message: '', type: 'success' };
  }

  const patterns = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/,
    UK: /^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/
  };

  const pattern = patterns[country.toUpperCase()];

  if (!pattern) {
    return { isValid: true, message: '', type: 'success' };
  }

  if (!pattern.test(postalCode.trim())) {
    const examples = {
      US: '12345 or 12345-6789',
      CA: 'K1A 0A6',
      UK: 'SW1A 1AA',
      DE: '12345',
      FR: '75001'
    };

    return {
      isValid: false,
      message: `Please enter a valid postal code (e.g., ${examples[country.toUpperCase()]})`,
      type: 'format'
    };
  }

  return { isValid: true, message: 'Valid postal code', type: 'success' };
};

/**
 * Helper function to calculate Levenshtein distance
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Levenshtein distance
 */
function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Check if password is commonly used
 * @param {string} password - Password to check
 * @returns {boolean} Whether password is common
 */
function isCommonPassword(password) {
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey',
    'dragon', 'master', 'shadow', 'superman', 'michael'
  ];

  return commonPasswords.includes(password.toLowerCase());
}

/**
 * Get password strength label
 * @param {number} strength - Strength score (0-100)
 * @returns {string} Strength label
 */
function getPasswordStrengthLabel(strength) {
  if (strength < 30) return 'Weak';
  if (strength < 60) return 'Fair';
  if (strength < 80) return 'Good';
  return 'Strong';
}

/**
 * Detect credit card type
 * @param {string} cardNumber - Credit card number
 * @returns {string} Card type
 */
function detectCardType(cardNumber) {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    dinersclub: /^3[0689]/,
    jcb: /^35/
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cardNumber)) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }

  return 'Unknown';
}

/**
 * Validate multiple fields at once
 * @param {Object} data - Data object to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation results
 */
export const validateForm = (data, rules) => {
  const results = {};
  let isValid = true;

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    const fieldResults = [];

    for (const rule of fieldRules) {
      const { validator, options = {} } = rule;
      const result = validator(value, { ...options, fieldName: field });
      
      if (!result.isValid) {
        fieldResults.push(result);
        isValid = false;
        break; // Stop at first error for this field
      }
    }

    results[field] = fieldResults.length > 0 ? fieldResults[0] : { isValid: true, message: '', type: 'success' };
  }

  return { isValid, results };
};

// Export all validation functions
export default {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateRequired,
  validateLength,
  validateNumber,
  validateDate,
  validateURL,
  validateFile,
  validateCreditCard,
  validatePostalCode,
  validateForm
};