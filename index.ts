import {config} from "dotenv";

config();

import express from 'express';
import {AuthController, ProductsController, OrderController, MenusController, BigbossController} from "./controllers";
import mongoose, {Mongoose} from "mongoose";
import http from "http";
import {RestaurantController} from "./controllers/restaurant.controller";

async function startServer(): Promise<void> {

    // ---> connexion à MonGo BD
    const m: Mongoose = await mongoose.connect(process.env.MONGO_URI as string, {
        auth: {
            username: process.env.MONGO_USER as string,
            password: process.env.MONGO_PASSWORD as string
        }
    });

    const port = process.env.PORT || 3000;
    const app = express();
    const httpServer = http.createServer(app);
    const io = require('socket.io')(httpServer, {
        cors: {origin: 'http://localhost:4200'}
    });

    let cors = require('cors');
    // use it before all route definitions
    app.use(cors({origin: 'http://localhost:4200'}));

    // ---> Déclaration est appels aux controllers
    const authController = new AuthController();
    app.use('/auth', authController.buildRoutes());
    const productController = new ProductsController();
    app.use('/products', productController.buildRoutes());
    const bigbossController = new BigbossController();
    app.use('/bigboss', bigbossController.buildRoutes())
    const orderController = new OrderController();
    app.use('/ordered', orderController.buildRoutes());
    const menuController = new MenusController();
    app.use('/menus', menuController.buildRoutes());
    const restaurantController = new RestaurantController();
    app.use('/restaurants', restaurantController.buildRoutes());


    io.on('connection', (socket: any) => {
        socket.on('createRoom', (data: any) => {
            socket.join(data.userId);
        });
        socket.on('data', (data: any) => {
            io.sockets.in(data.userId).emit('eventToClient', {role: data.role, message: data.message});
        });
    });
    httpServer.listen(port, () => console.log(`Listening on port ${port}`));
}
startServer().catch(console.error);