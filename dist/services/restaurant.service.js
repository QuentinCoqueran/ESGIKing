"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantService = void 0;
const models_1 = require("../models");
const models_2 = require("../models");
class RestaurantService {
    static instance;
    static getInstance() {
        if (RestaurantService.instance === undefined) {
            RestaurantService.instance = new RestaurantService();
        }
        return RestaurantService.instance;
    }
    async saveRestaurant(restaurant, menuToAdd, productToAdd) {
        let model = await models_2.RestaurantModel.findOne({ name: restaurant.name });
        if (model === null) {
            model = await models_2.RestaurantModel.create({
                name: restaurant.name,
                latitude: restaurant.latitude,
                longitude: restaurant.longitude
            });
        }
        else {
            return model;
        }
        for (let menu of menuToAdd) {
            console.log("test1");
            let menuModel = await models_1.MenuModel.findOne({ name: menu });
            console.log(menuModel);
            if (menuModel) {
                model.menuList.push(menuModel._id);
                console.log("added");
            }
            else {
                console.log("errOr");
                throw new Error("Menu not found");
            }
        }
        for (let product of productToAdd) {
            console.log("test2");
            let productModel = await models_1.ProductModel.findOne({ name: product });
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
    async deleteById(id) {
        const res = await models_2.RestaurantModel.deleteOne({ _id: id }).exec();
        return res.deletedCount === 1;
    }
    async getById(id) {
        return models_2.RestaurantModel.findById(id).exec();
    }
    async updateById(id, body) {
        const restaurant = await this.getById(id);
        if (!restaurant) {
            return null;
        }
        if (body.name !== undefined) {
            restaurant.name = body.name;
        }
        if (body.latitude !== undefined) {
            restaurant.latitude = body.latitude;
        }
        if (body.longitude !== undefined) {
            restaurant.longitude = body.longitude;
        }
        if (body.menuList !== undefined) {
            restaurant.menuList.splice(0, restaurant.menuList.length);
            for (let n of body.menuList) {
                let menu = await models_1.MenuModel.findOne({ name: n });
                if (menu) {
                    restaurant.menuList.push(menu._id);
                }
                else {
                    throw new Error("Menu not found");
                }
            }
        }
        if (body.productList !== undefined) {
            restaurant.productList.splice(0, restaurant.productList.length);
            for (let name of body.productList) {
                let product = await models_1.ProductModel.findOne({ name: name });
                if (product) {
                    restaurant.productList.push(product._id);
                }
                else {
                    throw new Error("Product named " + name + " not found");
                }
            }
        }
        return await restaurant.save();
    }
}
exports.RestaurantService = RestaurantService;
//# sourceMappingURL=restaurant.service.js.map