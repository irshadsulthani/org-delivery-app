import { User } from "../../../../domain/entities/User";


export interface IGetUsers {
    execute(): Promise<Omit<User, 'password'>[]>;
    executeCustomers(): Promise<Omit<User, 'password'>[]>;
    executeDeliveryBoys(): Promise<Omit<User, 'password'>[]>;
    executeRetailers(): Promise<Omit<User, 'password'>[]>;
}

