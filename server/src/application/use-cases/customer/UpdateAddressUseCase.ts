import { UpdateAddressDTO } from "../../../domain/dtos/customer/ProfileDTOs";
import { Address } from "../../../domain/entities/Customer";
import { ICustomerRepository } from "../../../infrastructure/database/repositories/interface/ICustomerRepository";

export class UpdateAddressUseCase {
  constructor(private _customerRepo: ICustomerRepository) {}

  async execute(userId: string, addressId: string, updates: UpdateAddressDTO): Promise<Address> {
    const customer = await this._customerRepo.updateAddress(userId, addressId, updates);
    const updatedAddress = customer.addresses.find(a => a._id?.equals(addressId));
    if (!updatedAddress) {
      throw new Error("Address not found after update");
    }
    return updatedAddress;
  }
}
