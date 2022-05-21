import express, {Request, Response, Router} from "express";
import {ProductModel} from "../models";
import {checkUserConnected} from "../middlewares";
import {ProductService} from "../services";

export class ProductsController{

    async createProduct(req: Request, res: Response){
        const platform = req.headers["user-agent"] || "Unknown";
        const isExists = await ProductModel.exists({ name: req.body.name });
        if(!isExists) {
            try {
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
            } catch (err) {
                console.log(err);
                res.status(400).end();
            }
        } else {
            console.log("Product already exists");
            res.status(409).end();
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

    async deleteOne(req: Request, res: Response){
        const isExists = await ProductModel.exists({ _id: req.params.id });
        if(isExists) {
            try{
                const todelete = await ProductService.getInstance().deleteById(req.params.id)
                res.status(204).end();
            }catch(err){
                console.log(err);
                res.status(400).end();
            }
        }else{
            console.log("This product id doesn't exists")
            res.sendStatus(404).end();
        }
    }

    async editOne(req: Request, res : Response){
        const isExists = await ProductModel.exists({ _id: req.params.id });
        if(isExists) {

        }else {
            console.log("This product id doesn't exists")
            res.sendStatus(404).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/all', express.json(), this.getAll.bind(this));
        router.get('/:id', express.json(), this.getOne.bind(this));
        router.delete('/delete/:id', this.deleteOne.bind(this));
        router.post('/create', express.json(), this.createProduct.bind(this));
        router.patch('edit/:id', this.editOne.bind(this));
        return router;
    }
}