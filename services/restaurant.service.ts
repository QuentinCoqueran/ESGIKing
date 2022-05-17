import {
    MenuModel,
    MenuProps,
    ProductCategoryModel,
    ProductCategoryProps,
    ProductDocument,
    ProductModel,
    ProductProps
} from "../models";

import {RestaurantDocument, RestaurantModel, RestaurantProps} from "../models/restaurant.model";

export class RestaurantService{
    private static instance?: RestaurantService;

    public static getInstance(): RestaurantService {
        if (RestaurantService.instance === undefined) {
            RestaurantService.instance = new RestaurantService();
        }
        return RestaurantService.instance;
    }

    public async saveRestaurant(restaurant: Partial<RestaurantProps>, menuToAdd: Pick<MenuProps, 'name'>[], productToAdd: Pick<ProductProps, 'name'>[]): Promise<RestaurantDocument> {
        let model = await RestaurantModel.findOne({name: restaurant.name});
        if (model === null) {
            model = await RestaurantModel.create({
                name: restaurant.name,
                latitude: restaurant.latitude,
                longitude: restaurant.longitude
            });
        }else {
            return model;
        }
        for(let menu of menuToAdd){
            console.log("test1");
            let menuModel = await MenuModel.findOne({name: menu});
            console.log(menuModel);
            if (menuModel){
                model.menuList.push(menuModel._id);
                console.log("added");
            }else{
                console.log("errOr")
                throw new Error("Menu not found");
            }
        }
        for(let product of productToAdd){
            console.log("test2");
            let productModel = await ProductModel.findOne({name: product});
            if(productModel) {
                model.productList.push(productModel._id);
            }else {
                throw new Error("Product not found");
            }
        }
        await model.save();
        return model;
    }
}