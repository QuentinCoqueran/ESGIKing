"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedService = void 0;
const models_1 = require("../models");
const ordered_model_1 = require("../models/ordered.model");
const OrderedDisplay_1 = require("../models/OrderedDisplay");
class OrderedService {
    static instance;
    static getInstance() {
        if (OrderedService.instance === undefined) {
            OrderedService.instance = new OrderedService();
        }
        return OrderedService.instance;
    }
    constructor() {
    }
    async subscribeOrdered(ordered, platform) {
        if (!ordered.client) {
            throw new Error('Missing password');
        }
        // TODO : modifier l'ajout d'un livreur
        const deliveryman = await OrderedService.getInstance().getDeliveryman("uber");
        const orderedModel = await ordered_model_1.OrderedModel.create({
            platform,
            client: ordered.client,
            deliveryMan: deliveryman,
            //TODO : Modifier ajout address
            address: "242 Faubourg Saint-Antoine"
        });
        return orderedModel;
    }
    async getDeliveryman(username) {
        // TODO : modifier la recherche d'un livreur
        const deliveryMan = await models_1.UserModel.findOne({
            login: username
        });
        return deliveryMan ? deliveryMan._id : null;
    }
    async getClientIdFromDeliveryMan(userId) {
        const ordered = await ordered_model_1.OrderedModel.findOne({
            deliveryMan: userId,
        });
        return ordered ? ordered.client : null;
    }
    async getOrdered(clientId) {
        let orderedDisplay = new OrderedDisplay_1.OrderedDisplay();
        const ordered = await ordered_model_1.OrderedModel.findOne({
            client: clientId,
        });
        if (ordered) {
            const clientActual = await models_1.UserModel.findOne({
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
exports.OrderedService = OrderedService;
//# sourceMappingURL=ordered.service.js.map