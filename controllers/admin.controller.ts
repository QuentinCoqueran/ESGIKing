import express, {Request, Response, Router} from "express";
import {checkAdminConnected} from "../middlewares";
import {OfferService} from "../services";

export class AdminController {

    async admin(req: Request, res: Response) {
        res.json(req.user);
    }

    async getAllOffer(req: Request, res: Response) {
        try {
            const offers = await OfferService.getInstance().getAllOffers();
            res.json(offers);
        } catch(err) {
            res.status(400).end();
        }
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

        try {
            console.log("addOffer")
            if(req.body.menuList && req.body.productList){
                console.log("menu & product")
                const offer = await OfferService.getInstance().saveOffer({
                    name: req.body.name,
                    discount: req.body.discount
                }, req.body.restaurant, req.body.menuList, req.body.productList);
                if(offer) {
                    res.json(offer);
                } else {
                    res.status(400).end();
                }

            }else if (req.body.menuList && !req.body.productList){
                console.log("menu")
                const offer = await OfferService.getInstance().saveOffer({
                    name: req.body.name,
                    discount: req.body.discount
                }, req.body.restaurant, req.body.menuList, undefined);
                if(offer) {
                    res.json(offer);
                } else {
                    res.status(400).end();
                }

            }else if (!req.body.menuList && req.body.productList){
                console.log("product")
                const offer = await OfferService.getInstance().saveOffer({
                    name: req.body.name,
                    discount: req.body.discount
                }, req.body.restaurant, undefined, req.body.productList);
                if(offer) {
                    res.json(offer);
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

    buildRoutes(): Router {
        const router = express.Router();
        router.get("/", checkAdminConnected(), this.admin.bind(this));
        router.get("/allOffer", checkAdminConnected(), this.getAllOffer.bind(this));
        router.get("/offer/:id", checkAdminConnected(), this.getOffer.bind(this));
        router.post("/addOffer", checkAdminConnected(), express.json(), this.addOffer.bind(this));
        return router;
    }

}