import express, {Request, Response, Router} from "express";
import {checkUserConnected} from "../middlewares";
import {RestaurantService} from "../services";

export class BigbossController{

    async bigboss(req: Request, res: Response){
        res.json(req.user);
    }

    async addRestaurant(req: Request, res: Response){
        const platform = req.headers["user-agent"] || "Unknown";
        try {
            const restaurant = await RestaurantService.getInstance().saveRestaurant({
                name: req.body.name,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                menuList: req.body.menuList,
                productList: req.body.productList
            }, platform);
            res.json(restaurant);
        }catch (err){
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/addRestaurant',express.json, this.addRestaurant.bind(this));
        return router;
    }

}