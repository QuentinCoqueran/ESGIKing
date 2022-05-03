"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenusController = void 0;
const models_1 = require("../models");
class MenusController {
    async createMenu(req, res) {
        const platform = req.headers["user-agent"] || "Unknown";
        const isExists = await models_1.MenuModel.exists({ name: req.body.name });
        if (!isExists) {
            try {
            }
            catch (err) {
                console.log(err);
                res.status(500).end();
            }
        }
        else {
        }
    }
}
exports.MenusController = MenusController;
//# sourceMappingURL=menus.controller.js.map