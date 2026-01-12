const axios = require('axios');
const { Property, AuditLog } = require('../../models');
const { ROLES } = require('../../utils/constants/roles');

/**
 * Location Controller
 * Handles property geolocation and mapping operations
 */
class LocationController {
  /**
   * Get Property Location
   */
  async getPropertyLocation(req, res) {
    try {
      const { propertyId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view location for this property' });
      }

      const property = await Property.findByPk(propertyId, {
        attributes: ['id', 'name', 'address', 'city', 'state', 'zipCode', 'country', 'latitude', 'longitude', 'geofence']
      });

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      // If no coordinates, try to geocode
      if (!property.latitude || !property.longitude) {
        const geocoded = await this.geocodeAddress(property);
        if (geocoded) {
          property.latitude = geocoded.latitude;
          property.longitude = geocoded.longitude;
          await property.save();
        }
      }

      // Get nearby properties
      const nearbyProperties = await this.getNearbyProperties(property);

      // Get location details
      const locationDetails = await this.getLocationDetails(property.latitude, property.longitude);

      res.json({
        success: true,
        data: {
          property: {
            id: property.id,
            name: property.name,
            address: property.address,
            city: property.city,
            state: property.state,
            zipCode: property.zipCode,
            country: property.country,
            coordinates: {
              latitude: property.latitude,
              longitude: property.longitude
            },
            geofence: property.geofence
          },
          locationDetails,
          nearbyProperties
        }
      });
    } catch (error) {
      console.error('Get property location error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update Property Location
   */
  async updatePropertyLocation(req, res) {
    try {
      const { propertyId } = req.params;
      const { latitude, longitude, geofence, address } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to update location for this property' });
      }

      const property = await Property.findByPk(propertyId);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      const updates = {};
      const changes = {};

      // Update address if provided
      if (address) {
        if (address.street && address.street !== property.address) {
          changes.address = { from: property.address, to: address.street };
          property.address = address.street;
        }
        if (address.city && address.city !== property.city) {
          changes.city = { from: property.city, to: address.city };
          property.city = address.city;
        }
        if (address.state && address.state !== property.state) {
          changes.state = { from: property.state, to: address.state };
          property.state = address.state;
        }
        if (address.zipCode && address.zipCode !== property.zipCode) {
          changes.zipCode = { from: property.zipCode, to: address.zipCode };
          property.zipCode = address.zipCode;
        }
        if (address.country && address.country !== property.country) {
          changes.country = { from: property.country, to: address.country };
          property.country = address.country;
        }

        // Geocode new address
        if (Object.keys(changes).length > 0) {
          const geocoded = await this.geocodeAddress(property);
          if (geocoded) {
            changes.latitude = { from: property.latitude, to: geocoded.latitude };
            changes.longitude = { from: property.longitude, to: geocoded.longitude };
            property.latitude = geocoded.latitude;
            property.longitude = geocoded.longitude;
          }
        }
      }

      // Update coordinates if provided
      if (latitude !== undefined && latitude !== property.latitude) {
        changes.latitude = { from: property.latitude, to: latitude };
        property.latitude = latitude;
      }

      if (longitude !== undefined && longitude !== property.longitude) {
        changes.longitude = { from: property.longitude, to: longitude };
        property.longitude = longitude;
      }

      // Update geofence if provided
      if (geofence !== undefined) {
        changes.geofence = { from: property.geofence, to: geofence };
        property.geofence = geofence;
      }

      // Save changes
      if (Object.keys(changes).length > 0) {
        property.updatedBy = userId;
        await property.save();

        // Create audit log
        await AuditLog.create({
          userId,
          action: 'PROPERTY_LOCATION_UPDATED',
          details: `Location updated for property: ${property.name}`,
          ipAddress: req.ip,
          metadata: { 
            propertyId: property.id, 
            changes 
          }
        });
      }

      res.json({
        success: true,
        message: 'Property location updated successfully',
        data: {
          propertyId: property.id,
          coordinates: {
            latitude: property.latitude,
            longitude: property.longitude
          },
          address: {
            street: property.address,
            city: property.city,
            state: property.state,
            zipCode: property.zipCode,
            country: property.country
          },
          geofence: property.geofence,
          updatedFields: Object.keys(changes)
        }
      });
    } catch (error) {
      console.error('Update property location error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Geocode Address
   */
  async geocodeAddress(req, res) {
    try {
      const { address, city, state, zipCode, country } = req.body;

      if (!address) {
        return res.status(400).json({ error: 'Address is required' });
      }

      const fullAddress = `${address}, ${city || ''}, ${state || ''} ${zipCode || ''}, ${country || ''}`.trim();

      const result = await this.geocode(fullAddress);

      if (!result) {
        return res.status(404).json({ error: 'Could not geocode address' });
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Geocode address error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Reverse Geocode Coordinates
   */
  async reverseGeocode(req, res) {
    try {
      const { latitude, longitude } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
      }

      const result = await this.reverseGeocodeCoordinates(latitude, longitude);

      if (!result) {
        return res.status(404).json({ error: 'Could not reverse geocode coordinates' });
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Reverse geocode error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Properties in Bounds
   */
  async getPropertiesInBounds(req, res) {
    try {
      const { bounds } = req.query;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!bounds) {
        return res.status(400).json({ error: 'Bounds are required' });
      }

      const { north, south, east, west } = JSON.parse(bounds);

      // Get user's accessible properties
      const accessibleProperties = await this.getAccessibleProperties(userId, userRoles);
      const propertyIds = accessibleProperties.map(p => p.id);

      if (propertyIds.length === 0) {
        return res.json({
          success: true,
          data: []
        });
      }

      const properties = await Property.findAll({
        where: {
          id: { [Op.in]: propertyIds },
          latitude: { [Op.between]: [south, north] },
          longitude: { [Op.between]: [west, east] },
          status: 'active'
        },
        attributes: ['id', 'name', 'address', 'city', 'state', 'type', 'monthlyRent', 
                    'bedrooms', 'bathrooms', 'latitude', 'longitude', 'status'],
        limit: 200
      });

      // Format for map response
      const mapProperties = properties.map(property => ({
        id: property.id,
        name: property.name,
        address: property.address,
        city: property.city,
        state: property.state,
        type: property.type,
        price: property.monthlyRent,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        coordinates: {
          lat: property.latitude,
          lng: property.longitude
        },
        status: property.status
      }));

      res.json({
        success: true,
        data: mapProperties
      });
    } catch (error) {
      console.error('Get properties in bounds error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Calculate Distance Between Properties
   */
  async calculateDistance(req, res) {
    try {
      const { propertyId1, propertyId2 } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check access to both properties
      const hasAccess1 = await this.checkPropertyAccess(propertyId1, userId, userRoles);
      const hasAccess2 = await this.checkPropertyAccess(propertyId2, userId, userRoles);

      if (!hasAccess1 || !hasAccess2) {
        return res.status(403).json({ error: 'Not authorized to access one or both properties' });
      }

      const [property1, property2] = await Promise.all([
        Property.findByPk(propertyId1, {
          attributes: ['id', 'name', 'latitude', 'longitude']
        }),
        Property.findByPk(propertyId2, {
          attributes: ['id', 'name', 'latitude', 'longitude']
        })
      ]);

      if (!property1 || !property2) {
        return res.status(404).json({ error: 'One or both properties not found' });
      }

      if (!property1.latitude || !property1.longitude || !property2.latitude || !property2.longitude) {
        return res.status(400).json({ error: 'One or both properties missing coordinates' });
      }

      const distance = this.calculateHaversineDistance(
        property1.latitude, property1.longitude,
        property2.latitude, property2.longitude
      );

      res.json({
        success: true,
        data: {
          property1: {
            id: property1.id,
            name: property1.name
          },
          property2: {
            id: property2.id,
            name: property2.name
          },
          distance: {
            kilometers: distance,
            miles: distance * 0.621371,
            meters: distance * 1000
          }
        }
      });
    } catch (error) {
      console.error('Calculate distance error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Nearby Points of Interest
   */
  async getNearbyPOI(req, res) {
    try {
      const { propertyId } = req.params;
      const { radius = 5, types } = req.query; // radius in kilometers
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Check property access
      const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Not authorized to view nearby points for this property' });
      }

      const property = await Property.findByPk(propertyId, {
        attributes: ['id', 'name', 'latitude', 'longitude']
      });

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      if (!property.latitude || !property.longitude) {
        return res.status(400).json({ error: 'Property missing coordinates' });
      }

      // This would typically use Google Places API or similar
      // For now, return mock data or implement based on available service
      const poiTypes = types ? types.split(',') : ['school', 'hospital', 'park', 'restaurant', 'shopping_mall'];
      
      const pointsOfInterest = await this.fetchPointsOfInterest(
        property.latitude, 
        property.longitude, 
        radius, 
        poiTypes
      );

      res.json({
        success: true,
        data: {
          property: {
            id: property.id,
            name: property.name,
            coordinates: {
              latitude: property.latitude,
              longitude: property.longitude
            }
          },
          radius,
          pointsOfInterest
        }
      });
    } catch (error) {
      console.error('Get nearby POI error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Batch Geocode Properties
   */
  async batchGeocode(req, res) {
    try {
      const { propertyIds } = req.body;
      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
        return res.status(400).json({ error: 'Property IDs array is required' });
      }

      // Limit batch operations
      if (propertyIds.length > 50) {
        return res.status(400).json({ error: 'Maximum 50 properties per batch geocode' });
      }

      const results = {
        success: [],
        failed: []
      };

      // Process each property
      for (const propertyId of propertyIds) {
        try {
          // Check property access
          const hasAccess = await this.checkPropertyAccess(propertyId, userId, userRoles);
          if (!hasAccess) {
            results.failed.push({ propertyId, error: 'Not authorized to access this property' });
            continue;
          }

          const property = await Property.findByPk(propertyId);
          if (!property) {
            results.failed.push({ propertyId, error: 'Property not found' });
            continue;
          }

          // Skip if already has coordinates
          if (property.latitude && property.longitude) {
            results.success.push({ 
              propertyId, 
              status: 'already_geocoded',
              coordinates: {
                latitude: property.latitude,
                longitude: property.longitude
              }
            });
            continue;
          }

          // Geocode address
          const geocoded = await this.geocodeAddress(property);
          if (geocoded) {
            property.latitude = geocoded.latitude;
            property.longitude = geocoded.longitude;
            property.updatedBy = userId;
            await property.save();

            results.success.push({ 
              propertyId, 
              status: 'geocoded',
              coordinates: {
                latitude: geocoded.latitude,
                longitude: geocoded.longitude
              }
            });
          } else {
            results.failed.push({ propertyId, error: 'Could not geocode address' });
          }
        } catch (error) {
          console.error(`Failed to geocode property ${propertyId}:`, error);
          results.failed.push({ propertyId, error: error.message });
        }
      }

      // Create audit log
      await AuditLog.create({
        userId,
        action: 'BATCH_GEOCODE',
        details: `Batch geocode processed: ${results.success.length} success, ${results.failed.length} failed`,
        ipAddress: req.ip,
        metadata: { results }
      });

      res.json({
        success: true,
        message: `Batch geocode processed. ${results.success.length} successful, ${results.failed.length} failed.`,
        data: results
      });
    } catch (error) {
      console.error('Batch geocode error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Location Statistics
   */
  async getLocationStats(req, res) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles;

      // Get user's accessible properties
      const accessibleProperties = await this.getAccessibleProperties(userId, userRoles);
      const propertyIds = accessibleProperties.map(p => p.id);

      if (propertyIds.length === 0) {
        return res.json({
          success: true,
          data: {
            total: 0,
            withCoordinates: 0,
            byCity: {},
            byState: {},
            density: {}
          }
        });
      }

      const properties = await Property.findAll({
        where: { id: { [Op.in]: propertyIds } },
        attributes: ['id', 'city', 'state', 'latitude', 'longitude']
      });

      const totalProperties = properties.length;
      const withCoordinates = properties.filter(p => p.latitude && p.longitude).length;

      // Group by city
      const byCity = properties.reduce((acc, property) => {
        const city = property.city || 'Unknown';
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {});

      // Group by state
      const byState = properties.reduce((acc, property) => {
        const state = property.state || 'Unknown';
        acc[state] = (acc[state] || 0) + 1;
        return acc;
      }, {});

      // Calculate density (simplified)
      const density = {
        urban: properties.filter(p => this.isUrbanArea(p.city)).length,
        suburban: properties.filter(p => this.isSuburbanArea(p.city)).length,
        rural: properties.filter(p => this.isRuralArea(p.city)).length
      };

      res.json({
        success: true,
        data: {
          total: totalProperties,
          withCoordinates,
          withoutCoordinates: totalProperties - withCoordinates,
          coordinateCoverage: totalProperties > 0 ? ((withCoordinates / totalProperties) * 100).toFixed(2) + '%' : '0%',
          byCity,
          byState,
          density,
          topCities: Object.entries(byCity)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([city, count]) => ({ city, count }))
        }
      });
    } catch (error) {
      console.error('Get location stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Helper: Geocode address using Google Maps API
   */
  async geocodeAddress(property) {
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.warn('Google Maps API key not configured');
        return null;
      }

      const address = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}, ${property.country}`;
      const encodedAddress = encodeURIComponent(address);

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
          formattedAddress: response.data.results[0].formatted_address,
          placeId: response.data.results[0].place_id
        };
      }

      return null;
    } catch (error) {
      console.error('Geocode address error:', error);
      return null;
    }
  }

  /**
   * Helper: Reverse geocode coordinates
   */
  async reverseGeocodeCoordinates(latitude, longitude) {
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.warn('Google Maps API key not configured');
        return null;
      }

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          address: result.formatted_address,
          components: result.address_components,
          placeId: result.place_id
        };
      }

      return null;
    } catch (error) {
      console.error('Reverse geocode error:', error);
      return null;
    }
  }

  /**
   * Helper: Calculate Haversine distance between two points
   */
  calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Helper: Convert degrees to radians
   */
  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Helper: Get nearby properties
   */
  async getNearbyProperties(property, radiusKm = 5) {
    try {
      if (!property.latitude || !property.longitude) {
        return [];
      }

      const nearby = await Property.findAll({
        where: {
          id: { [Op.ne]: property.id },
          status: 'active',
          latitude: { 
            [Op.between]: [
              property.latitude - (radiusKm / 111), // 1 degree ≈ 111 km
              property.latitude + (radiusKm / 111)
            ]
          },
          longitude: {
            [Op.between]: [
              property.longitude - (radiusKm / (111 * Math.cos(this.toRad(property.latitude)))),
              property.longitude + (radiusKm / (111 * Math.cos(this.toRad(property.latitude))))
            ]
          }
        },
        attributes: ['id', 'name', 'address', 'city', 'type', 'monthlyRent', 'latitude', 'longitude'],
        limit: 10
      });

      // Calculate distances
      return nearby.map(p => ({
        ...p.toJSON(),
        distance: this.calculateHaversineDistance(
          property.latitude, property.longitude,
          p.latitude, p.longitude
        )
      })).sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Get nearby properties error:', error);
      return [];
    }
  }

  /**
   * Helper: Get location details
   */
  async getLocationDetails(latitude, longitude) {
    try {
      if (!latitude || !longitude) {
        return {};
      }

      // This would use various APIs to get location details
      // For now, return basic info
      return {
        timezone: await this.getTimezone(latitude, longitude),
        elevation: await this.getElevation(latitude, longitude),
        weather: await this.getWeather(latitude, longitude)
      };
    } catch (error) {
      console.error('Get location details error:', error);
      return {};
    }
  }

  /**
   * Helper: Fetch points of interest
   */
  async fetchPointsOfInterest(latitude, longitude, radius, types) {
    try {
      // This would use Google Places API or similar
      // For now, return mock data
      const mockPOI = [
        { name: 'Central High School', type: 'school', distance: 1.2 },
        { name: 'City Hospital', type: 'hospital', distance: 2.5 },
        { name: 'Main Street Park', type: 'park', distance: 0.8 },
        { name: 'Local Restaurant', type: 'restaurant', distance: 0.5 },
        { name: 'Shopping Mall', type: 'shopping_mall', distance: 3.1 }
      ];

      return mockPOI.filter(poi => types.includes(poi.type));
    } catch (error) {
      console.error('Fetch POI error:', error);
      return [];
    }
  }

  /**
   * Helper: Get timezone
   */
  async getTimezone(latitude, longitude) {
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) return 'Unknown';

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${Math.floor(Date.now() / 1000)}&key=${apiKey}`
      );

      if (response.data.status === 'OK') {
        return response.data.timeZoneId;
      }

      return 'Unknown';
    } catch (error) {
      console.error('Get timezone error:', error);
      return 'Unknown';
    }
  }

  /**
   * Helper: Get elevation
   */
  async getElevation(latitude, longitude) {
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) return null;

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/elevation/json?locations=${latitude},${longitude}&key=${apiKey}`
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        return response.data.results[0].elevation;
      }

      return null;
    } catch (error) {
      console.error('Get elevation error:', error);
      return null;
    }
  }

  /**
   * Helper: Get weather
   */
  async getWeather(latitude, longitude) {
    try {
      // This would use a weather API like OpenWeatherMap
      // For now, return mock data
      return {
        temperature: 22,
        condition: 'Sunny',
        humidity: 65,
        windSpeed: 12
      };
    } catch (error) {
      console.error('Get weather error:', error);
      return null;
    }
  }

  /**
   * Helper: Check property access
   */
  async checkPropertyAccess(propertyId, userId, userRoles) {
    try {
      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        return true;
      }

      const property = await Property.findByPk(propertyId);
      if (!property) return false;

      if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        return user.companyId === property.companyId;
      }

      if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Portfolio,
            as: 'ManagedPortfolios'
          }]
        });
        
        if (user.ManagedPortfolios && user.ManagedPortfolios.length > 0) {
          const managedPortfolioIds = user.ManagedPortfolios.map(p => p.id);
          return managedPortfolioIds.includes(property.portfolioId);
        }
        return false;
      }

      if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Property,
            as: 'ManagedProperties'
          }]
        });
        
        if (user.ManagedProperties && user.ManagedProperties.length > 0) {
          const managedPropertyIds = user.ManagedProperties.map(p => p.id);
          return managedPropertyIds.includes(property.id);
        }
        return false;
      }

      if (userRoles.includes(ROLES.LANDLORD)) {
        return property.ownerId === userId;
      }

      return false;
    } catch (error) {
      console.error('Check property access error:', error);
      return false;
    }
  }

  /**
   * Helper: Get accessible properties for user
   */
  async getAccessibleProperties(userId, userRoles) {
    try {
      let whereClause = {};

      if (userRoles.includes(ROLES.SYSTEM_ADMIN)) {
        // All properties
      } else if (userRoles.includes(ROLES.COMPANY_ADMIN)) {
        const user = await User.findByPk(userId);
        if (user && user.companyId) {
          whereClause.companyId = user.companyId;
        }
      } else if (userRoles.includes(ROLES.PORTFOLIO_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Portfolio,
            as: 'ManagedPortfolios'
          }]
        });
        
        if (user.ManagedPortfolios && user.ManagedPortfolios.length > 0) {
          const portfolioIds = user.ManagedPortfolios.map(p => p.id);
          whereClause.portfolioId = { [Op.in]: portfolioIds };
        }
      } else if (userRoles.includes(ROLES.PROPERTY_MANAGER)) {
        const user = await User.findByPk(userId, {
          include: [{ 
            model: Property,
            as: 'ManagedProperties'
          }]
        });
        
        if (user.ManagedProperties && user.ManagedProperties.length > 0) {
          const propertyIds = user.ManagedProperties.map(p => p.id);
          whereClause.id = { [Op.in]: propertyIds };
        }
      } else if (userRoles.includes(ROLES.LANDLORD)) {
        whereClause.ownerId = userId;
      }

      return await Property.findAll({
        where: whereClause,
        attributes: ['id']
      });
    } catch (error) {
      console.error('Get accessible properties error:', error);
      return [];
    }
  }

  /**
   * Helper: Check if area is urban
   */
  isUrbanArea(city) {
    const urbanCities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
    return urbanCities.includes(city);
  }

  /**
   * Helper: Check if area is suburban
   */
  isSuburbanArea(city) {
    const suburbanCities = ['Irvine', 'Plano', 'Scottsdale', 'Bellevue', 'Overland Park'];
    return suburbanCities.includes(city);
  }

  /**
   * Helper: Check if area is rural
   */
  isRuralArea(city) {
    // Simple check - if not urban or suburban, consider rural
    return !this.isUrbanArea(city) && !this.isSuburbanArea(city);
  }
}

module.exports = new LocationController();