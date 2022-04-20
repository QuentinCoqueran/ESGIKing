import express, {Request, Response, Router} from "express";
import {AuthService} from "../services";
import {checkUserConnected} from "../middlewares";
import {RoleModel, RoleProps} from "../models";

export class AuthController {

    async createUser(req: Request, res: Response) {
        const platform = req.headers['user-agent'] || "Unknown";
        try {
            //creation table user
            const user = await AuthService.getInstance().subscribeUser({
                    login: req.body.username,
                    password: req.body.password,
                },
                {
                    role: req.body.role
                }, platform);
            res.json(user);
        } catch (err) {
            console.log(err)
            res.status(400).end();
        }
    }

    async logUser(req: Request, res: Response) {
        const platform = req.headers['user-agent'] || "Unknown";
        try {
            const session = await AuthService.getInstance().logIn({
                login: req.body.username,
                password: req.body.password
            }, platform);
            res.send({
                token: session?._id
            });
        } catch (err) {
            res.status(401).end(); // unauthorized
        }
    }

    async me(req: Request, res: Response) {
        res.json(req.user);
    }

    async setRole(req: Request, res: Response) {
        const roleActual = await RoleModel.findOne({
            user: req.user?._id,
        }).populate("user").exec();
        res.json(roleActual?.role);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/subscribe', express.json(), this.createUser.bind(this));
        router.post('/login', express.json(), this.logUser.bind(this));
        router.get('/me', checkUserConnected(), this.me.bind(this));
        router.get('/get-role', checkUserConnected(), this.setRole.bind(this));
        return router;
    }
}
