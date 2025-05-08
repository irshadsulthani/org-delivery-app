// src/application/use-cases/ResetPasswordUseCase.ts

import { IUserRepository } from "../../../domain/interface/repositories/IUserRepository";
import { IResetPassword } from "../../../domain/interface/use-case/IResetPassord";
import { PasswordService } from "../../../domain/services/PasswordService";
import { UserModel } from "../../../infrastructure/database/schemas/userModel";


export class ResetPasswordUseCase implements IResetPassword {
  constructor(private _userRepo: IUserRepository) {}

  async execute(email: string, newPassword: string): Promise<void> {
    const user = await this._userRepo.findByEmail(email);

    if (!user) throw new Error('User not found');

    const hashedPassword = await PasswordService.hash(newPassword);
    await UserModel.updateOne({ email }, { password: hashedPassword });
  }
}
