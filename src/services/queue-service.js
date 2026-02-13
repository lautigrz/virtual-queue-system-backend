
import { QueueRepository } from "../repository/queue-repository.js";
import { ActiveQueueRepository } from "../repository/active-queue-repository.js";
import { calculateProgress } from "../utils/calculate-progress.js";

const queueRepository = new QueueRepository();
const activeQueueRepository = new ActiveQueueRepository();
const EXPIRATION_TIME = 20000000;
export class QueueService {

    async addToQueue(userId) {

        const add = queueRepository.addToQueue(userId);

        return add;

    }
    async getStatus(userId) {
   
        const userExists = await activeQueueRepository.isActive(userId);

        if (userExists) return { userId: userId, redirect: '/ticket-selection', "expiration": Date.now() + EXPIRATION_TIME};

        const userPosition = await queueRepository.getPosition(userId);

        if (userPosition === null) return { status: 'not_in_queue' };

        const queueSize = await queueRepository.sizeQueue();

        const initialAhead = await queueRepository.getInitialAhead(userId);

        const progress = calculateProgress(initialAhead, userPosition);

        const status = {
            status: 'in_queue',
            position: userPosition + 1,
            queueSize: queueSize,
            ahead: userPosition,
            progress: progress
        }

        return status;

    }

}

