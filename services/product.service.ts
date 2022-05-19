import {ProductCategoryDocument, ProductCategoryModel, ProductCategoryProps, ProductDocument, ProductModel, ProductProps} from "../models";

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

    public async deleteById(toDelete: string): Promise<boolean> {
        const productToDelete = ProductModel.deleteOne({_id: toDelete});
        return true;
    }
}