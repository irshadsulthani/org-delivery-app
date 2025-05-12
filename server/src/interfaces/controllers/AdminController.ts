// src/infrastructure/controllers/AdminController.ts
import { Request, Response } from 'express';
import { StatusCode } from "../../utils/statusCode";
import { GetUsers } from "../../application/use-cases/user/GetUsers";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { DeliveryBoyRepository } from "../../infrastructure/database/repositories/DeliveryBoyRepository";
import { GetPendingDeliveryBoys } from '../../application/use-cases/deliveryBoy/GetPendingDeliveryBoys';
import { ApproveDeliveryBoy } from '../../application/use-cases/deliveryBoy/ApproveDeliveryBoy';
import { RejectDeliveryBoy } from '../../application/use-cases/deliveryBoy/RejectDeliveryBoy';
import { RatingService } from '../../application/services/RatingService';
import { GetDeliveryBoyById } from '../../application/use-cases/deliveryBoy/GetDeliveryBoyById';

const userRepo = new UserRepository();
const deliveryBoyRepo = new DeliveryBoyRepository();
const ratingService = new RatingService();

export class AdminController {
  static getUsers = async (req: Request, res: Response) => {
    try {
      const useCase = new GetUsers(userRepo);
      const users = await useCase.execute();
      res.status(StatusCode.OK).json(users);
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
  }

  static getAllCustomers = async (req: Request, res: Response) => {
    try {
      const useCase = new GetUsers(userRepo);
      const customers = await useCase.executeCustomers();
      res.status(StatusCode.OK).json(customers);
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
  }

  static getAllDeliveryBoys = async (req: Request, res: Response) => {
    try {
      const useCase = new GetUsers(userRepo);
      const deliveryBoys = await useCase.excuteDeliveryBoys();
      const transformedData = deliveryBoys.map((boy:any) => ({
        _id: boy._id,
        userId:boy.userId,
        name: boy.name,
        email: boy.email,
        phone:boy.phone,
        status: boy.status || 'Active',
        joinDate: boy.createdAt,
        deliveries: boy.totalDeliveredOrders || 0,
        rating: ratingService.calculateAverageRating(boy), // You'll need to implement this
        area: `${boy.city}, ${boy.state}`,
        vehicleType: boy.vehicleType || 'Bike',
        isBlocked: boy.isBlocked || false,
        isVerified: boy.verificationStatus === 'approved',
        createdAt: boy.createdAt,
      }));

      res.status(StatusCode.OK).json(transformedData);
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
  };

//   static blockDeliveryBoy = async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;
//       const user = await userRepo.findById(id);
      
//       if (!user) {
//         return res.status(StatusCode.NOT_FOUND).json({ message: 'User not found' });
//       }
      
//       if (user.role !== 'deliveryBoy') {
//         return res.status(StatusCode.BAD_REQUEST).json({ message: 'User is not a delivery boy' });
//       }
      
//       const updatedUser = await userRepo.updateUser(id, { isBlocked: true });
//       res.status(StatusCode.OK).json(updatedUser);
//     } catch (err: any) {
//       res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
//     }
//   };

//   static unblockDeliveryBoy = async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;
//       const user = await userRepo.findById(id);
      
//       if (!user) {
//         return res.status(StatusCode.NOT_FOUND).json({ message: 'User not found' });
//       }
      
//       if (user.role !== 'deliveryBoy') {
//         return res.status(StatusCode.BAD_REQUEST).json({ message: 'User is not a delivery boy' });
//       }
      
//       const updatedUser = await userRepo.updateUser(id, { isBlocked: false });
//       res.status(StatusCode.OK).json(updatedUser);
//     } catch (err: any) {
//       res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
//     }
//   };


  static getAllReatilers = async (req: Request, res: Response) => {
    try {
      const useCase = new GetUsers(userRepo);
      const reatilers = await useCase.excuteReatilers();
      res.status(StatusCode.OK).json(reatilers);
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
  }

  static getPendingDeliveryBoys = async (req: Request, res: Response) => {
    try {
      const useCase = new GetPendingDeliveryBoys(deliveryBoyRepo);
      const pendingDeliveryBoys = await useCase.execute();
      
      // Transform data to include user details
      const result = pendingDeliveryBoys.map(deliveryBoy => ({
        id: deliveryBoy._id,
        userId: deliveryBoy.userId,
        name: (deliveryBoy.userId as any)?.name || 'Unknown',
        email: (deliveryBoy.userId as any)?.email || '',
        phone: deliveryBoy.phone,
        status: deliveryBoy.verificationStatus,
        createdAt: deliveryBoy.createdAt,
        profileImageUrl: deliveryBoy.profileImageUrl,
        verificationImageUrl: deliveryBoy.verificationImageUrl
      }));

      res.status(StatusCode.OK).json(result);
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
  }

  static approveDeliveryBoy = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const useCase = new ApproveDeliveryBoy(deliveryBoyRepo);
      await useCase.execute(id);
      res.status(StatusCode.OK).json({ message: 'Delivery boy approved successfully' });
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
  }

  static rejectDeliveryBoy = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const useCase = new RejectDeliveryBoy(deliveryBoyRepo);
      await useCase.execute(id);
      res.status(StatusCode.OK).json({ message: 'Delivery boy rejected successfully' });
    } catch (err: any) {
      res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
  }

 static getDeliveryBoyById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const useCase = new GetDeliveryBoyById(deliveryBoyRepo);
      
      const deliveryBoy = await useCase.execute(id);
      
      // Return the delivery boy data
      res.status(StatusCode.OK).json(deliveryBoy);
    } catch (err: any) {
      console.error('Error fetching delivery boy:', err);
      res.status(StatusCode.NOT_FOUND).json({ 
        message: err.message || 'Delivery boy not found' 
      });
    }
  }

}