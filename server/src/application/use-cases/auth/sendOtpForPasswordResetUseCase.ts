import { IUserRepository } from '../../../domain/interface/repositories/IUserRepository';
import { GenerateOtpWithExpiry } from '../../../infrastructure/services/GenerateOtp';
import { SendOtpMail } from '../../../infrastructure/services/Nodemailer';
import { saveOtp } from '../../../infrastructure/services/OtpStore';
import { ISendOtpForPasswordReset } from '../../../domain/interface/use-case/ISendOtpForPasswordReset';

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
