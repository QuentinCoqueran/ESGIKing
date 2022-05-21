import {MenuModel, MenuProps, ProductModel, ProductProps} from "../models";

import {RestaurantDocument, RestaurantModel, RestaurantProps} from "../models";

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

    async deleteById(id: string): Promise<boolean> {
        const res = await RestaurantModel.deleteOne({_id: id}).exec();
        return res.deletedCount === 1;
    }

    async getById(id: string): Promise<RestaurantDocument | null> {
        return RestaurantModel.findById(id).exec();
    }

    async updateById(id: string, body: any) {
        const restaurant = await this.getById(id);
        if(!restaurant) {
            return null;
        }
        if(body.name !== undefined) {
            restaurant.name = body.name;
        }
        if(body.latitude !== undefined) {
            restaurant.latitude = body.latitude;
        }
        if(body.longitude !== undefined) {
            restaurant.longitude = body.longitude;
        }
        if(body.menuList !== undefined) {
            restaurant.menuList = body.menuList;
        }
        if(body.productList !== undefined) {
            restaurant.productList = body.productList;
        }
        return await restaurant.save();

    }
}