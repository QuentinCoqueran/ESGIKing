import {RoleModel, UserModel, UserProps} from "../models";

import {OrderDocument, OrderModel, OrderProps} from "../models/order.model";
import {OrderDisplay} from "../models/OrderDisplay";
import {DeliveryManOrder} from "../models/DeliveryManOrder";

const request = require('request');

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

    public async updateDeliverymanFromOrder(deliverymans: DeliveryManOrder[], clientId: UserProps | string) {
        if (!deliverymans) {
            throw new Error('Pas de livreur');
        }
        for (let i = 0; i < deliverymans.length; i++) {
            //cherche si le deliveryman est banned
            let banned = await OrderModel.find({
                client: clientId,
                deliverymanBanned: {$in: deliverymans[i].id},
                step: 0,
            });
            if (banned.length == 0) {
                let sizeBanned = 0;
                //cherche si il y a deja eu des banned pour update ou insert
                let orderActual = await OrderModel.find({
                    client: clientId,
                    step: 0,
                });
                orderActual.forEach(function (index) {
                    sizeBanned = index.deliverymanBanned.length;
                });

                if (sizeBanned == 0) {
                    return {maj: false, idDeliveryman: deliverymans[i].id};
                } else {
                    const filter = {client: clientId, step: 0};
                    const update = {deliveryMan: deliverymans[i].id};
                    await OrderModel.findOneAndUpdate(filter, update, {
                        returnOriginal: true
                    }).exec();
                    return {maj: true, idDeliveryman: deliverymans[i].id};
                }
            }
        }
        //pas de nouveau livreur pour la commande
        const filter = {client: clientId, step: 0};
        const update = {deliveryMan: null, step: 3};
        await OrderModel.findOneAndUpdate(filter, update, {
            returnOriginal: true
        }).exec();
        return null;
    }

    public async subscribeOrdered(ordered: Partial<OrderProps>, platform: string): Promise<OrderDocument | null> {
        if (!ordered.client) {
            throw new Error('Missing data');
        }
        const deliverymans = await OrderService.getInstance().findDeliveryMan()
        let result = await OrderService.getInstance().updateDeliverymanFromOrder(deliverymans, ordered.client);
        if (result) {
            if (!result.maj) {
                return await OrderModel.create({
                    platform,
                    client: ordered.client,
                    deliveryMan: result.idDeliveryman,
                    //TODO : Modifier ajout address
                    address: "242 Faubourg Saint-Antoine"
                });
            } else {
                return null;
            }
        }
        return null;
    }

    async findDeliveryMan() {
        //get id deliveryman role in RoleModel
        const deliveryMan = await RoleModel.findOne({
            role: 'deliveryman'
        });
        //find all user with this idRole = deliveryman in collection User
        const users = await UserModel.find({
            role: deliveryMan?.id,
            longitude: {$ne: 0},
            latitude: {$ne: 0}
        });
        return await this.searchDeliveryman(users);
    }

    async searchDeliveryman(users: any) {
        let deliveryManArraySorted = [];

        //on boucle tous les livreurs
        for (let i = 0; i < users.length; i++) {
            let deliveryManOrder = new DeliveryManOrder();
            //on verifie que le livreur est libre
            let orders = await OrderModel.find({
                deliveryMan: users[i]._id,
                $and: [{step: {$ne: 0}}, {step: {$ne: 3}}]
            });
            if (orders.length == 0) {
                let url = "https://wxs.ign.fr/calcul/geoportail/itineraire/rest/1.0.0/route?resource=bdtopo-osrm&start=" + users[i].longitude + "%2C" + users[i].latitude + "&end=2.367776%2C48.852891&profile=car&optimization=fastest&geometryFormat=polyline&getSteps=false&getBbox=false&distanceUnit=kilometer&timeUnit=minute";
                // on lance notre requete get pour stocker la duration de chaque livreur
                const result = await httpGet(url)
                if (typeof result === "string") {
                    let jsonObject = JSON.parse(result);
                    deliveryManOrder.id = users[i]._id;
                    deliveryManOrder.duration = jsonObject.duration;
                    deliveryManArraySorted.push(deliveryManOrder);
                }
            }
        }

        // on trie par duration la plus courte
        deliveryManArraySorted.sort(function (a, b) {
            if (a.duration && b.duration) {
                return a.duration - b.duration;
            }
            return -1;
        });
        //return les livreurs à affecter à la commande
        return deliveryManArraySorted;


        function httpGet(url: string) {
            return new Promise((resolve, reject) => {
                request(url, (error: any, response: any, body: any) => {
                    if (error) reject(error);
                    if (response.statusCode != 200) {
                        reject('Invalid status code <' + response.statusCode + '>');
                    }
                    resolve(body);
                });
            });
        }
    }


    public async getClientIdFromDeliveryMan(userId: string | undefined): Promise<UserProps | null> {
        const ordered = await OrderModel.findOne({
            deliveryMan: userId,
            step: {$ne: 3}
        });
        return ordered ? ordered.client as UserProps : null;
    }

    public async updatePostDeliveryMan(userId: string | undefined, longitude: number | undefined, latitude: number | undefined) {
        if (!userId || !longitude || !latitude) {
            throw new Error('Missing data');
        }
        const filter = {_id: userId};
        const update = {longitude: longitude, latitude: latitude};
        const data = await UserModel.findOneAndUpdate(filter, update, {
            returnOriginal: false
        });
        return data;
    }

    public async getOrdered(clientId: string | undefined): Promise<OrderDisplay | null> {
        console.log(clientId)
        let orderDisplay = new OrderDisplay();
        const order = await OrderModel.findOne({
            client: clientId,
            $or: [{step: {$ne: 3}}, {deliveryMan: null}]
        });
        if (order) {
            const clientActual = await UserModel.findOne({
                _id: order.client,
            });
            const deliverymanActual = await UserModel.findOne({
                _id: order.deliveryMan,
            });
            if (clientActual && deliverymanActual) {
                orderDisplay.name = clientActual.name;
                orderDisplay.lastName = clientActual.lastname;
                orderDisplay.address = order.address;
                orderDisplay.deliverymanId = order.deliveryMan;
                orderDisplay.step = order.step;
                orderDisplay.latitudeDeliveryman = deliverymanActual.latitude;
                orderDisplay.longitudeDeliveryman = deliverymanActual.longitude;
            }
        }
        return orderDisplay;
    }

    public async updateStep(deliveryManId: string | undefined, newStep: number | undefined): Promise<OrderDocument | null> {
        const filter = {deliveryMan: deliveryManId, step: 0};
        const update = {step: newStep};
        return OrderModel.findOneAndUpdate(filter, update, {
            returnOriginal: false
        });
    }

    public async updateOrderDeliverymanBanned(deliveryManId: string, idClient: string): Promise<OrderDocument | null> {
        if (!deliveryManId || !idClient) {
            throw new Error('Missing data');
        }
        const filter = {deliveryMan: deliveryManId, step: 0};
        const update = {$push: {deliverymanBanned: deliveryManId}};
        const newOrder = await OrderModel.findOneAndUpdate(filter, update, {
            returnOriginal: false
        }).exec();
        let deliverymans = await OrderService.getInstance().findDeliveryMan()
        await OrderService.getInstance().updateDeliverymanFromOrder(deliverymans, idClient);
        return newOrder;
    }
}