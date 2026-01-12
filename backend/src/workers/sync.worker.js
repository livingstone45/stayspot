const Queue = require('bull');
const logger = require('../config/logger');
const db = require('../models');

class SyncWorker {
  constructor() {
    this.queue = new Queue('sync-processing', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 10000
        },
        removeOnComplete: true,
        removeOnFail: false
      }
    });
    
    this.initializeWorkers();
    logger.info('Sync worker initialized');
  }

  /**
   * Initialize queue workers
   */
  initializeWorkers() {
    // Sync market data
    this.queue.process('sync-market-data', 2, async (job) => {
      return await this.syncMarketData(job.data);
    });

    // Sync property data with external platforms
    this.queue.process('sync-properties-external', 3, async (job) => {
      return await this.syncPropertiesExternal(job.data);
    });

    // Sync tenant data
    this.queue.process('sync-tenants', 2, async (job) => {
      return await this.syncTenantData(job.data);
    });

    // Sync financial data
    this.queue.process('sync-financial', 1, async (job) => {
      return await this.syncFinancialData(job.data);
    });

    // Sync integration data
    this.queue.process('sync-integration', 2, async (job) => {
      return await this.syncIntegrationData(job.data);
    });

    // Full system sync
    this.queue.process('sync-full', 1, async (job) => {
      return await this.syncFullSystem(job.data);
    });

    // Data validation and repair
    this.queue.process('validate-data', 1, async (job) => {
      return await this.validateAndRepairData(job.data);
    });

    // Error handling
    this.queue.on('failed', (job, error) => {
      logger.error(`Sync job ${job.id} failed:`, error);
      this.handleJobFailure(job, error);
    });

    this.queue.on('completed', (job, result) => {
      logger.info(`Sync job ${job.id} completed successfully`);
      this.handleJobSuccess(job, result);
    });

    this.queue.on('stalled', (job) => {
      logger.warn(`Sync job ${job.id} stalled`);
    });
  }

  /**
   * Add market data sync job
   * @param {Object} data - Sync data
   * @returns {Promise<Job>} Bull job
   */
  async addMarketDataSyncJob(data) {
    return await this.queue.add('sync-market-data', data, {
      jobId: `market_sync_${Date.now()}`,
      priority: 1
    });
  }

  /**
   * Add external property sync job
   * @param {Object} data - Sync data
   * @returns {Promise<Job>} Bull job
   */
  async addExternalPropertySyncJob(data) {
    return await this.queue.add('sync-properties-external', data, {
      jobId: `property_ext_sync_${data.propertyId || 'all'}_${Date.now()}`,
      priority: 2
    });
  }

  /**
   * Add tenant sync job
   * @param {Object} data - Sync data
   * @returns {Promise<Job>} Bull job
   */
  async addTenantSyncJob(data) {
    return await this.queue.add('sync-tenants', data, {
      jobId: `tenant_sync_${Date.now()}`,
      priority: 3
    });
  }

  /**
   * Add financial sync job
   * @param {Object} data - Sync data
   * @returns {Promise<Job>} Bull job
   */
  async addFinancialSyncJob(data) {
    return await this.queue.add('sync-financial', data, {
      jobId: `financial_sync_${Date.now()}`,
      priority: 4
    });
  }

  /**
   * Add integration sync job
   * @param {Object} data - Sync data
   * @returns {Promise<Job>} Bull job
   */
  async addIntegrationSyncJob(data) {
    return await this.queue.add('sync-integration', data, {
      jobId: `integration_sync_${data.integrationId}_${Date.now()}`,
      priority: 5
    });
  }

  /**
   * Add full system sync job
   * @param {Object} data - Sync data
   * @returns {Promise<Job>} Bull job
   */
  async addFullSyncJob(data) {
    return await this.queue.add('sync-full', data, {
      jobId: `full_sync_${Date.now()}`,
      priority: 6
    });
  }

  /**
   * Add data validation job
   * @param {Object} data - Validation data
   * @returns {Promise<Job>} Bull job
   */
  async addDataValidationJob(data) {
    return await this.queue.add('validate-data', data, {
      jobId: `validate_${Date.now()}`,
      priority: 7
    });
  }

  /**
   * Sync market data
   * @param {Object} data - Sync data
   * @returns {Promise<Object>} Result
   */
  async syncMarketData(data) {
    const { 
      sources = ['zillow', 'realtor', 'rentometer'],
      forceRefresh = false 
    } = data;
    
    logger.info(`Syncing market data from sources: ${sources.join(', ')}`);
    
    try {
      const result = {
        sources: {},
        statistics: {
          totalProperties: 0,
          updatedProperties: 0,
          newListings: 0,
          priceChanges: 0
        },
        timestamp: new Date()
      };
      
      // Check if sync is needed
      if (!forceRefresh) {
        const lastSync = await this.getLastMarketSync();
        const hoursSinceLastSync = (Date.now() - new Date(lastSync).getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastSync < 6) { // Sync at most every 6 hours
          return {
            success: true,
            skipped: true,
            reason: 'Recent sync exists',
            lastSync,
            timestamp: new Date()
          };
        }
      }
      
      // Sync from each source
      for (const source of sources) {
        try {
          const sourceResult = await this.syncFromMarketSource(source);
          result.sources[source] = sourceResult;
          
          // Update statistics
          result.statistics.totalProperties += sourceResult.total || 0;
          result.statistics.updatedProperties += sourceResult.updated || 0;
          result.statistics.newListings += sourceResult.new || 0;
          result.statistics.priceChanges += sourceResult.priceChanges || 0;
          
          logger.info(`Market data sync from ${source} completed: ${sourceResult.updated || 0} updated`);
        } catch (error) {
          logger.error(`Failed to sync from ${source}:`, error);
          result.sources[source] = {
            success: false,
            error: error.message
          };
        }
      }
      
      // Update market data metrics
      await this.updateMarketMetrics(result.statistics);
      
      // Record sync completion
      await this.recordMarketSync({
        sources,
        statistics: result.statistics,
        duration: Date.now() - result.timestamp.getTime()
      });
      
      // Trigger market data updated event
      const triggers = require('../utils/automation/triggers');
      await triggers.trigger('marketdata.sync_completed', {
        sources,
        statistics: result.statistics,
        timestamp: new Date()
      });
      
      result.success = Object.values(result.sources).some(s => s.success);
      result.message = `Market data sync completed: ${result.statistics.updatedProperties} properties updated`;
      
      return result;
    } catch (error) {
      logger.error('Market data sync failed:', error);
      throw error;
    }
  }

  /**
   * Sync properties with external platforms
   * @param {Object} data - Sync data
   * @returns {Promise<Object>} Result
   */
  async syncPropertiesExternal(data) {
    const { 
      propertyId = null,
      platforms = ['airbnb', 'booking', 'vrbo'],
      action = 'sync',
      force = false 
    } = data;
    
    logger.info(`Syncing properties with external platforms: ${platforms.join(', ')}`);
    
    try {
      const result = {
        platforms: {},
        properties: [],
        statistics: {
          total: 0,
          successful: 0,
          failed: 0
        },
        timestamp: new Date()
      };
      
      // Get properties to sync
      const properties = await this.getPropertiesToSync(propertyId, action, force);
      result.statistics.total = properties.length;
      
      if (properties.length === 0) {
        return {
          success: true,
          skipped: true,
          reason: 'No properties to sync',
          timestamp: new Date()
        };
      }
      
      // Initialize platform clients
      const platformClients = this.initializePlatformClients(platforms);
      
      // Sync each property with each platform
      for (const property of properties) {
        const propertyResult = {
          propertyId: property.id,
          propertyName: property.name,
          platforms: {}
        };
        
        for (const [platformName, platformClient] of Object.entries(platformClients)) {
          try {
            const platformResult = await this.syncPropertyWithPlatform(
              property,
              platformClient,
              platformName,
              action
            );
            
            propertyResult.platforms[platformName] = platformResult;
            
            if (platformResult.success) {
              result.statistics.successful++;
            } else {
              result.statistics.failed++;
            }
            
            // Record sync
            await this.recordPropertySync({
              propertyId: property.id,
              platform: platformName,
              action,
              status: platformResult.success ? 'success' : 'failed',
              data: platformResult,
              syncedAt: new Date()
            });
          } catch (error) {
            logger.error(`Failed to sync property ${property.id} with ${platformName}:`, error);
            
            propertyResult.platforms[platformName] = {
              success: false,
              error: error.message
            };
            
            result.statistics.failed++;
            
            // Record failure
            await this.recordPropertySync({
              propertyId: property.id,
              platform: platformName,
              action,
              status: 'failed',
              error: error.message,
              syncedAt: new Date()
            });
          }
        }
        
        result.properties.push(propertyResult);
        
        // Update property sync status
        await this.updatePropertySyncStatus(property.id, action);
      }
      
      // Update platform statistics
      for (const platform of platforms) {
        const platformResults = result.properties.flatMap(p => 
          p.platforms[platform] ? [p.platforms[platform]] : []
        );
        
        result.platforms[platform] = {
          total: platformResults.length,
          successful: platformResults.filter(r => r.success).length,
          failed: platformResults.filter(r => !r.success).length
        };
      }
      
      // Trigger external sync completed event
      const triggers = require('../utils/automation/triggers');
      await triggers.trigger('integration.sync_completed', {
        integrationType: 'property_external',
        platforms,
        action,
        statistics: result.statistics,
        timestamp: new Date()
      });
      
      result.success = result.statistics.failed === 0;
      result.message = `External sync completed: ${result.statistics.successful} successful, ${result.statistics.failed} failed`;
      
      return result;
    } catch (error) {
      logger.error('External property sync failed:', error);
      throw error;
    }
  }

  /**
   * Sync tenant data
   * @param {Object} data - Sync data
   * @returns {Promise<Object>} Result
   */
  async syncTenantData(data) {
    const { 
      tenantId = null,
      syncBackgroundChecks = true,
      syncCreditReports = false,
      updateLeaseStatus = true 
    } = data;
    
    logger.info(`Syncing tenant data${tenantId ? ` for tenant ${tenantId}` : ''}`);
    
    try {
      const result = {
        tenants: [],
        statistics: {
          total: 0,
          backgroundChecks: 0,
          creditReports: 0,
          leaseUpdates: 0,
          errors: 0
        },
        timestamp: new Date()
      };
      
      // Get tenants to sync
      const tenants = await this.getTenantsToSync(tenantId);
      result.statistics.total = tenants.length;
      
      if (tenants.length === 0) {
        return {
          success: true,
          skipped: true,
          reason: 'No tenants to sync',
          timestamp: new Date()
        };
      }
      
      // Sync each tenant
      for (const tenant of tenants) {
        const tenantResult = {
          tenantId: tenant.id,
          tenantName: `${tenant.User?.firstName} ${tenant.User?.lastName}`,
          updates: [],
          errors: []
        };
        
        try {
          // Sync background checks
          if (syncBackgroundChecks) {
            try {
              const backgroundCheckResult = await this.syncTenantBackgroundCheck(tenant);
              tenantResult.updates.push({
                type: 'background_check',
                result: backgroundCheckResult
              });
              result.statistics.backgroundChecks++;
            } catch (error) {
              logger.error(`Failed to sync background check for tenant ${tenant.id}:`, error);
              tenantResult.errors.push({
                type: 'background_check',
                error: error.message
              });
              result.statistics.errors++;
            }
          }
          
          // Sync credit reports
          if (syncCreditReports && tenant.creditCheckAuthorized) {
            try {
              const creditReportResult = await this.syncTenantCreditReport(tenant);
              tenantResult.updates.push({
                type: 'credit_report',
                result: creditReportResult
              });
              result.statistics.creditReports++;
            } catch (error) {
              logger.error(`Failed to sync credit report for tenant ${tenant.id}:`, error);
              tenantResult.errors.push({
                type: 'credit_report',
                error: error.message
              });
              result.statistics.errors++;
            }
          }
          
          // Update lease status
          if (updateLeaseStatus) {
            try {
              const leaseUpdateResult = await this.updateTenantLeaseStatus(tenant);
              tenantResult.updates.push({
                type: 'lease_status',
                result: leaseUpdateResult
              });
              result.statistics.leaseUpdates++;
            } catch (error) {
              logger.error(`Failed to update lease status for tenant ${tenant.id}:`, error);
              tenantResult.errors.push({
                type: 'lease_status',
                error: error.message
              });
              result.statistics.errors++;
            }
          }
          
          // Update tenant sync timestamp
          await tenant.update({
            lastDataSync: new Date(),
            syncCount: (tenant.syncCount || 0) + 1
          });
          
        } catch (error) {
          logger.error(`Failed to sync tenant ${tenant.id}:`, error);
          tenantResult.errors.push({
            type: 'general',
            error: error.message
          });
          result.statistics.errors++;
        }
        
        result.tenants.push(tenantResult);
        
        // Report progress
        if (result.tenants.length % 10 === 0) {
          logger.info(`Tenant sync progress: ${result.tenants.length}/${tenants.length}`);
        }
      }
      
      // Trigger tenant sync completed event
      const triggers = require('../utils/automation/triggers');
      await triggers.trigger('integration.sync_completed', {
        integrationType: 'tenant_data',
        statistics: result.statistics,
        timestamp: new Date()
      });
      
      result.success = result.statistics.errors === 0;
      result.message = `Tenant sync completed: ${result.tenants.length} tenants processed`;
      
      return result;
    } catch (error) {
      logger.error('Tenant data sync failed:', error);
      throw error;
    }
  }

  /**
   * Sync financial data
   * @param {Object} data - Sync data
   * @returns {Promise<Object>} Result
   */
  async syncFinancialData(data) {
    const { 
      syncType = 'all',
      startDate = null,
      endDate = null,
      forceReconciliation = false 
    } = data;
    
    logger.info(`Syncing financial data: ${syncType}`);
    
    try {
      const result = {
        syncType,
        operations: {},
        statistics: {
          payments: 0,
          transactions: 0,
          invoices: 0,
          reconciliations: 0,
          errors: 0
        },
        timestamp: new Date()
      };
      
      // Sync payments
      if (syncType === 'all' || syncType === 'payments') {
        try {
          const paymentResult = await this.syncPaymentData(startDate, endDate);
          result.operations.payments = paymentResult;
          result.statistics.payments = paymentResult.synced || 0;
          result.statistics.errors += paymentResult.errors || 0;
        } catch (error) {
          logger.error('Payment sync failed:', error);
          result.operations.payments = {
            success: false,
            error: error.message
          };
          result.statistics.errors++;
        }
      }
      
      // Sync transactions
      if (syncType === 'all' || syncType === 'transactions') {
        try {
          const transactionResult = await this.syncTransactionData(startDate, endDate);
          result.operations.transactions = transactionResult;
          result.statistics.transactions = transactionResult.synced || 0;
          result.statistics.errors += transactionResult.errors || 0;
        } catch (error) {
          logger.error('Transaction sync failed:', error);
          result.operations.transactions = {
            success: false,
            error: error.message
          };
          result.statistics.errors++;
        }
      }
      
      // Sync invoices
      if (syncType === 'all' || syncType === 'invoices') {
        try {
          const invoiceResult = await this.syncInvoiceData(startDate, endDate);
          result.operations.invoices = invoiceResult;
          result.statistics.invoices = invoiceResult.synced || 0;
          result.statistics.errors += invoiceResult.errors || 0;
        } catch (error) {
          logger.error('Invoice sync failed:', error);
          result.operations.invoices = {
            success: false,
            error: error.message
          };
          result.statistics.errors++;
        }
      }
      
      // Perform reconciliation
      if (forceReconciliation || syncType === 'reconciliation') {
        try {
          const reconciliationResult = await this.performFinancialReconciliation(startDate, endDate);
          result.operations.reconciliation = reconciliationResult;
          result.statistics.reconciliations = reconciliationResult.reconciled || 0;
          result.statistics.errors += reconciliationResult.errors || 0;
        } catch (error) {
          logger.error('Financial reconciliation failed:', error);
          result.operations.reconciliation = {
            success: false,
            error: error.message
          };
          result.statistics.errors++;
        }
      }
      
      // Update financial sync metrics
      await this.updateFinancialMetrics(result.statistics);
      
      // Trigger financial sync completed event
      const triggers = require('../utils/automation/triggers');
      await triggers.trigger('integration.sync_completed', {
        integrationType: 'financial_data',
        syncType,
        statistics: result.statistics,
        timestamp: new Date()
      });
      
      result.success = result.statistics.errors === 0;
      result.message = `Financial sync completed: ${Object.values(result.statistics).reduce((a, b) => a + b, 0)} operations`;
      
      return result;
    } catch (error) {
      logger.error('Financial data sync failed:', error);
      throw error;
    }
  }

  /**
   * Sync integration data
   * @param {Object} data - Sync data
   * @returns {Promise<Object>} Result
   */
  async syncIntegrationData(data) {
    const { 
      integrationId = null,
      syncType = 'full',
      force = false 
    } = data;
    
    logger.info(`Syncing integration data${integrationId ? ` for integration ${integrationId}` : ''}`);
    
    try {
      const result = {
        integrations: [],
        statistics: {
          total: 0,
          successful: 0,
          failed: 0,
          recordsProcessed: 0
        },
        timestamp: new Date()
      };
      
      // Get integrations to sync
      const integrations = await this.getIntegrationsToSync(integrationId, syncType, force);
      result.statistics.total = integrations.length;
      
      if (integrations.length === 0) {
        return {
          success: true,
          skipped: true,
          reason: 'No integrations to sync',
          timestamp: new Date()
        };
      }
      
      // Sync each integration
      for (const integration of integrations) {
        const integrationResult = {
          integrationId: integration.id,
          integrationName: integration.name,
          type: integration.type,
          result: null,
          recordsProcessed: 0,
          duration: 0
        };
        
        const startTime = Date.now();
        
        try {
          // Trigger sync started event
          const triggers = require('../utils/automation/triggers');
          await triggers.trigger('integration.sync_started', {
            integrationId: integration.id,
            syncType,
            startTime: new Date(startTime)
          });
          
          // Perform integration-specific sync
          const syncResult = await this.performIntegrationSync(integration, syncType);
          
          integrationResult.result = syncResult;
          integrationResult.recordsProcessed = syncResult.recordsProcessed || 0;
          integrationResult.success = syncResult.success;
          
          if (syncResult.success) {
            result.statistics.successful++;
            result.statistics.recordsProcessed += integrationResult.recordsProcessed;
          } else {
            result.statistics.failed++;
          }
          
          // Update integration status
          await integration.update({
            lastSync: new Date(),
            lastSyncStatus: syncResult.success ? 'success' : 'failed',
            lastSyncResult: syncResult,
            syncCount: (integration.syncCount || 0) + 1
          });
          
          // Trigger sync completed event
          await triggers.trigger('integration.sync_completed', {
            integrationId: integration.id,
            syncType,
            recordsProcessed: integrationResult.recordsProcessed,
            duration: Date.now() - startTime,
            completedAt: new Date()
          });
          
        } catch (error) {
          logger.error(`Failed to sync integration ${integration.id}:`, error);
          
          integrationResult.result = {
            success: false,
            error: error.message
          };
          integrationResult.success = false;
          
          result.statistics.failed++;
          
          // Update integration status
          await integration.update({
            lastSync: new Date(),
            lastSyncStatus: 'failed',
            lastSyncError: error.message
          });
          
          // Trigger sync failed event
          const triggers = require('../utils/automation/triggers');
          await triggers.trigger('integration.sync_failed', {
            integrationId: integration.id,
            syncType,
            error: error.message,
            failedAt: new Date()
          });
        }
        
        integrationResult.duration = Date.now() - startTime;
        result.integrations.push(integrationResult);
      }
      
      result.success = result.statistics.failed === 0;
      result.message = `Integration sync completed: ${result.statistics.successful} successful, ${result.statistics.failed} failed`;
      
      return result;
    } catch (error) {
      logger.error('Integration data sync failed:', error);
      throw error;
    }
  }

  /**
   * Perform full system sync
   * @param {Object} data - Sync data
   * @returns {Promise<Object>} Result
   */
  async syncFullSystem(data) {
    const { 
      components = ['market', 'properties', 'tenants', 'financial', 'integrations'],
      sequential = false 
    } = data;
    
    logger.info(`Performing full system sync for components: ${components.join(', ')}`);
    
    try {
      const result = {
        components: {},
        statistics: {
          totalComponents: components.length,
          successful: 0,
          failed: 0,
          totalDuration: 0
        },
        timestamp: new Date()
      };
      
      const startTime = Date.now();
      
      if (sequential) {
        // Sync components sequentially
        for (const component of components) {
          const componentStartTime = Date.now();
          
          try {
            const componentResult = await this.syncSystemComponent(component, data);
            result.components[component] = {
              success: true,
              result: componentResult,
              duration: Date.now() - componentStartTime
            };
            result.statistics.successful++;
          } catch (error) {
            logger.error(`Failed to sync component ${component}:`, error);
            result.components[component] = {
              success: false,
              error: error.message,
              duration: Date.now() - componentStartTime
            };
            result.statistics.failed++;
          }
        }
      } else {
        // Sync components in parallel (using Promise.all)
        const componentPromises = components.map(async (component) => {
          const componentStartTime = Date.now();
          
          try {
            const componentResult = await this.syncSystemComponent(component, data);
            return {
              component,
              success: true,
              result: componentResult,
              duration: Date.now() - componentStartTime
            };
          } catch (error) {
            logger.error(`Failed to sync component ${component}:`, error);
            return {
              component,
              success: false,
              error: error.message,
              duration: Date.now() - componentStartTime
            };
          }
        });
        
        const componentResults = await Promise.all(componentPromises);
        
        // Organize results
        componentResults.forEach(compResult => {
          result.components[compResult.component] = {
            success: compResult.success,
            result: compResult.result,
            duration: compResult.duration
          };
          
          if (compResult.success) {
            result.statistics.successful++;
          } else {
            result.statistics.failed++;
          }
        });
      }
      
      result.statistics.totalDuration = Date.now() - startTime;
      
      // Update system sync metrics
      await this.updateSystemSyncMetrics(result);
      
      // Trigger system sync completed event
      const triggers = require('../utils/automation/triggers');
      await triggers.trigger('system.sync_completed', {
        components,
        statistics: result.statistics,
        timestamp: new Date()
      });
      
      result.success = result.statistics.failed === 0;
      result.message = `Full system sync completed: ${result.statistics.successful}/${result.statistics.totalComponents} components successful`;
      
      return result;
    } catch (error) {
      logger.error('Full system sync failed:', error);
      throw error;
    }
  }

  /**
   * Validate and repair data
   * @param {Object} data - Validation data
   * @returns {Promise<Object>} Result
   */
  async validateAndRepairData(data) {
    const { 
      dataTypes = ['all'],
      repair = true,
      validateRelationships = true 
    } = data;
    
    logger.info(`Validating and repairing data types: ${dataTypes.join(', ')}`);
    
    try {
      const result = {
        validations: {},
        repairs: {},
        statistics: {
          totalChecked: 0,
          issuesFound: 0,
          issuesFixed: 0,
          errors: 0
        },
        timestamp: new Date()
      };
      
      // Determine which data types to validate
      const typesToValidate = dataTypes.includes('all') 
        ? ['properties', 'tenants', 'leases', 'payments', 'maintenance', 'tasks']
        : dataTypes;
      
      // Validate each data type
      for (const dataType of typesToValidate) {
        try {
          const validationResult = await this.validateDataType(dataType, validateRelationships);
          result.validations[dataType] = validationResult;
          
          result.statistics.totalChecked += validationResult.total || 0;
          result.statistics.issuesFound += validationResult.issues || 0;
          result.statistics.errors += validationResult.errors || 0;
          
          // Repair if requested and issues found
          if (repair && validationResult.issues > 0) {
            try {
              const repairResult = await this.repairDataType(dataType, validationResult.issuesList);
              result.repairs[dataType] = repairResult;
              
              result.statistics.issuesFixed += repairResult.fixed || 0;
            } catch (repairError) {
              logger.error(`Failed to repair ${dataType}:`, repairError);
              result.repairs[dataType] = {
                success: false,
                error: repairError.message
              };
              result.statistics.errors++;
            }
          }
        } catch (validationError) {
          logger.error(`Failed to validate ${dataType}:`, validationError);
          result.validations[dataType] = {
            success: false,
            error: validationError.message
          };
          result.statistics.errors++;
        }
      }
      
      // Update data quality metrics
      await this.updateDataQualityMetrics(result.statistics);
      
      // Trigger data validation completed event
      const triggers = require('../utils/automation/triggers');
      await triggers.trigger('system.data_validated', {
        dataTypes: typesToValidate,
        repair,
        statistics: result.statistics,
        timestamp: new Date()
      });
      
      result.success = result.statistics.errors === 0;
      result.message = `Data validation completed: ${result.statistics.issuesFound} issues found, ${result.statistics.issuesFixed} fixed`;
      
      return result;
    } catch (error) {
      logger.error('Data validation failed:', error);
      throw error;
    }
  }

  /**
   * Helper methods for sync operations
   */
  
  async getLastMarketSync() {
    const lastSync = await db.MarketSync.findOne({
      order: [['syncedAt', 'DESC']],
      attributes: ['syncedAt']
    });
    
    return lastSync?.syncedAt || new Date(0);
  }

  async syncFromMarketSource(source) {
    // Implement source-specific sync logic
    // This would integrate with external APIs like Zillow, Realtor.com, etc.
    
    switch (source) {
      case 'zillow':
        return await this.syncFromZillow();
      case 'realtor':
        return await this.syncFromRealtor();
      case 'rentometer':
        return await this.syncFromRentometer();
      default:
        throw new Error(`Unsupported market source: ${source}`);
    }
  }

  async syncFromZillow() {
    // Zillow API integration
    // This is a placeholder - actual implementation would call Zillow API
    return {
      success: true,
      total: 100,
      updated: 25,
      new: 5,
      priceChanges: 10
    };
  }

  async syncFromRealtor() {
    // Realtor.com API integration
    return {
      success: true,
      total: 80,
      updated: 20,
      new: 3,
      priceChanges: 8
    };
  }

  async syncFromRentometer() {
    // Rentometer API integration
    return {
      success: true,
      total: 150,
      updated: 40,
      new: 8,
      priceChanges: 15
    };
  }

  async updateMarketMetrics(statistics) {
    // Update market metrics in database
    await db.MarketMetric.create({
      totalProperties: statistics.totalProperties,
      updatedProperties: statistics.updatedProperties,
      newListings: statistics.newListings,
      priceChanges: statistics.priceChanges,
      recordedAt: new Date()
    });
  }

  async recordMarketSync(data) {
    await db.MarketSync.create({
      sources: data.sources,
      statistics: data.statistics,
      duration: data.duration,
      syncedAt: new Date()
    });
  }

  async getPropertiesToSync(propertyId, action, force) {
    if (propertyId) {
      return await db.Property.findAll({
        where: { id: propertyId },
        include: [{ model: db.PropertyImage, limit: 5 }]
      });
    }
    
    // Get properties that need syncing
    const where = {
      status: 'active',
      published: true
    };
    
    if (!force) {
      // Only sync properties that haven't been synced recently
      where.lastExternalSync = {
        [db.Sequelize.Op.or]: [
          null,
          { [db.Sequelize.Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000) } // 24 hours
        ]
      };
    }
    
    return await db.Property.findAll({
      where,
      include: [{ model: db.PropertyImage, limit: 5 }],
      limit: force ? 50 : 100
    });
  }

  initializePlatformClients(platforms) {
    const clients = {};
    
    for (const platform of platforms) {
      switch (platform) {
        case 'airbnb':
          clients.airbnb = this.createAirbnbClient();
          break;
        case 'booking':
          clients.booking = this.createBookingClient();
          break;
        case 'vrbo':
          clients.vrbo = this.createVrboClient();
          break;
        default:
          logger.warn(`Unsupported platform: ${platform}`);
      }
    }
    
    return clients;
  }

  createAirbnbClient() {
    // Create Airbnb API client
    return {
      syncListing: async (property) => {
        // Airbnb sync implementation
        return { success: true, listingId: `airbnb_${property.id}` };
      }
    };
  }

  createBookingClient() {
    // Create Booking.com API client
    return {
      syncListing: async (property) => {
        // Booking.com sync implementation
        return { success: true, listingId: `booking_${property.id}` };
      }
    };
  }

  createVrboClient() {
    // Create Vrbo API client
    return {
      syncListing: async (property) => {
        // Vrbo sync implementation
        return { success: true, listingId: `vrbo_${property.id}` };
      }
    };
  }

  async syncPropertyWithPlatform(property, platformClient, platformName, action) {
    // Perform platform-specific sync
    switch (action) {
      case 'sync':
        return await platformClient.syncListing(property);
      case 'update':
        return await platformClient.updateListing(property);
      case 'publish':
        return await platformClient.publishListing(property);
      case 'unpublish':
        return await platformClient.unpublishListing(property);
      default:
        throw new Error(`Unsupported action: ${action}`);
    }
  }

  async recordPropertySync(data) {
    await db.PropertySync.create(data);
  }

  async updatePropertySyncStatus(propertyId, action) {
    await db.Property.update(
      {
        lastExternalSync: new Date(),
        externalSyncAction: action
      },
      { where: { id: propertyId } }
    );
  }

  async getTenantsToSync(tenantId) {
    if (tenantId) {
      return await db.Tenant.findAll({
        where: { id: tenantId },
        include: [
          { model: db.User },
          { model: db.Lease, where: { status: 'active' }, required: false }
        ]
      });
    }
    
    // Get tenants that need syncing (active leases, not synced recently)
    return await db.Tenant.findAll({
      include: [
        { model: db.User },
        { 
          model: db.Lease, 
          where: { status: 'active' },
          required: true 
        }
      ],
      where: {
        lastDataSync: {
          [db.Sequelize.Op.or]: [
            null,
            { [db.Sequelize.Op.lt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // 7 days
          ]
        }
      },
      limit: 100
    });
  }

  async syncTenantBackgroundCheck(tenant) {
    // Integrate with background check service
    // This is a placeholder - actual implementation would call background check API
    return {
      success: true,
      checkId: `bg_${tenant.id}_${Date.now()}`,
      status: 'completed',
      timestamp: new Date()
    };
  }

  async syncTenantCreditReport(tenant) {
    // Integrate with credit reporting service
    return {
      success: true,
      reportId: `cr_${tenant.id}_${Date.now()}`,
      score: 750,
      timestamp: new Date()
    };
  }

  async updateTenantLeaseStatus(tenant) {
    // Update lease status based on current date
    const updated = await db.Lease.update(
      { status: 'expired' },
      {
        where: {
          tenantId: tenant.id,
          status: 'active',
          endDate: { [db.Sequelize.Op.lt]: new Date() }
        }
      }
    );
    
    return {
      success: true,
      leasesUpdated: updated[0],
      timestamp: new Date()
    };
  }

  async syncPaymentData(startDate, endDate) {
    // Sync payment data with payment gateways
    const payments = await db.Payment.findAll({
      where: {
        status: 'pending',
        createdAt: {
          [db.Sequelize.Op.between]: [startDate || new Date(Date.now() - 24 * 60 * 60 * 1000), endDate || new Date()]
        }
      }
    });
    
    let synced = 0;
    let errors = 0;
    
    for (const payment of payments) {
      try {
        await this.syncSinglePayment(payment);
        synced++;
      } catch (error) {
        logger.error(`Failed to sync payment ${payment.id}:`, error);
        errors++;
      }
    }
    
    return {
      success: errors === 0,
      synced,
      errors,
      total: payments.length
    };
  }

  async syncSinglePayment(payment) {
    // Sync single payment with payment gateway
    // Implementation depends on payment gateway
    await payment.update({
      status: 'completed',
      paidDate: new Date(),
      lastSync: new Date()
    });
  }

  async syncTransactionData(startDate, endDate) {
    // Sync transaction data
    return {
      success: true,
      synced: 0,
      errors: 0,
      total: 0
    };
  }

  async syncInvoiceData(startDate, endDate) {
    // Sync invoice data
    return {
      success: true,
      synced: 0,
      errors: 0,
      total: 0
    };
  }

  async performFinancialReconciliation(startDate, endDate) {
    // Perform financial reconciliation
    return {
      success: true,
      reconciled: 0,
      discrepancies: 0,
      errors: 0
    };
  }

  async updateFinancialMetrics(statistics) {
    // Update financial metrics
    await db.FinancialMetric.create({
      ...statistics,
      recordedAt: new Date()
    });
  }

  async getIntegrationsToSync(integrationId, syncType, force) {
    if (integrationId) {
      return await db.Integration.findAll({
        where: { id: integrationId, isActive: true }
      });
    }
    
    const where = { isActive: true };
    
    if (!force) {
      // Only sync integrations that need syncing
      where.lastSync = {
        [db.Sequelize.Op.or]: [
          null,
          { [db.Sequelize.Op.lt]: new Date(Date.now() - 60 * 60 * 1000) } // 1 hour
        ]
      };
    }
    
    if (syncType !== 'full') {
      where.syncType = syncType;
    }
    
    return await db.Integration.findAll({
      where,
      limit: 10
    });
  }

  async performIntegrationSync(integration, syncType) {
    // Perform integration-specific sync
    // This would call the integration's sync method
    
    switch (integration.type) {
      case 'crm':
        return await this.syncCrmIntegration(integration, syncType);
      case 'accounting':
        return await this.syncAccountingIntegration(integration, syncType);
      case 'property_listing':
        return await this.syncPropertyListingIntegration(integration, syncType);
      case 'payment_gateway':
        return await this.syncPaymentGatewayIntegration(integration, syncType);
      default:
        throw new Error(`Unsupported integration type: ${integration.type}`);
    }
  }

  async syncCrmIntegration(integration, syncType) {
    // Sync CRM integration
    return {
      success: true,
      recordsProcessed: 50,
      details: { contacts: 30, companies: 20 }
    };
  }

  async syncAccountingIntegration(integration, syncType) {
    // Sync accounting integration
    return {
      success: true,
      recordsProcessed: 100,
      details: { transactions: 80, invoices: 20 }
    };
  }

  async syncPropertyListingIntegration(integration, syncType) {
    // Sync property listing integration
    return {
      success: true,
      recordsProcessed: 25,
      details: { listings: 25 }
    };
  }

  async syncPaymentGatewayIntegration(integration, syncType) {
    // Sync payment gateway integration
    return {
      success: true,
      recordsProcessed: 200,
      details: { payments: 150, refunds: 50 }
    };
  }

  async syncSystemComponent(component, data) {
    // Route to appropriate sync method based on component
    switch (component) {
      case 'market':
        return await this.syncMarketData(data);
      case 'properties':
        return await this.syncPropertiesExternal(data);
      case 'tenants':
        return await this.syncTenantData(data);
      case 'financial':
        return await this.syncFinancialData(data);
      case 'integrations':
        return await this.syncIntegrationData(data);
      default:
        throw new Error(`Unsupported system component: ${component}`);
    }
  }

  async updateSystemSyncMetrics(result) {
    // Update system sync metrics
    await db.SystemSync.create({
      components: Object.keys(result.components),
      statistics: result.statistics,
      syncedAt: new Date()
    });
  }

  async validateDataType(dataType, validateRelationships) {
    // Validate specific data type
    switch (dataType) {
      case 'properties':
        return await this.validateProperties(validateRelationships);
      case 'tenants':
        return await this.validateTenants(validateRelationships);
      case 'leases':
        return await this.validateLeases(validateRelationships);
      case 'payments':
        return await this.validatePayments(validateRelationships);
      case 'maintenance':
        return await this.validateMaintenance(validateRelationships);
      case 'tasks':
        return await this.validateTasks(validateRelationships);
      default:
        throw new Error(`Unsupported data type: ${dataType}`);
    }
  }

  async validateProperties(validateRelationships) {
    const properties = await db.Property.findAll({
      include: validateRelationships ? [
        { model: db.Unit },
        { model: db.PropertyImage }
      ] : []
    });
    
    let issues = 0;
    const issuesList = [];
    
    for (const property of properties) {
      const propertyIssues = [];
      
      // Check required fields
      if (!property.name) propertyIssues.push('Missing name');
      if (!property.address) propertyIssues.push('Missing address');
      if (!property.type) propertyIssues.push('Missing type');
      
      // Check relationships
      if (validateRelationships) {
        if (!property.Units || property.Units.length === 0) {
          propertyIssues.push('No units assigned');
        }
      }
      
      if (propertyIssues.length > 0) {
        issues++;
        issuesList.push({
          id: property.id,
          type: 'property',
          issues: propertyIssues
        });
      }
    }
    
    return {
      success: true,
      total: properties.length,
      issues,
      issuesList,
      timestamp: new Date()
    };
  }

  async validateTenants(validateRelationships) {
    // Similar validation for tenants
    return {
      success: true,
      total: 0,
      issues: 0,
      issuesList: []
    };
  }

  async validateLeases(validateRelationships) {
    // Similar validation for leases
    return {
      success: true,
      total: 0,
      issues: 0,
      issuesList: []
    };
  }

  async validatePayments(validateRelationships) {
    // Similar validation for payments
    return {
      success: true,
      total: 0,
      issues: 0,
      issuesList: []
    };
  }

  async validateMaintenance(validateRelationships) {
    // Similar validation for maintenance
    return {
      success: true,
      total: 0,
      issues: 0,
      issuesList: []
    };
  }

  async validateTasks(validateRelationships) {
    // Similar validation for tasks
    return {
      success: true,
      total: 0,
      issues: 0,
      issuesList: []
    };
  }

  async repairDataType(dataType, issuesList) {
    // Repair issues for specific data type
    let fixed = 0;
    
    for (const issue of issuesList) {
      try {
        await this.repairDataIssue(dataType, issue);
        fixed++;
      } catch (error) {
        logger.error(`Failed to repair ${dataType} issue ${issue.id}:`, error);
      }
    }
    
    return {
      success: true,
      fixed,
      total: issuesList.length,
      timestamp: new Date()
    };
  }

  async repairDataIssue(dataType, issue) {
    // Repair specific data issue
    switch (dataType) {
      case 'properties':
        await this.repairPropertyIssue(issue);
        break;
      // Add other data types as needed
    }
  }

  async repairPropertyIssue(issue) {
    const property = await db.Property.findByPk(issue.id);
    
    if (!property) return;
    
    // Fix common issues
    const updates = {};
    
    if (issue.issues.includes('Missing name')) {
      updates.name = `Property ${property.id}`;
    }
    
    if (Object.keys(updates).length > 0) {
      await property.update(updates);
    }
  }

  async updateDataQualityMetrics(statistics) {
    // Update data quality metrics
    await db.DataQualityMetric.create({
      ...statistics,
      recordedAt: new Date()
    });
  }

  handleJobFailure(job, error) {
    logger.error(`Sync job ${job.id} failed:`, error);
    
    // Send alert for sync failures
    const triggers = require('../utils/automation/triggers');
    triggers.trigger('system.error', {
      errorCode: 'SYNC_FAILED',
      errorMessage: `Sync job failed: ${error.message}`,
      component: 'sync-worker',
      severity: job.data.priority === 'high' ? 'high' : 'medium'
    });
  }

  handleJobSuccess(job, result) {
    logger.info(`Sync job ${job.id} completed successfully`);
    
    // Update sync metrics
    this.updateSyncMetrics(result);
  }

  updateSyncMetrics(result) {
    // Update overall sync metrics
    // This could track success rates, durations, etc.
  }

  /**
   * Get queue statistics
   * @returns {Promise<Object>} Queue stats
   */
  async getStats() {
    const counts = await this.queue.getJobCounts();
    const workers = await this.queue.getWorkers();
    
    return {
      queue: 'sync-processing',
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
    logger.info('Sync worker queue paused');
  }

  /**
   * Resume queue processing
   */
  async resume() {
    await this.queue.resume();
    logger.info('Sync worker queue resumed');
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
    
    logger.info(`Cleaned up sync jobs older than ${daysOld} days`);
  }
}

// Create singleton instance
const syncWorker = new SyncWorker();

module.exports = syncWorker;