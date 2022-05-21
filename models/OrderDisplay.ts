import {UserProps} from "./user.model";

export class OrderDisplay {
    name: string | undefined;
    lastName: string | undefined;
    address: string | undefined;
    step: number | undefined;
    deliverymanId: UserProps | undefined;
    longitudeDeliveryman: string | undefined;
    latitudeDeliveryman: string | undefined;
}