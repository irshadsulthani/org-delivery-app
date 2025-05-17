// src/application/use-cases/auth/verifyOtpForPasswordReset.ts

import OtpModel from '../../../infrastructure/database/schemas/otpModel';
import { IVerifyOtpForPasswordReset } from './interface/IVerifyOtpForPasswordReset';

export class VerifyOtpForPasswordReset implements IVerifyOtpForPasswordReset {
  async execute(email: string, enteredOtp: number): Promise<void> {
    const otpEntry = await OtpModel.findOne({ email });
    
    if (!otpEntry) {
      throw new Error('OTP not found');
    }

    if (otpEntry.otp != enteredOtp) {
      throw new Error('Invalid OTP');
    }

    if (otpEntry.expiresAt < new Date()) {
      throw new Error('OTP expired');
    }

    await OtpModel.deleteOne({ email });
  }
}
