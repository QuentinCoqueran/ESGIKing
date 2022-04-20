import { Request, Response, Router } from "express";
export declare class AuthController {
    createUser(req: Request, res: Response): Promise<void>;
    logUser(req: Request, res: Response): Promise<void>;
    me(req: Request, res: Response): Promise<void>;
    setRole(req: Request, res: Response): Promise<void>;
    buildRoutes(): Router;
}
