import {UserModel, UserProps} from "../models";

import {OrderedDocument, OrderedModel, OrderedProps} from "../models/ordered.model";
import {OrderedDisplay} from "../models/OrderedDisplay";

export class OrderedService {

    private static instance?: OrderedService;

    public static getInstance(): OrderedService {
        if (OrderedService.instance === undefined) {
            OrderedService.instance = new OrderedService();
        }
        return OrderedService.instance;
    }

    private constructor() {
    }

    public async subscribeOrdered(ordered: Partial<OrderedProps>, platform: string): Promise<OrderedDocument> {
        if (!ordered.client) {
            throw new Error('Missing password');
        }
        // TODO : modifier l'ajout d'un livreur
        const deliveryman = await OrderedService.getInstance().getDeliveryman("uber");
        const orderedModel = await OrderedModel.create({
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
        const ordered = await OrderedModel.findOne({
            deliveryMan: userId,
        });
        return ordered ? ordered.client as UserProps : null;
    }

    public async getOrdered(clientId: string | undefined): Promise<OrderedDisplay | null> {
        let orderedDisplay = new OrderedDisplay();
        const ordered = await OrderedModel.findOne({
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
        return orderedDisplay;
    }

}