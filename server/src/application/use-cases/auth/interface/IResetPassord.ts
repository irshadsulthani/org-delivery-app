// src/domain/interface/use-case/IResetPassword.ts

import { IUserRepository } from "../../../../infrastructure/database/repositories/interface/IUserRepository";





export interface IResetPassword {
  execute(email: string, newPassword: string, userRepo: IUserRepository): Promise<void>;
}
