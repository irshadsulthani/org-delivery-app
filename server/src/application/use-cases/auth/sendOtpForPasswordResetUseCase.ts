import { generateOtpWithExpiry } from '../../../infrastructure/services/generateOtp';
import { sendOtpMail } from '../../../infrastructure/services/nodemailer';
import { saveOtp } from '../../../infrastructure/services/otpStore';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

export const sendOtpForPasswordReset = async (
  email: string,
  userRepo: IUserRepository
) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error('User not found');
  const { otp, expiresAt } = generateOtpWithExpiry();
  await sendOtpMail(email, otp);
  await saveOtp(email, otp, expiresAt);
  return { otp, expiresAt };
};
