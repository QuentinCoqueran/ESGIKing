import express, {Request, Response, Router} from "express";
import {RestaurantService} from "../services";
import {RestaurantModel} from "../models";


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
        if (restaurant) {
            res.json(restaurant);
        } else {
            res.sendStatus(404).end();
        }
    }

    async getOffersRestaurant(req: Request, res: Response) {
        const offers = await RestaurantService.getInstance().findOffersByRestaurant(req.params['id']);
        if (offers) {
            res.json(offers);
        }
    }

    async getNameProductsOneRestaurant(req: Request, res: Response) {
        const restaurant = await RestaurantModel.findById(req.params['id']);
        if (restaurant) {
            const allNameProduct = await RestaurantService.getInstance().transformIdIntoName(restaurant);
            res.json(allNameProduct);
        } else {
            res.sendStatus(404).end();
        }
    }


    buildRoutes(): Router {
        const router = express.Router();
        router.get("/allRestaurants", this.getAllRestaurants.bind(this));
        router.get("/:id", this.getOneRestaurant.bind(this));
        router.get("/names/:id", this.getNameProductsOneRestaurant.bind(this));
        router.get("/offersRestaurants/:id", this.getOffersRestaurant.bind(this));
        return router;
    }

}