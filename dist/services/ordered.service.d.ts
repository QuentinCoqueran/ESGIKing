import { UserProps } from "../models";
import { OrderedDocument, OrderedProps } from "../models/ordered.model";
import { OrderedDisplay } from "../models/OrderedDisplay";
export declare class OrderedService {
    private static instance?;
    static getInstance(): OrderedService;
    private constructor();
    subscribeOrdered(ordered: Partial<OrderedProps>, platform: string): Promise<OrderedDocument>;
    getDeliveryman(username: string | undefined): Promise<UserProps | null>;
    getClientIdFromDeliveryMan(userId: string | undefined): Promise<UserProps | null>;
    getOrdered(clientId: string | undefined): Promise<OrderedDisplay | null>;
}
