"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const models_2 = require("../models");
class AuthService {
    static instance;
    static getInstance() {
        if (AuthService.instance === undefined) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
    constructor() {
    }
    async subscribeUser(user, info, platform) {
        if (!user.password) {
            throw new Error('Missing password');
        }
        const model = await models_1.UserModel.create({
            login: user.login,
            password: utils_1.SecurityUtils.sha512(user.password),
        });
        let role;
        const isExists = await models_1.RoleModel.exists({ role: info.role });
        if (!isExists) {
            role = await models_1.RoleModel.create({
                platform,
                user: model?._id,
                role: info.role
            });
        }
        else {
            role = await models_1.RoleModel.findOne({ role: info.role });
        }
        model.role = role?._id;
        //update de model
        await model.save();
        return role;
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
        const session = await models_2.SessionModel.create({
            platform,
            expiration: expirationDate,
            user: user._id
        });
        user.sessions.push(session._id); // permet de memoriser la session dans le user
        await user.save();
        return session;
    }
    async getUserFrom(token) {
        const session = await models_2.SessionModel.findOne({
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