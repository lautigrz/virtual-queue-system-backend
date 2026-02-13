import { redis } from "../config/redis-client.js";

const client = redis.connect();

export class ActiveQueueRepository {
    
    async isActive(userId) {
        return await client.zscore('active_sessions', userId);
    }
}