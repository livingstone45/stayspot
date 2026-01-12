const axios = require('axios');
const { Property } = require('../../models');

class GeolocationService {
  constructor() {
    this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  }

  async geocodeAddress(address) {
    if (!this.googleMapsApiKey) {
      throw new Error('Google Maps API key not configured');
    }

    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: address,
          key: this.googleMapsApiKey
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        const location = result.geometry.location;
        
        return {
          latitude: location.lat,
          longitude: location.lng,
          formattedAddress: result.formatted_address,
          addressComponents: result.address_components
        };
      } else {
        throw new Error('Address not found');
      }
    } catch (error) {
      throw new Error(`Geocoding failed: ${error.message}`);
    }
  }

  async reverseGeocode(latitude, longitude) {
    if (!this.googleMapsApiKey) {
      throw new Error('Google Maps API key not configured');
    }

    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: `${latitude},${longitude}`,
          key: this.googleMapsApiKey
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        return response.data.results[0];
      } else {
        throw new Error('Location not found');
      }
    } catch (error) {
      throw new Error(`Reverse geocoding failed: ${error.message}`);
    }
  }

  async updatePropertyCoordinates(propertyId) {
    const property = await Property.findByPk(propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zip_code}`;
    
    try {
      const geocodeResult = await this.geocodeAddress(fullAddress);
      
      await property.update({
        latitude: geocodeResult.latitude,
        longitude: geocodeResult.longitude
      });

      return {
        propertyId,
        latitude: geocodeResult.latitude,
        longitude: geocodeResult.longitude,
        formattedAddress: geocodeResult.formattedAddress
      };
    } catch (error) {
      throw new Error(`Failed to update coordinates: ${error.message}`);
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  async findNearbyProperties(latitude, longitude, radiusKm = 10, limit = 20) {
    const properties = await Property.findAll({
      where: {
        latitude: { [Op.ne]: null },
        longitude: { [Op.ne]: null },
        status: 'active'
      },
      attributes: ['id', 'name', 'address', 'city', 'state', 'latitude', 'longitude', 'monthly_rent']
    });

    const nearbyProperties = properties
      .map(property => {
        const distance = this.calculateDistance(
          latitude, longitude,
          property.latitude, property.longitude
        );
        
        return {
          ...property.toJSON(),
          distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
        };
      })
      .filter(property => property.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    return nearbyProperties;
  }

  async getPropertyNeighborhood(propertyId) {
    const property = await Property.findByPk(propertyId);
    if (!property || !property.latitude || !property.longitude) {
      throw new Error('Property not found or coordinates not available');
    }

    try {
      // Get nearby places using Google Places API
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          location: `${property.latitude},${property.longitude}`,
          radius: 1000, // 1km radius
          type: 'point_of_interest',
          key: this.googleMapsApiKey
        }
      });

      const places = response.data.results.map(place => ({
        name: place.name,
        type: place.types[0],
        rating: place.rating,
        vicinity: place.vicinity,
        distance: this.calculateDistance(
          property.latitude, property.longitude,
          place.geometry.location.lat, place.geometry.location.lng
        )
      }));

      return places.sort((a, b) => a.distance - b.distance);
    } catch (error) {
      throw new Error(`Failed to get neighborhood data: ${error.message}`);
    }
  }

  async bulkGeocodeProperties(companyId) {
    const properties = await Property.findAll({
      where: {
        company_id: companyId,
        latitude: null,
        longitude: null
      }
    });

    const results = [];

    for (const property of properties) {
      try {
        const result = await this.updatePropertyCoordinates(property.id);
        results.push({ success: true, propertyId: property.id, ...result });
        
        // Add delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        results.push({ 
          success: false, 
          propertyId: property.id, 
          error: error.message 
        });
      }
    }

    return {
      total: properties.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  async getRouteDistance(origin, destination) {
    if (!this.googleMapsApiKey) {
      throw new Error('Google Maps API key not configured');
    }

    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
          origins: origin,
          destinations: destination,
          units: 'metric',
          key: this.googleMapsApiKey
        }
      });

      if (response.data.status === 'OK' && response.data.rows.length > 0) {
        const element = response.data.rows[0].elements[0];
        
        if (element.status === 'OK') {
          return {
            distance: element.distance,
            duration: element.duration
          };
        }
      }
      
      throw new Error('Route not found');
    } catch (error) {
      throw new Error(`Route calculation failed: ${error.message}`);
    }
  }
}

module.exports = new GeolocationService();