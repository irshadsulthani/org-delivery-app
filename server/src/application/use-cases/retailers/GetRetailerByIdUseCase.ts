import { RetailerShop } from "../../../domain/entities/RetailerShop";
import { RetailersRepository } from "../../../infrastructure/database/repositories/RetailersRepository";



export class GetRetailerByIdUseCase {
    constructor(private _retailerRepo: RetailersRepository ) {}

    async execute(id: string): Promise<RetailerShop> {
        const retailer = await this._retailerRepo.findByUserId(id)
        if (!retailer) {
            throw new Error('Retailer Not Found')
        }
        return retailer
    }
}