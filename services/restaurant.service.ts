import {MenuModel, MenuProps, ProductModel, ProductProps, RoleModel, UserModel, UserProps} from "../models";

import {RestaurantDocument, RestaurantModel, RestaurantProps} from "../models";

export class RestaurantService{
    private static instance?: RestaurantService;

    public static getInstance(): RestaurantService {
        if (RestaurantService.instance === undefined) {
            RestaurantService.instance = new RestaurantService();
        }
        return RestaurantService.instance;
    }

    async getAllRestaurants(): Promise<RestaurantDocument[]> {
        return RestaurantModel.find().exec();
    }

    public async saveRestaurant(restaurant: Partial<RestaurantProps>, menuToAdd: Pick<MenuProps, 'name'>[], productToAdd: Pick<ProductProps, 'name'>[]): Promise<RestaurantDocument> {
        let model = await RestaurantModel.findOne({latitude: restaurant.latitude, longitude: restaurant.longitude});

        if (model === null) {

            if(restaurant.admin){
                let admin = await UserModel.findOne({_id: restaurant.admin});
                if(admin) {

                    let userRole = await RoleModel.findOne({_id: admin.role});
                    if(userRole) {
                        console.log(userRole.role);
                        if(userRole.role === "admin") {

                            let adminRestaurant = await RestaurantModel.findOne({admin: admin._id});
                            if(!adminRestaurant) {
                                model = await RestaurantModel.create({
                                    name: restaurant.name,
                                    latitude: restaurant.latitude,
                                    longitude: restaurant.longitude,
                                    admin: restaurant.admin
                                });
                            }else {
                                throw new Error("This admin is already assign to a restaurant");
                            }
                        }else {
                            throw new Error("User is not an admin");
                        }
                    }else {
                        throw new Error("Role not found");
                    }
                }else{
                    throw new Error("User admin not found");
                }
            }else{
                throw new Error("Admin field not found");
            }
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
        console.log(body);
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
            restaurant.menuList.splice(0, restaurant.menuList.length);
            for (let n of body.menuList) {
                let menu = await MenuModel.findOne({name: n});
                if (menu) {
                    restaurant.menuList.push(menu._id);
                } else {
                    throw new Error("Menu not found");
                }
            }
        }
        if(body.productList !== undefined) {
            restaurant.productList.splice(0, restaurant.productList.length);
            for(let name of body.productList) {
                let product = await ProductModel.findOne({name: name});
                if(product) {
                    restaurant.productList.push(product._id);
                }else {
                    throw new Error("Product named " + name + " not found");
                }
            }
        }
        if(body.admin !== undefined) {
            console.log(body.admin);
            let admin = await UserModel.findById(body.admin);
            console.log(admin);
            if(admin) {
                let userRole = await RoleModel.findOne({_id: admin.role});
                console.log(userRole);
                if(userRole) {
                    if(userRole.role === "admin") {
                        console.log("is admin");
                        restaurant.admin = body.admin;
                    }else {
                        console.log("is not admin");
                        throw new Error("User is not an admin");
                    }
                }else {
                    throw new Error("Role not found");
                }
            }else {
                throw new Error("User not found");
            }
        }
        return await restaurant.save();

    }
}