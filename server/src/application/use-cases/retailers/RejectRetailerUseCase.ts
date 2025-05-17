import { IRetailersRepository } from "../../../infrastructure/database/repositories/interface/IRetailersRepository";
import { IRejectRetailerUseCase } from "./interface/IRejectRetailerUseCase";

export class RejectRetailerUseCase implements IRejectRetailerUseCase {
  constructor(private readonly retailerRepo: IRetailersRepository) {}

  async execute(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid retailer ID');
    }

    // const exists = await this.retailerRepo.exists(id);
    // if (!exists) {
    //   throw new Error('Retailer not found');
    // }

    await this.retailerRepo.updateVerificationStatus(
      id, 
      false, 
      'rejected'
    );
  }
}

