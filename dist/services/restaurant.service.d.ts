import { RestaurantDocument, RestaurantProps } from "../models/restaurant.model";
export declare class RestaurantService {
    private static instance?;
    static getInstance(): RestaurantService;
    saveRestaurant(restaurant: Partial<RestaurantProps>, platform: string): Promise<RestaurantDocument>;
}
