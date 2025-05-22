import { DeliveryBoyListingRequest } from "../../../../domain/dtos/DeliveryBoyListingRequest";
import { DeliveryBoyResponse } from "../../../../domain/dtos/DeliveryBoyResponse";
import { User } from "../../../../domain/entities/User";


export interface IUserRepository {
    findByEmail (email : string): Promise<User |null>
    createUser(user: User): Promise<User>;
    comparePassword(inputPassword: string, storedHash: string): Promise<boolean>;
    getAllUsers(): Promise<User[]>;
    getAllCustomers(): Promise<User[]>;
    getAllDeliveryBoysPaginated(params: DeliveryBoyListingRequest): Promise<{
        data: DeliveryBoyResponse[];
        total: number;
    }>;

    getAllRetailers(): Promise<User[]>
    blockUser(userId: string): Promise<User>;
    unblockUser(userId: string): Promise<User>;
}