import { Router } from "express";
import { EventController } from "../../controller/event-controller.js";

const eventRouter = Router();
const controller = new EventController();

eventRouter.get('/open-status', controller.getOpenStatus);

export { eventRouter };