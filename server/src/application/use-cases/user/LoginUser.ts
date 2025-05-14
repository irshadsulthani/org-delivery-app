import { IDeliveryBoyRepository } from "../../../domain/interface/repositories/IDeliveryBoyRepository";
import { IRetailersRepository } from "../../../domain/interface/repositories/IRetailersRepository";
import { IUserRepository } from "../../../domain/interface/repositories/IUserRepository";
import { IAuthService } from "../../../domain/interface/services/IAuthService";
import { AppError } from "../../../utils/AppError";
import { StatusCode } from "../../../utils/statusCode";

export class LoginUser {
  constructor(
    private _userRepo: IUserRepository,
    private _authService: IAuthService,
    private _deliveryBoyRepo: IDeliveryBoyRepository,
    private _retailerRepo: IRetailersRepository
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
    
    if (user.role === 'retailer') {
      if (!user._id) {
        throw new AppError("User ID is missing", StatusCode.BAD_REQUEST);
      }
      const retailer = await this._retailerRepo.findByUserId(user._id);
      if (!retailer) {
        throw new AppError("Retailer profile not found", StatusCode.NOT_FOUND);
      }

      if (user.isBlocked) {
        throw new AppError("Your account has been blocked. Please contact support.", StatusCode.FORBIDDEN, "info");
      }

      if (retailer.verificationStatus === 'pending') {
        throw new AppError("Your account is pending admin approval. Please wait.", StatusCode.FORBIDDEN, "info");
      }

      if (retailer.verificationStatus === 'rejected') {
        throw new AppError("Your verification request was rejected. Please contact admin.", StatusCode.FORBIDDEN, "info");
      }
    }

    // ✅ DELIVERY BOY CHECK
    if (user.role === 'deliveryBoy') {
      if (!user._id) {
        throw new AppError("User ID is missing", StatusCode.BAD_REQUEST);
      }
      const deliveryBoy = await this._deliveryBoyRepo.findByUserId(user._id);

      if (!deliveryBoy) {
        throw new AppError("Delivery boy profile not found", StatusCode.NOT_FOUND);
      }

      if (deliveryBoy.verificationStatus === 'pending') {
        throw new AppError("Your account is pending admin approval. Please wait.", StatusCode.FORBIDDEN, "info");
      }

      if (deliveryBoy.verificationStatus === 'rejected') {
        throw new AppError("Your verification request was rejected. Please contact admin.", StatusCode.FORBIDDEN, "info");
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
