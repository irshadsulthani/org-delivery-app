import { IUserRepository } from "../../../domain/interface/repositories/IUserRepository";
import { IAuthService } from "../../../domain/interface/services/IAuthService";


export class LoginUser {
  constructor(
    private _userRepo: IUserRepository,
    private _authService: IAuthService  // Injecting the IAuthService
  ) {}

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

    // Using injected _authService to generate tokens
    const accessToken = this._authService.generateAccessToken(user);
    const refreshToken = this._authService.generateRefreshToken(user);

    return {
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    };
  }
}
