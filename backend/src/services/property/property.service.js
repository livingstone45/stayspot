const { Property, Unit, PropertyImage, PropertyDocument, User, Company, Portfolio, Tenant, Lease, MaintenanceRequest } = require('../../models');
const { Op } = require('sequelize');
const geolocationService = require('./geolocation.service');
const uploadService = require('./upload.service');

class PropertyService {
  constructor() {}

  /**
   * Create new property
   */
  async createProperty(propertyData, userId) {
    try {
      const { 
        units, 
        images, 
        documents, 
        coordinates,
        ...propertyInfo 
      } = propertyData;

      // Validate coordinates or geocode address
      let latitude, longitude;
      if (coordinates) {
        latitude = coordinates.latitude;
        longitude = coordinates.longitude;
      } else if (propertyInfo.address) {
        const geocodeResult = await geolocationService.geocodeAddress(propertyInfo.address);
        latitude = geocodeResult.latitude;
        longitude = geocodeResult.longitude;
      }

      // Create property
      const property = await Property.create({
        ...propertyInfo,
        latitude,
        longitude,
        created_by: userId,
        updated_by: userId,
        status: 'active'
      });

      // Create units if provided
      if (units && units.length > 0) {
        const unitPromises = units.map(unitData => 
          Unit.create({
            ...unitData,
            property_id: property.id,
            created_by: userId,
            status: 'vacant'
          })
        );
        await Promise.all(unitPromises);
      }

      // Handle images if provided
      if (images && images.length > 0) {
        const imagePromises = images.map(async (imageData, index) => {
          const uploadedImage = await uploadService.uploadPropertyImage(
            imageData.file,
            {
              propertyId: property.id,
              isPrimary: index === 0,
              uploadedBy: userId
            }
          );

          return PropertyImage.create({
            property_id: property.id,
            url: uploadedImage.url,
            thumbnail_url: uploadedImage.thumbnail_url,
            public_id: uploadedImage.public_id,
            is_primary: index === 0,
            uploaded_by: userId,
            metadata: uploadedImage.metadata
          });
        });
        await Promise.all(imagePromises);
      }

      // Handle documents if provided
      if (documents && documents.length > 0) {
        const documentPromises = documents.map(async (docData) => {
          const uploadedDoc = await uploadService.uploadDocument(
            docData.file,
            {
              propertyId: property.id,
              documentType: docData.document_type,
              uploadedBy: userId
            }
          );

          return PropertyDocument.create({
            property_id: property.id,
            name: docData.name,
            url: uploadedDoc.url,
            document_type: docData.document_type,
            uploaded_by: userId,
            metadata: uploadedDoc.metadata
          });
        });
        await Promise.all(documentPromises);
      }

      // Get complete property with relationships
      const completeProperty = await this.getPropertyById(property.id);

      return {
        success: true,
        property: completeProperty,
        message: 'Property created successfully'
      };
    } catch (error) {
      console.error('Create property error:', error);
      throw new Error(`Failed to create property: ${error.message}`);
    }
  }

  /**
   * Get property by ID
   */
  async getPropertyById(propertyId, includeRelations = true) {
    try {
      const include = [];
      
      if (includeRelations) {
        include.push(
          {
            model: Unit,
            include: [
              {
                model: Tenant,
                include: [{
                  model: User,
                  attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
                }]
              },
              {
                model: Lease,
                where: { status: 'active' },
                required: false,
                limit: 1,
                order: [['start_date', 'DESC']]
              }
            ]
          },
          {
            model: PropertyImage,
            attributes: ['id', 'url', 'thumbnail_url', 'is_primary', 'uploaded_at']
          },
          {
            model: PropertyDocument,
            attributes: ['id', 'name', 'url', 'document_type', 'uploaded_at']
          },
          {
            model: User,
            as: 'createdBy',
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: User,
            as: 'updatedBy',
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: Company,
            attributes: ['id', 'name', 'logo_url']
          },
          {
            model: Portfolio,
            attributes: ['id', 'name', 'description']
          }
        );
      }

      const property = await Property.findByPk(propertyId, { include });

      if (!property) {
        throw new Error('Property not found');
      }

      // Calculate occupancy rate
      const totalUnits = property.units?.length || 0;
      const occupiedUnits = property.units?.filter(unit => 
        unit.status === 'occupied' || unit.tenants?.length > 0
      ).length || 0;
      
      property.dataValues.occupancy_rate = totalUnits > 0 
        ? Math.round((occupiedUnits / totalUnits) * 100) 
        : 0;

      // Calculate maintenance stats
      const maintenanceRequests = await MaintenanceRequest.count({
        where: { 
          property_id: propertyId,
          created_at: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        }
      });
      
      property.dataValues.recent_maintenance_requests = maintenanceRequests;

      return property;
    } catch (error) {
      console.error('Get property error:', error);
      throw new Error(`Failed to get property: ${error.message}`);
    }
  }

