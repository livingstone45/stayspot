const redis = require('redis');
const { logger } = require('./logger');

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.init();
  }

  async init() {
    if (!process.env.REDIS_HOST) {
      logger.warn('Redis not configured, using memory cache');
      this.memoryCache = new Map();
      return;
    }

    try {
      this.client = redis.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        db: process.env.REDIS_DB || 0
      });

      await this.client.connect();
      this.isConnected = true;
      logger.info('Redis cache connected');
    } catch (error) {
      logger.error('Redis connection failed:', error);
      this.memoryCache = new Map();
    }
  }

  async get(key) {
    try {
      if (this.client && this.isConnected) {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
      }
      return this.memoryCache?.get(key) || null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      const serialized = JSON.stringify(value);
      
      if (this.client && this.isConnected) {
        await this.client.setEx(key, ttl, serialized);
      } else if (this.memoryCache) {
        this.memoryCache.set(key, value);
        setTimeout(() => this.memoryCache.delete(key), ttl * 1000);
      }
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  async del(key) {
    try {
      if (this.client && this.isConnected) {
        await this.client.del(key);
      } else if (this.memoryCache) {
        this.memoryCache.delete(key);
      }
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  }

  async flush() {
    try {
      if (this.client && this.isConnected) {
        await this.client.flushDb();
      } else if (this.memoryCache) {
        this.memoryCache.clear();
      }
    } catch (error) {
      logger.error('Cache flush error:', error);
    }
  }

  generateKey(prefix, ...parts) {
    return `${prefix}:${parts.join(':')}`;
  }
}

module.exports = new CacheService();