import express, {Request, Response, Router} from "express";
import {MenuModel, ProductProps} from "../models";
import {MenuService, ProductService} from "../services";


export class MenusController{

    async createMenu(req: Request, res: Response){
        const platform = req.headers["user-agent"] || "Unknown";
        const isExists = await MenuModel.exists({name: req.body.name});
        if(!isExists){
            try{
                const menu = await MenuService.getInstance().saveMenu({
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    imageUrl: req.body.imageUrl,
                    active: req.body.active,
                    }, req.body.products
                );
            }catch (err) {
                console.log(err);
                res.status(400).end();
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