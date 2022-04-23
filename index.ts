import {config} from "dotenv";
config();

import express from 'express';
import {AuthController, ProductsController} from "./controllers";
import mongoose, {Mongoose} from "mongoose";

async function startServer(): Promise<void> {

    // ---> connexion à MonGo BD
    const m: Mongoose = await mongoose.connect(process.env.MONGO_URI as string, {
        auth: {
            username: process.env.MONGO_USER  as string,
            password: process.env.MONGO_PASSWORD as string
        }
    });

    const app = express();
    var cors = require('cors');
    // use it before all route definitions
    app.use(cors({origin: 'http://localhost:4200'}));
    // ---> Déclaration est appels aux controllers
    const authController = new AuthController();
    app.use('/auth', authController.buildRoutes());
    const productController = new ProductsController();
    app.use('/products', productController.buildRoutes());

    app.listen(process.env.APP_PORT, function () {
        console.log("Server listening on port : " + process.env.APP_PORT);
    });
}

startServer().catch(console.error);