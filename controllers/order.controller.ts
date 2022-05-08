import express, {Request, Response, Router} from "express";
import {OrderService} from "../services";
import {checkUserConnected} from "../middlewares";

export class OrderController {

    async createOrder(req: Request, res: Response) {
        const platform = req.headers['user-agent'] || "Unknown";
        try {
            const ordered = await OrderService.getInstance().subscribeOrdered({
                client: req.body.clientId,
            }, platform);
            res.json(ordered);
        } catch (err) {
            console.log(err)
            res.status(400).end();
        }
    }

    async setClientIdFromDeliveryMan(req: Request, res: Response) {
        const orderedClient = await OrderService.getInstance().getClientIdFromDeliveryMan(req.user?._id);
        res.json(orderedClient);
    }

    async setOrderData(req: Request, res: Response) {
        const ordered = await OrderService.getInstance().getOrdered(req.body.clientId);
        res.json(ordered);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/create-order', express.json(), this.createOrder.bind(this));
        router.get('/client-id', checkUserConnected(), this.setClientIdFromDeliveryMan.bind(this));
        router.post('/data-order', express.json(), this.setOrderData.bind(this));
        return router;
    }
}