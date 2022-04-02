"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.listen(process.env.APP_PORT, function () {
    console.log("Server listening on port :" + process.env.APP_PORT);
});
//# sourceMappingURL=index.js.map