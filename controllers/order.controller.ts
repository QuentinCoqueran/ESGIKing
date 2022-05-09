import express, {Request, Response, Router} from "express";
import {OrderService} from "../services/order.service";
import {checkUserConnected} from "../middlewares";

export class OrderController {

    async createOrdered(req: Request, res: Response) {
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

    async updatePostDeliveryMan(req: Request, res: Response) {
        try {
            const data = await OrderService.getInstance().updatePostDeliveryMan(req.body?.userId, req.body?.longitude, req.body?.latitude);
            res.json(data);
        } catch (err) {
            res.status(403).end();
        }
    }

    async setOrderData(req: Request, res: Response) {
        try {
            const ordered = await OrderService.getInstance().getOrdered(req.body?.clientId);
            res.json(ordered);
        } catch (err) {
            res.status(403).end();
        }
    }

    async updateTakeOrder(req: Request, res: Response) {
        try {
            if (req.body.takeOrder) {
                //maj de la step de l'order à 1
                const newStep = await OrderService.getInstance().updateStep(req.body?.idDeliveryman, 1);
                res.json(newStep);
            } else {
                //maj du array deliveryMan banned
                const newDeliveryman = await OrderService.getInstance().updateOrderDeliverymanBanned(req.body?.idDeliveryman,req.body?.idClient);
                res.json(newDeliveryman);
            }
        } catch (err) {
            res.status(403).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/create-ordered', express.json(), this.createOrdered.bind(this));
        router.get('/client-id', checkUserConnected(), this.setClientIdFromDeliveryMan.bind(this));
        router.post('/update-post', express.json(), this.updatePostDeliveryMan.bind(this));
        router.post('/data-ordered', express.json(), this.setOrderData.bind(this));
        router.post('/take-order', express.json(), this.updateTakeOrder.bind(this));
        return router;
    }
}