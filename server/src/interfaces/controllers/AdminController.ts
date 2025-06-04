import { blockCustomer, unBlockCustomer } from './../../../../client/src/api/adminApi';
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
import { BlockDeliveryBoyUseCase } from "../../application/use-cases/deliveryBoy/BlockDeliveryBoyUseCase";
import { UnBlockDeliveryBoyUseCase } from "../../application/use-cases/deliveryBoy/UnBlockDeliveryBoyUseCase";
import { RetailerListingRequest } from "../../domain/dtos/RetailerListingRequest";
import { BlockCustomer } from '../../application/use-cases/customer/BlockCustomer';
import { CustomerRepository } from '../../infrastructure/database/repositories/CustomerRepository';
import { UnBlockCustomer } from '../../application/use-cases/customer/UnBlockCustomer';

const userRepo = new UserRepository();
const deliveryBoyRepo = new DeliveryBoyRepository();
const ratingService = new RatingService();
const retailerRepo = new RetailersRepository();
const customerRepo = new CustomerRepository();

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
      const {
        page = 1,
        limit = 5,
        search = "",
        verificationStatus,
        isBlocked,
        vehicleType,
        currentlyAvailable,
        sortField = "createdAt",
        sortDirection = "desc",
      } = req.query;
      const useCase = new GetUsers(userRepo);
      const customers = await useCase.executeCustomerPaginated({
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        filters: {
          verificationStatus: verificationStatus as string,
          isBlocked: isBlocked ? isBlocked === "true" : undefined,
          vehicleType: vehicleType as string,
          currentlyAvailable: currentlyAvailable
            ? currentlyAvailable === "true"
            : undefined,
        },
        sort: {
          field: sortField as string,
          direction: sortDirection as "asc" | "desc",
        },
      });
      res.status(StatusCode.OK).json(customers);
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
  };

  static getAllDeliveryBoys = async (req: Request, res: Response) => {
    try {
      const {
        page = 1,
        limit = 5,
        search = "",
        verificationStatus,
        isBlocked,
        vehicleType,
        currentlyAvailable,
        sortField = "createdAt",
        sortDirection = "desc",
      } = req.query;
      // console.log(req.query);
      
      const useCase = new GetUsers(userRepo);
      const result = await useCase.executeDeliveryBoysPaginated({
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        filters: {
          verificationStatus: verificationStatus as string,
          isBlocked: isBlocked ? isBlocked === "true" : undefined,
          vehicleType: vehicleType as string,
          currentlyAvailable: currentlyAvailable
            ? currentlyAvailable === "true"
            : undefined,
        },
        sort: {
          field: sortField as string,
          direction: sortDirection as "asc" | "desc",
        },
      });
      res.status(StatusCode.OK).json({
        success: true,
        data: result.data,
        total: result.total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(result.total / Number(limit)),
      });
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: err.message,
      });
    }
  };

  static blockDelveryBoy = async (req: Request, res: Response) => {
    try {
      const { deliveryBoyId } = req.params;

      const useCase = new BlockDeliveryBoyUseCase(userRepo, deliveryBoyRepo);
      await useCase.execute(deliveryBoyId);

      res.status(StatusCode.OK).json({
        message: "Delivery Boy Blocked Success",
      });
    } catch (error: any) {
      res.status(StatusCode.BAD_REQUEST).json({
        message: error.message || "Failed to block Delivery Boy",
      });
    }
  };
  static UnblockDelveryBoy = async (req: Request, res: Response) => {
    try {
      const { deliveryBoyId } = req.params;
      const useCase = new UnBlockDeliveryBoyUseCase(userRepo, deliveryBoyRepo);
      await useCase.execute(deliveryBoyId);
      res.status(StatusCode.OK).json({
        message: "Delivery Boy Un Blocked Success",
      });
    } catch (error: any) {
      res.status(StatusCode.BAD_REQUEST).json({
        message: error.message || "Failed to un block Delivery Boy",
      });
    }
  };

  static getAllRetailers = async (req: Request, res: Response) => {
  try {
    const params: RetailerListingRequest = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      filters: {
        verificationStatus: req.query.verificationStatus as string,
        isBlocked: req.query.isBlocked ? 
          req.query.isBlocked === 'true' : undefined,
        status: req.query.status as string,
      },
      sort: req.query.sortField ? {
        field: req.query.sortField as string,
        direction: req.query.sortDirection as 'asc' | 'desc',
      } : undefined,
    };

    const useCase = new GetUsers(userRepo);
    const result = await useCase.executeRetailersPaginated(params);
    res.status(StatusCode.OK).json(result);
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
  static blockCustomer = async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const useCase = new BlockCustomer(userRepo, customerRepo)
      await useCase.execute(customerId);
      res.status(StatusCode.OK).json({
        message: "Customer blocked successfully",
      });
    } catch (error:any) {
      res.status(StatusCode.BAD_REQUEST).json({
        message: error.message || "Failed to block customer",
      });
    }
  }
  static unblockCustomer = async (req: Request, res: Response) => {
    try {
      console.log('Unblocking customer...');
      
      const { customerId } = req.params;
      const useCase = new UnBlockCustomer(userRepo, customerRepo);
      await useCase.execute(customerId);
      res.status(StatusCode.OK).json({success: true,
        message: "Customer unblocked successfully",
      });
    } catch (error:any) {
      res.status(StatusCode.BAD_REQUEST).json({success: false,
        message: error.message || "Failed to unblock customer",
      });
    }
  }
}