import mongoose, {Schema, Document, Model} from "mongoose";
import {ProductProps} from "./product.model";

const menuSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
    }],
    imageUrl: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    collection: 'menus',
    timestamps: true,
    versionKey: false
});

export interface MenuProps{
    _id: string;
    name: string;
    description: string;
    price: number;
    products: string[] | ProductProps[];
    imageUrl: string;
    active: boolean;
}

export type MenuDocument = Document & MenuProps;
export const MenuModel: Model<MenuDocument> = mongoose.model<MenuDocument>('Menu', menuSchema);