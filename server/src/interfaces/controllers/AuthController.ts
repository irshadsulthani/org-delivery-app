import { Request, Response } from 'express';
import { LoginUser } from '../../application/use-cases/user/LoginUser';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { AuthService } from '../../application/services/AuthService';
import { config } from '../../config';
import { StatusCode } from '../../utils/statusCode';
import { ResetPasswordUseCase } from '../../application/use-cases/auth/ResetPasswordUseCase';
import { VerifyOtpAndRegisterUser } from '../../application/use-cases/auth/VerifyOtpAndRegisterUser';
import { DeliveryBoyRepository } from '../../infrastructure/database/repositories/DeliveryBoyRepository';


const userRepo = new UserRepository();
const authService = new AuthService();
const deliveryBoyRepo = new DeliveryBoyRepository();

export class AuthController {
  static register = async (req: Request, res: Response) => {
    try {
      const { otp, ...userData } = req.body as User & { otp: number };
      const useCase = new VerifyOtpAndRegisterUser(userRepo);
      const user = await useCase.execute(userData, otp);
      const userId = user._id
      console.log(userId);
      
      res.status(StatusCode.CREATED).json(user);
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const useCase = new LoginUser(userRepo, authService, deliveryBoyRepo);

      const result = await useCase.execute(req.body.email, req.body.password, ['customer']);

      // Set the access token cookie
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: Number(config.accessTokenExpiration),
      });
  
      // Set the refresh token cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: Number(config.refreshTokenExpiration),
      });
  
      // Remove tokens from response body
      const { accessToken, refreshToken, ...userData } = result;
  
      // Send back the user data without tokens
      res.status(StatusCode.OK).json(userData);
    } catch (err: any) {
      console.error('Login Error: ', err); // Log the error for debugging
      res.status(StatusCode.UNAUTHORIZED).json({ message: err.message });
    }
  };
  

  static adminLogin = async (req: Request, res: Response) => {
    try {
      
      const useCase = new LoginUser(userRepo , authService, deliveryBoyRepo);
      
      const result = await useCase.execute(req.body.email, req.body.password,['admin']);
      
      const { accessToken, refreshToken, ...userData } = result;
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: Number(config.accessTokenExpiration),
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: Number(config.refreshTokenExpiration),
      });
  
      res.status(StatusCode.OK).json(userData); 
    } catch (err: any) {
      res.status(StatusCode.UNAUTHORIZED).json({ message: err.message });
    }
  };

  static adminLogout = async (req: Request, res: Response) => {
    try {
      // Clear the cookies
      res.clearCookie('accessToken', { httpOnly: true, sameSite: 'strict' });
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
      res.status(StatusCode.OK).json({ message: 'Logged out successfully' });
    } catch (err: any) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to logout' });
    }
  };

  static userLogut = async (req: Request, res: Response) => {
    try {
      res.clearCookie('accessToken', { httpOnly: true, sameSite: 'strict' });
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
      res.status(StatusCode.OK).json({ message: 'Logged out successfully' });
    } catch (err: any) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to logout' });
    }
  };

  static refreshAccessToken = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        res.status(StatusCode.UNAUTHORIZED).json({ message: 'No refresh token found' });
        return;
      }
  
      // Using the verifyRefreshToken method
      const userData = authService.verifyRefreshToken(refreshToken);
      
      const user = await userRepo.findById(userData.id);

      if (!user) {
        throw new Error('User not found');
      }
  
      // Generate new access token using the generateAccessToken method
      const newAccessToken = authService.generateAccessToken(user);
      

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: Number(config.accessTokenExpiration),
      });
  
      res.status(StatusCode.OK).json({ accessToken: newAccessToken });
    } catch (err: any) {
      res.status(StatusCode.UNAUTHORIZED).json({ message: err.message });
    }
  };
  

  static resetPassword = async (req: Request, res: Response) => {   
    const { email, password } = req.body;
    try {
      const resetPasswordInstance = new ResetPasswordUseCase(userRepo);
       await resetPasswordInstance.execute(email, password);

       res.status(StatusCode.OK).json({ success: true, message: 'Password reset successfully' })
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({success:false, message: err.message });
    }
  }
  static googleCallback = async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      
      const accessToken = authService.generateAccessToken(user);
      const refreshToken = authService.generateRefreshToken(user);
  
      // Set tokens as HTTP-only cookies
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: Number(config.accessTokenExpiration),
      });
  
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: Number(config.refreshTokenExpiration),
      });
      res.redirect(`${config.frontendUrl}/?email=${encodeURIComponent(user.email)}`);
    } catch (err) {
      console.error('OAuth callback error:', err);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: 'OAuth login failed' });
    }
  };
  static deliveryBoyLogin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      // 1. Validate credentials
      const useCase = new LoginUser(userRepo, authService, deliveryBoyRepo);
      const result = await useCase.execute(email, password, ['deliveryBoy']);
      
      
      // 3. Proceed with login if approved
      const { accessToken, refreshToken, ...userData } = result;
  
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: Number(config.accessTokenExpiration),
      });
  
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: Number(config.refreshTokenExpiration),
      });
  
      res.status(StatusCode.OK).json({
        success: true,
        userData: {
          ...userData,
        }
      });
  
    } catch (err: any) {
      res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: err.message || 'Login failed'
      });
    }
  };
  
  static deliveryBoyLogout = async (req: Request, res: Response) => {
    try {
      res.clearCookie('accessToken', { httpOnly: true, sameSite: 'strict' });
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
      res.status(StatusCode.OK).json({ message: 'Logged out successfully' });
    } catch (err: any) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to logout' });
    }
  }
  static reatilerLogin = async (req: Request, res:Response) =>{
    try {
      const useCase = new LoginUser(userRepo, authService, deliveryBoyRepo)
      const result = await useCase.execute(req.body.email, req.body.password,['retailer'])
      const {accessToken, refreshToken, ...userData} = result

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: Number(config.accessTokenExpiration),
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: Number(config.refreshTokenExpiration),
      });
      res.status(StatusCode.OK).json({success:true,userData}); 
    } catch (err: any) {
      res.status(StatusCode.UNAUTHORIZED).json({ success:false,message: err.message });
    }
  }
  static reatilerLogout = async (req: Request , res: Response) => {
    try {
      res.clearCookie('accessToken', {httpOnly:true, sameSite: 'strict'})
      res.clearCookie('refreshToken', {httpOnly: true, sameSite : 'strict'})
      res.status(StatusCode.OK).json({success:true, message:'Logout Success'})
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({success:false, message: 'Failed to Logout'})
    }
  }
}
