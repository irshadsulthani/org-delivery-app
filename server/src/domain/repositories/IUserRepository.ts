import { User } from "../entities/User";

export interface IUserRepository {
    findByEmail (email : string): Promise<User |null>
    createUser(user: User): Promise<User>;
    comparePassword(inputPassword: string, storedHash: string): Promise<boolean>;
    getAllUsers(): Promise<User[]>;
    getAllCustomers(): Promise<User[]>;
}