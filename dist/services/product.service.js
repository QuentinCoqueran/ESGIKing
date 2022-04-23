"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const models_1 = require("../models");
class ProductService {
    static instance;
    static getInstance() {
        if (ProductService.instance === undefined) {
            ProductService.instance = new ProductService();
        }
        return ProductService.instance;
    }
    constructor() {
    }
    async saveProduct(product, info, platform) {
        let model = await models_1.ProductModel.findOne({ name: product.name, });
        if (model === null) {
            model = await models_1.ProductModel.create({
                name: product.name,
                price: product.price,
                description: product.description,
                imageUrl: product.imageUrl,
                active: product.active,
            });
        }
        else {
            return model;
        }
        let categoryToAdd = await models_1.ProductCategoryModel.findOne({ category: info.category });
        if (categoryToAdd === null) {
            categoryToAdd = await models_1.ProductCategoryModel.create({
                platform,
                category: info.category,
                active: true,
            });
        }
        else {
            model.category = categoryToAdd?._id;
        }
        await model.save();
        return model;
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map