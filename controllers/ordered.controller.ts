import express, {Request, Response, Router} from "express";
import {OrderedService} from "../services/ordered.service";
import {checkUserConnected} from "../middlewares";

export class OrderedController {

    async createOrdered(req: Request, res: Response) {
        const platform = req.headers['user-agent'] || "Unknown";
        try {
            const ordered = await OrderedService.getInstance().subscribeOrdered({
                client: req.body.clientId,
            }, platform);
            res.json(ordered);
        } catch (err) {
            console.log(err)
            res.status(400).end();
        }
    }

    async setClientIdFromDeliveryMan(req: Request, res: Response) {
        const orderedClient = await OrderedService.getInstance().getClientIdFromDeliveryMan(req.user?._id);
        res.json(orderedClient);
    }

    async setOrderData(req: Request, res: Response) {
        const ordered = await OrderedService.getInstance().getOrdered(req.body.clientId);
        res.json(ordered);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/create-ordered', express.json(), this.createOrdered.bind(this));
        router.get('/client-id', checkUserConnected(), this.setClientIdFromDeliveryMan.bind(this));
        router.post('/data-ordered', express.json(), this.setOrderData.bind(this));
        return router;
    }
}