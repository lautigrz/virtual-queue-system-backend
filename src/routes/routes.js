import { Router } from "express";
import { queueRouter } from "./queue.router/queue.routes.js";
import { eventRouter } from "./event.router/event.routes.js";
export class AppRoutes {
    static get routes(){
        const router = Router();
        router.use('/queue', queueRouter);
        router.use('/event', eventRouter);
        return router;
    }
}