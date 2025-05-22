// // BlockCustomer.ts
// import { User } from "../../../domain/entities/User";
// import { userM } from "../../../infrastructure/database/schemas/userModel"; // <- add this export
// import { IBaseRepository } from "../../../infrastructure/database/repositories/interface/IBaseRepository";
// import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
// import { IBlockCustomer } from "./interface/IBlockCustomer";

// export class BlockCustomer implements IBlockCustomer {
//   constructor(
//     private readonly _userRepo: IUserRepository,
//     private readonly _baseRepo: IBaseRepository<User, userM>
//   ) {}

//   async execute(customerId: string): Promise<void> {
//     const customer = await this._baseRepo.findById(customerId);
//     if (!customer) {
//       throw new Error("Customer not found");
//     }

//     await this._baseRepo.update(customerId, { isBlocked: true });
//   }
// }

