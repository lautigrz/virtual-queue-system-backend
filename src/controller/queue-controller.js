import { QueueService } from "../services/queue-service.js";
import { randomUUID } from 'crypto';

const queueService = new QueueService();
const OPEN_TIME = new Date('2026-02-06T17:45:00').getTime();
export class QueueController {
    addToQueue = async (req, res) => {

        try {
            const incomingId = req.body.userId;
            const userId =
                typeof incomingId === 'string' && incomingId.trim() !== ''
                    ? incomingId
                    : randomUUID();

            const added = await queueService.addToQueue(userId);

            if (added === 0) return res.status(409).json({ message: "User already in queue", userId: userId });

            res.status(201).json({ message: "Added to queue", userId: userId });

        } catch (error) {

            res.status(500).json({ message: "Error adding to queue", error: error.message });
        }
    }

    getQueueStatus = async (req, res) => {
        try {

            const { id } = req.params;

            const status = await queueService.getStatus(id);

            res.status(200).json(status);

        } catch (error) {

            res.status(500).json({ message: "Error getting queue status", error: error.message });

        }
    }
}