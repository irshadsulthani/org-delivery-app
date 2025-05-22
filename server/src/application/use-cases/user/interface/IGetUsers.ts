import { DeliveryBoyListingRequest } from "../../../../domain/dtos/DeliveryBoyListingRequest";
import { DeliveryBoyResponse } from "../../../../domain/dtos/DeliveryBoyResponse";
import { User } from "../../../../domain/entities/User";


export interface IGetUsers {
    execute(): Promise<Omit<User, 'password'>[]>;
    executeCustomers(): Promise<Omit<User, 'password'>[]>;
     executeDeliveryBoysPaginated(params: DeliveryBoyListingRequest): Promise<{
    data: DeliveryBoyResponse[];
    total: number;
}>

    executeRetailers(): Promise<Omit<User, 'password'>[]>;
}

