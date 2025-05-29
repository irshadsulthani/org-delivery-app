import { ICustomerRepository } from "../../../infrastructure/database/repositories/interface/ICustomerRepository";

export class SetDefaultAddressUseCase {
  constructor(private _customerRepo: ICustomerRepository) {}

  async execute(userId: string, addressId: string): Promise<void> {
    await this._customerRepo.setDefaultAddress(userId, addressId);
  }
}
