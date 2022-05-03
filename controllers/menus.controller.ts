import express, {Request, Response, Router} from "express";
import {MenuModel} from "../models";

export class MenusController{

    async createMenu(req: Request, res: Response){
        const platform = req.headers["user-agent"] || "Unknown";
        const isExists = await MenuModel.exists({name: req.body.name});
        if(!isExists){
            try{

            }catch (err) {
                console.log(err);
                res.status(500).end();
            }
        }else{

        }
    }
    buildRoutes(): Router {
        const router = express.Router();
        router.get('/all', express.json(), this.getAll.bind(this));
        router.get('/:id', express.json(), this.getOne.bind(this));
        router.post('/create', express.json(), this.createProduct.bind(this));
        return router;
    }
}