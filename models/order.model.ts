import mongoose, {Schema, Document, Model} from "mongoose";
import {UserProps} from "./user.model";
import {ProductProps} from "./product.model";
import {MenuProps} from "./menu.model";


const orderSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    deliveryMan: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    address: {
        type: String,
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
    step: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 0
    },
    atRestaurant: {
        type: Boolean,
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
}, {
    collection: "orders",
    timestamps: true,
    versionKey: false
});

export interface OrderProps extends Document {
    client: UserProps;
    deliveryMan: UserProps;
    address: string;
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
    step: string;
    createdAt: Date;
    updatedAt: Date;
}

export type OrderDocument = OrderProps & Document;
export const OrderModel: Model<OrderDocument> = mongoose.model<OrderDocument>("Order", orderSchema);
