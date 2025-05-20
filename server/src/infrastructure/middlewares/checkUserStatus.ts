// src/infrastructure/middlewares/checkUserStatus.ts
import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../database/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { StatusCode } from '../../utils/statusCode';

export const checkUserStatus = (userRepo: UserRepository) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get user ID from authenticated request
      const userId = (req.user as any).id;
      console.log('userId',userId);
      
      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: 'Unauthorized - User not identified'
        });
        return; // End the function without returning a value
      }

      // Fetch user from repository
      const user = await userRepo.findById(userId);
      console.log('user',user);
      
      if (!user) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Check if user is blocked
      if (user.isBlocked) {
        res.status(StatusCode.FORBIDDEN).json({
          success: false,
          message: 'Account blocked - Please contact support'
        });
        return;
      }

      // Check if user is verified
      if (!user.isVerified) {
        res.status(StatusCode.FORBIDDEN).json({
          success: false,
          message: 'Account not verified - Please verify your email'
        });
        return;
      }

      // Attach full user object to request for downstream use
      req.user = user;
      next(); // Continue to next middleware
    } catch (error) {
      next(error); // Pass errors to Express error handler
    }
  };
};