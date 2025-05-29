import { CustomerRequestDto } from "../../../../domain/dtos/customer/CustomerRequestDto";
import { CustomerResponseDto } from "../../../../domain/dtos/customer/CustomerResponseDto";
import { DeliveryBoyListingRequest } from "../../../../domain/dtos/DeliveryBoyListingRequest";
import { DeliveryBoyResponse } from "../../../../domain/dtos/DeliveryBoyResponse";
import { RetailerListingRequest } from "../../../../domain/dtos/RetailerListingRequest";
import { RetailerResponse } from "../../../../domain/dtos/RetailerResponse";
import { User } from "../../../../domain/entities/User";


export interface IGetUsers {
    execute(): Promise<Omit<User, 'password'>[]>;
    executeRetailersPaginated(params: RetailerListingRequest): Promise<{
        data: RetailerResponse[];
        total: number;
    }>;

     executeDeliveryBoysPaginated(params: DeliveryBoyListingRequest): Promise<{
    data: DeliveryBoyResponse[];
    total: number;
}>

    executeCustomerPaginated(params: CustomerRequestDto): Promise<{
    data: CustomerResponseDto[];
    total: number;
}>
}

