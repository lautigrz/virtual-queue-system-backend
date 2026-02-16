import IORedis from "ioredis";

class RedisClient {
    constructor() {
        this.client = null;
    }

    connect() {
        if (!this.client) {
            this.client = new IORedis({
                host: process.env.REDIS_HOST || "redis",
                port: 6379,
                maxRetriesPerRequest: null,
                enableReadyCheck: false
            });

            this.client.on("connect", () => {
                console.log("Redis connected");
            });
        }

        return this.client;
    }

    duplicate() {
        return this.connect().duplicate();
    }
}

export const redis = new RedisClient();
