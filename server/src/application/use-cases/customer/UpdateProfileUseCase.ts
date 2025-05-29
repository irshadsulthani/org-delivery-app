import { UpdateProfileDTO } from "../../../domain/dtos/customer/ProfileDTOs";
import { Customer } from "../../../domain/entities/Customer";
import { User } from "../../../domain/entities/User";
import { ICustomerRepository } from "../../../infrastructure/database/repositories/interface/ICustomerRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";

export class UpdateProfileUseCase {
    constructor(
    private _userRepo: IUserRepository,
    private _customerRepo: ICustomerRepository
  ) {}

  async execute(userId: string, data: UpdateProfileDTO): Promise<void> {
    const updates: { user?: Partial<User>, customer?: Partial<Customer> } = {};

    if (data.name) {
      updates.user = { name: data.name };
    }

    if (data.phone) {
      updates.customer = { phone: data.phone };
    }

    if (updates.user) {
      await this._userRepo.update(userId, updates.user);
    }

    if (updates.customer) {
      await this._customerRepo.updateProfile(userId, updates.customer);
    }
  }

}
