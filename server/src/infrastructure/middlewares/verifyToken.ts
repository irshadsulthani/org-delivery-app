import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

const ACCESS_SECRET = config.jwtAccessSecret;

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies?.accessToken;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  try {
    if (!ACCESS_SECRET) {
      throw new Error('ACCESS_SECRET is not defined');
    }
    const decoded = jwt.verify(token, ACCESS_SECRET);
    // @ts-ignore
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

