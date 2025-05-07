import { Request, Response } from 'express'; 
import { sendOtpUseCase } from "../../application/use-cases/auth/sendOtpUseCase";
import { VerifyOtpAndRegisterUser } from '../../application/use-cases/auth/verifyOtpAndRegisterUser';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { sendOtpForPasswordReset } from '../../application/use-cases/auth/sendOtpForPasswordResetUseCase';
import { verifyOtpForPasswordReset } from '../../application/use-cases/auth/verifyOtpForPasswordResetUseCase';
import { StatusCode } from '../../utils/statusCode';

export const handleOtpRequest = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  try {
    const { otp, expiresAt } = await sendOtpUseCase(email);
    res.status(StatusCode.OK).json({ message: 'OTP sent successfully', otp, expiresAt });
  } catch (err) {
    console.error(err);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send OTP' });
  }
};

const userRepo = new UserRepository();

export const verifyOtpController = async (req: Request, res: Response): Promise<void> => {
  const { email, otp, role, ...userData } = req.body;
  try {
    const useCase = new VerifyOtpAndRegisterUser(userRepo);
    const user = await useCase.execute({ email, ...userData }, otp, role);
    res.status(StatusCode.OK).json({ success: true, message: 'OTP verified and user registered successfully', user });
  } catch (err: any) {
    res.status(StatusCode.BAD_REQUEST).json({ success: false, message: err.message });
  }
};

export const otpEmailForForgetPass = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const { otp, expiresAt } = await sendOtpForPasswordReset(email, userRepo);
    res.status(StatusCode.OK).json({ success: true, message: 'OTP sent successfully', otp, expiresAt });
  } catch (err: any) {
    if (err.message === 'User not found') {
      res.status(StatusCode.NOT_FOUND).json({ success: false, message: err.message });
    } else if (err.message === 'Only customers can reset their password') {
      res.status(StatusCode.FORBIDDEN).json({ success: false, message: err.message });
    } else {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to send OTP' });
    }
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {  
  const { email, otp } = req.body;  
  try {
    await verifyOtpForPasswordReset(email, otp);
    res.status(StatusCode.OK).json({ success: true, message: 'OTP verified successfully' });
  } catch (err: any) {
    res.status(StatusCode.BAD_REQUEST).json({ success: false, message: err.message });
  }
};
