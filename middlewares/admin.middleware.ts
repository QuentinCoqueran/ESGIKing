import {Request, RequestHandler} from "express";
import {AuthService} from "../services";
import {UserProps} from "../models";

declare module 'express' {
    export interface Request {
        user?: UserProps;
    }
}

export function checkBigbossConnected(): RequestHandler {
    return async function(req: Request,
                          res,
                          next) {
        const authorization = req.headers['authorization'];
        if(authorization === undefined) {
            res.status(401).end();
            return;
        }
        const parts = authorization.split(" ");
        if(parts.length !== 2) {
            res.status(401).end();
            return;
        }
        if(parts[0] !== 'Bearer') {
            res.status(401).end();
            return;
        }
        const token = parts[1];
        try {
            const user = await AuthService.getInstance().getUserFrom(token);
            if(user){
                let role = await AuthService.getInstance().getRoleFrom(user._id);
                if(role && role === "admin") {
                    req.user = user;
                    next();
                } else {
                    res.status(401).end();
                    return;
                }
            }
            else{
                res.status(401).end();
                return;
            }
        } catch(err) {
            res.status(401).end();
        }
    }
}
