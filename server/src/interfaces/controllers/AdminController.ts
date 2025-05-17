// src/infrastructure/controllers/AdminController.ts
import { Request, Response } from "express";
import { StatusCode } from "../../utils/statusCode";
import { GetUsers } from "../../application/use-cases/user/GetUsers";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { DeliveryBoyRepository } from "../../infrastructure/database/repositories/DeliveryBoyRepository";
import { GetPendingDeliveryBoys } from "../../application/use-cases/deliveryBoy/GetPendingDeliveryBoys";
import { ApproveDeliveryBoy } from "../../application/use-cases/deliveryBoy/ApproveDeliveryBoy";
import { RejectDeliveryBoy } from "../../application/use-cases/deliveryBoy/RejectDeliveryBoy";
import { RatingService } from "../../application/services/RatingService";
import { GetDeliveryBoyById } from "../../application/use-cases/deliveryBoy/GetDeliveryBoyById";
import { GetPendingRetailerUseCase } from "../../application/use-cases/retailers/GetPendingRetailerUseCase";
import { ApproveRetailerUseCase } from "../../application/use-cases/retailers/ApproveRetailerUseCase";
import { RetailersRepository } from "../../infrastructure/database/repositories/RetailersRepository";
import { GetRetailerByIdUseCase } from "../../application/use-cases/retailers/GetRetailerByIdUseCase";
import { RejectRetailerUseCase } from "../../application/use-cases/retailers/RejectRetailerUseCase";
import { BlockRetailerUseCase } from "../../application/use-cases/retailers/BlockRetailerUseCase";
import { UnBlockRetailerUseCase } from "../../application/use-cases/retailers/UnBlockRetailerUseCase";

const userRepo = new UserRepository();
const deliveryBoyRepo = new DeliveryBoyRepository();
const ratingService = new RatingService();
const retailerRepo = new RetailersRepository();

