import { IUserRepository } from "../../../domain/interface/repositories/IUserRepository";


export class GetUsers {
    constructor(private _userRepo: IUserRepository) {}
    async execute() {
        try {
            const users = await this._userRepo.getAllUsers();
            return users.map(({ password, ...user }) => user);
        } catch (error) {
            throw new Error("Error fetching users");
        }
    }
    async executeCustomers() {
        try {
            const customers = await this._userRepo.getAllCustomers();
            return customers.map(({ password, ...user }) => user);
        } catch (error) {
            throw new Error("Error fetching customers");
        }
    }
    async excuteDeliveryBoys() {
        try {
            const deliveryBoys = await this._userRepo.getAllDeliveryBoys();
            return deliveryBoys.map(({ password, ...user }) => user);
        } catch (error) {
            throw new Error("Error fetching delivery Boys");
        }
    }
    async excuteReatilers(){
        try {
            const reatilers = await this._userRepo.getAllReatilers();
            return reatilers.map(({password, ...user}) => user )
        } catch (error) {
            throw new Error("Error fetching Reatilers")
        }
    }
}
