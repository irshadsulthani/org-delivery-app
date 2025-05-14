import { IRetailersRepository } from './../../../domain/interface/repositories/IRetailersRepository';
import { IUserRepository } from "../../../domain/interface/repositories/IUserRepository";


export class BlockRetailerUseCase {
    constructor(
    private _userRepo:IUserRepository,
    private _retailerRepo:IRetailersRepository    
    ){}

    async execute(retailerId: string): Promise<void> {
        const retailer = await this._retailerRepo.findByUserId(retailerId)
        if(!retailer) throw new Error('Retailer Not Found')
        await this._userRepo.blockUser(retailer.userId._id.toString())
    }
}