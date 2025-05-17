import { RetailerShop } from "../../../domain/entities/RetailerShop";
import { IRetailersRepository } from "../../../infrastructure/database/repositories/interface/IRetailersRepository";
import { IGetPendingRetailerUseCase } from "./interface/IGetPendingRetailerUseCase";

export class GetPendingRetailerUseCase implements IGetPendingRetailerUseCase {
    constructor(private readonly retailerRepo: IRetailersRepository) {}
    
    async execute(): Promise<RetailerShop[]> {
        return this.retailerRepo.findPendingRetailers();
    }
}
