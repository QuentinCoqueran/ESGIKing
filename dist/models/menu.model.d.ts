import { Document, Model } from "mongoose";
import { ProductProps } from "./product.model";
export interface MenuProps {
    _id: string;
    name: string;
    description: string;
    price: number;
    products: string[] | ProductProps[];
    imageUrl: string;
    active: boolean;
}
export declare type MenuDocument = Document & MenuProps;
export declare const MenuModel: Model<MenuDocument>;
