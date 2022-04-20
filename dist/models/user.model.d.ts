import { Document, Model } from "mongoose";
import { SessionProps } from "./session.model";
import { RoleProps } from "./role.model";
export interface UserProps {
    _id: string;
    login: string;
    password: string;
    sessions: string[] | SessionProps[];
    role: string | RoleProps;
}
export declare type UserDocument = UserProps & Document;
export declare const UserModel: Model<UserDocument>;
