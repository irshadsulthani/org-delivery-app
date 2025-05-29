import { CustomerRequestDto } from "../../../../domain/dtos/customer/CustomerRequestDto";
import { CustomerResponseDto } from "../../../../domain/dtos/customer/CustomerResponseDto";
import { DeliveryBoyListingRequest } from "../../../../domain/dtos/DeliveryBoyListingRequest";
import { DeliveryBoyResponse } from "../../../../domain/dtos/DeliveryBoyResponse";
import { RetailerListingRequest } from "../../../../domain/dtos/RetailerListingRequest";
import { RetailerResponse } from "../../../../domain/dtos/RetailerResponse";
import { User } from "../../../../domain/entities/User";


export interface IUserRepository {
    findByEmail (email : string): Promise<User |null>
    createUser(user: User): Promise<User>;
    comparePassword(inputPassword: string, storedHash: string): Promise<boolean>;
    getAllUsers(): Promise<User[]>;
    getAllCustomersPaginated(params: CustomerRequestDto): Promise<{
        data: CustomerResponseDto[];
        total: number;
    }>;
    getAllDeliveryBoysPaginated(params: DeliveryBoyListingRequest): Promise<{
        data: DeliveryBoyResponse[];
        total: number;
    }>;

    getAllRetailersPaginated(params: RetailerListingRequest): Promise<{
        data:RetailerResponse[];
        total:number
    }>
    blockUser(userId: string): Promise<User>;
    unblockUser(userId: string): Promise<User>;
}