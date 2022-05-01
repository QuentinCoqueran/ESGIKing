"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const services_1 = require("../services");
class ProductsController {
    async createProduct(req, res) {
        const platform = req.headers["user-agent"] || "Unknown";
        try {
            const product = await services_1.ProductService.getInstance().saveProduct({
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                active: req.body.active
            }, {
                category: req.body.category,
            }, platform);
            res.json(product);
        }
        catch (err) {
            console.log(err);
            res.status(400).end();
        }
    }
    async getAll(req, res) {
        const products = await models_1.ProductModel.find();
        console.log(products);
        res.json(products);
    }
    async getOne(req, res) {
        const product = await models_1.ProductModel.findById(req.params['id']);
        console.log(product);
        res.json(product);
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.get('/all', express_1.default.json(), this.getAll.bind(this));
        router.get('/:id', express_1.default.json(), this.getOne.bind(this));
        router.post('/create', express_1.default.json(), this.createProduct.bind(this));
        return router;
    }
}
exports.ProductsController = ProductsController;
//# sourceMappingURL=products.controller.js.map