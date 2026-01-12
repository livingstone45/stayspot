const crypto = require('crypto');

class StringHelper {
  /**
   * Generate a random string
   * @param {number} length - Length of string
   * @returns {string} Random string
   */
  static generateRandomString(length = 10) {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  /**
   * Generate a secure token
   * @param {number} bytes - Number of bytes
   * @returns {string} Secure token
   */
  static generateToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
  }

  /**
   * Slugify a string
   * @param {string} text - Text to slugify
   * @returns {string} Slugified string
   */
  static slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  /**
   * Truncate string with ellipsis
   * @param {string} str - String to truncate
   * @param {number} length - Max length
   * @param {string} ellipsis - Ellipsis character
   * @returns {string} Truncated string
   */
  static truncate(str, length = 100, ellipsis = '...') {
    if (str.length <= length) return str;
    return str.substring(0, length - ellipsis.length) + ellipsis;
  }

  /**
   * Capitalize first letter of each word
   * @param {string} str - String to capitalize
   * @returns {string} Capitalized string
   */
  static capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }

  /**
   * Convert string to camelCase
   * @param {string} str - String to convert
   * @returns {string} camelCase string
   */
  static toCamelCase(str) {
    return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^(.)/, (_, c) => c.toLowerCase());
  }

  /**
   * Convert string to snake_case
   * @param {string} str - String to convert
   * @returns {string} snake_case string
   */
  static toSnakeCase(str) {
    return str.replace(/\s+/g, '_')
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toLowerCase();
  }

  /**
   * Convert string to kebab-case
   * @param {string} str - String to convert
   * @returns {string} kebab-case string
   */
  static toKebabCase(str) {
    return str.replace(/\s+/g, '-')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }

  /**
   * Remove HTML tags from string
   * @param {string} str - String with HTML
   * @returns {string} Clean string
   */
  static stripHtml(str) {
    return str.replace(/<[^>]*>/g, '');
  }

  /**
   * Escape special regex characters
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  static escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Generate initials from name
   * @param {string} name - Full name
   * @returns {string} Initials
   */
  static getInitials(name) {
    if (!name) return '';
    
    const words = name.split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }

  /**
   * Mask sensitive information
   * @param {string} str - String to mask
   * @param {number} visibleChars - Number of visible chars at start/end
   * @returns {string} Masked string
   */
  static maskSensitive(str, visibleChars = 4) {
    if (!str || str.length <= visibleChars * 2) return '*'.repeat(str.length);
    
    const start = str.substring(0, visibleChars);
    const end = str.substring(str.length - visibleChars);
    const masked = '*'.repeat(str.length - visibleChars * 2);
    
    return start + masked + end;
  }

  /**
   * Normalize whitespace
   * @param {string} str - String to normalize
   * @returns {string} Normalized string
   */
  static normalizeWhitespace(str) {
    return str.replace(/\s+/g, ' ').trim();
  }

  /**
   * Remove diacritics/accents
   * @param {string} str - String with accents
   * @returns {string} Clean string
   */
  static removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Generate a unique filename
   * @param {string} originalName - Original filename
   * @param {string} prefix - Optional prefix
   * @returns {string} Unique filename
   */
  static generateUniqueFilename(originalName, prefix = '') {
    const ext = originalName.split('.').pop();
    const name = originalName.substring(0, originalName.lastIndexOf('.'));
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    
    const cleanName = this.slugify(name);
    const uniqueName = `${prefix}${cleanName}-${timestamp}-${random}.${ext}`;
    
    return uniqueName;
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid
   */
  static isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  /**
   * Generate a hash from string
   * @param {string} str - String to hash
   * @param {string} algorithm - Hash algorithm
   * @returns {string} Hash string
   */
  static hashString(str, algorithm = 'sha256') {
    return crypto.createHash(algorithm).update(str).digest('hex');
  }

  /**
   * Parse CSV line
   * @param {string} line - CSV line
   * @returns {Array} Parsed values
   */
  static parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current.trim());
    return values;
  }

  /**
   * Generate a color from string (for avatars, etc.)
   * @param {string} str - Input string
   * @returns {string} Hex color
   */
  static stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  }

  /**
   * Count words in string
   * @param {string} str - Input string
   * @returns {number} Word count
   */
  static countWords(str) {
    if (!str) return 0;
    return str.trim().split(/\s+/).length;
  }

  /**
   * Generate a readable file size string
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

module.exports = StringHelper;