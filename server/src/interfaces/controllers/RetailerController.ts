// src/interfaces/http/controllers/RetailerController.ts

import { Request, Response } from "express";
import { RetailersRepository } from "../../infrastructure/database/repositories/RetailersRepository";
import { RegisterRetailerShopUseCase } from "../../application/use-cases/retailers/RegisterRetailerUseCase";
import { StatusCode } from "../../utils/statusCode";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { GetRegistrationStatusUseCase } from "../../application/use-cases/retailers/GetRegistrationStatuseUseCase";

const retailerRepo = new RetailersRepository();
const registerUseCase = new RegisterRetailerShopUseCase(retailerRepo);
const userRepository = new UserRepository();

export class RetailerController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const {
        email,
        shopName,
        description,
        phone,
        address: { street, area, city, state, zipCode, country } = {}, // Default empty object to prevent errors if address is missing
      } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const shopImage = files["shopImage"][0];
      const licenseImage = files["shopLicense"][0];

      const user = await userRepository.findByEmail(email);
      if (!user) {
        res.status(StatusCode.NOT_FOUND).json({
          message: "User not found with the provided email",
        });
        return;
      }

      const registered = await registerUseCase.execute({
        userId: user._id as string,
        shopName,
        description,
        phone,
        shopImage,
        shopLicense: licenseImage,
        street,
        area,
        city,
        state,
        zipCode,
        country,
      });

      res.status(StatusCode.CREATED).json(registered);
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Registration failed", error: error.message });
    }
  }
  static async getRegisterStatus(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const useCase = new GetRegistrationStatusUseCase(
        retailerRepo,
        userRepository
      );
      const status = await useCase.execute(email);

      res.status(StatusCode.OK).json({
            registrationCompleted: status.registrationCompleted,
            verificationStatus: status.verificationStatus,
            // rejectionReason: status.rejectionReason,
            shopDetails: status.shopDetails
        });

    } catch (error: any) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Failed to get registration status",
        error: error.message,
      });
    }
  }
}
