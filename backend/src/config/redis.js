const redis = require('redis');
require('dotenv').config();

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        password: process.env.REDIS_PASSWORD || undefined
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      throw error;
    }
  }

  async get(key) {
    if (!this.isConnected) await this.connect();
    return await this.client.get(key);
  }

  async set(key, value, expireInSeconds = 3600) {
    if (!this.isConnected) await this.connect();
    if (expireInSeconds) {
      await this.client.setEx(key, expireInSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key) {
    if (!this.isConnected) await this.connect();
    await this.client.del(key);
  }

  async exists(key) {
    if (!this.isConnected) await this.connect();
    return await this.client.exists(key);
  }

  async hSet(key, field, value) {
    if (!this.isConnected) await this.connect();
    await this.client.hSet(key, field, value);
  }

  async hGet(key, field) {
    if (!this.isConnected) await this.connect();
    return await this.client.hGet(key, field);
  }

  async flushAll() {
    if (!this.isConnected) await this.connect();
    await this.client.flushAll();
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;