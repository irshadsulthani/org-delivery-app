import { ICustomerRepository } from "../../../infrastructure/database/repositories/interface/ICustomerRepository";


export class DeleteAddressUseCase {
  constructor(private _customerRepo: ICustomerRepository) {}

  async execute(userId: string, addressId: string): Promise<void> {
    await this._customerRepo.deleteAddress(userId, addressId);
  }
}
