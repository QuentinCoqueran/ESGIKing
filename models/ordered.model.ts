import mongoose, {Schema, Document, Model} from "mongoose";
import {UserProps} from "./user.model";


const orderedSchema = new Schema({
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
            },
            quantity: {
                type: Number,
            }
        }
    ],
    menus: [
        {
            menu: {
                type: Schema.Types.ObjectId,
                ref: "Menu",
            },
            quantity: {
                type: Number,
            }
        }
    ],
    total: {
        type: Number,
    },
    step: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 0
    }
}, {
    collection: "ordered",
    timestamps: true,
    versionKey: false
});

export interface OrderedProps extends Document {
    client: UserProps;
    deliveryMan: UserProps;
    address: string;
    products: [
        {
            //product: string | ProductProps;
            quantity: number
        }
    ];
    menus: [
        {
            //menu: string | MenuProps;
            quantity: number
        }
    ];
    total: number;
    step: string;
}

export type OrderedDocument = OrderedProps & Document;
export const OrderedModel: Model<OrderedDocument> = mongoose.model<OrderedDocument>("Ordered", orderedSchema);
