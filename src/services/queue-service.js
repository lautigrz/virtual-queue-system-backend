import { redis } from "../config/redis-client.js";

const client = redis.getClient();
export class QueueService{

    async addToQueue(userId){
    
        try {
            const add = await client.zAdd('waiting_queue', {
            score: Date.now(), value: userId
        }, {NX: true});
        
        return add;

        } catch (error) {
            console.error("Error adding to queue:", error);
            throw error;
        }
    }


    async getStatus(userId){
        try{

            const userExists = await client.zScore('active_sessions', userId);

            if(userExists) return JSON.stringify({userId: userId, redirect: '/purchase'});
            
            const userPosition = await client.zRank('waiting_queue', userId);

            if(userPosition === null) return JSON.stringify({status: 'not_in_queue'});

            const queueSize = await client.zCard('waiting_queue');
            
            const ahead = await client.zRange('waiting_queue', 0, userPosition - 1);

            await client.set(`initial_ahead:${userId}`,ahead.length,
                                        { NX: true }
                                        );

            const progress = await this.calculateProgress(userId, ahead.length);
            
            return JSON.stringify({status: 'in_queue', position: userPosition + 1, queueSize: queueSize, ahead: ahead.length, progress: progress});
            

        }catch(error){
            console.error("Error getting queue status:", error);
        }
    }


     async calculateProgress(userId, currentAhead){
        const initialAhead = await client.get(`initial_ahead:${userId}`);

        if(initialAhead === 0) return 100;
        
        const progressed = ((initialAhead - currentAhead) / initialAhead) * 100;

        return Math.max(0, Math.min(100, Math.round(progressed)));   
       
    }
}

