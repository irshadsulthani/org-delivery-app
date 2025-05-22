import { DeliveryBoyListingRequest } from "../../../domain/dtos/DeliveryBoyListingRequest";
import { DeliveryBoyResponse } from "../../../domain/dtos/DeliveryBoyResponse";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IGetUsers } from "./interface/IGetUsers";


export class GetUsers implements IGetUsers {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(): Promise<Omit<User, 'password'>[]> {
    return this.handleUserFetch(() => this.userRepo.getAllUsers());
  }

  async executeCustomers(): Promise<Omit<User, 'password'>[]> {
    return this.handleUserFetch(() => this.userRepo.getAllCustomers());
  }

  async executeDeliveryBoysPaginated(params: DeliveryBoyListingRequest): Promise<{
        data: DeliveryBoyResponse[];
        total: number;
    }> {
        try {
            return await this.userRepo.getAllDeliveryBoysPaginated(params);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error fetching delivery boys: ${error.message}`);
            }
            throw new Error("Error fetching delivery boys: Unknown error");
        }
    }


  async executeRetailers(): Promise<Omit<User, 'password'>[]> {
    return this.handleUserFetch(() => this.userRepo.getAllRetailers());
  }

  private async handleUserFetch(
    fetchFn: () => Promise<User[]>
  ): Promise<Omit<User, 'password'>[]> {
    try {
      const users = await fetchFn();
      return users.map(({ password, ...user }) => user);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching users: ${error.message}`);
      } else {
        throw new Error("Error fetching users: Unknown error");
      }
    }
  }
}

