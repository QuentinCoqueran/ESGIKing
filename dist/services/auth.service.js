"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const session_model_1 = require("../models/session.model");
class AuthService {
    static instance;
    static getInstance() {
        if (AuthService.instance === undefined) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
    constructor() { }
    async subscribeUser(user) {
        if (!user.password) {
            throw new Error('Missing password');
        }
        const model = new models_1.UserModel({
            login: user.login,
            password: utils_1.SecurityUtils.sha512(user.password)
        });
        return model.save();
    }
    // Pick selectionne des champs dans le type
    async logIn(info, platform) {
        const user = await models_1.UserModel.findOne({
            login: info.login,
            password: utils_1.SecurityUtils.sha512(info.password)
        }).exec();
        if (user === null) {
            throw new Error('User not found');
        }
        // 604_800 -> 1 week in seconds
        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + 604_800_000);
        const session = await session_model_1.SessionModel.create({
            platform,
            expiration: expirationDate,
            user: user._id
        });
        user.sessions.push(session._id); // permet de memoriser la session dans le user
        await user.save();
        return session;
    }
    async getUserFrom(token) {
        const session = await session_model_1.SessionModel.findOne({
            _id: token,
            expiration: {
                $gte: new Date()
            }
        }).populate("user").exec();
        return session ? session.user : null;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map