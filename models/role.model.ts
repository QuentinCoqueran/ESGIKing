import mongoose, {Schema, Document, Model} from "mongoose";
import {UserProps} from "./user.model";

const roleSchema = new Schema({
    role: {
        type: String,
        enum: ["admin", "bigboss", "customer", "cooker", "deliveryman"],
        default: "customer"
    }
}, {
    collection: "role",
    timestamps: true,
    versionKey: false
});

export interface RoleProps extends Document {
    role: string;
}

export type RoleDocument = RoleProps & Document;
export const RoleModel: Model<RoleDocument> = mongoose.model<RoleDocument>("Role", roleSchema);
