"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantService = void 0;
const models_1 = require("../models");
const restaurant_model_1 = require("../models/restaurant.model");
class RestaurantService {
    static instance;
    static getInstance() {
        if (RestaurantService.instance === undefined) {
            RestaurantService.instance = new RestaurantService();
        }
        return RestaurantService.instance;
    }
    async saveRestaurant(restaurant, menuToAdd, productToAdd) {
        let model = await restaurant_model_1.RestaurantModel.findOne({ name: restaurant.name });
        if (model === null) {
            model = await restaurant_model_1.RestaurantModel.create({
                name: restaurant.name,
                latitude: restaurant.latitude,
                longitude: restaurant.longitude
            });
        }
        else {
            return model;
        }
        for (let menu of menuToAdd) {
            let menuModel = await models_1.MenuModel.findOne({ name: menu.name });
            if (menuModel) {
                model.menuList.push(menuModel._id);
            }
            else {
                throw new Error("Menu not found");
            }
        }
        for (let product of productToAdd) {
            let productModel = await models_1.ProductModel.findOne({ name: product.name });
            if (productModel) {
                model.productList.push(productModel._id);
            }
            else {
                throw new Error("Product not found");
            }
        }
        await model.save();
        return model;
    }
}
exports.RestaurantService = RestaurantService;
//# sourceMappingURL=restaurant.service.js.map