  /**
   * Update property
   */
  async updateProperty(propertyId, updates, userId) {
    try {
      const property = await Property.findByPk(propertyId);
      
      if (!property) {
        throw new Error('Property not found');
      }

      // Handle address/coordinate updates
      if (updates.address && !updates.latitude && !updates.longitude) {
        const geocodeResult = await geolocationService.geocodeAddress(updates.address);
        updates.latitude = geocodeResult.latitude;
        updates.longitude = geocodeResult.longitude;
      }

      // Update property
      await property.update({
        ...updates,
        updated_by: userId,
        updated_at: new Date()
      });

      // Get updated property with relations
      const updatedProperty = await this.getPropertyById(propertyId);

      return {
        success: true,
        property: updatedProperty,
        message: 'Property updated successfully'
      };
    } catch (error) {
      console.error('Update property error:', error);
      throw new Error(`Failed to update property: ${error.message}`);
    }
  }

  /**
   * Delete property (soft delete)
   */
  async deleteProperty(propertyId, userId) {
    try {
      const property = await Property.findByPk(propertyId);
      
      if (!property) {
        throw new Error('Property not found');
      }

      // Check if property has active leases
      const activeLeases = await Lease.count({
        include: [{
          model: Unit,
          where: { property_id: propertyId }
        }],
        where: { 
          status: 'active',
          end_date: { [Op.gt]: new Date() }
        }
      });

      if (activeLeases > 0) {
        throw new Error('Cannot delete property with active leases');
      }

      // Soft delete
      await property.update({
        status: 'deleted',
        deleted_by: userId,
        deleted_at: new Date()
      });

      return {
        success: true,
        message: 'Property deleted successfully'
      };
    } catch (error) {
      console.error('Delete property error:', error);
      throw new Error(`Failed to delete property: ${error.message}`);
    }
  }

