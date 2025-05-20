import { JwtPayload } from 'jsonwebtoken';

export interface AuthPayload extends JwtPayload {
  _id: string;
  email?: string;
  role?: string;
}
