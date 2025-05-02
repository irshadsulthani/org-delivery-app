// src/infrastructure/services/otpStore.ts
import OtpModel from '../database/schemas/otpModel';

export const saveOtp = async (email: string, otp: number, expiresAt: Date) => {
  await OtpModel.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true }
  );
};
