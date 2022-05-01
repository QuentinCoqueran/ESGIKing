import { Request, Response, Router } from "express";
export declare class ProductsController {
    createProduct(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    getOne(req: Request, res: Response): Promise<void>;
    buildRoutes(): Router;
}
