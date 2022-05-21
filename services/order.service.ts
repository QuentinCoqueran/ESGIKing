import {OrderDocument, OrderModel, OrderProps, UserModel, UserProps} from "../models";
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
        return await OrderModel.create({
            platform,
            client: ordered.client,
            deliveryMan: deliveryman,
            //TODO : Modifier ajout address
            address: "242 Faubourg Saint-Antoine"
        });
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
        let orderDisplay = new OrderDisplay();
        const order = await OrderModel.findOne({
            client: clientId,
        });
        if (order) {
            const clientActual = await UserModel.findOne({
                _id: order.client,
            });

            if (clientActual) {
                orderDisplay.name = clientActual.name;
                orderDisplay.lastName = clientActual.lastname;
                orderDisplay.address = order.address;
                orderDisplay.step = order.step;
                console.log(orderDisplay);
            }
        }
        console.log(orderDisplay);
        return orderDisplay;
    }

}