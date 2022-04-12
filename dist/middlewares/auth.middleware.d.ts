import { RequestHandler } from "express";
import { UserProps } from "../models";
declare module 'express' {
    interface Request {
        user?: UserProps;
    }
}
export declare function checkUserConnected(): RequestHandler;
