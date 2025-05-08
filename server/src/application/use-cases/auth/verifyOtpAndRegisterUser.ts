// src/application/use-cases/auth/verifyOtpAndRegisterUser.ts

import OtpModel from '../../../infrastructure/database/schemas/otpModel';
import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/interface/repositories/IUserRepository';
import { IVerifyOtpAndRegisterUser } from '../../../domain/interface/use-case/IVerifyOtpAndRegisterUser';

export class VerifyOtpAndRegisterUser implements IVerifyOtpAndRegisterUser {
  constructor(private _userRepo: IUserRepository) {}

  async execute(user: User, enteredOtp: number, role?: User['role']): Promise<User> {
    const otpEntry = await OtpModel.findOne({ email: user.email });
  
    if (!otpEntry) throw new Error('OTP not found');
    if (otpEntry.otp != enteredOtp) throw new Error('Invalid OTP');
    if (otpEntry.expiresAt < new Date()) throw new Error('OTP expired');
  
    const existing = await this._userRepo.findByEmail(user.email);
    if (existing) throw new Error('Email already registered');
  
    user.role = role || 'customer';

    const newUser = await this._userRepo.createUser(user);
    await OtpModel.deleteOne({ email: user.email });
  
    return newUser;
  }
}
