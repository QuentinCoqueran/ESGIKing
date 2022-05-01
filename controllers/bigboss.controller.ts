import express, {Request, Response, Router} from "express";
import {checkUserConnected} from "../middlewares";

export class BigbossController{

    async bigboss(req: Request, res: Response){
        res.json(req.user);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/restaurant',checkUserConnected(), this.bigboss.bind(this));
        return router;
    }

}