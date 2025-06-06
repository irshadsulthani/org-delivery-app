import { Types } from "mongoose";
import { AddressDTO } from "../../../domain/dtos/customer/ProfileDTOs";
import { Address } from "../../../domain/entities/Customer";
import { ICustomerRepository } from "../../../infrastructure/database/repositories/interface/ICustomerRepository";


export class AddAddressUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(userId: string, address: AddressDTO): Promise<Address> {
    const newAddress = {
      ...address,
      isDefault: false,
      _id: new Types.ObjectId()
    };
    const customer = await this.customerRepository.addAddress(userId, newAddress);
    return customer.addresses.find(a => a._id?.equals(newAddress._id))!;
  }
}
