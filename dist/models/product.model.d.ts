import { Document, Model } from "mongoose";
import { ProductCategoryProps } from "./product.category.model";
export interface ProductProps {
    _id: string;
    name: string;
    price: number;
    category?: string | ProductCategoryProps;
    description: string;
    imageUrl: string;
    active: boolean;
}
export declare type ProductDocument = ProductProps & Document;
export declare const ProductModel: Model<ProductDocument>;
