import {MenuModel, MenuProps, OfferDocument, OfferModel, ProductModel, ProductProps} from "../models";

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

    public async saveOffer(offer: Partial<OfferDocument>, menuToAdd: Pick<MenuProps, 'name'>[], productToAdd: Pick<ProductProps, 'name'>[]): Promise<OfferDocument> {
        let model = await OfferModel.findOne({name: offer.name});
        if(!model){
            model = await OfferModel.create({
                name: offer.name,
                discount: offer.discount
            });

            for (let menu of menuToAdd) {
                let menuModel = await MenuModel.findOne({name: menu.name});
                if(menuModel){
                    model.menuList.push(menuModel._id);
                }else{
                    throw new Error("Menu not found");
                }
            }

            for (let product of productToAdd) {
                let productModel = await ProductModel.findOne({name: product.name});
                if(productModel){
                    model.productList.push(productModel._id);
                }else{
                    throw new Error("Product not found");
                }
            }

        }else{
            throw new Error("Offer already exist");
        }
        return model;
    }



}