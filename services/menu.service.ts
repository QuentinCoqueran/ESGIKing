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

    async updateById(id: string, body: any) {
        const menu = await MenuModel.findById(id).exec();
        if(!menu) {
            return null;
        }
        if(body.name !== undefined) {
            menu.name = body.name;
        }
        if(body.description !== undefined) {
            menu.description = body.description;
        }
        if(body.price !== undefined) {
            menu.price = body.price;
        }
        if(body.products !== undefined) {
            menu.products.splice(0, menu.products.length);
            for (let product of body.products) {
                let productModel = await ProductModel.findOne({name: product});
                if(productModel) {
                    menu.products.push(productModel._id);
                }else {
                    throw new Error("Product not found");
                }
            }
        }
        if(body.imageUrl !== undefined) {
            menu.imageUrl = body.imageUrl;
        }
        if(body.active !== undefined){
            menu.active = body.active;
        }
        return await menu.save();
    }

    public async deleteById(toDelete: string): Promise<boolean> {
        const menuToDelete = MenuModel.deleteOne({_id: toDelete}).exec();
        return true;
    }
}