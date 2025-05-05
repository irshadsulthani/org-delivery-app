import { Request, Response } from 'express'; 
import { sendOtpUseCase } from "../../application/use-cases/auth/sendOtpUseCase";
// src/interfaces/controllers/verifyOtpController.ts
import { VerifyOtpAndRegisterUser } from '../../application/use-cases/auth/verifyOtpAndRegisterUser';
import { MongoUserRepository } from '../../infrastructure/database/repositories/MongoUserRepository';
import { sendOtpForPasswordReset } from '../../application/use-cases/auth/sendOtpForPasswordResetUseCase';
import { verifyOtpForPasswordReset } from '../../application/use-cases/auth/verifyOtpForPasswordResetUseCase';

export const handleOtpRequest = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  try {
    const { otp, expiresAt } = await sendOtpUseCase(email);

    res.status(200).json({ message: 'OTP sent successfully', otp, expiresAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

const userRepo = new MongoUserRepository();

export const verifyOtpController = async (req: Request, res: Response): Promise<void> => {
  const { email, otp, role,...userData  } = req.body;
  try {
    const useCase = new VerifyOtpAndRegisterUser(userRepo);
    const user = await useCase.execute({ email, ...userData }, otp, role);
    res.status(200).json({success:true, message: 'OTP verified and user registered successfully', user });
  } catch (err: any) {
    res.status(400).json({success:false, message: err.message });
  }
};

export const otpEmailForForgetPass = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const { otp, expiresAt } = await sendOtpForPasswordReset(email, userRepo);
    res.status(200).json({success:true, message: 'OTP sent successfully', otp, expiresAt });

  } catch (err: any) {
    if (err.message === 'User not found') {
      res.status(404).json({ message: err.message });
    } else if (err.message === 'Only customers can reset their password') {
      res.status(403).json({success:true, message: err.message });
    } else {
      res.status(500).json({success:false, message: 'Failed to send OTP' });
    }
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {  
  const { email, otp } = req.body;
  console.log('its in verifyOtp');
  
  console.log(req.body);
  
  try {
    await verifyOtpForPasswordReset(email, otp);
    res.status(200).json({success:true, message: 'OTP verified successfully' });
  } catch (err: any) {
    res.status(400).json({success:false, message: err.message });
  }
}