export class AdminController {
  static getUsers = async (req: Request, res: Response) => {
    try {
      const useCase = new GetUsers(userRepo);
      const users = await useCase.execute();
      res.status(StatusCode.OK).json(users);
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
  };

  static getAllCustomers = async (req: Request, res: Response) => {
    try {
      const useCase = new GetUsers(userRepo);
      const customers = await useCase.executeCustomers();
      res.status(StatusCode.OK).json(customers);
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
  };

  static getAllDeliveryBoys = async (req: Request, res: Response) => {
    try {
      const useCase = new GetUsers(userRepo);
      const deliveryBoys = await useCase.executeDeliveryBoys();
      const transformedData = deliveryBoys.map((boy: any) => ({
        _id: boy._id,
        userId: boy.userId,
        name: boy.name,
        email: boy.email,
        phone: boy.phone,
        status: boy.status || "Active",
        joinDate: boy.createdAt,
        deliveries: boy.totalDeliveredOrders || 0,
        rating: ratingService.calculateAverageRating(boy),
        area: `${boy.city}, ${boy.state}`,
        vehicleType: boy.vehicleType || "Bike",
        isBlocked: boy.isBlocked || false,
        isVerified: boy.verificationStatus === "approved",
        createdAt: boy.createdAt,
      }));

      res.status(StatusCode.OK).json(transformedData);
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
  };

  static blockDelveryBoy = async (req: Request, res: Response) => {};
  static UnblockDelveryBoy = async (req: Request, res: Response) => {};

  static getAllRetailers = async (req: Request, res: Response) => {
    try {
      const useCase = new GetUsers(userRepo);
      const retailers = await useCase.executeRetailers();
      const transformedData = retailers.map((retailer: any) => ({
        _id: retailer._id,
        userId: retailer.shopId,
        shopName: retailer.shopName,
        name: retailer.name,
        email: retailer.email,
        phone: retailer.phone || "",
        status: retailer.isBlocked ? "Blocked" : "Active",
        joinDate: retailer.createdAt,
        totalOrders: 0,
        rating: retailer.shopRating || 0,
        address: {
          street: retailer.address?.street || "",
          city: retailer.address?.city || "",
          state: retailer.address?.state || "",
        },
        shopImageUrl: retailer.shopImageUrl,
        licenseStatus: retailer.shopLicenseUrl ? "uploaded" : "pending",
        isBlocked: retailer.isBlocked || false,
        isVerified: retailer.shopIsVerified || false,
        createdAt: retailer.createdAt,
        updatedAt: retailer.updatedAt,
      }));
      res.status(StatusCode.OK).json(transformedData);
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
  };
  static getPendingDeliveryBoys = async (req: Request, res: Response) => {
    try {
      const useCase = new GetPendingDeliveryBoys(deliveryBoyRepo);
      const pendingDeliveryBoys = await useCase.execute();

      // Transform data to include user details
      const result = pendingDeliveryBoys.map((deliveryBoy) => ({
        id: deliveryBoy._id,
        userId: deliveryBoy.userId,
        name: (deliveryBoy.userId as any)?.name || "Unknown",
        email: (deliveryBoy.userId as any)?.email || "",
        phone: deliveryBoy.phone,
        status: deliveryBoy.verificationStatus,
        createdAt: deliveryBoy.createdAt,
        profileImageUrl: deliveryBoy.profileImageUrl,
        verificationImageUrl: deliveryBoy.verificationImageUrl,
      }));

      res.status(StatusCode.OK).json(result);
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
  };

  static approveDeliveryBoy = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const useCase = new ApproveDeliveryBoy(deliveryBoyRepo);
      await useCase.execute(id);
      res
        .status(StatusCode.OK)
        .json({ message: "Delivery boy approved successfully" });
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
  };

  static rejectDeliveryBoy = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const useCase = new RejectDeliveryBoy(deliveryBoyRepo);
      await useCase.execute(id);
      res
        .status(StatusCode.OK)
        .json({ message: "Delivery boy rejected successfully" });
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
  };

  static getDeliveryBoyById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const useCase = new GetDeliveryBoyById(deliveryBoyRepo);

      const deliveryBoy = await useCase.execute(id);

      // Return the delivery boy data
      res.status(StatusCode.OK).json(deliveryBoy);
    } catch (err: any) {
      console.error("Error fetching delivery boy:", err);
      res.status(StatusCode.NOT_FOUND).json({
        message: err.message || "Delivery boy not found",
      });
    }
  };
  static getPendingRetailers = async (req: Request, res: Response) => {
    try {
      const useCase = new GetPendingRetailerUseCase(retailerRepo);
      const pendingRetailers = await useCase.execute();

      res.status(StatusCode.OK).json(pendingRetailers);
    } catch (error: any) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Failed to fetch pending retailers",
        error: error.message,
      });
    }
  };
  static approveRetailer = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const useCase = new ApproveRetailerUseCase(retailerRepo);
      await useCase.execute(id);
      res.status(StatusCode.OK).json({
        message: "Retailer approved successfully",
      });
    } catch (error: any) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Failed to approve retailer",
        error: error.message,
      });
    }
  };

  static rejectRetailer = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const useCase = new RejectRetailerUseCase(retailerRepo);
      await useCase.execute(id);
      res.status(StatusCode.OK).json({
        message: "Retailer rejected successfully",
      });
    } catch (error: any) {
      console.error(error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Failed to reject retailer",
        error: error.message,
      });
    }
  };
  static getRetailerById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const useCase = new GetRetailerByIdUseCase(retailerRepo);
      const retailer = await useCase.execute(id);
      res.status(StatusCode.OK).json(retailer);
    } catch (err: any) {
      console.error("Error fetching retailer boy:", err);
      res.status(StatusCode.NOT_FOUND).json({
        message: err.message || "Retailer boy not found",
      });
    }
  };
  static blockRetailer = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const useCase = new BlockRetailerUseCase(userRepo, retailerRepo);
      await useCase.execute(id);

      res.status(StatusCode.OK).json({
        message: "Retailer blocked successfully",
      });
    } catch (err: any) {
      console.error("Error blocking retailer:", err);
      res.status(StatusCode.BAD_REQUEST).json({
        message: err.message || "Failed to block retailer",
      });
    }
  };
  static unblockRetailer = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log("its here in unblock", id);

      const useCase = new UnBlockRetailerUseCase(userRepo, retailerRepo);
      await useCase.execute(id);

      res.status(StatusCode.OK).json({
        message: "Retailer unblocked successfully",
      });
    } catch (err: any) {
      console.error("Error unblocking retailer:", err);
      res.status(StatusCode.BAD_REQUEST).json({
        message: err.message || "Failed to unblock retailer",
      });
    }
  };
}
