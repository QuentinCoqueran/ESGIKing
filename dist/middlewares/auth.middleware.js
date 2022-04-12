"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserConnected = void 0;
const services_1 = require("../services");
function checkUserConnected() {
    return async function (req, res, next) {
        const authorization = req.headers['authorization'];
        if (authorization === undefined) {
            res.status(401).end();
            return;
        }
        const parts = authorization.split(" ");
        if (parts.length !== 2) {
            res.status(401).end();
            return;
        }
        if (parts[0] !== 'Bearer') {
            res.status(401).end();
            return;
        }
        const token = parts[1];
        try {
            const user = await services_1.AuthService.getInstance().getUserFrom(token);
            if (user === null) {
                res.status(401).end();
                return;
            }
            req.user = user;
            next();
        }
        catch (err) {
            res.status(401).end();
        }
    };
}
exports.checkUserConnected = checkUserConnected;
//# sourceMappingURL=auth.middleware.js.map