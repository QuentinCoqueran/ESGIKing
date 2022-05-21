"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigbossController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const models_1 = require("../models");
const admin_service_1 = require("../services/admin.service");
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
    async deleteRestaurant(req, res) {
        const platform = req.headers["user-agent"] || "Unknown";
        try {
            console.log("test");
            const restaurant = await services_1.RestaurantService.getInstance().deleteById(req.params.id);
            if (restaurant) {
                res.status(204).end();
            }
            else {
                res.status(404).end();
            }
        }
        catch (err) {
            res.status(400).end();
        }
    }
    async updateRestaurant(req, res) {
        const platform = req.headers["user-agent"] || "Unknown";
        try {
            const restaurant = await services_1.RestaurantService.getInstance().updateById(req.params.id, req.body);
            if (restaurant) {
                res.json(restaurant);
            }
            else {
                res.status(404).end();
            }
        }
        catch (err) {
            res.status(400).end();
        }
    }
    async addAdmin(req, res) {
        const plateform = req.headers["user-agent"] || "Unknown";
        const isExists = await models_1.UserModel.findOne({});
        if (isExists) {
            try {
                const admin = await admin_service_1.AdminService.getInstance().setRoleAdmin(req.params.id);
                if (admin) {
                    res.json(admin);
                }
                else {
                    res.status(404).end();
                    // go to subscribeUser
                }
            }
            catch (err) {
                console.log(err);
                res.status(400).end();
            }
        }
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.post('/addRestaurant', express_1.default.json(), this.addRestaurant.bind(this));
        router.delete('/deleteRestaurant/:id', this.deleteRestaurant.bind(this));
        router.put('/updateRestaurant/:id', express_1.default.json(), this.updateRestaurant.bind(this));
        router.put('/addAdmin/:id', express_1.default.json(), this.addAdmin.bind(this));
        return router;
    }
}
exports.BigbossController = BigbossController;
//# sourceMappingURL=bigboss.controller.js.map