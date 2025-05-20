import { IRetailersRepository } from "../../../infrastructure/database/repositories/interface/IRetailersRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IUnBlockRetailerUseCase } from "./interface/IUnBlockRetailerUseCase";


export class UnBlockRetailerUseCase implements IUnBlockRetailerUseCase {
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _retailerRepo: IRetailersRepository
    ) {}

    async execute(retailerId: string): Promise<void> {
        if (!retailerId || typeof retailerId !== 'string') {
            throw new Error('Invalid retailer ID');
        }

        const retailer = await this._retailerRepo.findByUserId(retailerId);
        if (!retailer) {
            throw new Error(`Retailer with ID ${retailerId} not found`);
        }

        await this._userRepo.unblockUser(retailer.userId._id.toString());
    }
}