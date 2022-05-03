import {UserModel, UserProps} from "../models";

import {OrderDocument, OrderModel, OrderProps} from "../models/order.model";
import {OrderDisplay} from "../models/OrderDisplay";

export class OrderService {

    private static instance?: OrderService;

    public static getInstance(): OrderService {
        if (OrderService.instance === undefined) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }

    private constructor() {
    }

    public async subscribeOrdered(ordered: Partial<OrderProps>, platform: string): Promise<OrderDocument> {
        if (!ordered.client) {
            throw new Error('Missing password');
        }
        // TODO : modifier l'ajout d'un livreur
        const deliveryman = await OrderService.getInstance().getDeliveryman("uber");
        const orderedModel = await OrderModel.create({
            platform,
            client: ordered.client,
            deliveryMan: deliveryman,
            //TODO : Modifier ajout address
            address: "242 Faubourg Saint-Antoine"
        });
        return orderedModel;
    }

    public async getDeliveryman(username: string | undefined): Promise<UserProps | null> {
        // TODO : modifier la recherche d'un livreur
        const deliveryMan = await UserModel.findOne({
            login: username
        });
        return deliveryMan ? deliveryMan._id as UserProps : null;
    }

    public async getClientIdFromDeliveryMan(userId: string | undefined): Promise<UserProps | null> {
        const ordered = await OrderModel.findOne({
            deliveryMan: userId,
        });
        return ordered ? ordered.client as UserProps : null;
    }

    public async getOrdered(clientId: string | undefined): Promise<OrderDisplay | null> {
        let orderedDisplay = new OrderDisplay();
        const ordered = await OrderModel.findOne({
            client: clientId,
        });
        if (ordered) {
            const clientActual = await UserModel.findOne({
                _id: ordered.client,
            });

            if (clientActual) {
                orderedDisplay.name = clientActual.name;
                orderedDisplay.lastName = clientActual.lastname;
                orderedDisplay.address = ordered.address;
                orderedDisplay.step = ordered.step;
                console.log(orderedDisplay);
            }
        }
        console.log(orderedDisplay);
        return orderedDisplay;
    }

}