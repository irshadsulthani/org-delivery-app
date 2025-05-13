import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../../config';
import { StatusCode } from '../../utils/statusCode';

const ACCESS_SECRET = config.jwtAccessSecret;

// Extend Express Request type to include user
declare module 'express-serve-static-core' {
  interface Request {
    user?: string | JwtPayload;
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(StatusCode.UNAUTHORIZED).json({ message: 'Access token not found' });
    return;
  }

  try {
    if (!ACCESS_SECRET) {
      throw new Error('JWT access secret is not defined');
    }
    const decoded = jwt.verify(token, ACCESS_SECRET) as JwtPayload;
    
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(StatusCode.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
  }
};
