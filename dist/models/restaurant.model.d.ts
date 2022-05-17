import { Document, Model } from "mongoose";
import { MenuProps } from "./menu.model";
import { ProductProps } from "./product.model";
export interface RestaurantProps {
    name: string;
    latitude: number;
    longitude: number;
    menuList: string[] | MenuProps[];
    productList: string[] | ProductProps[];
}
export declare type RestaurantDocument = RestaurantProps & Document;
export declare const RestaurantModel: Model<RestaurantDocument>;
