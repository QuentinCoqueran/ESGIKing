import { Request, Response, Router } from "express";
export declare class BigbossController {
    bigboss(req: Request, res: Response): Promise<void>;
    addRestaurant(req: Request, res: Response): Promise<void>;
    buildRoutes(): Router;
}
