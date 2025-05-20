// src/infrastructure/database/repositories/DeliveryBoyRepository.ts
import { DeliveryBoy } from "../../../domain/entities/DeliveryBoy";

import { DeliveryBoyModel } from "../schemas/deliveryBoyModel";
import { UserModel } from "../schemas/userModel";
import { IDeliveryBoyRepository } from "./interface/IDeliveryBoyRepository";

export class DeliveryBoyRepository implements IDeliveryBoyRepository {
    async create(deliveryBoy: DeliveryBoy): Promise<DeliveryBoy> {
      const newDeliveryBoy = new DeliveryBoyModel(deliveryBoy);
      const savedDeliveryBoy = await newDeliveryBoy.save();
      return { ...savedDeliveryBoy.toObject(), _id: savedDeliveryBoy._id.toString() };
    }
  
    async findByUserId(userId: string): Promise<DeliveryBoy | null> {
      const deliveryBoy = await DeliveryBoyModel.findOne({ userId }).populate('userId')
      return deliveryBoy ? { ...deliveryBoy.toObject(), _id: deliveryBoy._id.toString() } : null;
    }
  
    async updateVerificationStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> {
      await DeliveryBoyModel.findByIdAndUpdate(id, { 
        verificationStatus: status, 
        isVerified: status === 'approved'
      });
    }

    async findByEmail(email: string): Promise<DeliveryBoy | null> {
      const user = await UserModel.findOne({ email });
      if (!user) return null;
      const deliveryBoy = await DeliveryBoyModel.findOne({ userId: user._id }).populate('userId');
      return deliveryBoy ? { ...deliveryBoy.toObject(), _id: deliveryBoy._id.toString() } : null;
    }

    async findPendingDeliveryBoys(): Promise<DeliveryBoy[]> {
      const deliveryBoys = await DeliveryBoyModel.find({ verificationStatus: 'pending' })
        .populate('userId', 'name email')
        .lean();
      return deliveryBoys.map(deliveryBoy => ({
        ...deliveryBoy,
        _id: deliveryBoy._id.toString(),
      }));
    }

    async findById(id: string): Promise<DeliveryBoy | null> {
      const deliveryBoy = await DeliveryBoyModel.findById(id).populate('userId');
      return deliveryBoy ? { ...deliveryBoy.toObject(), _id: deliveryBoy._id.toString() } : null;
    }
}