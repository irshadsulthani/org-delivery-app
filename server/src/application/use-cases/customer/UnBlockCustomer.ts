import { ICustomerRepository } from "../../../infrastructure/database/repositories/interface/ICustomerRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IUnBlockCustomer } from "./interface/IUnBlockCustomer";

export class UnBlockCustomer implements IUnBlockCustomer {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _customerRepo: ICustomerRepository
  ) {}
  async execute(customerId: string): Promise<void> {
    if (!customerId || typeof customerId !== 'string') {
      throw new Error('Invalid customer ID');
    }
    const customer = await this._customerRepo.findByUserId(customerId);
    if (!customer) {
      throw new Error('Customer Not found');
    }
    const userId = typeof customer.userId === 'string'
        ? customer.userId
        : customer.userId._id?.toString();
    await this._userRepo.unblockUser(userId);
  }
}
