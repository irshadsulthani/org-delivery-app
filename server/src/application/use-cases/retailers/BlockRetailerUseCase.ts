import { IRetailersRepository } from "../../../infrastructure/database/repositories/interface/IRetailersRepository"
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository"
import { IBlockRetailerUseCase } from "./interface/IBlockRetailerUseCase"


export class BlockRetailerUseCase implements IBlockRetailerUseCase {
    constructor(
    private readonly _userRepo:IUserRepository,
    private readonly _retailerRepo:IRetailersRepository    
    ){}

    async execute(retailerId: string): Promise<void> {
        const retailer = await this._retailerRepo.findByUserId(retailerId)
        if(!retailer) throw new Error('Retailer Not Found')
        await this._userRepo.blockUser(retailer.userId._id.toString())
    }
}