// BlockCustomer.ts
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IBlockCustomer } from "./interface/IBlockCustomer";
import { ICustomerRepository } from "../../../infrastructure/database/repositories/interface/ICustomerRepository";

export class BlockCustomer implements IBlockCustomer {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _customerRepo: ICustomerRepository
  ) {}

  async execute(customerId: string): Promise<void> {
    // First find the customer by userId
    const customer = await this._customerRepo.findByUserId(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    // Then block the user in the User repository
    await this._userRepo.blockUser(customerId);
  }
}