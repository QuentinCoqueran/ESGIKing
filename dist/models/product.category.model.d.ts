import { Document, Model } from "mongoose";
export interface ProductCategoryProps {
    _id: string;
    category: string;
    active: boolean;
}
export declare type ProductCategoryDocument = ProductCategoryProps & Document;
export declare const ProductCategoryModel: Model<ProductCategoryDocument>;
