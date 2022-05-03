import { Document, Model } from "mongoose";
import { UserProps } from "./user.model";
export interface OrderedProps extends Document {
    client: UserProps;
    deliveryMan: UserProps;
    address: string;
    products: [
        {
            quantity: number;
        }
    ];
    menus: [
        {
            quantity: number;
        }
    ];
    total: number;
    step: string;
}
export declare type OrderedDocument = OrderedProps & Document;
export declare const OrderedModel: Model<OrderedDocument>;
