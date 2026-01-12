const { logger } = require('./logger');

class QueueService {
  constructor() {
    this.queues = new Map();
    this.workers = new Map();
    this.isProcessing = false;
  }

  createQueue(name, options = {}) {
    if (this.queues.has(name)) {
      return this.queues.get(name);
    }

    const queue = {
      name,
      jobs: [],
      options: {
        concurrency: options.concurrency || 1,
        delay: options.delay || 0,
        attempts: options.attempts || 3,
        backoff: options.backoff || 'exponential',
        ...options
      },
      stats: {
        completed: 0,
        failed: 0,
        active: 0,
        waiting: 0
      }
    };

    this.queues.set(name, queue);
    return queue;
  }

  async addJob(queueName, jobData, options = {}) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const job = {
      id: this.generateJobId(),
      data: jobData,
      options: { ...queue.options, ...options },
      attempts: 0,
      status: 'waiting',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    queue.jobs.push(job);
    queue.stats.waiting++;

    logger.info(`Job ${job.id} added to queue ${queueName}`);
    
    if (!this.isProcessing) {
      this.processQueues();
    }

    return job;
  }

  process(queueName, processor) {
    this.workers.set(queueName, processor);
  }

  async processQueues() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      for (const [queueName, queue] of this.queues) {
        const processor = this.workers.get(queueName);
        if (!processor) continue;

        await this.processQueue(queue, processor);
      }
    } finally {
      this.isProcessing = false;
      
      // Check if there are more jobs to process
      const hasWaitingJobs = Array.from(this.queues.values())
        .some(queue => queue.jobs.some(job => job.status === 'waiting'));
      
      if (hasWaitingJobs) {
        setTimeout(() => this.processQueues(), 1000);
      }
    }
  }

  async processQueue(queue, processor) {
    const { concurrency } = queue.options;
    const waitingJobs = queue.jobs.filter(job => job.status === 'waiting');
    const activeJobs = queue.jobs.filter(job => job.status === 'active');

    if (activeJobs.length >= concurrency || waitingJobs.length === 0) {
      return;
    }

    const jobsToProcess = waitingJobs.slice(0, concurrency - activeJobs.length);

    await Promise.all(
      jobsToProcess.map(job => this.processJob(queue, job, processor))
    );
  }

  async processJob(queue, job, processor) {
    job.status = 'active';
    job.attempts++;
    job.updatedAt = new Date();
    queue.stats.active++;
    queue.stats.waiting--;

    try {
      logger.info(`Processing job ${job.id} in queue ${queue.name}`);
      
      await processor(job.data, job);
      
      job.status = 'completed';
      job.completedAt = new Date();
      queue.stats.completed++;
      queue.stats.active--;

      logger.info(`Job ${job.id} completed successfully`);
    } catch (error) {
      logger.error(`Job ${job.id} failed:`, error);
      
      if (job.attempts < job.options.attempts) {
        job.status = 'waiting';
        job.error = error.message;
        queue.stats.waiting++;
        
        // Apply backoff delay
        const delay = this.calculateBackoffDelay(job.attempts, job.options.backoff);
        setTimeout(() => {
          // Job will be picked up in next processing cycle
        }, delay);
      } else {
        job.status = 'failed';
        job.error = error.message;
        job.failedAt = new Date();
        queue.stats.failed++;
      }
      
      queue.stats.active--;
    }
  }

  calculateBackoffDelay(attempt, backoffType) {
    switch (backoffType) {
      case 'exponential':
        return Math.pow(2, attempt) * 1000;
      case 'linear':
        return attempt * 1000;
      case 'fixed':
        return 5000;
      default:
        return 1000;
    }
  }

  generateJobId() {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getQueueStats(queueName) {
    const queue = this.queues.get(queueName);
    return queue ? queue.stats : null;
  }

  getJob(queueName, jobId) {
    const queue = this.queues.get(queueName);
    return queue ? queue.jobs.find(job => job.id === jobId) : null;
  }

  removeJob(queueName, jobId) {
    const queue = this.queues.get(queueName);
    if (queue) {
      const index = queue.jobs.findIndex(job => job.id === jobId);
      if (index !== -1) {
        queue.jobs.splice(index, 1);
        return true;
      }
    }
    return false;
  }
}

module.exports = new QueueService();