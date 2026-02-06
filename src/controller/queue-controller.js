import { QueueService } from "../services/queue-service.js";
import { randomUUID } from 'crypto';
import { eventQueue } from "../worker/event-queue.js";
const queueService = new QueueService();
const OPEN_TIME = new Date('2026-02-06T17:45:00').getTime();
export class QueueController{
    addToQueue = async(req,res) => {
       
        const incomingId = req.body.userId;
        console.log("Incoming userId:", incomingId);
        const userId =
        typeof incomingId === 'string' && incomingId.trim() !== ''
        ? incomingId
        : randomUUID();
        
        const added = await queueService.addToQueue(userId);
        
        if(added === 0) return res.status(409).json({message: "User already in queue", userId: userId});
        
        await eventQueue.add(
            "process-user",
            {},
            {
                jobId: "process-queue",
                removeOnComplete: true,
                removeOnFail: true
            }
        );


        res.status(201).json({message: "Added to queue", userId: userId});
    }

    getQueueStatus = async(req, res) => {
        const { id } = req.params;
     
        const status = await queueService.getStatus(id);

        res.status(200).json(JSON.parse(status));
    }
}