import { redis } from "../config/redis-client.js";

const client = redis.connect();

export class QueueRepository {

    async addToQueue(userId) {

        const timestamp = Date.now();

        const multi = client.multi();

        multi.zadd('waiting_queue', 'NX', timestamp, userId);

        multi.zrank('waiting_queue', userId);

        const results = await multi.exec();

        if (!results) {
            throw new Error("Failed to add user to queue");
        };

        const [added, rank] = results;

        if (added === 0) {
            return 0;
        }

        await client.set(`initial_ahead:${userId}`, rank[1], 'NX');
        return added;

    }

    async getPosition(userId) {
        return await client.zrank('waiting_queue', userId);
    }

    async getInitialAhead(userId) {
        return await client.get(`initial_ahead:${userId}`) || 0;
    }

    async sizeQueue(){
        return client.zcard('waiting_queue');
    }


}