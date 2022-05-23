import {MenuModel, MenuProps, OfferModel, ProductModel, ProductProps, RoleModel, UserModel, UserProps} from "../models";

import {RestaurantDocument, RestaurantModel, RestaurantProps} from "../models";
import {AllProductsName} from "../models/AllProductsName";
import {OrderDisplay} from "../models/OrderDisplay";
import {OfferDocument, OfferModel, OfferProps} from "../models/offer.model";

export class RestaurantService {
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

    public async saveRestaurant(restaurant: Partial<RestaurantProps>, adminToAdd:Pick<UserProps, '_id'>[], menuToAdd: Pick<MenuProps, 'name'>[], productToAdd: Pick<ProductProps, 'name'>[]): Promise<RestaurantDocument> {
        let model = await RestaurantModel.findOne({latitude: restaurant.latitude, longitude: restaurant.longitude});

        if (model === null) {
                model = await RestaurantModel.create({
                    name: restaurant.name,
                    latitude: restaurant.latitude,
                    longitude: restaurant.longitude,
                });

        }else {
            return model;
        }

        console.log(adminToAdd)

        for (let id of adminToAdd) {
            console.log("ITERE")
            let user = await UserModel.findById(id);
            if (user) {
                let userRole = await RoleModel.findOne({_id: user.role});
                if (userRole && userRole.role === "admin") {
                    model.adminList.push(user._id);
                }
            } else {
                throw new Error("User not found");
            }
        }

        for (let menu of menuToAdd) {
            console.log("test1");
            let menuModel = await MenuModel.findOne({name: menu});
            console.log(menuModel);
            if (menuModel) {
                model.menuList.push(menuModel._id);
                console.log("added");
            } else {
                console.log("errOr")
                throw new Error("Menu not found");
            }
        }
        for (let product of productToAdd) {
            console.log("test2");
            let productModel = await ProductModel.findOne({name: product});
            if (productModel) {
                model.productList.push(productModel._id);
            } else {
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
                let menu = await MenuModel.findOne({name: n});
                if (menu) {
                    restaurant.menuList.push(menu._id);
                } else {
                    throw new Error("Menu not found");
                }
            }
        }
        if (body.productList !== undefined) {
            restaurant.productList.splice(0, restaurant.productList.length);
            for (let name of body.productList) {
                let product = await ProductModel.findOne({name: name});
                if (product) {
                    restaurant.productList.push(product._id);
                } else {
                    throw new Error("Product named " + name + " not found");
                }
            }
        }
        if (body.offerList !== undefined) {
            restaurant.offerList.splice(0, restaurant.offerList.length);
            for(let offerName of body.offerList) {
                let offerObj = await OfferModel.findOne({name: offerName, restaurant: restaurant._id});
                if(offerObj) {
                    restaurant.offerList.push(offerObj._id);
                }else {
                    throw new Error("Offer named " + offerObj + " not found");
                }
            }
        }
        if(body.admin !== undefined) {

            for(let name of body.admin) {
                let admin = await UserModel.findOne({_id: name});
                if(admin) {

                    let userRole = await RoleModel.findOne({_id: admin.role});

                    restaurant.adminList.push(admin._id);
                }else {
                    throw new Error("User named " + name + " not found");
                }
            }

        }
        return await restaurant.save();

    }

    async transformIdIntoName(restaurant: any) {
        let allProducts = new AllProductsName();
        for (let product of restaurant.productList) {
            let productModel = await ProductModel.findOne({_id: product});
            if (productModel) {
                let items = {
                    name: productModel.name,
                    price: productModel.price,
                    urlImg: productModel.imageUrl.trim(),
                    description: productModel.description,
                    idProduct: productModel._id
                }
                allProducts.products.push(items)

            } else {
                throw new Error("Product not found");
            }
        }
        for (let menu of restaurant.menuList) {
            let menuModel = await MenuModel.findOne({_id: menu});
            if (menuModel) {
                let items = {
                    name: menuModel.name,
                    price: menuModel.price,
                    urlImg: menuModel.imageUrl.trim(),
                    description: menuModel.description,
                    menuId: menuModel._id
                }
                allProducts.menus?.push(items);

            } else {
                throw new Error("Product not found");
            }
        }
        return allProducts;
    }

    async findOffersByRestaurant(param: string): Promise<OfferProps | null> {
        const offers = await OfferModel.find({
            restaurant: param
        });
        return offers ? offers.discount as OfferProps : null;
    }
}