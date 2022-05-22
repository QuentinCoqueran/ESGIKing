import {
    MenuModel,
    MenuProps,
    OfferDocument,
    OfferModel, OfferProps,
    ProductModel,
    ProductProps,
    RestaurantModel,
    RestaurantProps
} from "../models";

export class OfferService {
    private static instance?: OfferService;

    public static getInstance(): OfferService {
        if (OfferService.instance === undefined) {
            OfferService.instance = new OfferService();
        }
        return OfferService.instance;
    }

    async getAllOffers(): Promise<OfferDocument[]> {
        return OfferModel.find().exec();
    }

    async getOfferById(id: string): Promise<OfferDocument> {
        let offer = await OfferModel.findById(id).exec();
        if(!offer){
            throw new Error("Offer not found");
        }else{
            return offer;
        }
    }

    public async saveOffer(offer: Partial<OfferProps>, restaurantToAdd: Pick<RestaurantProps, "name">, menuToAdd?: Pick<MenuProps, 'name'>[], productToAdd?: Pick<ProductProps, 'name'>[]): Promise<OfferDocument> {
        console.log("saveOffer")
        let model = await OfferModel.findOne({name: offer.name, restaurant: offer.restaurant});
        if (!model) {
            console.log("model null -> create")
            model = await OfferModel.create({
                name: offer.name,
                discount: offer.discount,
            });
            console.log("model created")
        } else {
            throw new Error("Offer already exist");
        }

        let restaurant = await RestaurantModel.findOne({name: restaurantToAdd});
        if (restaurant) {
            console.log("restaurant found")
            model.restaurant = restaurant._id;
        } else {
            console.log("restaurant not found")
            throw new Error("Restaurant not found");
        }


        if (menuToAdd) {
            for (let menu of menuToAdd) {
                let menuModel = await MenuModel.findOne({name: menu});
                if (menuModel) {
                    console.log("menu found")
                    model.menuList.push(menuModel._id);
                } else {
                    throw new Error("Menu not found");
                }
            }
        }
        if (productToAdd) {
            for (let product of productToAdd) {
                let productModel = await ProductModel.findOne({name: product});
                if (productModel) {
                    console.log("product found")
                    model.productList.push(productModel._id);
                } else {
                    throw new Error("Product not found");
                }
            }
        }
        return await model.save();

    }


}