import {
    MenuModel,
    MenuProps,
    OfferDocument,
    OfferModel, OfferProps,
    ProductModel,
    ProductProps,
    RestaurantModel,
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

    public async saveOffer(offer: Partial<OfferProps>, menuToAdd?: Pick<MenuProps, 'name'>[], productToAdd?: Pick<ProductProps, 'name'>[]): Promise<OfferDocument> {
        console.log("test")
        console.log(offer);

        let restaurant = await RestaurantModel.findOne({name: offer.restaurant});
        if (restaurant) {
            console.log("restaurant found")
        } else {
            console.log("restaurant not found")
            throw new Error("Restaurant not found");
        }

        let model = await OfferModel.findOne({name: offer.name, restaurant: restaurant._id});
        if (!model) {
            model = await OfferModel.create({
                name: offer.name,
                discount: offer.discount,
                restaurant: restaurant._id
            });
            console.log("model created")
        } else {
            throw new Error("Offer already exist");
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

    async deleteOffer(id: string): Promise<OfferDocument> {
        let offer = await OfferModel.findById(id).exec();
        if(!offer){
            throw new Error("Offer not found");
        }else{
            return await offer.remove();
        }
    }


}