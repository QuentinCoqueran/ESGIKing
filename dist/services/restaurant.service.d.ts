import { MenuProps, ProductProps } from "../models";
import { RestaurantDocument, RestaurantProps } from "../models/restaurant.model";
export declare class RestaurantService {
    private static instance?;
    static getInstance(): RestaurantService;
    saveRestaurant(restaurant: Partial<RestaurantProps>, menuToAdd: Pick<MenuProps, 'name'>[], productToAdd: Pick<ProductProps, 'name'>[]): Promise<RestaurantDocument>;
}
