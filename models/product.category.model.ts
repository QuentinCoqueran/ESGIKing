import mongoose, {Schema, Document, Model} from "mongoose";


const productCategorySchema = new Schema({
    category: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
},{
    collection: 'product_categories',
    timestamps: true,
    versionKey: false
});

export interface ProductCategoryProps {
    _id: string;
    category: string;
    active: boolean;
}

export type ProductCategoryDocument = ProductCategoryProps & Document;
export const ProductCategoryModel: Model<ProductCategoryDocument> = mongoose.model<ProductCategoryDocument>("ProductCategory", productCategorySchema);
