import { IDeliveryBoyRepository } from "../../../domain/interface/repositories/IDeliveryBoyRepository";
import { IUserRepository } from "../../../domain/interface/repositories/IUserRepository";
import { IAuthService } from "../../../domain/interface/services/IAuthService";
import { AppError } from "../../../utils/AppError";
import { StatusCode } from "../../../utils/statusCode";

export class LoginUser {
  constructor(
    private _userRepo: IUserRepository,
    private _authService: IAuthService,
    private _deliveryBoyRepo: IDeliveryBoyRepository
  ) {}

  async execute(email: string, password: string, allowedRoles: string[]): Promise<{
    name: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this._userRepo.findByEmail(email);
    if (!user) throw new AppError("Invalid credentials", StatusCode.UNAUTHORIZED);

    if (!allowedRoles.includes(user.role)) {
      throw new AppError("Access denied", StatusCode.FORBIDDEN);
    }

    const isMatch = await this._userRepo.comparePassword(password, user.password);
    if (!isMatch) throw new AppError("Invalid credentials", StatusCode.UNAUTHORIZED);

    if (user.role === 'deliveryBoy') {
      if (!user._id) throw new AppError("User ID not found", StatusCode.BAD_REQUEST);

      const deliveryBoy = await this._deliveryBoyRepo.findByUserId(user._id);
      if (!deliveryBoy) throw new AppError("Delivery boy profile not found", StatusCode.NOT_FOUND);

      if (deliveryBoy.verificationStatus === 'pending') {
        throw new AppError(
          "Your account is pending admin approval. Please wait.",
          StatusCode.FORBIDDEN,
          "info"
        );
      }

      if (deliveryBoy.verificationStatus === 'rejected') {
        throw new AppError(
          "Your verification request was rejected. Please contact admin.",
          StatusCode.FORBIDDEN,
          "info"
        );
      }
    }

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
