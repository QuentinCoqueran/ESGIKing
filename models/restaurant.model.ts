import mongoose, {Schema, Document, Model} from "mongoose";
import {RoleProps} from "./role.model";
import {MenuProps} from "./menu.model";
import {ProductProps} from "./product.model";


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
    productList: string[] | ProductProps[]
}

export type RestaurantDocument = RestaurantProps & Document;
export const RestaurantModel: Model<RestaurantDocument> = mongoose.model<RestaurantDocument>("Restaurant", restaurantSchema);