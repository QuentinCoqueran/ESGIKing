import express, {Request, Response, Router} from "express";
import {OrderService} from "../services";
import {checkUserConnected} from "../middlewares";

export class OrderController {

    async createOrder(req: Request, res: Response) {
        const platform = req.headers['user-agent'] || "Unknown";
        try {
            const ordered = await OrderService.getInstance().subscribeOrdered({
                client: req.body.clientId,
                address: req.body.address,
                products: req.body.products,
                menus: req.body.menus,
                atRestaurant: req.body.atRestaurant
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
                const newStep = await OrderService.getInstance().updateStep(req.body?.idClient, 1);
                res.json(newStep);
            } else {
                //maj du array deliveryMan banned
                const newDeliveryman = await OrderService.getInstance().updateOrderDeliverymanBanned(req.body?.idDeliveryman, req.body?.idClient);
                res.json(newDeliveryman);
            }
        } catch (err) {
            res.status(403).end();
        }
    }

    async finishOrder(req: Request, res: Response) {
        try {
            let newStep;
            if (req.body?.response == 'deliveryman') {
                //maj de la step de l'order à 2 quand livreur valide commande
                newStep = await OrderService.getInstance().updateStep(req.body?.idClient, 2);
            }
            if (req.body?.response == 'customer') {
                //maj de la step de l'order à 3 quand client valide commande
                newStep = await OrderService.getInstance().updateStep(req.body?.idClient, 3);
            }
            if (req.body?.response == 'refused') {
                //maj de la step de l'order à 1 quand client refuse la finalisation de la commande
                newStep = await OrderService.getInstance().updateStep(req.body?.idClient, 1);
            }
            res.json(newStep);
        } catch (err) {
            res.status(403).end();
        }
    }

    async saveMessage(req: Request, res: Response) {
        console.log(req.body)
        try {
            const messages = await OrderService.getInstance().saveMessage(req.body?.messageValue, req.body?.orderId, req.body?.role, req.body?.date);
            console.log(messages)
            res.json(messages);
        } catch (err) {
            res.status(403).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/create-ordered', express.json(), this.createOrder.bind(this));
        router.get('/client-id', checkUserConnected(), this.setClientIdFromDeliveryMan.bind(this));
        router.post('/update-post', express.json(), this.updatePostDeliveryMan.bind(this));
        router.post('/data-ordered', express.json(), this.setOrderData.bind(this));
        router.post('/take-order', express.json(), this.updateTakeOrder.bind(this));
        router.post('/finish-order', express.json(), this.finishOrder.bind(this));
        router.post('/save-message', express.json(), this.saveMessage.bind(this));
        return router;
    }
}