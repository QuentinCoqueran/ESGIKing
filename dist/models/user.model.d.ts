import { Document, Model } from "mongoose";
import { SessionProps } from "./session.model";
export interface UserProps {
    _id: string;
    login: string;
    password: string;
    sessions: string[] | SessionProps[];
}
export declare type UserDocument = UserProps & Document;
export declare const UserModel: Model<UserDocument>;
