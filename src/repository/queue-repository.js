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

        // Guardar posición inicial con TTL para evitar acumulación de claves
        const ttl = Number(process.env.INITIAL_AHEAD_TTL_SECONDS) || 3600;
        await client.set(`initial_ahead:${userId}`, rank[1], 'NX', 'EX', ttl);
        return added;

    }

    async getPosition(userId) {
        return await client.zrank('waiting_queue', userId);
    }

    async getInitialAhead(userId) {
        const v = await client.get(`initial_ahead:${userId}`);
        return v === null ? 0 : Number.parseInt(v, 10);
    }

    async sizeQueue(){
        return client.zcard('waiting_queue');
    }


}