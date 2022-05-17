"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantService = void 0;
const restaurant_model_1 = require("../models/restaurant.model");
class RestaurantService {
    static instance;
    static getInstance() {
        if (RestaurantService.instance === undefined) {
            RestaurantService.instance = new RestaurantService();
        }
        return RestaurantService.instance;
    }
    async saveRestaurant(restaurant, platform) {
        let model = await restaurant_model_1.RestaurantModel.findOne({ name: restaurant.name });
        if (model === null) {
            model = await restaurant_model_1.RestaurantModel.create({
                name: restaurant.name,
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
                menuList: restaurant.menuList,
                productList: restaurant.productList
            });
        }
        else {
            return model;
        }
        await model.save();
        return model;
    }
}
exports.RestaurantService = RestaurantService;
//# sourceMappingURL=restaurant.service.js.map