// application/use-cases/user/LoginUser.ts

import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AuthService } from '../../services/AuthService';

export class LoginUser {
  constructor(private _userRepo: IUserRepository) {}

  async execute(email: string, password: string, allowedRoles: string[]): Promise<{
    name: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this._userRepo.findByEmail(email);

    if (!user) throw new Error("Invalid credentials");

    // Check if user's role is allowed
    if (!allowedRoles.includes(user.role)) {
      throw new Error("Access denied");
    }

    const isMatch = await this._userRepo.comparePassword(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken(user);

    return {
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    };
  }
}
