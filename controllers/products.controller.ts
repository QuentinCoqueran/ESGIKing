import express, {Request, Response, Router} from "express";
import {ProductModel} from "../models";
import {checkUserConnected} from "../middlewares";
import {ProductService} from "../services";


export class ProductsController{

    async createProduct(req: Request, res: Response){
        const platform = req.headers["user-agent"] || "Unknown";
        try{
            const product = await ProductService.getInstance().saveProduct({
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                active: req.body.active
            },
            {
                category: req.body.category,
            }, platform);
            res.json(product);
        }catch (err){
            console.log(err);
            res.status(400).end();
        }
    }

    async getAll(req: Request, res: Response){
        const products = await ProductModel.find();
        console.log(products);
        res.json(products);
    }

    async getOne(req: Request, res: Response){
        const product = await ProductModel.findById(req.params['id']);
        console.log(product);
        res.json(product);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/all', express.json(), this.getAll.bind(this));
        router.get('/:id', express.json(), this.getOne.bind(this));
        router.post('/create', express.json(), this.createProduct.bind(this));
        return router;
    }
}