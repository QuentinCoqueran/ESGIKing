import express, {Request, Response, Router} from "express";
import {MenuModel, ProductModel, ProductProps} from "../models";
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
                res.json(menu);
            }catch (err) {
                console.log(err);
                res.status(400).end();
            }
        }else{
            console.log("Menu already exists");
            res.status(409).end();
        }
    }

    async getAll(req: Request, res: Response){
        const menus = await MenuModel.find();
        console.log(menus);
        res.json(menus);
    }

    async getOne(req: Request, res: Response){
        const menu = await MenuModel.findById(req.params['id']);
        console.log(menu);
        res.json(menu);
    }

    async deleteOne(req: Request, res: Response){
        console.log()
        const isExists = await MenuModel.exists({ _id: req.params.id });
        if(isExists) {
            try{
                const todelete = await ProductService.getInstance().deleteById(req.params.id)
                console.log("test");
                res.status(204).end();
            }catch(err){
                console.log(err);
                res.status(400).end();
            }
        }else{
            console.log("This menu id doesn't exists")
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
        router.post('/create', express.json(), this.createMenu.bind(this));
        router.get('/all', express.json(), this.getAll.bind(this));
        router.get('/:id', express.json(), this.getOne.bind(this));
        router.delete('/delete/:id', this.deleteOne.bind(this));
        router.patch('edit/:id', this.editOne.bind(this));
        return router;
    }
}