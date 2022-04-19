import { Document, Model } from "mongoose";
import { UserProps } from "./user.model";
export interface RoleProps extends Document {
    user: UserProps;
    role: string;
}
export declare type RoleDocument = RoleProps & Document;
export declare const RoleModel: Model<RoleDocument>;
