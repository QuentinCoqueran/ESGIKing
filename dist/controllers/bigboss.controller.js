"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigbossController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const models_1 = require("../models");
class BigbossController {
    async bigboss(req, res) {
        res.json(req.user);
    }
    async addRestaurant(req, res) {
        console.log("log");
        const platform = req.headers["user-agent"] || "Unknown";
        const isExists = await models_1.RestaurantModel.findOne({ latitude: req.body.latitude, longitude: req.body.longitude });
        if (!isExists) {
            try {
                const restaurant = await services_1.RestaurantService.getInstance().saveRestaurant({
                    name: req.body.name,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                }, req.body.menuList, req.body.productList);
                res.json(restaurant);
            }
            catch (err) {
                res.status(400).end();
            }
        }
        else {
            console.log("This restaurant already exists");
            res.status(409).end();
        }
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.post('/addRestaurant', express_1.default.json(), this.addRestaurant.bind(this));
        return router;
    }
}
exports.BigbossController = BigbossController;
//# sourceMappingURL=bigboss.controller.js.map