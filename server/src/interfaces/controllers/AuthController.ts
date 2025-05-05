import { resetPassword } from './../../application/use-cases/auth/resetPasswordUseCase';
import { Request, Response } from 'express';
import { VerifyOtpAndRegisterUser } from '../../application/use-cases/auth/verifyOtpAndRegisterUser';
import { LoginUser } from '../../application/use-cases/user/LoginUser';
import { MongoUserRepository } from '../../infrastructure/database/repositories/MongoUserRepository';
import { User } from '../../domain/entities/User';
import { AuthService } from '../../application/services/AuthService';
import { config } from '../../config';

const userRepo = new MongoUserRepository();

export class AuthController {
  static register = async (req: Request, res: Response) => {
    try {
      const { otp, ...userData } = req.body as User & { otp: number };
      const useCase = new VerifyOtpAndRegisterUser(userRepo);
      const user = await useCase.execute(userData, otp);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      
      const useCase = new LoginUser(userRepo);
      const result = await useCase.execute(req.body.email, req.body.password,['customer']);

      // Set the access token cookie
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: config.accessTokenExpiration , // 1 hour
      });

      // Set the refresh token cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: config.refreshTokenExpiration, // 7 days
      });

      // Remove tokens from response body
      const { accessToken, refreshToken, ...userData } = result;

      // Send back the user data without tokens (since tokens are in cookies)
      res.status(200).json(userData);
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  };

  static adminLogin = async (req: Request, res: Response) => {
    try {
      const useCase = new LoginUser(userRepo);
      const result = await useCase.execute(req.body.email, req.body.password,['admin']);
      const { accessToken, refreshToken, ...userData } = result;
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: config.accessTokenExpiration,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: config.refreshTokenExpiration,
      });
  
      res.status(200).json(userData); 
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  };

  static adminLogout = async (req: Request, res: Response) => {
    try {
      // Clear the cookies
      res.clearCookie('accessToken', { httpOnly: true, sameSite: 'strict' });
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to logout' });
    }
  };

  static userLogut = async (req: Request, res: Response) => {
    try {
      res.clearCookie('accessToken', { httpOnly: true, sameSite: 'strict' });
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to logout' });
    }
  };

  static refreshAccessToken = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
         res.status(401).json({ message: 'No refresh token found' });
         return
      }
  
      const userData = AuthService.verifyRefreshToken(refreshToken);

      const user = await userRepo.findById(userData.id);

      if (!user) {
        throw new Error('User not found');
      }
  
      const newAccessToken = AuthService.generateAccessToken(user);
      
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: config.accessTokenExpiration, // 1 hour
      });
  
      res.status(200).json({ accessToken: newAccessToken });
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  };

  static resetPassword = async (req: Request, res: Response) => {   
    const { email, password } = req.body;
    try {
      await resetPassword(email, password, userRepo);
       res.status(200).json({ success: true, message: 'Password reset successfully' })
    } catch (err: any) {
      res.status(400).json({success:false, message: err.message });
    }
  }
  static googleCallback = async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      
      const accessToken = AuthService.generateAccessToken(user);
      const refreshToken = AuthService.generateRefreshToken(user);
  
      // Set tokens as HTTP-only cookies
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: config.accessTokenExpiration,
      });
  
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: config.refreshTokenExpiration,
      });
      res.redirect(`${config.frontendUrl}/?email=${encodeURIComponent(user.email)}`);
    } catch (err) {
      console.error('OAuth callback error:', err);
      res.status(500).json({ error: 'OAuth login failed' });
    }
  };
  static deliveryBoyLogin = async (req: Request, res: Response) => {
    try {
      const useCase = new LoginUser(userRepo);
      const result = await useCase.execute(req.body.email, req.body.password,['deliveryBoy']);
      const { accessToken, refreshToken, ...userData } = result;
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: config.accessTokenExpiration,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: config.refreshTokenExpiration,
      });
      res.status(200).json({success:true,userData}); 
    } catch (err: any) {
      res.status(401).json({ success:false,message: err.message });
    }
  }
  static deliveryBoyLogout = async (req: Request, res: Response) => {
    try {
      res.clearCookie('accessToken', { httpOnly: true, sameSite: 'strict' });
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to logout' });
    }
  }
  static reatilerLogin = async (req: Request, res:Response) =>{
    try {
      const useCase = new LoginUser(userRepo)
      const result = await useCase.execute(req.body.email, req.body.password,['retailer'])
      const {accessToken, refreshToken, ...userData} = result

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: config.accessTokenExpiration,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: config.refreshTokenExpiration,
      });
      res.status(200).json({success:true,userData}); 
    } catch (err: any) {
      res.status(401).json({ success:false,message: err.message });
    }
  }
  static reatilerLogout = async (req: Request , res: Response) => {
    try {
      console.log('its here coming reatiler lgoout');
      
      res.clearCookie('accessToken', {httpOnly:true, sameSite: 'strict'})
      res.clearCookie('refreshToken', {httpOnly: true, sameSite : 'strict'})
      res.status(200).json({success:true, message:'Logout Success'})
    } catch (error) {
      res.status(500).json({success:false, message: 'Failed to Logout'})
    }
  }
}
