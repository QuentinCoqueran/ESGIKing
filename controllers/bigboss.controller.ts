import express, {Request, Response, Router} from "express";
import {checkUserConnected} from "../middlewares";
import {RestaurantService} from "../services";
import {RestaurantModel} from "../models";

export class BigbossController{

    async bigboss(req: Request, res: Response){
        res.json(req.user);
    }

    async addRestaurant(req: Request, res: Response){
        console.log("log");
        const platform = req.headers["user-agent"] || "Unknown";

        const isExists = await RestaurantModel.findOne({latitude: req.body.latitude, longitude: req.body.longitude});
        if(!isExists){
            try {
                const restaurant = await RestaurantService.getInstance().saveRestaurant({
                    name: req.body.name,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                }, req.body.menuList, req.body.productList);
                res.json(restaurant);
            }catch (err){
                res.status(400).end();
            }
        }else{
            console.log("This restaurant already exists");
            res.status(409).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/addRestaurant',express.json(), this.addRestaurant.bind(this));
        return router;
    }

}