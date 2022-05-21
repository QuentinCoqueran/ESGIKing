import {
    MenuModel,
    ProductCategoryDocument,
    ProductCategoryModel,
    ProductCategoryProps,
    ProductDocument,
    ProductModel,
    ProductProps
} from "../models";

export class ProductService {

    private static instance?: ProductService;

    public static getInstance(): ProductService {
        if (ProductService.instance === undefined) {
            ProductService.instance = new ProductService();
        }
        return ProductService.instance;
    }

    private constructor() {
    }

    public async saveProduct(product: Partial<ProductProps>, info: Pick<ProductCategoryProps, 'category'>, platform: string): Promise<ProductDocument> {
        let model = await ProductModel.findOne({name: product.name,});
        if (model === null) {
            model = await ProductModel.create({
                name: product.name,
                price: product.price,
                description: product.description,
                imageUrl: product.imageUrl,
                active: product.active,
            });
        } else {
            return model;
        }
        let categoryToAdd = await ProductCategoryModel.findOne({category: info.category});
        if (categoryToAdd === null) {
            categoryToAdd = await ProductCategoryModel.create({
                platform,
                category: info.category,
                active: true,
            });
        } else {
            model.category = categoryToAdd?._id;
        }
        await model.save();
        return model;
    }

    async updateById(id: string, body: any) {
        const product = await ProductModel.findById(id).exec();
        if(!product) {
            return null;
        }
        if(body.name !== undefined) {
            product.name = body.name;
        }
        if(body.description !== undefined) {
            product.description = body.description;
        }
        if(body.price !== undefined) {
            product.price = body.price;
        }
        if(body.category !== undefined) {
           let categoryToAdd = await ProductCategoryModel.findOne({category: body.category});
            if (categoryToAdd === null) {
                categoryToAdd = await ProductCategoryModel.create({
                    category: body.category,
                    active: true,
                });
            } else {
                product.category = categoryToAdd?._id;
            }
        }
        if(body.imageUrl !== undefined) {
            product.imageUrl = body.imageUrl;
        }
        if(body.active !== undefined){
            product.active = body.active;
        }
        return await product.save();
    }

    public async deleteById(toDelete: string): Promise<boolean> {
        const productToDelete = ProductModel.deleteOne({_id: toDelete});
        return true;
    }
}