  /**
   * Get properties with filters
   */
  async getProperties(filters = {}) {
    try {
      const {
        company_id,
        portfolio_id,
        property_type,
        status,
        min_price,
        max_price,
        bedrooms,
        bathrooms,
        location,
        radius, // in kilometers
        latitude,
        longitude,
        search,
        sort_by = 'created_at',
        sort_order = 'DESC',
        limit = 50,
        offset = 0,
        include_stats = false
      } = filters;

      const where = { status: { [Op.ne]: 'deleted' } };
      const include = [];

      // Company filter
      if (company_id) {
        where.company_id = company_id;
      }

      // Portfolio filter
      if (portfolio_id) {
        where.portfolio_id = portfolio_id;
      }

      // Property type filter
      if (property_type) {
        where.property_type = property_type;
      }

      // Status filter
      if (status) {
        where.status = status;
      }

      // Price filters
      if (min_price !== undefined) {
        where.price = where.price || {};
        where.price[Op.gte] = min_price;
      }
      if (max_price !== undefined) {
        where.price = where.price || {};
        where.price[Op.lte] = max_price;
      }

      // Bedrooms filter
      if (bedrooms) {
        where.bedrooms = bedrooms;
      }

      // Bathrooms filter
      if (bathrooms) {
        where.bathrooms = bathrooms;
      }

      // Location search
      if (location) {
        where[Op.or] = [
          { address: { [Op.like]: `%${location}%` } },
          { city: { [Op.like]: `%${location}%` } },
          { state: { [Op.like]: `%${location}%` } },
          { zip_code: { [Op.like]: `%${location}%` } }
        ];
      }

      // Radius search (geolocation)
      if (latitude && longitude && radius) {
        const radiusInDegrees = radius / 111; // Approximate km to degrees
        where.latitude = {
          [Op.between]: [latitude - radiusInDegrees, latitude + radiusInDegrees]
        };
        where.longitude = {
          [Op.between]: [longitude - radiusInDegrees, longitude + radiusInDegrees]
        };
      }

      // General search
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      // Include relationships
      include.push(
        {
          model: PropertyImage,
          where: { is_primary: true },
          required: false,
          attributes: ['id', 'url', 'thumbnail_url']
        },
        {
          model: Unit,
          attributes: ['id', 'unit_number', 'status', 'rent_amount'],
          required: false
        },
        {
          model: Company,
          attributes: ['id', 'name']
        }
      );

      // Get total count
      const total = await Property.count({ where });

      // Get properties with pagination
      const properties = await Property.findAll({
        where,
        include,
        order: [[sort_by, sort_order]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Calculate statistics if requested
      let stats = null;
      if (include_stats) {
        stats = await this.calculatePropertyStats(where);
      }

      return {
        success: true,
        properties,
        total,
        stats,
        message: 'Properties retrieved successfully'
      };
    } catch (error) {
      console.error('Get properties error:', error);
      throw new Error(`Failed to get properties: ${error.message}`);
    }
  }

  /**
   * Calculate property statistics
   */
  async calculatePropertyStats(whereConditions) {
    try {
      // Total properties
      const totalProperties = await Property.count({ 
        where: whereConditions 
      });

      // Total units
      const totalUnits = await Unit.count({
        include: [{
          model: Property,
          where: whereConditions
        }]
      });

      // Occupied units
      const occupiedUnits = await Unit.count({
        include: [{
          model: Property,
          where: whereConditions
        }],
        where: { status: 'occupied' }
      });

      // Vacant units
      const vacantUnits = await Unit.count({
        include: [{
          model: Property,
          where: whereConditions
        }],
        where: { status: 'vacant' }
      });

      // Average rent
      const rentStats = await Unit.findOne({
        include: [{
          model: Property,
          where: whereConditions
        }],
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rent_amount')), 'avg_rent'],
          [sequelize.fn('MIN', sequelize.col('rent_amount')), 'min_rent'],
          [sequelize.fn('MAX', sequelize.col('rent_amount')), 'max_rent']
        ],
        where: { rent_amount: { [Op.gt]: 0 } }
      });

      // Properties by type
      const propertiesByType = await Property.findAll({
        where: whereConditions,
        attributes: [
          'property_type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['property_type']
      });

      // Properties by status
      const propertiesByStatus = await Property.findAll({
        where: whereConditions,
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status']
      });

      return {
        total_properties: totalProperties,
        total_units: totalUnits,
        occupied_units: occupiedUnits,
        vacant_units: vacantUnits,
        occupancy_rate: totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0,
        average_rent: rentStats?.dataValues?.avg_rent || 0,
        min_rent: rentStats?.dataValues?.min_rent || 0,
        max_rent: rentStats?.dataValues?.max_rent || 0,
        by_type: propertiesByType.reduce((acc, item) => {
          acc[item.property_type] = item.dataValues.count;
          return acc;
        }, {}),
        by_status: propertiesByStatus.reduce((acc, item) => {
          acc[item.status] = item.dataValues.count;
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Calculate stats error:', error);
      return null;
    }
  }

  /**
   * Bulk upload properties
   */
  async bulkUploadProperties(fileData, userId, companyId) {
    try {
      // Parse CSV/Excel file
      const propertiesData = await this.parsePropertyFile(fileData);
      
      const results = [];
      const errors = [];

      for (const propertyData of propertiesData) {
        try {
          // Add company ID if not provided
          if (!propertyData.company_id && companyId) {
            propertyData.company_id = companyId;
          }

          // Create property
          const result = await this.createProperty(propertyData, userId);
          results.push({
            property: result.property.name || propertyData.address,
            success: true,
            id: result.property.id
          });
        } catch (error) {
          errors.push({
            property: propertyData.name || propertyData.address,
            error: error.message
          });
        }
      }

      return {
        success: true,
        processed: results.length + errors.length,
        successful: results.length,
        failed: errors.length,
        results,
        errors,
        message: `Bulk upload completed: ${results.length} successful, ${errors.length} failed`
      };
    } catch (error) {
      console.error('Bulk upload error:', error);
      throw new Error(`Bulk upload failed: ${error.message}`);
    }
  }

  /**
   * Parse property file (CSV/Excel)
   */
  async parsePropertyFile(fileData) {
    // This is a simplified version. In reality, you would use a library like:
    // - papaparse for CSV
    // - xlsx for Excel
    // - fast-csv for streaming CSV
    
    // For now, return dummy data structure
    return [{
      name: 'Sample Property',
      address: '123 Main St',
      city: 'Sample City',
      state: 'CA',
      zip_code: '12345',
      property_type: 'apartment',
      bedrooms: 3,
      bathrooms: 2,
      square_feet: 1500,
      year_built: 2000,
      description: 'Sample property description'
    }];
  }

  /**
   * Get properties near location
   */
  async getPropertiesNearLocation(latitude, longitude, radiusKm = 10) {
    try {
      // Convert km to degrees (approximate)
      const radiusDegrees = radiusKm / 111;
      
      const properties = await Property.findAll({
        where: {
          latitude: {
            [Op.between]: [latitude - radiusDegrees, latitude + radiusDegrees]
          },
          longitude: {
            [Op.between]: [longitude - radiusDegrees, longitude + radiusDegrees]
          },
          status: 'active'
        },
        include: [
          {
            model: PropertyImage,
            where: { is_primary: true },
            required: false,
            attributes: ['id', 'url', 'thumbnail_url']
          },
          {
            model: Unit,
            attributes: ['id', 'unit_number', 'status', 'rent_amount'],
            where: { status: 'vacant' },
            required: false
          }
        ],
        limit: 100
      });

      // Calculate distances
      const propertiesWithDistance = properties.map(property => {
        const distance = this.calculateDistance(
          latitude, 
          longitude, 
          property.latitude, 
          property.longitude
        );
        
        return {
          ...property.toJSON(),
          distance: parseFloat(distance.toFixed(2))
        };
      });

      // Sort by distance
      propertiesWithDistance.sort((a, b) => a.distance - b.distance);

      return {
        success: true,
        properties: propertiesWithDistance,
        total: propertiesWithDistance.length,
        message: 'Properties near location retrieved successfully'
      };
    } catch (error) {
      console.error('Get properties near location error:', error);
      throw new Error(`Failed to get properties near location: ${error.message}`);
    }
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Update property status
   */
  async updatePropertyStatus(propertyId, status, userId) {
    try {
      const property = await Property.findByPk(propertyId);
      
      if (!property) {
        throw new Error('Property not found');
      }

      // Validate status transition
      const validTransitions = {
        'draft': ['active', 'inactive'],
        'active': ['inactive', 'maintenance', 'sold'],
        'inactive': ['active', 'sold'],
        'maintenance': ['active', 'inactive'],
        'sold': ['archived'],
        'archived': []
      };

      const currentStatus = property.status;
      if (!validTransitions[currentStatus]?.includes(status)) {
        throw new Error(`Invalid status transition from ${currentStatus} to ${status}`);
      }

      await property.update({
        status,
        updated_by: userId,
        updated_at: new Date()
      });

      return {
        success: true,
        property: await this.getPropertyById(propertyId),
        message: `Property status updated to ${status}`
      };
    } catch (error) {
      console.error('Update property status error:', error);
      throw new Error(`Failed to update property status: ${error.message}`);
    }
  }

  /**
   * Get property analytics
   */
  async getPropertyAnalytics(propertyId, timeframe = 'month') {
    try {
      const property = await Property.findByPk(propertyId);
      
      if (!property) {
        throw new Error('Property not found');
      }

      let startDate;
      const endDate = new Date();
      
      switch (timeframe) {
        case 'day':
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      }

      // Get views/visits (would come from analytics service)
      const views = 0; // Placeholder

      // Get maintenance requests
      const maintenanceRequests = await MaintenanceRequest.count({
        where: {
          property_id: propertyId,
          created_at: { [Op.between]: [startDate, endDate] }
        }
      });

      // Get tenant turnover
      const leasesEnded = await Lease.count({
        include: [{
          model: Unit,
          where: { property_id: propertyId }
        }],
        where: {
          end_date: { [Op.between]: [startDate, endDate] }
        }
      });

      // Get revenue
      const revenue = await Lease.sum('monthly_rent', {
        include: [{
          model: Unit,
          where: { property_id: propertyId }
        }],
        where: {
          status: 'active'
        }
      }) || 0;

      // Get expenses (would come from financial service)
      const expenses = 0; // Placeholder

      return {
        success: true,
        analytics: {
          property_id: propertyId,
          timeframe,
          views,
          maintenance_requests: maintenanceRequests,
          tenant_turnover: leasesEnded,
          revenue,
          expenses,
          net_income: revenue - expenses,
          occupancy_rate: property.dataValues.occupancy_rate || 0
        },
        message: 'Property analytics retrieved successfully'
      };
    } catch (error) {
      console.error('Get property analytics error:', error);
      throw new Error(`Failed to get property analytics: ${error.message}`);
    }
  }

  /**
   * Export properties to CSV
   */
  async exportProperties(filters = {}) {
    try {
      const { properties } = await this.getProperties({
        ...filters,
        limit: 1000 // Max export limit
      });

      // Convert properties to CSV format
      const csvData = properties.map(property => ({
        ID: property.id,
        Name: property.name,
        Address: property.address,
        City: property.city,
        State: property.state,
        'Zip Code': property.zip_code,
        Type: property.property_type,
        Status: property.status,
        Bedrooms: property.bedrooms,
        Bathrooms: property.bathrooms,
        'Square Feet': property.square_feet,
        'Year Built': property.year_built,
        'Created Date': property.created_at,
        'Updated Date': property.updated_at
      }));

      return {
        success: true,
        data: csvData,
        total: csvData.length,
        message: 'Properties exported successfully'
      };
    } catch (error) {
      console.error('Export properties error:', error);
      throw new Error(`Failed to export properties: ${error.message}`);
    }
  }
}

module.exports = new PropertyService();