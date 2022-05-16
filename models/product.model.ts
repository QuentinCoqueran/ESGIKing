import mongoose, {Schema, Document, Model} from "mongoose";
import {ProductCategoryProps} from "./product.category.model";

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.String,
        ref: 'ProductCategory',
    },
    imageUrl: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
}, {
    collection: "products",
    timestamps: true,
    versionKey: false
});

export interface ProductProps {
    name: string;
    price: number;
    category?: string | ProductCategoryProps;
    description: string;
    imageUrl: string;
    active: boolean;
}

export type ProductDocument = ProductProps & Document;
export const ProductModel: Model<ProductDocument> = mongoose.model<ProductDocument>("Product", productSchema);
