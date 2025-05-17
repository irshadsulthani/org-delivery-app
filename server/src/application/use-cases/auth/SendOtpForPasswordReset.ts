import { IUserRepository } from '../../../infrastructure/database/repositories/interface/IUserRepository';
import { GenerateOtpWithExpiry } from '../../../infrastructure/services/generateOtp';
import { SendOtpMail } from '../../../infrastructure/services/nodemailer';
import { saveOtp } from '../../../infrastructure/services/OtpStore';
import { ISendOtpForPasswordReset } from './interface/ISendOtpForPasswordReset';

export class SendOtpForPasswordReset implements ISendOtpForPasswordReset {
  constructor(private userRepo: IUserRepository) {}

  async execute(email: string): Promise<{ otp: string; expiresAt: Date }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error('User not found');

    const { otp, expiresAt } = GenerateOtpWithExpiry();
    await SendOtpMail(email, otp);
    await saveOtp(email, otp, expiresAt);

    return { otp: otp.toString(), expiresAt };
  }
}
