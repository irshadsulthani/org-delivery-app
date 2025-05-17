import { ISendOtpUseCase } from './interface/ISendOtpUseCase';
import { GenerateOtpWithExpiry } from '../../../infrastructure/services/generateOtp';
import { SendOtpMail } from '../../../infrastructure/services/nodemailer';
import { saveOtp } from '../../../infrastructure/services/OtpStore';

export class SendOtpUseCase implements ISendOtpUseCase {
  async execute(email: string): Promise<{ otp: string; expiresAt: Date }> {
    const { otp, expiresAt } = GenerateOtpWithExpiry();
    await SendOtpMail(email, otp);
    await saveOtp(email, otp, expiresAt);
    return { otp: otp.toString(), expiresAt };
  }
}
