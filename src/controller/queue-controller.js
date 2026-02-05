import { QueueService } from "../services/queue-service.js";
import { randomUUID } from 'crypto';
const queueService = new QueueService();

export class QueueController{
    addToQueue = async(req,res) => {

        const incomingId = req.body.userId;
        console.log("Incoming userId:", incomingId);
        const userId =
        typeof incomingId === 'string' && incomingId.trim() !== ''
        ? incomingId
        : randomUUID();
        console.log("Request to add user to queue:", userId);

        const added = await queueService.addToQueue(userId);
        
        if(added === 0) return res.status(409).json({message: "User already in queue", userId: userId});
        
        res.status(201).json({message: "Added to queue", userId: userId});
    }

    getQueueStatus = async(req, res) => {
        const { id } = req.params;
        console.log("Fetching status for user ID:", id);    
        const status = await queueService.getStatus(id);

        res.status(200).json(JSON.parse(status));
    }
}