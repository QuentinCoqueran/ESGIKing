import mongoose, {Schema, Document, Model} from "mongoose";
import {SessionProps} from "./session.model";
import {RoleProps} from "./role.model";

const userSchema = new Schema({
    login: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    sessions: [{
        type: Schema.Types.ObjectId,
        ref: "Session"
    }],
    role: {
        type: Schema.Types.ObjectId,
        ref: "Role"
    }
}, {
    collection: "users",
    timestamps: true,
    versionKey: false
});

export interface UserProps {
    _id: string;
    login: string;
    password: string;
    sessions: string[] | SessionProps[];
    role: string | RoleProps;
}

export type UserDocument = UserProps & Document;
export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);
