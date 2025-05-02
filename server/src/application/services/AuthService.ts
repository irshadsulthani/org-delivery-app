import jwt from 'jsonwebtoken';
import { User } from '../../domain/entities/User';
import { config } from '../../config/index';

const ACCESS_SECRET = config.jwtAccessSecret;
const REFRESH_SECRET = config.jwtRefreshSecret;

export class AuthService {
  static generateAccessToken(user: User): string {
    if (!user._id) {
      throw new Error('User ID is undefined');
    }
    if (!ACCESS_SECRET) {
      throw new Error('Access secret is not defined');
    }
    return jwt.sign({ id: user._id.toString(), role: user.role }, ACCESS_SECRET, {
      expiresIn: config.accessTokenExpiration, 
    });
  }

  static generateRefreshToken(user: User): string {
    if (!user._id) {
      throw new Error('User ID is undefined');
    }
    if (!REFRESH_SECRET) {
      throw new Error('Refresh secret is not defined');
    }
    return jwt.sign({ id: user._id.toString(), role: user.role }, REFRESH_SECRET, {
      expiresIn: config.refreshTokenExpiration,
    });
  }

  // Helper function to verify the refresh token
  static verifyRefreshToken(token: string): any {
    try {
      if (!REFRESH_SECRET) {
        throw new Error('Refresh secret is not defined');
      }
      return jwt.verify(token, REFRESH_SECRET);
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }
}
