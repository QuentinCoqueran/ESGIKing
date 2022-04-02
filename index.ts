import {config} from "dotenv";
config();

import express from 'express';
import {AuthController} from "./controllers";
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

    // ---> Déclaration est appels aux controllers
    const authController = new AuthController();
    app.use('/auth', authController.buildRoutes())

    app.listen(process.env.APP_PORT, function () {
        console.log("Server listening on port : " + process.env.APP_PORT);
    });
}

startServer().catch(console.error);