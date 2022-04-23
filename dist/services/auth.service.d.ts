import { RoleDocument, RoleProps, UserProps } from "../models";
import { SessionDocument } from "../models";
export declare class AuthService {
    private static instance?;
    static getInstance(): AuthService;
    private constructor();
    subscribeUser(user: Partial<UserProps>, info: Pick<RoleProps, 'role'>, platform: string): Promise<RoleDocument>;
    logIn(info: Pick<UserProps, 'login' | 'password'>, platform: string): Promise<SessionDocument | null>;
    getUserFrom(token: string): Promise<UserProps | null>;
}
