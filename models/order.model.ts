import mongoose, {Schema, Document, Model} from "mongoose";
import {ProductProps} from "./product.model";
import {UserProps} from "./user.model";
import {MenuProps} from "./menu.model";

const orderSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    menus: [
        {
            menu: {
                type: Schema.Types.ObjectId,
                ref: "Menu",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    endedAt: {
        type: Date,
        required: false
    }

},{
    collection: "orders",
    timestamps: true,
    versionKey: false
});

export interface OrderProps {
    user: string;
    products: [
        {
            product: string | ProductProps;
            quantity: number
        }
    ];
    menus: [
        {
            menu: string | MenuProps;
            quantity: number
        }
    ];
    total: number;
    status: string;
    createdAt: Date;
    updatedAt: Date
}

export type OrderDocument = Document & OrderProps;
export const OrderModel: Model<OrderDocument> = mongoose.model<OrderDocument>("Order", orderSchema);