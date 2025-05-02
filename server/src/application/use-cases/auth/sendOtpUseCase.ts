import { verifyOtp } from './../../../../../client/src/api/userApi';
import { generateOtpWithExpiry } from '../../../infrastructure/services/generateOtp';
import { sendOtpMail } from '../../../infrastructure/services/nodemailer';
import { saveOtp } from '../../../infrastructure/services/otpStore';

export const sendOtpUseCase = async (email: string) => {
  const { otp, expiresAt } = generateOtpWithExpiry();
  await sendOtpMail(email, otp);
  saveOtp(email, otp, expiresAt);
  return { otp, expiresAt }; // You can skip sending this in prod
};

