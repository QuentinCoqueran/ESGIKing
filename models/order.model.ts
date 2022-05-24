import mongoose, {Schema, Document, Model} from "mongoose";
import {UserProps} from "./user.model";
import {ProductProps} from "./product.model";
import {MenuProps} from "./menu.model";
import {SessionProps} from "./session.model";


const orderSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    deliveryMan: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    address: {
        type: String,
    },
    deliverymanBanned: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    products: [{
        _id: false,
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            // required: true
        },
        quantity: {
            type: Number,
            // required: true
        }
    }],
    menus: [{
        _id: false,
        menu: {
            type: Schema.Types.ObjectId,
            ref: "Menu",
            //required: true
        },
        quantity: {
            type: Number,
            // required: true
        }
    }],
    message: [{
            _id: false,
            valueMessage: {
                type: String,
                //required: true
            },
            role: {
                type: String,
                // required: true
            },
            date: {
                type: Number,
                // required: true
            }
    }],
    total: {
        type: Number,
        //required: true
    },
    step: {
        type: Number,
        // 0 commandé, 1 commande prête, 2 validé par le livreur, 3 validée par le client
        enum: [0, 1, 2, 3],
        default: 0
    },
    atRestaurant: {
        type: Boolean,
        //required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        //required: true
    },
    endedAt: {
        type: Date,
        //required: false
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
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
    products: [{
            product: string | ProductProps;
            quantity: number
    }];
    menus: [{
            menu: string | MenuProps;
            quantity: number
    }];
    message: [{
            valueMessage: string;
            role: string;
    }];
    total: number;
    step: number;
    deliverymanBanned: string[] | UserProps[];
    createdAt: Date;
    updatedAt: Date;
    atRestaurant: boolean
    restaurant: string
}

export type OrderDocument = OrderProps & Document;
export const OrderModel: Model<OrderDocument> = mongoose.model<OrderDocument>("Ordered", orderSchema);
