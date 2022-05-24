import {UserProps} from "./user.model";
import {OrderProps} from "./order.model";

export class OrderDisplay {
    name: string | undefined;
    lastName: string | undefined;
    address: string | undefined;
    step: number | undefined;
    deliverymanId: UserProps | undefined;
    longitudeDeliveryman: string | undefined;
    latitudeDeliveryman: string | undefined;
    idOrder: OrderProps | undefined;
    total: number | undefined;
}