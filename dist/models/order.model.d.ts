import { Document, Model } from "mongoose";
import { ProductProps } from "./product.model";
import { MenuProps } from "./menu.model";
export interface OrderProps {
    user: string;
    products: [
        {
            product: string | ProductProps;
            quantity: number;
        }
    ];
    menus: [
        {
            menu: string | MenuProps;
            quantity: number;
        }
    ];
    total: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare type OrderDocument = Document & OrderProps;
export declare const OrderModel: Model<OrderDocument>;
