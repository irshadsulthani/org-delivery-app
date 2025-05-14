import { IRetailersRepository } from "../../../domain/interface/repositories/IRetailersRepository";
import { IUserRepository } from "../../../domain/interface/repositories/IUserRepository";


export class UnBlockRetailerUseCase{
    constructor(
        private _userRepo: IUserRepository,
        private _retailerRepo: IRetailersRepository
    ){}
    async execute(retailerId: string): Promise<void> {
        const retailer = await this._retailerRepo.findByUserId(retailerId)

        if(!retailer) throw new Error('Retailer not found')

        await this._userRepo.unblockUser(retailer.userId._id.toString())
    }
}