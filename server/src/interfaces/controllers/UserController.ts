
import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { StatusCode } from "../../utils/statusCode";
import { GetCustomerDashboardUseCase } from "../../application/use-cases/customer/GetCustomerDashboardUseCase";
import { CustomerRepository } from "../../infrastructure/database/repositories/CustomerRepository";
import { GetProfileUseCase } from "../../application/use-cases/customer/GetProfileUseCase";
import { uploadToCloudinary } from "../../infrastructure/cloudinary/cloudinary";
import { UpdateProfileDTO } from "../../domain/dtos/customer/ProfileDTOs";
import { UpdateProfileUseCase } from "../../application/use-cases/customer/UpdateProfileUseCase";
import { AddAddressUseCase } from "../../application/use-cases/customer/AddAddressUseCase";
import { UpdateAddressUseCase } from "../../application/use-cases/customer/UpdateAddressUseCase";
import { DeleteAddressUseCase } from "../../application/use-cases/customer/DeleteAddressUseCase";
import { SetDefaultAddressUseCase } from "../../application/use-cases/customer/SetDefaultAddressUseCase";

const userRepo = new UserRepository();
const customerRepo = new CustomerRepository();
const getDashboardUseCase = new GetCustomerDashboardUseCase(customerRepo);
const getProfileUseCase = new GetProfileUseCase(customerRepo, userRepo);
const addAddressUseCase = new AddAddressUseCase(customerRepo);
const updateAddressUsecase = new UpdateAddressUseCase(customerRepo);
const deleteAddressUseCase = new DeleteAddressUseCase(customerRepo);
const setDefaultAddress = new SetDefaultAddressUseCase(customerRepo);

export class UserController {
  private static getUserId(req: Request): string {
    return (req.user as any).id;
  }
  static getGoogleLoginUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { email } = req.params;
      const user = await userRepo.findByEmail(email);
      res.status(StatusCode.OK).json(user);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      res.status(StatusCode.BAD_REQUEST).json({ message });
    }
  };
  static getDashboardData = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const customerData = await getDashboardUseCase.execute(userId);
      res.status(StatusCode.OK).json(customerData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      const statusCode = message.includes("not found")
        ? StatusCode.NOT_FOUND
        : StatusCode.BAD_REQUEST;
      res.status(statusCode).json({ message });
    }
  };
  static getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const useCase = await getProfileUseCase.execute(userId);
      res.status(StatusCode.OK).json(useCase);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      res.status(StatusCode.BAD_REQUEST).json({ message });
    }
  };
  static updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const { name, phone } = req.body;
      let profileImageUrl: string | undefined;
      if (req.file) {
        const fileBuffer = req.file.buffer;
        const filename = `profile_${userId}_${Date.now()}`;
        profileImageUrl = await uploadToCloudinary(fileBuffer, filename);
      }
      const updateData: UpdateProfileDTO = {
        name,
        phone,
        profileImageUrl: profileImageUrl ?? "",
      };
      const updateProfileUseCase = new UpdateProfileUseCase(
        userRepo,
        customerRepo
      );
      await updateProfileUseCase.execute(userId, updateData);

      res
        .status(StatusCode.OK)
        .json({ message: "Profile updated successfully" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      res.status(StatusCode.BAD_REQUEST).json({ message });
    }
  };
  static addCustomerAddress = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const address = req.body;
      const useCase = await addAddressUseCase.execute(userId, address);
      res.status(StatusCode.CREATED).json(useCase);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      res.status(StatusCode.BAD_REQUEST).json({ message });
    }
  };
  static updateAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("updateAddress called");
      const userId = this.getUserId(req);
      const addressId = req.params.addressId;
      const addressData = req.body;
      const useCase = await updateAddressUsecase.execute(
        userId,
        addressId,
        addressData
      );
      res.status(StatusCode.OK).json(useCase);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      res.status(StatusCode.BAD_REQUEST).json({ message });
    }
  };
  static deleteAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("deleteAddress called");
      const userId = this.getUserId(req);
      const addressId = req.params.addressId;
      await deleteAddressUseCase.execute(userId, addressId);
      res
        .status(StatusCode.OK)
        .json({ message: "Address deleted successfully" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete address";
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message });
    }
  };
  static setDefaultAddress = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const addressId = req.params.addressId;
      const useCase = await setDefaultAddress.execute(userId, addressId);
      res.status(StatusCode.OK).json({ message: "Default address updated" });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to set default address";
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message });
    }
  };
}
