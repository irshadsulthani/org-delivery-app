import { ISendOtpUseCase } from './interface/ISendOtpUseCase';
import { GenerateOtpWithExpiry } from '../../../infrastructure/services/generateOtp';
import { SendOtpMail } from '../../../infrastructure/services/nodemailer';
import { saveOtp } from '../../../infrastructure/services/OtpStore';
import { IUserRepository } from '../../../infrastructure/database/repositories/interface/IUserRepository';

export class SendOtpUseCase implements ISendOtpUseCase {
  constructor(
    private readonly _userRepo: IUserRepository
  ) {}
  async execute(email: string): Promise<{ otp: string; expiresAt: Date }> {
    const registereEmail = await this._userRepo.findByEmail(email);
    if (registereEmail) {
      throw new Error('Email already registered');
    }
    const { otp, expiresAt } = GenerateOtpWithExpiry();
    await SendOtpMail(email, otp);
    await saveOtp(email, otp, expiresAt);
    return { otp: otp.toString(), expiresAt };
  }
}
