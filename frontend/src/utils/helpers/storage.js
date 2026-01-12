/**
 * Local storage utilities with error handling
 */

/**
 * Set item in localStorage
 */
export const setLocalStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Error setting localStorage:', error);
    return false;
  }
};

/**
 * Get item from localStorage
 */
export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting localStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove item from localStorage
 */
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing localStorage:', error);
    return false;
  }
};

/**
 * Clear all localStorage
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Set item in sessionStorage
 */
export const setSessionStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Error setting sessionStorage:', error);
    return false;
  }
};

/**
 * Get item from sessionStorage
 */
export const getSessionStorage = (key, defaultValue = null) => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting sessionStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove item from sessionStorage
 */
export const removeSessionStorage = (key) => {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing sessionStorage:', error);
    return false;
  }
};

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get storage size in bytes
 */
export const getStorageSize = () => {
  let total = 0;
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  
  return total;
};

/**
 * Storage keys constants
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'stayspot_auth_token',
  REFRESH_TOKEN: 'stayspot_refresh_token',
  USER_DATA: 'stayspot_user_data',
  THEME: 'stayspot_theme',
  LANGUAGE: 'stayspot_language',
  PREFERENCES: 'stayspot_preferences',
  RECENT_SEARCHES: 'stayspot_recent_searches',
  DRAFT_DATA: 'stayspot_draft_data'
};