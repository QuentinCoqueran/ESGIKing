import { UserDocument, UserProps } from "../models";
import { SessionDocument } from "../models/session.model";
export declare class AuthService {
    private static instance?;
    static getInstance(): AuthService;
    private constructor();
    subscribeUser(user: Partial<UserProps>): Promise<UserDocument>;
    logIn(info: Pick<UserProps, 'login' | 'password'>, platform: string): Promise<SessionDocument | null>;
    getUserFrom(token: string): Promise<UserProps | null>;
}
