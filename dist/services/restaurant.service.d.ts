import { MenuProps, ProductProps } from "../models";
import { RestaurantDocument, RestaurantProps } from "../models";
export declare class RestaurantService {
    private static instance?;
    static getInstance(): RestaurantService;
    saveRestaurant(restaurant: Partial<RestaurantProps>, menuToAdd: Pick<MenuProps, 'name'>[], productToAdd: Pick<ProductProps, 'name'>[]): Promise<RestaurantDocument>;
    deleteById(id: string): Promise<boolean>;
    getById(id: string): Promise<RestaurantDocument | null>;
    updateById(id: string, body: any): Promise<RestaurantDocument | null>;
}
