"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
class AuthController {
    async createUser(req, res) {
        const platform = req.headers['user-agent'] || "Unknown";
        try {
            //creation table user
            const user = await services_1.AuthService.getInstance().subscribeUser({
                login: req.body.username,
                password: req.body.password,
            }, {
                role: req.body.role
            }, platform);
            res.json(user);
        }
        catch (err) {
            console.log(err);
            res.status(400).end();
        }
    }
    async logUser(req, res) {
        const platform = req.headers['user-agent'] || "Unknown";
        try {
            const session = await services_1.AuthService.getInstance().logIn({
                login: req.body.username,
                password: req.body.password
            }, platform);
            res.send({
                token: session?._id
            });
        }
        catch (err) {
            res.status(401).end(); // unauthorized
        }
    }
    async me(req, res) {
        res.json(req.user);
    }
    async setRole(req, res) {
        const roleActual = await models_1.RoleModel.findOne({
            user: req.user?._id,
        }).populate("user").exec();
        res.json(roleActual?.role);
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.post('/subscribe', express_1.default.json(), this.createUser.bind(this));
        router.post('/login', express_1.default.json(), this.logUser.bind(this));
        router.get('/me/', (0, middlewares_1.checkUserConnected)(), this.me.bind(this));
        router.get('/get-role', (0, middlewares_1.checkUserConnected)(), this.setRole.bind(this));
        return router;
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map