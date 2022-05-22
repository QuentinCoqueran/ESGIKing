import mongoose, {Model, Schema} from "mongoose";

import {MenuModel, MenuProps} from "./menu.model";
import {ProductProps} from "./product.model";

const offerSchema = new Schema({
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    productList: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    menuList: [{
        type: Schema.Types.ObjectId,
        ref: 'Menu'
    }],
},
    {
        collection: 'offers',
        timestamps: true,
        versionKey: false
    });

export interface OfferProps {
    restaurant: string;
    productList: string[] | ProductProps[];
    menuList: string[] | MenuProps[];
}

export type OfferDocument = OfferProps & Document;
export const OfferModel : Model<OfferDocument> = mongoose.model<OfferDocument>('Offer', offerSchema);