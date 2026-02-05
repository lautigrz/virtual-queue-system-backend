import { Router } from "express";
import { QueueController } from "../../controller/queue-controller.js";
const queueRouter = Router();

const controller = new QueueController();

queueRouter.post('/join', controller.addToQueue); 
queueRouter.get('/status/:id', controller.getQueueStatus);
export { queueRouter };