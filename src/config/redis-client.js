import { createClient } from "redis";

class RedisClient {
    constructor() {
        this.client = createClient({
            url: 'redis://127.0.0.1:6379'
        });

        this.isConnected = false;
    }

    async connect() {
        if (!this.isConnected) {
            await this.client.connect();
            this.isConnected = true;
            console.log("Redis connected");
        }
    }

    getClient() {
        return this.client;
    }
}

export const redis = new RedisClient();