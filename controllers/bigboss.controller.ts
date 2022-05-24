import express, {Request, Response, Router} from "express";
import {checkUserConnected} from "../middlewares";
import {AdminService, AuthService, RestaurantService} from "../services";
import {RestaurantModel, UserModel} from "../models";
import {checkBigbossConnected} from "../middlewares";

export class BigbossController{

    async bigboss(req: Request, res: Response){
        res.json(req.user);
    }

    async getAllRestaurants(req: Request, res: Response){
        try {
            const restaurants = await RestaurantService.getInstance().getAllRestaurants();
            res.json(restaurants);
        } catch(err) {
            res.status(400).end();
        }
    }

    async addRestaurant(req: Request, res: Response){

        const platform = req.headers["user-agent"] || "Unknown";

        const isExists = await RestaurantModel.findOne({latitude: req.body.latitude, longitude: req.body.longitude});
        if(!isExists){
            try {
                const restaurant = await RestaurantService.getInstance().saveRestaurant({
                    name: req.body.name,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude
                }, req.body.adminList, req.body.menuList, req.body.productList);

                res.status(201).json(restaurant);
            }catch (err){
                console.log(err);
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
                res.status(400).end();
            }
        }
    }

    async deleteAdmin(req: Request, res: Response){
        const plateform = req.headers["user-agent"] || "Unknown";

        try {
            const admin = await AdminService.getInstance().deleteAdmin(req.params.id);
            if(admin){
                res.status(204).end();
            }else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }


    async createAdmin(req: Request, res: Response){
        const plateform = req.headers["user-agent"] || "Unknown";

        try {
            const admin = await AdminService.getInstance().createAdmin({
                login: req.body.login,
                password: req.body.password,
                name: req.body.name,
                lastname: req.body.lastname
            });
            if(admin){
                res.status(201).json(admin);
            }else {
                res.status(400).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async getAllAdmins(req: Request, res: Response){
        try {
            const admin = await AdminService.getInstance().getAllAdmins();
            res.json(admin);
        } catch(err) {
            res.status(400).end();
        }
    }


    buildRoutes(): Router {
        const router = express.Router();
        router.get("/", checkBigbossConnected(), this.bigboss);
        router.get("/allRestaurants", checkBigbossConnected(), this.getAllRestaurants.bind(this));
        router.post('/addRestaurant', checkBigbossConnected(), express.json(), this.addRestaurant.bind(this));
        router.delete('/deleteRestaurant/:id', checkBigbossConnected(),this.deleteRestaurant.bind(this));
        router.put('/updateRestaurant/:id', checkBigbossConnected(), express.json(), this.updateRestaurant.bind(this));
        router.post('/createAdmin', checkBigbossConnected(), express.json(), this.createAdmin.bind(this));
        router.put('/addAdmin/:id', checkBigbossConnected(), express.json(), this.addAdmin.bind(this));
        router.get('/getAllAdmins', checkBigbossConnected(), this.getAllAdmins.bind(this));
        router.delete('/deleteAdmin/:id', checkBigbossConnected(), this.deleteAdmin.bind(this));
        return router;
    }

}