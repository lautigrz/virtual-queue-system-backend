import IORedis from 'ioredis';

class RedisClient {
  constructor() {
    this.client = null;
  }

  connect() {
    if (!this.client) {
      this.client = new IORedis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
        maxRetriesPerRequest: null,
      });

      this.client.on('connect', () => console.log('Redis connected'));
      this.client.on('ready', () => console.log('Redis ready'));
      this.client.on('error', (err) => console.error('Redis error', err));
      this.client.on('close', () => console.warn('Redis connection closed'));
    }

    return this.client;
  }

  duplicate() {
    return this.connect().duplicate();
  }
}

export const redis = new RedisClient();
