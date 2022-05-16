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
const http_1 = __importDefault(require("http"));
async function startServer() {
    // ---> connexion à MonGo BD
    const m = await mongoose_1.default.connect(process.env.MONGO_URI, {
        auth: {
            username: process.env.MONGO_USER,
            password: process.env.MONGO_PASSWORD
        }
    });
    const port = process.env.PORT || 3000;
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    const io = require('socket.io')(httpServer, {
        cors: { origin: 'http://localhost:4200' }
    });
    var cors = require('cors');
    // use it before all route definitions
    app.use(cors({ origin: 'http://localhost:4200' }));
    // ---> Déclaration est appels aux controllers
    const authController = new controllers_1.AuthController();
    app.use('/auth', authController.buildRoutes());
    const productController = new controllers_1.ProductsController();
    app.use('/products', productController.buildRoutes());
    const orderedController = new controllers_1.OrderController();
    app.use('/order', orderedController.buildRoutes());
    const menuController = new controllers_1.MenusController();
    app.use('/menus', menuController.buildRoutes());
    io.on('connection', (socket) => {
        socket.on('createRoom', (data) => {
            socket.join(data.userId);
        });
        socket.on('data', (data) => {
            io.sockets.in(data.userId).emit('eventToClient', { role: data.role, message: data.message });
        });
    });
    httpServer.listen(port, () => console.log(`Listening on port ${port}`));
}
startServer().catch(console.error);
//# sourceMappingURL=index.js.map