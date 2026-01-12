const cron = require('cron');
const { logger } = require('../utils/logger');

// Import workers
const notificationWorker = require('./notification.worker');
const propertyWorker = require('./property.worker');
const reportWorker = require('./report.worker');
const syncWorker = require('./sync.worker');

// Worker registry
const workers = new Map();

/**
 * Start all background workers
 */
function startWorkers() {
  try {
    logger.info('Starting background workers...');

    // Notification worker - every 5 minutes
    const notificationJob = new cron.CronJob('*/5 * * * *', async () => {
      try {
        await notificationWorker.processNotifications();
      } catch (error) {
        logger.error('Notification worker error:', error);
      }
    });

    // Property sync worker - every hour
    const propertySyncJob = new cron.CronJob('0 * * * *', async () => {
      try {
        await propertyWorker.syncPropertyData();
      } catch (error) {
        logger.error('Property sync worker error:', error);
      }
    });

    // Report generation worker - daily at 2 AM
    const reportJob = new cron.CronJob('0 2 * * *', async () => {
      try {
        await reportWorker.generateDailyReports();
      } catch (error) {
        logger.error('Report worker error:', error);
      }
    });

    // Data sync worker - every 30 minutes
    const dataSyncJob = new cron.CronJob('*/30 * * * *', async () => {
      try {
        await syncWorker.syncExternalData();
      } catch (error) {
        logger.error('Data sync worker error:', error);
      }
    });

    // Start all jobs
    notificationJob.start();
    propertySyncJob.start();
    reportJob.start();
    dataSyncJob.start();

    // Register workers
    workers.set('notification', notificationJob);
    workers.set('propertySync', propertySyncJob);
    workers.set('report', reportJob);
    workers.set('dataSync', dataSyncJob);

    logger.info('All background workers started successfully');
  } catch (error) {
    logger.error('Failed to start workers:', error);
    throw error;
  }
}

/**
 * Stop all background workers
 */
function stopWorkers() {
  try {
    logger.info('Stopping background workers...');
    
    workers.forEach((worker, name) => {
      worker.stop();
      logger.info(`Stopped ${name} worker`);
    });
    
    workers.clear();
    logger.info('All background workers stopped');
  } catch (error) {
    logger.error('Failed to stop workers:', error);
    throw error;
  }
}

/**
 * Get worker status
 */
function getWorkerStatus() {
  const status = {};
  
  workers.forEach((worker, name) => {
    status[name] = {
      running: worker.running,
      lastDate: worker.lastDate(),
      nextDate: worker.nextDate(),
    };
  });
  
  return status;
}

module.exports = {
  startWorkers,
  stopWorkers,
  getWorkerStatus,
  workers,
};