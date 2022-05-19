import {MenuDocument, MenuModel, MenuProps, ProductDocument, ProductModel, ProductProps} from "../models";


export class MenuService {

    private static instance?: MenuService;

    public static getInstance(): MenuService {
        if (MenuService.instance === undefined) {
            MenuService.instance = new MenuService();
        }
        return MenuService.instance;
    }
    constructor() { }

    public async saveMenu(menu: Partial<MenuProps>, info: Pick<ProductProps, 'name'>[]): Promise<MenuDocument> {

        let model = await MenuModel.findOne({name: menu.name,});
        if (model === null) {
            model = await MenuModel.create({
                name: menu.name,
                description: menu.description,
                price: menu.price,
                imageUrl: menu.imageUrl,
                active: menu.active,
            });
        }else {
            return model;
        }
        for (let product of info) {
            let productModel = await ProductModel.findOne({name: product});
            if(productModel) {
                model.products.push(productModel._id);
            }else {
                throw new Error("Product not found");
            }
        }
        await model.save();
        return model;
    }
    public async deleteById(toDelete: string): Promise<boolean> {
        const menuToDelete = MenuModel.deleteOne({_id: toDelete});
        return true;
    }
}