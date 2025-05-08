// src/domain/interface/use-case/IResetPassword.ts

import { IUserRepository } from "../repositories/IUserRepository";

export interface IResetPassword {
  execute(email: string, newPassword: string, userRepo: IUserRepository): Promise<void>;
}
