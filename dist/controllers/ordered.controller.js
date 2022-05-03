"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedController = void 0;
const express_1 = __importDefault(require("express"));
const ordered_service_1 = require("../services/ordered.service");
const middlewares_1 = require("../middlewares");
class OrderedController {
    async createOrdered(req, res) {
        const platform = req.headers['user-agent'] || "Unknown";
        try {
            const ordered = await ordered_service_1.OrderedService.getInstance().subscribeOrdered({
                client: req.body.clientId,
            }, platform);
            res.json(ordered);
        }
        catch (err) {
            console.log(err);
            res.status(400).end();
        }
    }
    async setClientIdFromDeliveryMan(req, res) {
        const orderedClient = await ordered_service_1.OrderedService.getInstance().getClientIdFromDeliveryMan(req.user?._id);
        res.json(orderedClient);
    }
    async setOrderData(req, res) {
        const ordered = await ordered_service_1.OrderedService.getInstance().getOrdered(req.body.clientId);
        res.json(ordered);
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.post('/create-ordered', express_1.default.json(), this.createOrdered.bind(this));
        router.get('/client-id', (0, middlewares_1.checkUserConnected)(), this.setClientIdFromDeliveryMan.bind(this));
        router.post('/data-ordered', express_1.default.json(), this.setOrderData.bind(this));
        return router;
    }
}
exports.OrderedController = OrderedController;
//# sourceMappingURL=ordered.controller.js.map