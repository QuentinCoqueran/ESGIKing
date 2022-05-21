import express, {Request, Response, Router} from "express";
import {MenuModel} from "../models";
import {ProductService} from "../services";


export class MenusController{

    async createMenu(req: Request, res: Response){
        const platform = req.headers["user-agent"] || "Unknown";
        const isExists = await MenuModel.exists({name: req.body.name});
        if(!isExists){
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
            }catch (err) {
                console.log(err);
                res.status(500).end();
            }
        }else{
            console.log("Menu already exists");
            res.status(409).end();
        }
    }
    buildRoutes(): Router {
        const router = express.Router();
        router.post('/create', express.json(), this.createMenu.bind(this));
        return router;
    }
}