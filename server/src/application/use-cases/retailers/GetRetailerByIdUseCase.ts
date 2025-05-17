import { RetailerShop } from "../../../domain/entities/RetailerShop";
import { IRetailersRepository } from "../../../infrastructure/database/repositories/interface/IRetailersRepository";
import { IGetRetailerByIdUseCase } from "./interface/IGetRetailerByIdUseCase";

export class GetRetailerByIdUseCase implements IGetRetailerByIdUseCase {
  constructor(private readonly retailerRepo: IRetailersRepository) {}
  async execute(id: string): Promise<RetailerShop> {
    if (!id) {
      throw new Error("Retailer ID is required");
    }
    const retailer = await this.retailerRepo.findByUserId(id);
    if (!retailer) {
      throw new Error(`Retailer with ID ${id} not found`);
    }

    return retailer;
  }
}
