import { RetailerShop } from "../../../domain/entities/RetailerShop";
import { IRetailersRepository } from "../../../domain/interface/repositories/IRetailersRepository";


export class GetPendingRetailerUseCase {
    static execute() {
      throw new Error('Method not implemented.');
    }
    constructor (private  _retailerRepo: IRetailersRepository){}
    
    async execute(): Promise<RetailerShop[]>{
        return await this._retailerRepo.findPendingRetailers();
    } 
}