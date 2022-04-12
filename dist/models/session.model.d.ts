import { Document, Model } from "mongoose";
import { UserProps } from "./user.model";
export interface SessionProps {
    _id: string;
    user: string | UserProps;
    platform: string;
    expiration?: Date;
}
export declare type SessionDocument = SessionProps & Document;
export declare const SessionModel: Model<SessionDocument>;
