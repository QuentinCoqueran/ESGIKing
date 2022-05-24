import express, {Request, Response, Router} from "express";
import {checkAdminConnected} from "../middlewares";
import {AuthService, OfferService, RestaurantService} from "../services";
import {OfferModel, RestaurantModel} from "../models";

export class AdminController {

    async admin(req: Request, res: Response) {
        res.json(req.user);
    }

    async getAllOffer(req: Request, res: Response) {

        const offers = await OfferService.getInstance().getAllOffers();
        res.json(offers);
    }

    async getOffer(req: Request, res: Response) {
        try {
            const offer = await OfferService.getInstance().getOfferById(req.params.id);
            if(offer) {
                res.json(offer);
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async addOffer(req: Request, res: Response) {
        const platform = req.headers["user-agent"] || "Unknown";

        console.log("addOffer");

        let restaurant = await RestaurantModel.findOne({name: req.body.restaurant});
        if(!restaurant) {
            res.status(400).end();
        }else{
            let isExists = await OfferModel.findOne({name: req.body.name, restaurant: restaurant._id});
            if(isExists){
                res.status(409).end();
            }
        }

        try {
            if(req.body.menuList && req.body.productList){
                const offer = await OfferService.getInstance().saveOffer({
                    name: req.body.name,
                    discount: req.body.discount,
                    restaurant: req.body.restaurant
                },req.body.menuList, req.body.productList);
                if(offer) {
                    res.status(201).json(offer);
                } else {
                    res.status(400).end();
                }

            }else if (req.body.menuList && !req.body.productList){
                console.log("menu")
                const offer = await OfferService.getInstance().saveOffer({
                    name: req.body.name,
                    discount: req.body.discount,
                    restaurant: req.body.restaurant
                }, req.body.menuList, undefined);
                if(offer) {
                    res.status(201).json(offer);
                } else {
                    res.status(400).end();
                }

            }else if (!req.body.menuList && req.body.productList){
                console.log("product")
                const offer = await OfferService.getInstance().saveOffer({
                    name: req.body.name,
                    discount: req.body.discount,
                    restaurant: req.body.restaurant
                }, undefined, req.body.productList);
                if(offer) {
                    res.status(201).json(offer);
                } else {
                    res.status(400).end();
                }

            }else{
                console.log("no menu & no product")
                res.status(400).end();
            }

        } catch(err) {
            console.log(err);
            res.status(400).end();
        }
    }

    async deleteOffer(req: Request, res: Response) {
        const platform = req.headers["user-agent"] || "Unknown";

        try {
            const offer = await OfferService.getInstance().deleteOffer(req.params.id);
            if(offer) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateRestaurant(req: Request, res: Response) {
        const platform = req.headers["user-agent"] || "Unknown";
        const authorization = req.headers["authorization"];
        if(!authorization) {
            res.status(401).end();
        }else {
            let parts = authorization.split(" ");
            let token = parts[1];
            let user = await AuthService.getInstance().getUserFrom(token);

            if(!user) {
                res.status(401).end();
            }else {

                let restaurantAdmin = await RestaurantModel.findOne({admin: user._id});

                if (!restaurantAdmin) {
                    res.status(401).end();
                } else {

                    try {
                        const restaurant = await RestaurantService.getInstance().updateById(restaurantAdmin._id, req.body);
                        if (restaurant) {
                            res.json(restaurant);
                        } else {
                            res.status(404).end();
                        }
                    } catch (err) {
                        res.status(400).end();
                    }
                }
            }
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get("/", checkAdminConnected(), this.admin.bind(this));
        router.get("/allOffer", checkAdminConnected(), this.getAllOffer.bind(this));
        router.get("/offer/:id", checkAdminConnected(), this.getOffer.bind(this));
        router.post("/addOffer", checkAdminConnected(), express.json(), this.addOffer.bind(this));
        router.delete("/deleteOffer/:id", checkAdminConnected(), this.deleteOffer.bind(this));
        router.put("/updateRestaurant/", checkAdminConnected(), express.json(), this.updateRestaurant.bind(this));
        return router;
    }

}