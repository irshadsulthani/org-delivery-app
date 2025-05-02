import OtpModel from '../../../infrastructure/database/schemas/otpModel';

export const verifyOtpForPasswordReset = async (
  email: string,
  enteredOtp: number
): Promise<void> => {
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

  // Optional: remove the OTP after successful verification
  await OtpModel.deleteOne({ email });
};
