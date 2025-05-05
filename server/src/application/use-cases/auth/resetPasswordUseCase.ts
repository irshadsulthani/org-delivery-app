import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { PasswordService } from '../../../domain/services/PasswordService';
import { UserModel } from '../../../infrastructure/database/schemas/userModel';

export const resetPassword = async (
  email: string,
  newPassword: string,
  userRepo: IUserRepository
) => {
  const user = await userRepo.findByEmail(email);
  console.log('user user', user);
  
  if (!user) throw new Error('User not found');

  const hashedPassword = await PasswordService.hash(newPassword);
  await UserModel.updateOne({ email }, { password: hashedPassword });
};
