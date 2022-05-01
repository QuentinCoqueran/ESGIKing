import mongoose, {Schema, Document, Model} from "mongoose";
import {RoleProps} from "./role.model";

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    latitud: {
        type: Number,
        required: true
    },
    longitud: {
        type: Number,
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
    latitud: number,
    longitud: number
}

export type RestaurantDocument = RestaurantProps & Document;
export const RestaurantModel: Model<RestaurantDocument> = mongoose.model<RestaurantDocument>("Restaurant", restaurantSchema);