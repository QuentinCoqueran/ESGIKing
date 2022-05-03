import { Request, Response, Router } from "express";
export declare class OrderedController {
    createOrdered(req: Request, res: Response): Promise<void>;
    setClientIdFromDeliveryMan(req: Request, res: Response): Promise<void>;
    setOrderData(req: Request, res: Response): Promise<void>;
    buildRoutes(): Router;
}
