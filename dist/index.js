"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const controllers_1 = require("./controllers");
const mongoose_1 = __importDefault(require("mongoose"));
async function startServer() {
    // ---> connexion à MonGo BD
    const m = await mongoose_1.default.connect(process.env.MONGO_URI, {
        auth: {
            username: process.env.MONGO_USER,
            password: process.env.MONGO_PASSWORD
        }
    });
    const app = (0, express_1.default)();
    // ---> Déclaration est appels aux controllers
    const authController = new controllers_1.AuthController();
    app.use('/auth', authController.buildRoutes());
    app.listen(process.env.APP_PORT, function () {
        console.log("Server listening on port : " + process.env.APP_PORT);
    });
}
startServer().catch(console.error);
//# sourceMappingURL=index.js.map