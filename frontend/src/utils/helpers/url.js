/**
 * URL and query parameter utilities
 */

/**
 * Build URL with query parameters
 */
export const buildUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl, window.location.origin);
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      } else {
        url.searchParams.set(key, value);
      }
    }
  });
  
  return url.toString();
};

/**
 * Parse query parameters from URL
 */
export const parseQueryParams = (search = window.location.search) => {
  const params = new URLSearchParams(search);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    if (result[key]) {
      // Handle multiple values for same key
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
};

/**
 * Update URL query parameters without page reload
 */
export const updateQueryParams = (params, replace = false) => {
  const url = new URL(window.location);
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value === null || value === undefined || value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });
  
  const method = replace ? 'replaceState' : 'pushState';
  window.history[method]({}, '', url.toString());
};

/**
 * Remove query parameters from URL
 */
export const removeQueryParams = (keys, replace = false) => {
  const url = new URL(window.location);
  
  keys.forEach(key => {
    url.searchParams.delete(key);
  });
  
  const method = replace ? 'replaceState' : 'pushState';
  window.history[method]({}, '', url.toString());
};

/**
 * Get base URL without query parameters
 */
export const getBaseUrl = (url = window.location.href) => {
  return url.split('?')[0];
};

/**
 * Check if URL is external
 */
export const isExternalUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname !== window.location.hostname;
  } catch {
    return false;
  }
};

/**
 * Generate slug from string
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Validate URL format
 */
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

/**
 * Extract domain from URL
 */
export const extractDomain = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

/**
 * Add protocol to URL if missing
 */
export const addProtocol = (url, protocol = 'https://') => {
  if (!url) return '';
  
  if (!/^https?:\/\//i.test(url)) {
    return protocol + url;
  }
  
  return url;
};