import mongoose, {Model, Document, Schema} from "mongoose";

import {MenuModel, MenuProps} from "./menu.model";
import {ProductProps} from "./product.model";
import {RestaurantProps} from "./restaurant.model";

const offerSchema = new Schema({
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    productList:[{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    menuList:[{
        type: Schema.Types.ObjectId,
        ref: 'Menu'
    }],
    discount: {
        type: Number, // in %
    }
},
    {
        collection: 'offers',
        timestamps: true,
        versionKey: false
    });

export interface OfferProps extends Document{
    restaurant: string | RestaurantProps;
    name: string;
    productList: string[] | ProductProps[];
    menuList: string[] | MenuProps[];
    discount: number;
}

export type OfferDocument = OfferProps & Document;
export const OfferModel : Model<OfferDocument> = mongoose.model<OfferDocument>('Offer', offerSchema);