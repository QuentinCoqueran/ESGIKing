import mongoose, {Schema, Document, Model} from "mongoose";
import {MenuProps} from "./menu.model";
import {ProductProps} from "./product.model";
import {UserProps} from "./user.model";
import {OfferProps} from "./offer.model";

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    menuList: [{
        type: Schema.Types.ObjectId,
        ref: 'Menu',
        required: true
    }],
    productList: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    offerList: [{
        type: Schema.Types.ObjectId,
        ref: 'Offer'
    }],
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
    {
        collection: 'restaurants',
        timestamps: true,
        versionKey: false
    }
);


export interface RestaurantProps{
    name: string,
    latitude: number,
    longitude: number,
    menuList: string[] | MenuProps[],
    productList: string[] | ProductProps[],
    offerList: string[] | OfferProps[],
    admin: string | UserProps
}

export type RestaurantDocument = RestaurantProps & Document;
export const RestaurantModel: Model<RestaurantDocument> = mongoose.model<RestaurantDocument>("Restaurant", restaurantSchema);