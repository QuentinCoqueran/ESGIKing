import { Model } from "mongoose";
import { MenuProps } from "./menu.model";
import { ProductProps } from "./product.model";
export interface OfferProps {
    restaurant: string;
    productList: string[] | ProductProps[];
    menuList: string[] | MenuProps[];
}
export declare type OfferDocument = OfferProps & Document;
export declare const OfferModel: Model<OfferDocument>;
