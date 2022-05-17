import {ProductCategoryModel, ProductCategoryProps, ProductDocument, ProductModel, ProductProps} from "../models";
import {RestaurantDocument, RestaurantModel, RestaurantProps} from "../models/restaurant.model";

export class RestaurantService{
    private static instance?: RestaurantService;

    public static getInstance(): RestaurantService {
        if (RestaurantService.instance === undefined) {
            RestaurantService.instance = new RestaurantService();
        }
        return RestaurantService.instance;
    }

    public async saveRestaurant(restaurant: Partial<RestaurantProps>, platform: string): Promise<RestaurantDocument> {
        let model = await RestaurantModel.findOne({name: restaurant.name});
        if (model === null) {
            model = await RestaurantModel.create({
                name: restaurant.name,
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
                menuList: restaurant.menuList,
                productList: restaurant.productList
            });
        }else {
            return model;
        }
        await model.save();
        return model;
    }

}