const axios = require('axios');
const NodeGeocoder = require('node-geocoder');
const { promisify } = require('util');
const redis = require('../../config/redis');
const logger = require('../../config/logger');

const GEOCODE_CACHE_EXPIRY = 86400; // 24 hours in seconds

// Initialize geocoder
const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
  formatter: null
});

const cache = {
  set: promisify(redis.set).bind(redis),
  get: promisify(redis.get).bind(redis),
  del: promisify(redis.del).bind(redis)
};

/**
 * Geocode an address to get coordinates
 * @param {string} address - Full address string
 * @returns {Promise<Object>} Geocoded result with lat/lng
 */
const geocodeAddress = async (address) => {
  try {
    // Check cache first
    const cacheKey = `geocode:${address}`;
    const cached = await cache.get(cacheKey);
    
    if (cached) {
      logger.debug(`Geocode cache hit for: ${address}`);
      return JSON.parse(cached);
    }
    
    const results = await geocoder.geocode(address);
    
    if (!results || results.length === 0) {
      throw new Error(`No results found for address: ${address}`);
    }
    
    const result = results[0];
    const geocodedData = {
      latitude: result.latitude,
      longitude: result.longitude,
      formattedAddress: result.formattedAddress,
      street: result.streetName || result.streetNumber,
      city: result.city,
      state: result.state,
      country: result.country,
      countryCode: result.countryCode,
      postalCode: result.zipcode,
      neighborhood: result.extra?.neighborhood,
      borough: result.extra?.borough,
      county: result.county,
      provider: result.provider
    };
    
    // Cache the result
    await cache.set(cacheKey, JSON.stringify(geocodedData), 'EX', GEOCODE_CACHE_EXPIRY);
    
    return geocodedData;
  } catch (error) {
    logger.error(`Geocoding failed for address: ${address}`, error);
    throw new Error(`Geocoding failed: ${error.message}`);
  }
};

/**
 * Reverse geocode coordinates to get address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Address information
 */
const reverseGeocode = async (lat, lng) => {
  try {
    const cacheKey = `reverse_geocode:${lat},${lng}`;
    const cached = await cache.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    const results = await geocoder.reverse({ lat, lon: lng });
    
    if (!results || results.length === 0) {
      throw new Error(`No results found for coordinates: ${lat}, ${lng}`);
    }
    
    const result = results[0];
    const addressData = {
      formattedAddress: result.formattedAddress,
      street: result.streetName || result.streetNumber,
      city: result.city,
      state: result.state,
      country: result.country,
      countryCode: result.countryCode,
      postalCode: result.zipcode,
      neighborhood: result.extra?.neighborhood,
      provider: result.provider
    };
    
    await cache.set(cacheKey, JSON.stringify(addressData), 'EX', GEOCODE_CACHE_EXPIRY);
    
    return addressData;
  } catch (error) {
    logger.error(`Reverse geocoding failed for coordinates: ${lat}, ${lng}`, error);
    throw new Error(`Reverse geocoding failed: ${error.message}`);
  }
};

/**
 * Calculate distance between two coordinates in kilometers
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert degrees to radians
 */
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Find properties within a radius of a location
 * @param {number} centerLat - Center latitude
 * @param {number} centerLng - Center longitude
 * @param {number} radiusKm - Radius in kilometers
 * @param {Array} properties - Array of property objects with lat/lng
 * @returns {Array} Properties within the radius
 */
const findPropertiesInRadius = (centerLat, centerLng, radiusKm, properties) => {
  return properties.filter(property => {
    if (!property.latitude || !property.longitude) return false;
    
    const distance = calculateDistance(
      centerLat, centerLng,
      property.latitude, property.longitude
    );
    
    return distance <= radiusKm;
  });
};

/**
 * Get timezone for coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Timezone
 */
const getTimezone = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/timezone/json`,
      {
        params: {
          location: `${lat},${lng}`,
          timestamp: Math.floor(Date.now() / 1000),
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    );
    
    if (response.data.status === 'OK') {
      return response.data.timeZoneId;
    }
    
    return 'UTC';
  } catch (error) {
    logger.error('Failed to get timezone', error);
    return 'UTC';
  }
};

/**
 * Validate coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if valid
 */
const isValidCoordinates = (lat, lng) => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

/**
 * Parse address components from a full address string
 * @param {string} address - Full address
 * @returns {Object} Parsed address components
 */
const parseAddress = (address) => {
  const components = {};
  
  // Simple parsing (can be enhanced with more sophisticated parsing)
  const parts = address.split(',').map(part => part.trim());
  
  if (parts.length >= 1) components.street = parts[0];
  if (parts.length >= 2) components.city = parts[1];
  if (parts.length >= 3) components.state = parts[2];
  if (parts.length >= 4) components.country = parts[3];
  if (parts.length >= 5) components.postalCode = parts[4];
  
  return components;
};

/**
 * Get nearby amenities using Google Places API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} type - Place type
 * @param {number} radius - Radius in meters
 * @returns {Promise<Array>} Nearby places
 */
const getNearbyPlaces = async (lat, lng, type = '', radius = 5000) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${lat},${lng}`,
          radius: radius,
          type: type,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    );
    
    if (response.data.status === 'OK') {
      return response.data.results.map(place => ({
        name: place.name,
        address: place.vicinity,
        types: place.types,
        rating: place.rating,
        totalRatings: place.user_ratings_total,
        location: place.geometry.location
      }));
    }
    
    return [];
  } catch (error) {
    logger.error('Failed to get nearby places', error);
    return [];
  }
};

module.exports = {
  geocodeAddress,
  reverseGeocode,
  calculateDistance,
  findPropertiesInRadius,
  getTimezone,
  isValidCoordinates,
  parseAddress,
  getNearbyPlaces
};