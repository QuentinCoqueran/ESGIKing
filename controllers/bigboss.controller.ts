import express, {Request, Response, Router} from "express";
import {checkUserConnected} from "../middlewares";
import {AuthService, RestaurantService} from "../services";
import {RestaurantModel, UserModel} from "../models";
import {AdminService} from "../services/admin.service";

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

    async deleteRestaurant(req: Request, res: Response){

        const platform = req.headers["user-agent"] || "Unknown";

        try {
            console.log("test");
            const restaurant = await RestaurantService.getInstance().deleteById(req.params.id);
            if(restaurant) {
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

        try {
            const restaurant = await RestaurantService.getInstance().updateById(req.params.id, req.body);
            if(restaurant) {
                res.json(restaurant);
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }


    async addAdmin(req: Request, res: Response){ // update user role to admin
        const plateform = req.headers["user-agent"] || "Unknown";

        const isExists = await UserModel.findOne({});
        if(isExists){
            try{
                const admin = await AdminService.getInstance().setRoleAdmin(req.params.id);
                if(admin){
                    res.json(admin);
                }else {
                    res.status(404).end();
                    // go to subscribeUser
                }
            }catch (err){
                console.log(err)
                res.status(400).end();
            }
        }
    }


    buildRoutes(): Router {
        const router = express.Router();
        router.post('/addRestaurant',express.json(), this.addRestaurant.bind(this));
        router.delete('/deleteRestaurant/:id', this.deleteRestaurant.bind(this));
        router.put('/updateRestaurant/:id', express.json(), this.updateRestaurant.bind(this));
        router.put('/addAdmin/:id', express.json(), this.addAdmin.bind(this));
        return router;
    }

}