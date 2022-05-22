import express, {Request, Response, Router} from "express";
import {AdminService, RestaurantService} from "../services";
import {RestaurantModel, UserModel} from "../models";

export class RestaurantController {

    async getAllRestaurants(req: Request, res: Response) {
        try {
            const restaurants = await RestaurantService.getInstance().getAllRestaurants();
            res.json(restaurants);
        } catch (err) {
            res.status(400).end();
        }
    }

    async getOneRestaurant(req: Request, res: Response) {
        const restaurant = await RestaurantModel.findById(req.params['id']);
        if(restaurant){
            res.json(restaurant);
        }else{
            res.sendStatus(404).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get("/allRestaurants", this.getAllRestaurants.bind(this));
        router.get("/:id", this.getOneRestaurant.bind(this));
        return router;
    }

}