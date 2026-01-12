const Queue = require('bull');
const logger = require('../config/logger');
const db = require('../models');
const { geocodeAddress } = require('../utils/helpers/geolocation.helper');
const FileHelper = require('../utils/helpers/file.helper');
const triggers = require('../utils/automation/triggers');

class PropertyWorker {
  constructor() {
    this.queue = new Queue('property-processing', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000
        },
        removeOnComplete: true,
        removeOnFail: false
      }
    });
    
    this.initializeWorkers();
    logger.info('Property worker initialized');
  }

  /**
   * Initialize queue workers
   */
  initializeWorkers() {
    // Process property upload
    this.queue.process('process-upload', 5, async (job) => {
      return await this.processPropertyUpload(job.data);
    });

    // Process property images
    this.queue.process('process-images', 10, async (job) => {
      return await this.processPropertyImages(job.data);
    });

    // Geocode property address
    this.queue.process('geocode-address', 3, async (job) => {
      return await this.geocodePropertyAddress(job.data);
    });

    // Enrich property data
    this.queue.process('enrich-data', 3, async (job) => {
      return await this.enrichPropertyData(job.data);
    });

    // Update website listing
    this.queue.process('update-website', 2, async (job) => {
      return await this.updateWebsiteListing(job.data);
    });

    // Bulk property import
    this.queue.process('bulk-import', 1, async (job) => {
      return await this.processBulkImport(job.data);
    });

    // Property sync with external platforms
    this.queue.process('sync-external', 2, async (job) => {
      return await this.syncWithExternalPlatforms(job.data);
    });

    // Property data cleanup
    this.queue.process('cleanup-data', 1, async (job) => {
      return await this.cleanupPropertyData(job.data);
    });

    // Error handling
    this.queue.on('failed', (job, error) => {
      logger.error(`Job ${job.id} failed:`, error);
      this.handleJobFailure(job, error);
    });

    this.queue.on('completed', (job, result) => {
      logger.info(`Job ${job.id} completed successfully`);
      this.handleJobSuccess(job, result);
    });

    this.queue.on('stalled', (job) => {
      logger.warn(`Job ${job.id} stalled`);
    });
  }

  /**
   * Add property upload job
   * @param {Object} data - Property data
   * @returns {Promise<Job>} Bull job
   */
  async addPropertyUploadJob(data) {
    return await this.queue.add('process-upload', data, {
      jobId: `upload_${data.propertyId}_${Date.now()}`,
      priority: 1
    });
  }

  /**
   * Add property image processing job
   * @param {Object} data - Image processing data
   * @returns {Promise<Job>} Bull job
   */
  async addImageProcessingJob(data) {
    return await this.queue.add('process-images', data, {
      jobId: `images_${data.propertyId}_${Date.now()}`,
      priority: 2
    });
  }

  /**
   * Add geocoding job
   * @param {Object} data - Geocoding data
   * @returns {Promise<Job>} Bull job
   */
  async addGeocodingJob(data) {
    return await this.queue.add('geocode-address', data, {
      jobId: `geocode_${data.propertyId}_${Date.now()}`,
      priority: 3
    });
  }

  /**
   * Add data enrichment job
   * @param {Object} data - Property data
   * @returns {Promise<Job>} Bull job
   */
  async addDataEnrichmentJob(data) {
    return await this.queue.add('enrich-data', data, {
      jobId: `enrich_${data.propertyId}_${Date.now()}`,
      priority: 4
    });
  }

  /**
   * Add website update job
   * @param {Object} data - Update data
   * @returns {Promise<Job>} Bull job
   */
  async addWebsiteUpdateJob(data) {
    return await this.queue.add('update-website', data, {
      jobId: `website_${data.propertyId}_${Date.now()}`,
      priority: 5
    });
  }

  /**
   * Add bulk import job
   * @param {Object} data - Bulk import data
   * @returns {Promise<Job>} Bull job
   */
  async addBulkImportJob(data) {
    return await this.queue.add('bulk-import', data, {
      jobId: `bulk_${Date.now()}`,
      priority: 6
    });
  }

  /**
   * Add external sync job
   * @param {Object} data - Sync data
   * @returns {Promise<Job>} Bull job
   */
  async addExternalSyncJob(data) {
    return await this.queue.add('sync-external', data, {
      jobId: `sync_${data.propertyId || 'all'}_${Date.now()}`,
      priority: 7
    });
  }

  /**
   * Process property upload
   * @param {Object} data - Property data
   * @returns {Promise<Object>} Processing result
   */
  async processPropertyUpload(data) {
    const { propertyId, uploadedBy, files = [] } = data;
    
    logger.info(`Processing property upload for property ${propertyId}`);
    
    try {
      // Get property from database
      const property = await db.Property.findByPk(propertyId, {
        include: [
          { model: db.User, as: 'uploadedBy' },
          { model: db.Company },
          { model: db.Portfolio }
        ]
      });
      
      if (!property) {
        throw new Error(`Property ${propertyId} not found`);
      }
      
      const result = {
        propertyId,
        steps: [],
        processedFiles: 0,
        errors: []
      };
      
      // Step 1: Validate property data
      result.steps.push(await this.validatePropertyData(property));
      
      // Step 2: Process uploaded files
      if (files.length > 0) {
        const imageResult = await this.processUploadedFiles(propertyId, files);
        result.steps.push(imageResult);
        result.processedFiles = imageResult.processedCount || 0;
        
        if (imageResult.errors && imageResult.errors.length > 0) {
          result.errors.push(...imageResult.errors);
        }
      }
      
      // Step 3: Update property status
      await property.update({
        status: 'pending_processing',
        processingStarted: new Date()
      });
      
      // Trigger property upload event
      await triggers.trigger('property.uploaded', {
        propertyId,
        uploadType: 'single',
        fileCount: files.length,
        uploadedBy
      });
      
      result.success = true;
      result.message = 'Property upload processing started';
      result.timestamp = new Date();
      
      return result;
    } catch (error) {
      logger.error(`Failed to process property upload for ${propertyId}:`, error);
      throw error;
    }
  }

  /**
   * Process property images
   * @param {Object} data - Image processing data
   * @returns {Promise<Object>} Processing result
   */
  async processPropertyImages(data) {
    const { propertyId, images = [], options = {} } = data;
    
    logger.info(`Processing images for property ${propertyId}`);
    
    try {
      const result = {
        propertyId,
        processed: [],
        failed: [],
        thumbnails: []
      };
      
      const defaultOptions = {
        mainImageWidth: 1200,
        mainImageHeight: 800,
        thumbnailWidth: 400,
        thumbnailHeight: 300,
        quality: 85,
        format: 'jpeg'
      };
      
      const processingOptions = { ...defaultOptions, ...options };
      
      for (const image of images) {
        try {
          const imageResult = await this.processSingleImage(
            propertyId, 
            image, 
            processingOptions
          );
          
          if (imageResult.success) {
            result.processed.push(imageResult);
            
            // Store in database
            await db.PropertyImage.create({
              propertyId,
              url: imageResult.url,
              thumbnailUrl: imageResult.thumbnailUrl,
              filename: imageResult.filename,
              size: imageResult.size,
              width: imageResult.width,
              height: imageResult.height,
              mimeType: imageResult.mimeType,
              isPrimary: result.processed.length === 1, // First image is primary
              order: result.processed.length,
              processedAt: new Date()
            });
          } else {
            result.failed.push({
              filename: image.filename,
              error: imageResult.error
            });
          }
        } catch (error) {
          logger.error(`Failed to process image ${image.filename}:`, error);
          result.failed.push({
            filename: image.filename,
            error: error.message
          });
        }
      }
      
      // Update property with image count
      await db.Property.update(
        {
          imageCount: result.processed.length,
          hasImages: result.processed.length > 0
        },
        { where: { id: propertyId } }
      );
      
      result.success = result.processed.length > 0;
      result.message = `Processed ${result.processed.length} images, ${result.failed.length} failed`;
      result.timestamp = new Date();
      
      return result;
    } catch (error) {
      logger.error(`Failed to process property images for ${propertyId}:`, error);
      throw error;
    }
  }

  /**
   * Geocode property address
   * @param {Object} data - Geocoding data
   * @returns {Promise<Object>} Geocoding result
   */
  async geocodePropertyAddress(data) {
    const { propertyId, address } = data;
    
    logger.info(`Geocoding address for property ${propertyId}`);
    
    try {
      const property = await db.Property.findByPk(propertyId);
      
      if (!property) {
        throw new Error(`Property ${propertyId} not found`);
      }
      
      // Build address string
      const addressString = this.buildAddressString(address || property.address);
      
      // Geocode address
      const geocoded = await geocodeAddress(addressString);
      
      // Update property with coordinates
      await property.update({
        latitude: geocoded.latitude,
        longitude: geocoded.longitude,
        formattedAddress: geocoded.formattedAddress,
        geocodedAt: new Date(),
        geocodingStatus: 'success'
      });
      
      // Get timezone
      const { getTimezone } = require('../utils/helpers/geolocation.helper');
      const timezone = await getTimezone(geocoded.latitude, geocoded.longitude);
      
      await property.update({ timezone });
      
      // Get nearby amenities
      const { getNearbyPlaces } = require('../utils/helpers/geolocation.helper');
      const nearbyAmenities = await getNearbyPlaces(
        geocoded.latitude,
        geocoded.longitude,
        '',
        5000 // 5km radius
      );
      
      // Store amenities
      for (const amenity of nearbyAmenities.slice(0, 20)) { // Limit to 20 amenities
        await db.NearbyAmenity.create({
          propertyId,
          name: amenity.name,
          type: amenity.types?.[0] || 'other',
          address: amenity.address,
          distance: this.calculateDistance(
            geocoded.latitude,
            geocoded.longitude,
            amenity.location.lat,
            amenity.location.lng
          ),
          rating: amenity.rating,
          totalRatings: amenity.totalRatings,
          metadata: amenity
        });
      }
      
      const result = {
        propertyId,
        success: true,
        coordinates: {
          latitude: geocoded.latitude,
          longitude: geocoded.longitude
        },
        formattedAddress: geocoded.formattedAddress,
        timezone,
        amenitiesCount: nearbyAmenities.length,
        message: 'Address geocoded successfully',
        timestamp: new Date()
      };
      
      return result;
    } catch (error) {
      logger.error(`Failed to geocode address for property ${propertyId}:`, error);
      
      // Update property with failure status
      await db.Property.update(
        {
          geocodingStatus: 'failed',
          geocodingError: error.message
        },
        { where: { id: propertyId } }
      );
      
      throw error;
    }
  }

  /**
   * Enrich property data
   * @param {Object} data - Property data
   * @returns {Promise<Object>} Enrichment result
   */
  async enrichPropertyData(data) {
    const { propertyId } = data;
    
    logger.info(`Enriching data for property ${propertyId}`);
    
    try {
      const property = await db.Property.findByPk(propertyId, {
        include: [
          { model: db.Company },
          { model: db.Portfolio },
          { model: db.PropertyImage }
        ]
      });
      
      if (!property) {
        throw new Error(`Property ${propertyId} not found`);
      }
      
      const result = {
        propertyId,
        enrichments: [],
        metadata: {}
      };
      
      // 1. Estimate market value
      const marketValue = this.estimateMarketValue(property);
      result.enrichments.push({
        type: 'market_value',
        value: marketValue,
        confidence: 'medium'
      });
      
      // 2. Calculate rental yield
      const rentalYield = this.calculateRentalYield(property);
      if (rentalYield) {
        result.enrichments.push({
          type: 'rental_yield',
          value: rentalYield,
          confidence: 'medium'
        });
      }
      
      // 3. Get neighborhood data
      const neighborhoodData = await this.getNeighborhoodData(property);
      if (neighborhoodData) {
        result.enrichments.push({
          type: 'neighborhood_data',
          value: neighborhoodData,
          confidence: 'high'
        });
        result.metadata.neighborhood = neighborhoodData;
      }
      
      // 4. Analyze images (if any)
      if (property.PropertyImages && property.PropertyImages.length > 0) {
        const imageAnalysis = await this.analyzePropertyImages(property.PropertyImages);
        result.enrichments.push({
          type: 'image_analysis',
          value: imageAnalysis,
          confidence: 'high'
        });
        result.metadata.imageAnalysis = imageAnalysis;
      }
      
      // 5. Get comparable properties
      const comparables = await this.findComparableProperties(property);
      result.enrichments.push({
        type: 'comparables',
        value: comparables,
        confidence: 'medium'
      });
      result.metadata.comparables = comparables;
      
      // 6. Calculate walk score (simulated)
      const walkScore = this.calculateWalkScore(property);
      result.enrichments.push({
        type: 'walk_score',
        value: walkScore,
        confidence: 'low'
      });
      
      // 7. Estimate maintenance costs
      const maintenanceCost = this.estimateMaintenanceCost(property);
      result.enrichments.push({
        type: 'maintenance_cost',
        value: maintenanceCost,
        confidence: 'medium'
      });
      
      // Update property with enriched data
      await property.update({
        marketValue,
        rentalYield,
        walkScore,
        estimatedMaintenance: maintenanceCost,
        neighborhoodRating: neighborhoodData?.rating,
        dataEnriched: true,
        enrichedAt: new Date(),
        metadata: {
          ...property.metadata,
          enrichments: result.enrichments,
          neighborhood: neighborhoodData,
          comparables: comparables,
          imageAnalysis: result.metadata.imageAnalysis
        }
      });
      
      result.success = true;
      result.message = `Property data enriched with ${result.enrichments.length} data points`;
      result.timestamp = new Date();
      
      return result;
    } catch (error) {
      logger.error(`Failed to enrich property data for ${propertyId}:`, error);
      throw error;
    }
  }

  /**
   * Update website listing
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Update result
   */
  async updateWebsiteListing(data) {
    const { propertyId, action = 'update' } = data;
    
    logger.info(`Updating website listing for property ${propertyId}`);
    
    try {
      const property = await db.Property.findByPk(propertyId, {
        include: [
          { model: db.PropertyImage, where: { isPrimary: true }, required: false },
          { model: db.Unit, where: { status: 'vacant' }, required: false }
        ]
      });
      
      if (!property) {
        throw new Error(`Property ${propertyId} not found`);
      }
      
      const result = {
        propertyId,
        action,
        updates: [],
        errors: []
      };
      
      // 1. Invalidate cache
      try {
        await this.invalidateCache(propertyId);
        result.updates.push({ type: 'cache', status: 'invalidated' });
      } catch (error) {
        result.errors.push({ type: 'cache', error: error.message });
      }
      
      // 2. Update search index
      try {
        await this.updateSearchIndex(property);
        result.updates.push({ type: 'search_index', status: 'updated' });
      } catch (error) {
        result.errors.push({ type: 'search_index', error: error.message });
      }
      
      // 3. Sync with external platforms
      if (property.status === 'active' && property.published) {
        try {
          const syncResult = await this.syncWithListingPlatforms(property);
          result.updates.push({ 
            type: 'external_sync', 
            status: 'completed',
            platforms: syncResult.platforms
          });
        } catch (error) {
          result.errors.push({ type: 'external_sync', error: error.message });
        }
      }
      
      // 4. Generate sitemap update
      try {
        await this.updateSitemap(propertyId, action);
        result.updates.push({ type: 'sitemap', status: 'updated' });
      } catch (error) {
        result.errors.push({ type: 'sitemap', error: error.message });
      }
      
      // 5. Update property status
      await property.update({
        websiteUpdated: true,
        lastWebsiteUpdate: new Date()
      });
      
      // Trigger website update event
      await triggers.trigger('property.published', {
        propertyId,
        action,
        platforms: result.updates.find(u => u.type === 'external_sync')?.platforms || []
      });
      
      result.success = result.errors.length === 0;
      result.message = `Website updated with ${result.updates.length} updates`;
      result.timestamp = new Date();
      
      return result;
    } catch (error) {
      logger.error(`Failed to update website listing for ${propertyId}:`, error);
      throw error;
    }
  }

  /**
   * Process bulk property import
   * @param {Object} data - Bulk import data
   * @returns {Promise<Object>} Import result
   */
  async processBulkImport(data) {
    const { filePath, companyId, portfolioId, uploadedBy, options = {} } = data;
    
    logger.info(`Processing bulk import from ${filePath}`);
    
    try {
      const result = {
        total: 0,
        processed: 0,
        created: 0,
        updated: 0,
        skipped: 0,
        errors: [],
        properties: []
      };
      
      // Read and parse CSV file
      const properties = await this.parseBulkImportFile(filePath);
      result.total = properties.length;
      
      const defaultOptions = {
        updateExisting: true,
        skipDuplicates: true,
        validateData: true,
        geocodeAddresses: true,
        enrichData: true,
        publishAfterImport: false
      };
      
      const importOptions = { ...defaultOptions, ...options };
      
      // Process each property
      for (let i = 0; i < properties.length; i++) {
        const propertyData = properties[i];
        
        try {
          // Add company and portfolio IDs
          propertyData.companyId = companyId;
          propertyData.portfolioId = portfolioId;
          propertyData.uploadedBy = uploadedBy;
          
          // Validate property data
          if (importOptions.validateData) {
            const validation = await this.validatePropertyData(propertyData);
            if (!validation.valid) {
              result.errors.push({
                index: i,
                property: propertyData.name || 'Unknown',
                error: `Validation failed: ${validation.errors.join(', ')}`
              });
              result.skipped++;
              continue;
            }
          }
          
          // Check for existing property
          let existingProperty = null;
          if (importOptions.skipDuplicates) {
            existingProperty = await this.findExistingProperty(propertyData);
          }
          
          let propertyResult;
          
          if (existingProperty && importOptions.updateExisting) {
            // Update existing property
            propertyResult = await this.updateExistingProperty(
              existingProperty.id,
              propertyData,
              importOptions
            );
            result.updated++;
          } else if (!existingProperty) {
            // Create new property
            propertyResult = await this.createNewProperty(
              propertyData,
              importOptions
            );
            result.created++;
          } else {
            // Skip duplicate
            propertyResult = {
              id: existingProperty.id,
              action: 'skipped',
              reason: 'duplicate'
            };
            result.skipped++;
          }
          
          result.processed++;
          result.properties.push(propertyResult);
          
          // Report progress every 10 properties
          if (result.processed % 10 === 0) {
            logger.info(`Bulk import progress: ${result.processed}/${result.total}`);
          }
        } catch (error) {
          logger.error(`Failed to process property at index ${i}:`, error);
          result.errors.push({
            index: i,
            property: propertyData.name || 'Unknown',
            error: error.message
          });
          result.skipped++;
        }
      }
      
      // Generate summary
      const summary = {
        file: filePath,
        companyId,
        portfolioId,
        uploadedBy,
        options: importOptions,
        statistics: {
          total: result.total,
          processed: result.processed,
          created: result.created,
          updated: result.updated,
          skipped: result.skipped,
          errorCount: result.errors.length,
          successRate: result.total > 0 ? (result.processed / result.total) * 100 : 0
        },
        timestamp: new Date()
      };
      
      // Send notification
      await this.sendBulkImportNotification(uploadedBy, summary);
      
      // Clean up temporary file
      await FileHelper.deleteFile(filePath);
      
      return {
        success: result.errors.length === 0,
        summary,
        details: result
      };
    } catch (error) {
      logger.error('Bulk import failed:', error);
      throw error;
    }
  }

  /**
   * Sync property with external platforms
   * @param {Object} data - Sync data
   * @returns {Promise<Object>} Sync result
   */
  async syncWithExternalPlatforms(data) {
    const { propertyId, platforms = ['all'], forceSync = false } = data;
    
    logger.info(`Syncing property ${propertyId} with external platforms`);
    
    try {
      const property = await db.Property.findByPk(propertyId, {
        include: [
          { model: db.PropertyImage, limit: 10 },
          { model: db.Unit, where: { status: 'vacant' }, required: false }
        ]
      });
      
      if (!property) {
        throw new Error(`Property ${propertyId} not found`);
      }
      
      // Check if sync is needed
      if (!forceSync && property.lastExternalSync) {
        const hoursSinceLastSync = (Date.now() - property.lastExternalSync) / (1000 * 60 * 60);
        if (hoursSinceLastSync < 1) { // Sync at most once per hour
          return {
            propertyId,
            skipped: true,
            reason: 'Recent sync exists',
            lastSync: property.lastExternalSync
          };
        }
      }
      
      const result = {
        propertyId,
        platforms: [],
        errors: []
      };
      
      // Define available platforms
      const availablePlatforms = {
        airbnb: this.syncWithAirbnb.bind(this),
        booking: this.syncWithBooking.bind(this),
        vrbo: this.syncWithVrbo.bind(this),
        zumper: this.syncWithZumper.bind(this),
        apartments: this.syncWithApartments.bind(this),
        realtor: this.syncWithRealtor.bind(this),
        zillow: this.syncWithZillow.bind(this)
      };
      
      // Determine which platforms to sync with
      let platformsToSync = [];
      
      if (platforms.includes('all')) {
        platformsToSync = Object.keys(availablePlatforms);
      } else {
        platformsToSync = platforms.filter(p => availablePlatforms[p]);
      }
      
      // Sync with each platform
      for (const platform of platformsToSync) {
        try {
          const syncResult = await availablePlatforms[platform](property);
          
          result.platforms.push({
            name: platform,
            success: true,
            result: syncResult,
            syncedAt: new Date()
          });
          
          // Record sync in database
          await db.ExternalSync.create({
            propertyId,
            platform,
            action: 'sync',
            status: 'success',
            data: syncResult,
            syncedAt: new Date()
          });
        } catch (error) {
          logger.error(`Failed to sync with ${platform}:`, error);
          
          result.errors.push({
            platform,
            error: error.message
          });
          
          // Record failure in database
          await db.ExternalSync.create({
            propertyId,
            platform,
            action: 'sync',
            status: 'failed',
            error: error.message,
            syncedAt: new Date()
          });
        }
      }
      
      // Update property sync status
      await property.update({
        lastExternalSync: new Date(),
        externalSyncCount: (property.externalSyncCount || 0) + 1
      });
      
      result.success = result.errors.length === 0;
      result.message = `Synced with ${result.platforms.length} platforms`;
      result.timestamp = new Date();
      
      // Trigger sync completed event
      await triggers.trigger('integration.sync_completed', {
        integrationType: 'property_sync',
        propertyId,
        platforms: result.platforms.map(p => p.name),
        successCount: result.platforms.length,
        failureCount: result.errors.length
      });
      
      return result;
    } catch (error) {
      logger.error(`Failed to sync property ${propertyId} with external platforms:`, error);
      throw error;
    }
  }

  /**
   * Cleanup property data
   * @param {Object} data - Cleanup data
   * @returns {Promise<Object>} Cleanup result
   */
  async cleanupPropertyData(data) {
    const { propertyId, cleanupTypes = ['all'] } = data;
    
    logger.info(`Cleaning up data for property ${propertyId}`);
    
    try {
      const property = await db.Property.findByPk(propertyId);
      
      if (!property) {
        throw new Error(`Property ${propertyId} not found`);
      }
      
      const result = {
        propertyId,
        cleanups: [],
        errors: []
      };
      
      // Define cleanup operations
      const cleanupOperations = {
        orphaned_images: this.cleanupOrphanedImages.bind(this),
        duplicate_data: this.cleanupDuplicateData.bind(this),
        stale_cache: this.cleanupStaleCache.bind(this),
        temporary_files: this.cleanupTemporaryFiles.bind(this),
        old_logs: this.cleanupOldLogs.bind(this),
        unused_metadata: this.cleanupUnusedMetadata.bind(this)
      };
      
      // Determine which cleanups to perform
      let cleanupsToPerform = [];
      
      if (cleanupTypes.includes('all')) {
        cleanupsToPerform = Object.keys(cleanupOperations);
      } else {
        cleanupsToPerform = cleanupTypes.filter(t => cleanupOperations[t]);
      }
      
      // Perform cleanups
      for (const cleanupType of cleanupsToPerform) {
        try {
          const cleanupResult = await cleanupOperations[cleanupType](propertyId);
          
          result.cleanups.push({
            type: cleanupType,
            success: true,
            result: cleanupResult,
            cleanedAt: new Date()
          });
        } catch (error) {
          logger.error(`Failed to perform cleanup ${cleanupType}:`, error);
          
          result.errors.push({
            type: cleanupType,
            error: error.message
          });
        }
      }
      
      // Update property
      await property.update({
        lastCleanup: new Date(),
        cleanupCount: (property.cleanupCount || 0) + 1
      });
      
      result.success = result.errors.length === 0;
      result.message = `Performed ${result.cleanups.length} cleanup operations`;
      result.timestamp = new Date();
      
      return result;
    } catch (error) {
      logger.error(`Failed to cleanup property data for ${propertyId}:`, error);
      throw error;
    }
  }

  /**
   * Helper methods
   */
  
  async validatePropertyData(property) {
    const { validateProperty } = require('../utils/validators/property.validator');
    
    try {
      const validation = validateProperty(property);
      
      if (validation.error) {
        return {
          valid: false,
          errors: validation.error.details.map(d => d.message)
        };
      }
      
      // Additional custom validation
      const additionalChecks = [];
      
      // Check if property with same address exists
      if (property.address) {
        const existing = await db.Property.findOne({
          where: {
            'address.street': property.address.street,
            'address.city': property.address.city,
            'address.postalCode': property.address.postalCode
          }
        });
        
        if (existing && existing.id !== property.id) {
          additionalChecks.push(`Property with similar address already exists (ID: ${existing.id})`);
        }
      }
      
      return {
        valid: additionalChecks.length === 0,
        errors: additionalChecks,
        warnings: additionalChecks.length > 0 ? ['Possible duplicate property'] : []
      };
    } catch (error) {
      logger.error('Property validation failed:', error);
      return {
        valid: false,
        errors: [error.message]
      };
    }
  }

  async processUploadedFiles(propertyId, files) {
    const result = {
      processedCount: 0,
      errors: []
    };
    
    for (const file of files) {
      try {
        // Process each file (upload to storage, create thumbnails, etc.)
        const fileResult = await this.processSingleFile(propertyId, file);
        
        if (fileResult.success) {
          result.processedCount++;
        } else {
          result.errors.push({
            filename: file.filename,
            error: fileResult.error
          });
        }
      } catch (error) {
        logger.error(`Failed to process file ${file.filename}:`, error);
        result.errors.push({
          filename: file.filename,
          error: error.message
        });
      }
    }
    
    return result;
  }

  async processSingleImage(propertyId, image, options) {
    // This is a simplified version - actual implementation would:
    // 1. Resize image
    // 2. Create thumbnail
    // 3. Optimize for web
    // 4. Upload to cloud storage
    // 5. Return URLs
    
    return {
      success: true,
      url: `https://storage.stayspot.com/properties/${propertyId}/images/${image.filename}`,
      thumbnailUrl: `https://storage.stayspot.com/properties/${propertyId}/thumbnails/${image.filename}`,
      filename: image.filename,
      size: image.size,
      width: options.mainImageWidth,
      height: options.mainImageHeight,
      mimeType: image.mimetype
    };
  }

  buildAddressString(address) {
    const parts = [];
    
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.postalCode) parts.push(address.postalCode);
    if (address.country) parts.push(address.country);
    
    return parts.join(', ');
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  estimateMarketValue(property) {
    // Simple estimation logic
    const baseValue = property.size?.area * 200; // $200 per sqft
    const bedroomBonus = (property.size?.bedrooms || 1) * 50000;
    const locationMultiplier = property.address?.city === 'New York' ? 1.5 : 1;
    
    return Math.round(baseValue + bedroomBonus * locationMultiplier);
  }

  calculateRentalYield(property) {
    if (!property.price?.amount || !property.marketValue) {
      return null;
    }
    
    const annualRent = property.price.amount * 12;
    return (annualRent / property.marketValue) * 100;
  }

  async getNeighborhoodData(property) {
    // Simulated neighborhood data - would integrate with external API
    return {
      rating: 8.5,
      safety: 7.8,
      schools: 8.2,
      amenities: 9.0,
      transportation: 7.5,
      description: 'Family-friendly neighborhood with good schools and amenities.'
    };
  }

  async analyzePropertyImages(images) {
    // Simulated image analysis - would use AI/ML in production
    return {
      qualityScore: 8.7,
      hasExterior: images.some(img => img.tags?.includes('exterior')),
      hasInterior: images.some(img => img.tags?.includes('interior')),
      hasAmenities: images.some(img => img.tags?.includes('amenities')),
      totalImages: images.length
    };
  }

  async findComparableProperties(property) {
    // Find similar properties in the same area
    const comparables = await db.Property.findAll({
      where: {
        id: { [db.Sequelize.Op.ne]: property.id },
        'address.city': property.address.city,
        type: property.type,
        status: 'active'
      },
      limit: 5,
      order: [['createdAt', 'DESC']]
    });
    
    return comparables.map(comp => ({
      id: comp.id,
      name: comp.name,
      price: comp.price,
      size: comp.size,
      distance: this.calculateDistance(
        property.latitude,
        property.longitude,
        comp.latitude,
        comp.longitude
      )
    }));
  }

  calculateWalkScore(property) {
    // Simulated walk score calculation
    return Math.floor(Math.random() * 100);
  }

  estimateMaintenanceCost(property) {
    // Simple estimation based on property size and age
    const baseCost = 1000; // Base annual cost
    const sizeCost = (property.size?.area || 1000) * 0.5;
    const age = property.yearBuilt ? new Date().getFullYear() - property.yearBuilt : 10;
    const ageCost = age * 50;
    
    return Math.round(baseCost + sizeCost + ageCost);
  }

  async invalidateCache(propertyId) {
    const redis = require('../config/redis');
    
    // Invalidate property cache
    await redis.del(`property:${propertyId}`);
    await redis.del('properties:list');
    await redis.del('properties:search:*');
    
    logger.debug(`Cache invalidated for property ${propertyId}`);
  }

  async updateSearchIndex(property) {
    // Update Elasticsearch/Algolia index
    // Implementation depends on search engine used
    logger.debug(`Search index updated for property ${property.id}`);
  }

  async syncWithListingPlatforms(property) {
    // Sync with external listing platforms
    // This would integrate with each platform's API
    return {
      platforms: ['airbnb', 'booking', 'vrbo'],
      status: 'success'
    };
  }

  async updateSitemap(propertyId, action) {
    // Update sitemap.xml
    logger.debug(`Sitemap updated for property ${propertyId} (${action})`);
  }

  async parseBulkImportFile(filePath) {
    // Parse CSV/Excel file
    // Implementation depends on file format
    return []; // Return array of property objects
  }

  async findExistingProperty(propertyData) {
    return await db.Property.findOne({
      where: {
        'address.street': propertyData.address.street,
        'address.city': propertyData.address.city,
        'address.postalCode': propertyData.address.postalCode
      }
    });
  }

  async updateExistingProperty(propertyId, propertyData, options) {
    // Update existing property
    await db.Property.update(propertyData, {
      where: { id: propertyId }
    });
    
    return {
      id: propertyId,
      action: 'updated'
    };
  }

  async createNewProperty(propertyData, options) {
    // Create new property
    const property = await db.Property.create(propertyData);
    
    // Process additional steps if needed
    if (options.geocodeAddresses) {
      await this.addGeocodingJob({
        propertyId: property.id,
        address: property.address
      });
    }
    
    if (options.enrichData) {
      await this.addDataEnrichmentJob({
        propertyId: property.id
      });
    }
    
    if (options.publishAfterImport) {
      await property.update({ status: 'active', published: true });
    }
    
    return {
      id: property.id,
      action: 'created'
    };
  }

  async sendBulkImportNotification(userId, summary) {
    await triggers.trigger('notification.sent', {
      userId,
      type: 'bulk_import_complete',
      title: 'Bulk Import Completed',
      message: `Bulk import completed: ${summary.statistics.processed} properties processed`,
      data: summary
    });
  }

  async syncWithAirbnb(property) {
    // Airbnb API integration
    return { status: 'synced', listingId: `airbnb_${property.id}` };
  }

  async syncWithBooking(property) {
    // Booking.com API integration
    return { status: 'synced', listingId: `booking_${property.id}` };
  }

  async syncWithVrbo(property) {
    // Vrbo API integration
    return { status: 'synced', listingId: `vrbo_${property.id}` };
  }

  async syncWithZumper(property) {
    // Zumper API integration
    return { status: 'synced', listingId: `zumper_${property.id}` };
  }

  async syncWithApartments(property) {
    // Apartments.com API integration
    return { status: 'synced', listingId: `apartments_${property.id}` };
  }

  async syncWithRealtor(property) {
    // Realtor.com API integration
    return { status: 'synced', listingId: `realtor_${property.id}` };
  }

  async syncWithZillow(property) {
    // Zillow API integration
    return { status: 'synced', listingId: `zillow_${property.id}` };
  }

  async cleanupOrphanedImages(propertyId) {
    // Remove images not linked to property
    const deleted = await db.PropertyImage.destroy({
      where: {
        propertyId,
        url: null
      }
    });
    
    return { deleted };
  }

  async cleanupDuplicateData(propertyId) {
    // Remove duplicate property data
    return { cleaned: 0 };
  }

  async cleanupStaleCache(propertyId) {
    // Cleanup stale cache entries
    return { cleaned: 0 };
  }

  async cleanupTemporaryFiles(propertyId) {
    // Cleanup temporary files
    const tempDir = `./uploads/temp/${propertyId}`;
    return await FileHelper.cleanupOldFiles(tempDir, 1); // Cleanup files older than 1 day
  }

  async cleanupOldLogs(propertyId) {
    // Cleanup old logs
    const deleted = await db.PropertyLog.destroy({
      where: {
        propertyId,
        createdAt: {
          [db.Sequelize.Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      }
    });
    
    return { deleted };
  }

  async cleanupUnusedMetadata(propertyId) {
    // Cleanup unused metadata
    return { cleaned: 0 };
  }

  handleJobFailure(job, error) {
    // Handle job failure (send notification, log, retry, etc.)
    logger.error(`Job ${job.id} failed:`, error);
    
    // Send notification to system admins
    triggers.trigger('system.error', {
      errorCode: 'JOB_FAILED',
      errorMessage: `Job ${job.id} failed: ${error.message}`,
      component: 'property-worker',
      severity: 'high'
    });
  }

  handleJobSuccess(job, result) {
    // Handle job success
    logger.info(`Job ${job.id} completed successfully`);
    
    // Update property status if applicable
    if (result.propertyId && result.success) {
      db.Property.update(
        { processingCompleted: new Date() },
        { where: { id: result.propertyId } }
      );
    }
  }

  /**
   * Get queue statistics
   * @returns {Promise<Object>} Queue stats
   */
  async getStats() {
    const counts = await this.queue.getJobCounts();
    const workers = await this.queue.getWorkers();
    
    return {
      queue: 'property-processing',
      counts,
      workers: workers.length,
      isPaused: await this.queue.isPaused(),
      timestamp: new Date()
    };
  }

  /**
   * Pause queue processing
   */
  async pause() {
    await this.queue.pause();
    logger.info('Property worker queue paused');
  }

  /**
   * Resume queue processing
   */
  async resume() {
    await this.queue.resume();
    logger.info('Property worker queue resumed');
  }

  /**
   * Cleanup old jobs
   * @param {number} daysOld - Remove jobs older than this many days
   */
  async cleanupOldJobs(daysOld = 7) {
    const cutoff = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    
    // Cleanup completed jobs
    await this.queue.clean(cutoff, 'completed');
    
    // Cleanup failed jobs (keep for 30 days)
    const failedCutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);
    await this.queue.clean(failedCutoff, 'failed');
    
    logger.info(`Cleaned up jobs older than ${daysOld} days`);
  }
}

// Create singleton instance
const propertyWorker = new PropertyWorker();

module.exports = propertyWorker;